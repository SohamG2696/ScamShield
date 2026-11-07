import os
import shutil
import easyocr
import logging
from fastapi import APIRouter, UploadFile, File, HTTPException
from predictor import predict_explain_log_job
from config import UPLOAD_DIR

logger = logging.getLogger("scamshield.routes.image")

router = APIRouter()

# Read Hindi and English before normalizing extracted text for the classifier.
reader = None
try:
    logger.info("Initializing EasyOCR reader (CPU mode)...")
    reader = easyocr.Reader(['hi', 'en'], gpu=False, verbose=False)
    logger.info("EasyOCR reader initialized successfully.")
except Exception as e:
    logger.error(f"Failed to initialize EasyOCR reader: {e}")


@router.post("/predict/image")
async def predict_image(file: UploadFile = File(...)):
    # Validate file extension
    ext = file.filename.lower().split(".")[-1]
    if ext not in ["jpg", "jpeg", "png", "bmp", "tiff", "webp"]:
        raise HTTPException(
            status_code=400,
            detail="Unsupported image format. Allowed: jpg, jpeg, png, bmp, tiff, webp."
        )

    file_path = os.path.join(
        str(UPLOAD_DIR),
        file.filename
    )

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        if reader is None:
            raise HTTPException(
                status_code=500,
                detail="OCR reader engine is offline or failed to initialize."
            )

        # Step 1: Extract text using EasyOCR
        ocr_result = reader.readtext(file_path, detail=0)
        extracted_text = "\n".join(ocr_result)

        if not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="The uploaded image contains no readable text."
            )

        # Translate Hindi, extract fields, and analyze through the shared workflow.
        result = await predict_explain_log_job(
            job_data=None,
            raw_text=extracted_text,
            input_type="image"
        )

        return {
            "filename": file.filename,
            **result
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in image prediction route: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process image file: {str(e)}"
        )
    finally:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass
