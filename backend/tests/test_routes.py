import os
from fastapi.testclient import TestClient
from PIL import Image, ImageDraw

# Add backend directory to sys.path
import sys
from pathlib import Path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app import app

client = TestClient(app)


def test_health():
    print("\n--- Testing /health ---")
    response = client.get("/health")
    print("Status:", response.status_code)
    print("Body:", response.json())
    assert response.status_code == 200


def test_predict_text():
    print("\n--- Testing /predict/text ---")
    job_payload = {
        "title": "Software Developer",
        "company": "Google",
        "description": "Building next-generation distributed systems in Python and Go.",
        "employment_type": "Full-time",
        "experience_required": "1-3 years",
        "education_required": "Bachelor's degree",
        "company_website": "https://google.com",
        "salary_range": "$100k - $140k",
        "location": "Mountain View, CA"
    }
    response = client.post("/predict/text", json=job_payload)
    print("Status:", response.status_code)
    print("Body:", response.json())
    assert response.status_code == 200
    assert "prediction" in response.json()
    assert "explanation" in response.json()


def test_predict_pdf():
    print("\n--- Testing /predict/pdf ---")
    # Find sample.pdf
    pdf_path = Path(__file__).resolve().parent / "sample.pdf"
    if not pdf_path.exists():
        pdf_path = Path(__file__).resolve().parent.parent / "backend" / "sample.pdf"

    if not pdf_path.exists():
        print("Skipping PDF test: sample.pdf not found.")
        return

    with open(pdf_path, "rb") as f:
        response = client.post(
            "/predict/pdf",
            files={"file": (pdf_path.name, f, "application/pdf")}
        )

    print("Status:", response.status_code)
    print("Body:", response.json())
    assert response.status_code == 200
    assert "prediction" in response.json()
    assert "explanation" in response.json()


def test_predict_image():
    print("\n--- Testing /predict/image ---")
    # Create a white image and write text on it
    img = Image.new('RGB', (600, 150), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    
    # Simple large pixel text
    d.text((10, 10), "POSITION: Junior Python Developer", fill=(0, 0, 0))
    d.text((10, 30), "COMPANY: Microsoft Corporation", fill=(0, 0, 0))
    d.text((10, 50), "REQUIREMENT: 1-2 years experience with FastAPI", fill=(0, 0, 0))
    d.text((10, 70), "APPLY TO: jobs@microsoft.com", fill=(0, 0, 0))
    d.text((10, 90), "WEBSITE: https://careers.microsoft.com", fill=(0, 0, 0))

    img_path = Path(__file__).resolve().parent / "test_screenshot.png"
    img.save(img_path)

    try:
        with open(img_path, "rb") as f:
            response = client.post(
                "/predict/image",
                files={"file": (img_path.name, f, "image/png")}
            )

        print("Status:", response.status_code)
        print("Body:", response.json())
        assert response.status_code == 200
        assert "prediction" in response.json()
        assert "explanation" in response.json()
    finally:
        if img_path.exists():
            os.remove(img_path)


if __name__ == "__main__":
    print("Starting ScamShield API integration tests...")
    test_health()
    test_predict_text()
    test_predict_pdf()
    test_predict_image()
    print("\nAll integration tests passed successfully!")
