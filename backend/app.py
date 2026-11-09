import logging
from typing import Dict, Any
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config import ALLOWED_ORIGINS, MAX_TEXT_LENGTH
from predictor import predict_explain_log_job
from routes.pdf import router as pdf_router
from routes.image import router as image_router
from routes.chat import router as chat_router
from utils.rate_limiter import inference_limiter

logger = logging.getLogger("scamshield.api")

app = FastAPI(
    title="ScamShield API",
    version="1.0.0"
)

# Production security: Restrict origins to Azure frontend and authorized local dev URLs
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to ScamShield API"
    }


@app.get("/health")
def health():
    return {
        "status": "running"
    }


@app.post("/predict/text")
async def predict(payload: Dict[str, Any], request: Request):
    # Enforce rate limiting per client IP
    inference_limiter.check(request)

    raw_text = str(payload.get("text") or payload.get("description") or "").strip()

    if not raw_text and not payload.get("title"):
        raise HTTPException(status_code=400, detail="Job description text cannot be empty.")

    if len(raw_text) > MAX_TEXT_LENGTH:
        raise HTTPException(
            status_code=413,
            detail=f"Text payload exceeds maximum limit of {MAX_TEXT_LENGTH} characters."
        )

    # Detect or extract input_type
    input_type = payload.get("input_type")
    if not input_type:
        lower = raw_text.lower()
        if "subject:" in lower and ("from:" in lower or "to:" in lower or "dear" in lower):
            input_type = "email"
        elif ("from:" in lower or "subject:" in lower) and "@" in raw_text:
            input_type = "email"
        else:
            input_type = "text"

    # The shared workflow translates Hindi before extracting structured fields.
    if raw_text and not payload.get("title"):
        job_data = None
    else:
        job_data = {
            "title": payload.get("title", ""),
            "company": payload.get("company", ""),
            "description": payload.get("description", raw_text),
            "employment_type": payload.get("employment_type", "Full-time"),
            "experience_required": payload.get("experience_required", "Unknown"),
            "education_required": payload.get("education_required", "Unknown"),
            "salary_range": payload.get("salary_range", ""),
            "company_website": payload.get("company_website", ""),
            "location": payload.get("location", "")
        }
        for field in ("requirements", "benefits", "remote", "company_email"):
            if field in payload:
                job_data[field] = payload[field]
        if not raw_text:
            raw_text = (
                f"Title: {job_data['title']}\n"
                f"Company: {job_data['company']}\n"
                f"Description: {job_data['description']}\n"
                f"Employment Type: {job_data['employment_type']}\n"
                f"Salary: {job_data['salary_range']}\n"
                f"Location: {job_data['location']}"
            )

    # Use unified workflow (handles relevance check, prediction, explainability, logging)
    result = await predict_explain_log_job(
        job_data=job_data,
        raw_text=raw_text,
        input_type=input_type
    )

    return result

app.include_router(pdf_router)
app.include_router(image_router)
app.include_router(chat_router)
