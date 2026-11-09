import os
import uuid
import logging
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Request, HTTPException
from predictor import predict_explain_log_job
from config import UPLOAD_DIR, MAX_UPLOAD_SIZE_BYTES
from utils.rate_limiter import inference_limiter

logger = logging.getLogger("scamshield.routes.image")
router = APIRouter()

ALLOWED_IMAGE_EXTS = {"jpg", "jpeg", "png", "bmp", "tiff", "webp"}

# Initialize EasyOCR reader lazily or at module load
reader = None
try:
    import easyocr
    logger.info("Initializing EasyOCR reader (CPU mode)...")
    reader = easyocr.Reader(['hi', 'en'], gpu=False, verbose=False)
    logger.info("EasyOCR reader initialized successfully.")
except Exception as e:
    logger.error(f"Failed to initialize EasyOCR reader: {e}")


def validate_image_header(header: bytes) -> Optional[str]:
    """
    Validates magic bytes to ensure file contents match claimed image formats.
    Returns the detected format string or None if unverified.
    """
    if len(header) < 12:
        return None

    # JPEG signature
    if header.startswith(b"\xff\xd8\xff"):
        return "jpeg"

    # PNG signature: 89 50 4E 47 0D 0A 1A 0A
    if header.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png"

    # WebP signature: RIFF....WEBP
    if header.startswith(b"RIFF") and header[8:12] == b"WEBP":
        return "webp"

    # BMP signature
    if header.startswith(b"BM"):
        return "bmp"

    # TIFF signature: II (little-endian) or MM (big-endian)
    if header.startswith(b"II*\x00") or header.startswith(b"MM\x00*"):
        return "tiff"

    return None


@router.post("/predict/image")
async def predict_image(request: Request, file: UploadFile = File(...)):
    # Rate limit check per client IP
    inference_limiter.check(request)

    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing uploaded image filename.")

    ext_parts = file.filename.lower().split(".")
    ext = ext_parts[-1] if len(ext_parts) > 1 else ""
    if ext not in ALLOWED_IMAGE_EXTS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image format '.{ext}'. Allowed formats: {', '.join(sorted(ALLOWED_IMAGE_EXTS))}."
        )

    safe_display_name = os.path.basename(file.filename).strip() or "screenshot.png"
    safe_ext = "png" if ext == "png" else "jpg" if ext in ("jpg", "jpeg") else ext

    # Generate isolated temporary filename
    temp_filename = f"img_{uuid.uuid4().hex}.{safe_ext}"
    file_path = os.path.join(str(UPLOAD_DIR), temp_filename)

    bytes_written = 0
    header_checked = False

    try:
        with open(file_path, "wb") as buffer:
            while True:
                chunk = await file.read(64 * 1024)
                if not chunk:
                    break

                bytes_written += len(chunk)
                if bytes_written > MAX_UPLOAD_SIZE_BYTES:
                    max_mb = MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)
                    raise HTTPException(
                        status_code=413,
                        detail=f"Image exceeds maximum allowed upload size of {max_mb} MB."
                    )

                if not header_checked:
                    detected_format = validate_image_header(chunk)
                    if not detected_format:
                        raise HTTPException(
                            status_code=400,
                            detail="Invalid image content. The file header does not match any supported image format."
                        )
                    header_checked = True

                buffer.write(chunk)

        if bytes_written == 0:
            raise HTTPException(status_code=400, detail="The uploaded image file is empty.")

        if reader is None:
            raise HTTPException(
                status_code=503,
                detail="OCR reader engine is currently initializing or unavailable."
            )

        # Step 1: Extract text using EasyOCR
        ocr_result = reader.readtext(file_path, detail=0)
        extracted_text = "\n".join(ocr_result)

        if not extracted_text or not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="The uploaded image contains no legible text. Please upload a clearer screenshot or document."
            )

        # Translate Hindi if needed, extract fields, and analyze through unified ML/Groq workflow
        result = await predict_explain_log_job(
            job_data=None,
            raw_text=extracted_text,
            input_type="image"
        )

        return {
            "filename": safe_display_name,
            **result
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing image upload ({safe_display_name}): {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze image file. Please ensure the image is not corrupted."
        )
    finally:
        # Guarantee immediate file cleanup
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as ex:
                logger.error(f"Failed to delete temp image file {file_path}: {ex}")
