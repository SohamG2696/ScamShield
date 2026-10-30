import httpx
import logging
from config import SUPABASE_URL, SUPABASE_KEY

logger = logging.getLogger("scamshield.db")


async def log_prediction_to_supabase(
    prediction: str,
    confidence: float,
    input_type: str,
    processing_time: float
):
    """
    Logs prediction details to the Supabase 'predictions' table asynchronously.
    Skips logging if Supabase credentials are not configured.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        logger.warning(
            "Supabase credentials (SUPABASE_URL/SUPABASE_KEY) are missing. "
            "Skipping cloud logging."
        )
        return

    url = f"{SUPABASE_URL}/rest/v1/predictions"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }

    payload = {
        "prediction": prediction,
        "confidence": confidence,
        "input_type": input_type,
        "processing_time": processing_time
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                headers=headers,
                json=payload,
                timeout=5.0
            )
            if response.status_code >= 300:
                logger.error(
                    f"Supabase logging failed (status {response.status_code}): {response.text}"
                )
            else:
                logger.info("Successfully logged prediction to Supabase.")
    except Exception as e:
        logger.error(f"Failed to log prediction to Supabase due to connection error: {e}")
