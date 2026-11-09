import os
import uuid
import logging
from fastapi import APIRouter, UploadFile, File, Request, HTTPException
from utils.pdf_parser import extract_text_from_pdf
from predictor import predict_explain_log_job
from config import UPLOAD_DIR, MAX_UPLOAD_SIZE_BYTES
from utils.rate_limiter import inference_limiter

logger = logging.getLogger("scamshield.routes.pdf")
router = APIRouter()

PDF_MAGIC = b"%PDF-"


@router.post("/predict/pdf")
async def predict_pdf(request: Request, file: UploadFile = File(...)):
    # Rate limit check per client IP
    inference_limiter.check(request)

    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only valid PDF files (.pdf) are supported.")

    # Sanitize user display name
    safe_display_name = os.path.basename(file.filename).strip() or "document.pdf"

    # Generate isolated, collision-proof temporary filename to eliminate path traversal risks
    temp_filename = f"pdf_{uuid.uuid4().hex}.pdf"
    file_path = os.path.join(str(UPLOAD_DIR), temp_filename)

    bytes_written = 0
    header_checked = False

    try:
        with open(file_path, "wb") as buffer:
            # Stream in 64KB chunks to enforce file size limits without buffering entire file in RAM
            while True:
                chunk = await file.read(64 * 1024)
                if not chunk:
                    break

                bytes_written += len(chunk)
                if bytes_written > MAX_UPLOAD_SIZE_BYTES:
                    max_mb = MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)
                    raise HTTPException(
                        status_code=413,
                        detail=f"File exceeds maximum allowed upload size of {max_mb} MB."
                    )

                # Validate magic bytes on the first chunk
                if not header_checked:
                    if len(chunk) < len(PDF_MAGIC) or not chunk.startswith(PDF_MAGIC):
                        raise HTTPException(
                            status_code=400,
                            detail="Invalid PDF content. The file header does not match the PDF standard specification."
                        )
                    header_checked = True

                buffer.write(chunk)

        if bytes_written == 0:
            raise HTTPException(status_code=400, detail="The uploaded PDF file is empty.")

        # Step 1: Extract text using PyMuPDF
        extracted_text = extract_text_from_pdf(file_path)
        if not extracted_text or not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="The uploaded PDF file contains no readable text. If it is a scanned document, please use image analysis."
            )

        # Translate Hindi if needed, extract fields, and analyze through unified ML/Groq workflow
        result = await predict_explain_log_job(
            job_data=None,
            raw_text=extracted_text,
            input_type="pdf"
        )

        return {
            "filename": safe_display_name,
            **result
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing PDF upload ({safe_display_name}): {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze PDF document. Please verify the file is not password-protected or corrupted."
        )
    finally:
        # Guarantee immediate file cleanup
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as ex:
                logger.error(f"Failed to delete temp PDF file {file_path}: {ex}")
