import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from utils.pdf_parser import extract_text_from_pdf
from utils.groq_client import parse_job_text_to_json
from predictor import predict_explain_log_job
from config import UPLOAD_DIR

router = APIRouter()


@router.post("/predict/pdf")
async def predict_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_path = os.path.join(
        str(UPLOAD_DIR),
        file.filename
    )

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Step 1: Extract text using PyMuPDF
        extracted_text = extract_text_from_pdf(file_path)
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="The uploaded PDF file contains no readable text.")

        # Step 2 & 4: Convert raw text into structured JSON fields using Groq
        structured_fields = parse_job_text_to_json(extracted_text)

        # Step 5 & 6: Run classification pipeline + explainability + logging
        result = await predict_explain_log_job(
            job_data=structured_fields,
            raw_text=extracted_text,
            input_type="pdf"
        )

        return {
            "filename": file.filename,
            "extracted_fields": structured_fields,
            **result
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF file: {e}")
    finally:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass
