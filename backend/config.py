from pathlib import Path
import os

# ===========================
# Project Paths
# ===========================

BASE_DIR = Path(__file__).resolve().parent

MODELS_DIR = BASE_DIR / "models"

MODEL_PATH = MODELS_DIR / "best_model.pkl"

ENCODER_PATH = MODELS_DIR / "encoder.pkl"

FEATURE_COLUMNS_PATH = MODELS_DIR / "feature_columns.pkl"

UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# ===========================
# Sentence Transformer
# ===========================

SENTENCE_MODEL = "all-MiniLM-L6-v2"

# ===========================
# Prediction Thresholds
# ===========================

LOW_RISK = 0.30
MEDIUM_RISK = 0.60
HIGH_RISK = 0.85

# ===========================
# Security & Upload Guardrails
# ===========================

MAX_UPLOAD_SIZE_BYTES = int(os.getenv("MAX_UPLOAD_SIZE_BYTES", str(10 * 1024 * 1024)))  # 10 MB limit
MAX_TEXT_LENGTH = int(os.getenv("MAX_TEXT_LENGTH", "65536"))  # 64 KB limit

# Default production and local origins
DEFAULT_ALLOWED_ORIGINS = [
    "https://happy-cliff-00cb7b800.4.azurestaticapps.net",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:4173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:4173",
]

raw_origins = os.getenv("ALLOWED_ORIGINS", "").strip()
if raw_origins:
    if raw_origins.startswith("[") and raw_origins.endswith("]"):
        import json
        try:
            ALLOWED_ORIGINS = json.loads(raw_origins)
        except Exception:
            ALLOWED_ORIGINS = [o.strip().strip("'\"") for o in raw_origins.strip("[]").split(",") if o.strip()]
    else:
        ALLOWED_ORIGINS = [o.strip().strip("'\"") for o in raw_origins.split(",") if o.strip()]
else:
    ALLOWED_ORIGINS = DEFAULT_ALLOWED_ORIGINS

# Ensure empty strings or whitespace are stripped
ALLOWED_ORIGINS = [origin.rstrip("/") for origin in ALLOWED_ORIGINS if origin]

# ===========================
# External Integrations
# ===========================

# Check possible .env file locations (backend dir, project root, or current working dir)
for candidate in [BASE_DIR / ".env", BASE_DIR.parent / ".env", Path.cwd() / ".env"]:
    if candidate.is_file():
        try:
            with open(candidate, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, val = line.split("=", 1)
                        # setdefault preserves existing environment variables passed by Docker or OS
                        os.environ.setdefault(key.strip(), val.strip().strip("'\""))
            break
        except Exception:
            pass

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
