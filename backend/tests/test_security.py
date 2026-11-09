import os
import io
import sys
from pathlib import Path
from fastapi.testclient import TestClient
from fastapi import Request

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app import app
from config import UPLOAD_DIR, ALLOWED_ORIGINS
from utils.rate_limiter import SlidingWindowRateLimiter, get_client_ip

client = TestClient(app)


def test_cors_allowed_origins():
    """Verify that only authorized production and local origins receive CORS headers."""
    prod_origin = "https://happy-cliff-00cb7b800.4.azurestaticapps.net"
    local_origin = "http://localhost:3000"
    malicious_origin = "https://malicious-attacker.org"

    # Preflight OPTIONS request for authorized prod origin
    res_prod = client.options(
        "/predict/text",
        headers={
            "Origin": prod_origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type",
        }
    )
    assert res_prod.headers.get("access-control-allow-origin") == prod_origin

    # Preflight OPTIONS request for authorized local origin
    res_local = client.options(
        "/predict/text",
        headers={
            "Origin": local_origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type",
        }
    )
    assert res_local.headers.get("access-control-allow-origin") == local_origin

    # Preflight OPTIONS request for unauthorized origin must NOT allow origin
    res_malicious = client.options(
        "/predict/text",
        headers={
            "Origin": malicious_origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type",
        }
    )
    assert res_malicious.headers.get("access-control-allow-origin") is None


def test_rate_limiter_unit():
    """Verify sliding window rate limiter raises HTTP 429 with Retry-After header."""
    limiter = SlidingWindowRateLimiter(limit=3, window_seconds=5, name="test_limiter")

    class DummyRequest:
        def __init__(self, ip):
            self.headers = {"x-forwarded-for": ip}
            self.client = None

    req = DummyRequest("198.51.100.1")

    # First 3 requests should pass
    limiter.check(req)
    limiter.check(req)
    limiter.check(req)

    # 4th request must raise 429
    try:
        limiter.check(req)
        assert False, "Expected 429 rate limit exception"
    except Exception as exc:
        assert getattr(exc, "status_code", None) == 429
        assert "Retry-After" in exc.headers
        assert int(exc.headers["Retry-After"]) >= 1


def test_text_payload_validation():
    """Verify empty text returns 400 and oversized text returns 413."""
    # Empty payload
    res_empty = client.post("/predict/text", json={"text": ""})
    assert res_empty.status_code == 400

    # Oversized payload (> 65536 chars)
    giant_text = "A" * 70000
    res_giant = client.post("/predict/text", json={"text": giant_text})
    assert res_giant.status_code == 413
    assert "exceeds maximum limit" in res_giant.json()["detail"]


def test_pdf_security_validation():
    """Verify spoofed PDF contents are rejected and temp files are cleanly deleted."""
    before_files = set(os.listdir(str(UPLOAD_DIR)))

    # 1. Non-PDF header spoofed with .pdf extension
    spoofed_bytes = io.BytesIO(b"MZ\x90\x00\x03This is not a real PDF file!")
    res_spoofed = client.post(
        "/predict/pdf",
        files={"file": ("malicious.pdf", spoofed_bytes, "application/pdf")}
    )
    assert res_spoofed.status_code == 400
    assert "Invalid PDF" in res_spoofed.json()["detail"]

    # 2. Empty PDF file
    empty_bytes = io.BytesIO(b"")
    res_empty = client.post(
        "/predict/pdf",
        files={"file": ("empty.pdf", empty_bytes, "application/pdf")}
    )
    assert res_empty.status_code == 400

    # 3. Disallowed extension
    res_ext = client.post(
        "/predict/pdf",
        files={"file": ("payload.exe", io.BytesIO(b"%PDF-test"), "application/octet-stream")}
    )
    assert res_ext.status_code == 400

    # Verify no leaked files remain on disk
    after_files = set(os.listdir(str(UPLOAD_DIR)))
    assert after_files == before_files, f"Leaked files detected in upload dir: {after_files - before_files}"


def test_image_security_validation():
    """Verify spoofed image contents are rejected and temp files are cleanly deleted."""
    before_files = set(os.listdir(str(UPLOAD_DIR)))

    # 1. Plain text spoofed with .png extension
    fake_png = io.BytesIO(b"Hello world, I am just plain text pretending to be an image.")
    res_fake = client.post(
        "/predict/image",
        files={"file": ("fake_screenshot.png", fake_png, "image/png")}
    )
    assert res_fake.status_code == 400
    assert "Invalid image content" in res_fake.json()["detail"]

    # 2. Unsupported extension
    res_bad_ext = client.post(
        "/predict/image",
        files={"file": ("exploit.sh", io.BytesIO(b"\x89PNG\r\n\x1a\n"), "application/x-sh")}
    )
    assert res_bad_ext.status_code == 400

    # Verify no leaked files remain on disk
    after_files = set(os.listdir(str(UPLOAD_DIR)))
    assert after_files == before_files, f"Leaked files detected in upload dir: {after_files - before_files}"


def test_rate_limiter_anti_spoofing():
    """
    Regression test: Verify untrusted direct clients cannot spoof X-Forwarded-For
    or X-Real-IP to bypass rate limits.
    """
    limiter = SlidingWindowRateLimiter(limit=3, window_seconds=5, name="anti_spoof_limiter")

    class ClientInfo:
        def __init__(self, host):
            self.host = host

    class RequestMock:
        def __init__(self, client_host, headers=None):
            self.client = ClientInfo(client_host)
            self.headers = headers or {}

    # Attacker's real public socket IP (NOT in trusted proxies)
    attacker_real_ip = "203.0.113.195"

    # Attacker sends 4 requests, each with a different forged X-Forwarded-For header
    req1 = RequestMock(attacker_real_ip, {"x-forwarded-for": "1.1.1.1"})
    req2 = RequestMock(attacker_real_ip, {"x-forwarded-for": "2.2.2.2"})
    req3 = RequestMock(attacker_real_ip, {"x-forwarded-for": "3.3.3.3"})
    req4 = RequestMock(attacker_real_ip, {"x-forwarded-for": "4.4.4.4"})

    # Even though forged headers vary, the rate limiter MUST anchor to the untrusted peer IP
    limiter.check(req1)
    limiter.check(req2)
    limiter.check(req3)

    try:
        limiter.check(req4)
        assert False, "Expected 429: Attacker bypassed rate limit via forged X-Forwarded-For headers!"
    except Exception as exc:
        assert getattr(exc, "status_code", None) == 429
        assert "Retry-After" in exc.headers

    # Verify trusted proxy behavior: Behind Azure Container Apps / Docker proxy (10.0.0.5)
    trusted_proxy_ip = "10.0.0.5"
    # Attacker prepended 1.1.1.1, but proxy appended attacker's genuine IP 198.51.100.50
    proxy_req = RequestMock(
        trusted_proxy_ip,
        {"x-forwarded-for": "1.1.1.1, 198.51.100.50"}
    )
    resolved_ip = get_client_ip(proxy_req)
    assert resolved_ip == "198.51.100.50", f"Expected '198.51.100.50', got '{resolved_ip}'"


if __name__ == "__main__":
    print("Running security verification suite...")
    test_cors_allowed_origins()
    test_rate_limiter_unit()
    test_rate_limiter_anti_spoofing()
    test_text_payload_validation()
    test_pdf_security_validation()
    test_image_security_validation()
    print("All security tests passed successfully!")

