import joblib
import numpy as np

from config import MODEL_PATH
from pipeline import preprocess_job

# -----------------------------------------
# Load model only once
# -----------------------------------------

model = joblib.load(MODEL_PATH)


# -----------------------------------------
# Predict Job
# -----------------------------------------

def predict_job(job):

    # Convert input into model features
    features = preprocess_job(job)

    # Prediction
    prediction = model.predict(features)[0]

    # Probability
    probability = model.predict_proba(features)[0]

    # Scam probability
    scam_probability = float(probability[1])

    # Genuine probability
    genuine_probability = float(probability[0])

    # Confidence
    confidence = max(
        scam_probability,
        genuine_probability
    )

    # Convert label to readable text
    if prediction == 1:
        result = "Scam"
    else:
        result = "Genuine"

    return {
        "prediction": result,
        "confidence": round(confidence * 100, 2),
        "scam_probability": round(scam_probability * 100, 2),
        "genuine_probability": round(genuine_probability * 100, 2)
    }


# -----------------------------------------
# Unified Predict, Explain, and Log Workflow
# -----------------------------------------

import time
from utils.groq_client import check_is_job_related, generate_explainability, generate_professional_report
from utils.db_utils import log_prediction_to_supabase

async def predict_explain_log_job(job_data: dict, raw_text: str, input_type: str) -> dict:
    """
    Executes the full prediction workflow:
    1. Preprocesses and predicts using LightGBM.
    2. Generates detailed explanations via Groq.
    3. Asynchronously logs prediction metrics to Supabase.
    """
    start_time = time.time()

    # ── Step 0: Check if text is actually a job / internship posting ──────────
    relevance = check_is_job_related(raw_text)
    if not relevance["is_job_related"]:
        return {
            "prediction": "NOT_JOB_RELATED",
            "confidence": 0.0,
            "scam_probability": 0.0,
            "genuine_probability": 0.0,
            "reason": relevance["reason"],
            "explanation": None,
            "professional_report": None,
            "processing_time": round(time.time() - start_time, 4)
        }

    # Predict using ML pipeline
    prediction_res = predict_job(job_data)
    
    prediction = prediction_res["prediction"]
    confidence = prediction_res["confidence"]

    # Generate explainability details using Groq
    explanation = generate_explainability(raw_text, prediction, confidence)

    # Generate a full professional report using Groq
    professional_report = generate_professional_report(raw_text, prediction, confidence, explanation)

    # Log metrics to Supabase
    processing_time = round(time.time() - start_time, 4)
    await log_prediction_to_supabase(
        prediction=prediction,
        confidence=confidence,
        input_type=input_type,
        processing_time=processing_time
    )

    # Add explanation, report, and processing time to response
    return {
        **prediction_res,
        "explanation": explanation,
        "professional_report": professional_report,
        "processing_time": processing_time
    }