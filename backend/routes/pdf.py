import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from utils.pdf_parser import extract_text_from_pdf
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

        # Translate Hindi, extract fields, and analyze through the shared workflow.
        result = await predict_explain_log_job(
            job_data=None,
            raw_text=extracted_text,
            input_type="pdf"
        )

        return {
            "filename": file.filename,
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
