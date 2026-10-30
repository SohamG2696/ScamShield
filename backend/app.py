from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from predictor import predict_explain_log_job
from schemas import JobInput
from routes.pdf import router as pdf_router
from routes.image import router as image_router
from routes.chat import router as chat_router

app = FastAPI(
    title="ScamShield API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
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


from utils.groq_client import parse_job_text_to_json
from typing import Union, Dict, Any

@app.post("/predict/text")
async def predict(payload: Dict[str, Any]):
    raw_text = payload.get("text") or payload.get("description") or ""

    # If raw text was provided, parse it with Groq into structured job fields
    if raw_text and not payload.get("title"):
        job_data = parse_job_text_to_json(raw_text)
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
        input_type="text"
    )

    return result

app.include_router(pdf_router)
app.include_router(image_router)
app.include_router(chat_router)