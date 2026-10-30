from pathlib import Path

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
# External Integrations
# ===========================

import os

# Manual .env loading to avoid dependency on python-dotenv
env_path = BASE_DIR.parent / ".env"
if env_path.exists():
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                os.environ[key.strip()] = val.strip()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama3-8b-8192")

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")