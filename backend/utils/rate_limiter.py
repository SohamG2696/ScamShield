import time
import os
import logging
import ipaddress
from collections import deque
from threading import Lock
from typing import Dict, List, Union
from fastapi import Request, HTTPException

logger = logging.getLogger("scamshield.ratelimit")

# Configuration via environment variables
RATE_LIMIT_INFERENCE_PER_MIN = int(os.getenv("RATE_LIMIT_INFERENCE_PER_MIN", "15"))
RATE_LIMIT_CHAT_PER_MIN = int(os.getenv("RATE_LIMIT_CHAT_PER_MIN", "20"))
RATE_LIMIT_WINDOW_SECONDS = 60

# Networks considered trusted proxies by default:
# - Loopback: 127.0.0.0/8, ::1
# - Azure Container Apps virtual network & container bridge: 10.0.0.0/8
# - Docker bridge & overlay networks: 172.16.0.0/12
# - Private local subnets: 192.168.0.0/16
DEFAULT_TRUSTED_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("fc00::/7"),
]


def _build_trusted_networks() -> List[Union[ipaddress.IPv4Network, ipaddress.IPv6Network]]:
    custom_proxies = os.getenv("TRUSTED_PROXIES", "").strip()
    networks = list(DEFAULT_TRUSTED_NETWORKS)
    if custom_proxies:
        for entry in custom_proxies.split(","):
            entry = entry.strip()
            if not entry:
                continue
            try:
                if "/" in entry:
                    networks.append(ipaddress.ip_network(entry, strict=False))
                else:
                    ip = ipaddress.ip_address(entry)
                    networks.append(ipaddress.ip_network(f"{ip}/{32 if ip.version == 4 else 128}"))
            except ValueError:
                logger.warning(f"Invalid TRUSTED_PROXIES CIDR or IP specification: {entry}")
    return networks


TRUSTED_NETWORKS = _build_trusted_networks()
TRUST_PROXY_HEADERS = os.getenv("TRUST_PROXY_HEADERS", "true").lower() in ("true", "1", "yes")


def is_trusted_proxy(ip_str: str) -> bool:
    """Checks whether an IP address belongs to the set of configured trusted proxies/networks."""
    try:
        ip = ipaddress.ip_address(ip_str.strip())
        return any(ip in net for net in TRUSTED_NETWORKS)
    except ValueError:
        return False


def get_client_ip(request: Request) -> str:
    """
    Safely resolves the true client IP address, guarding against header spoofing.
    
    Security Guarantees:
    1. Forwarding headers (X-Forwarded-For, X-Real-IP) are ONLY inspected if the direct
       socket connection (request.client.host) originates from a verified trusted proxy.
    2. If an untrusted client connects directly, all X-Forwarded-For and X-Real-IP headers
       are completely discarded, preventing forged IP rate-limit bypasses.
    3. When behind a trusted proxy, X-Forwarded-For is evaluated from right to left (most
       recent hop first), selecting the first non-trusted upstream IP address.
    4. All candidate strings are strictly validated as legitimate IPv4/IPv6 addresses.
    5. Falls back safely to direct peer IP or '127.0.0.1'.
    """
    peer_ip = "127.0.0.1"
    if request.client and request.client.host:
        peer_ip = request.client.host.strip()

    # If forwarding headers are disabled, or the immediate peer is not a trusted proxy,
    # strictly return the immediate peer's IP (prevents untrusted client header forgery).
    if not TRUST_PROXY_HEADERS or not is_trusted_proxy(peer_ip):
        return peer_ip

    # Peer is a trusted proxy: walk X-Forwarded-For from right to left
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        raw_ips = [ip.strip() for ip in forwarded.split(",") if ip.strip()]
        for candidate in reversed(raw_ips):
            try:
                candidate_ip = ipaddress.ip_address(candidate)
                # Select the first IP in reverse order that is NOT a trusted proxy
                if not any(candidate_ip in net for net in TRUSTED_NETWORKS):
                    return str(candidate_ip)
            except ValueError:
                # Discard invalid/forged IP strings
                continue

    # Secondary check: X-Real-IP set by a trusted reverse proxy
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        candidate = real_ip.strip()
        try:
            candidate_ip = ipaddress.ip_address(candidate)
            if not any(candidate_ip in net for net in TRUSTED_NETWORKS):
                return str(candidate_ip)
        except ValueError:
            pass

    return peer_ip


class SlidingWindowRateLimiter:
    """
    Thread-safe, in-memory sliding window rate limiter.
    
    Azure Container Apps Note:
    Each container replica enforces its own memory window per client IP.
    This provides robust denial-of-service and brute-force protection
    against single-container overload without introducing external paid Redis infrastructure.
    """

    def __init__(self, limit: int, window_seconds: int = 60, name: str = "default"):
        self.limit = limit
        self.window_seconds = window_seconds
        self.name = name
        self.records: Dict[str, deque] = {}
        self.lock = Lock()
        self.last_cleanup = time.time()

    def check(self, request: Request):
        client_ip = get_client_ip(request)
        now = time.time()

        with self.lock:
            # Periodic cleanup of inactive IPs every 5 minutes to prevent memory leaks
            if now - self.last_cleanup > 300:
                self._cleanup_stale(now)
                self.last_cleanup = now

            if client_ip not in self.records:
                self.records[client_ip] = deque()

            timestamps = self.records[client_ip]

            # Evict timestamps older than the window
            cutoff = now - self.window_seconds
            while timestamps and timestamps[0] <= cutoff:
                timestamps.popleft()

            # Check if limit is exceeded
            if len(timestamps) >= self.limit:
                oldest = timestamps[0]
                retry_after = max(1, int(self.window_seconds - (now - oldest)))
                logger.warning(
                    f"Rate limit exceeded for IP {client_ip} on limiter '{self.name}'. "
                    f"Retry-After: {retry_after}s"
                )
                raise HTTPException(
                    status_code=429,
                    detail=f"Rate limit exceeded. Maximum {self.limit} requests per minute allowed. Please try again in {retry_after} seconds.",
                    headers={"Retry-After": str(retry_after)}
                )

            # Record current request timestamp
            timestamps.append(now)

    def _cleanup_stale(self, now: float):
        cutoff = now - self.window_seconds
        stale_ips = []
        for ip, queue in self.records.items():
            while queue and queue[0] <= cutoff:
                queue.popleft()
            if not queue:
                stale_ips.append(ip)
        for ip in stale_ips:
            del self.records[ip]


# Singleton limiters for application routes
inference_limiter = SlidingWindowRateLimiter(
    limit=RATE_LIMIT_INFERENCE_PER_MIN,
    window_seconds=RATE_LIMIT_WINDOW_SECONDS,
    name="inference"
)

chat_limiter = SlidingWindowRateLimiter(
    limit=RATE_LIMIT_CHAT_PER_MIN,
    window_seconds=RATE_LIMIT_WINDOW_SECONDS,
    name="chat"
)
