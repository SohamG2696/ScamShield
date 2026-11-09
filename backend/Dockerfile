# ============================================================
# ScamShield Backend Multi-Stage Dockerfile (Optimized)
# Designed for Azure Container Apps / Low Memory & Small Disk Size
# ============================================================

# --- Stage 1: Build & Dependency Preparation ---
FROM python:3.12-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    HF_HOME=/root/.cache/huggingface \
    EASYOCR_MODULE_PATH=/root/.EasyOCR

WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install CPU PyTorch and all dependencies in a single consolidated step with --no-compile
RUN pip install --no-cache-dir --no-compile torch torchvision --index-url https://download.pytorch.org/whl/cpu \
 && pip install --no-cache-dir --no-compile --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

# Pre-download SentenceTransformer and EasyOCR weights into cache
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')" \
 && python -c "import easyocr; easyocr.Reader(['hi', 'en'], gpu=False, verbose=False)"

# Strip non-runtime artifacts safely:
# - PyTorch unit test suite (torch/test) and C++ headers (torch/include)
# - PyTorch test binaries in torch/bin (preserving torch_shm_manager required by torch._initExtension)
# - Python bytecode (__pycache__, *.pyc) and pip cache
RUN rm -rf /usr/local/lib/python3.12/site-packages/torch/test \
 && rm -rf /usr/local/lib/python3.12/site-packages/torch/include \
 && find /usr/local/lib/python3.12/site-packages/torch/bin -type f ! -name "torch_shm_manager" -delete 2>/dev/null || true \
 && find /usr/local/lib/python3.12/site-packages -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true \
 && find /usr/local/lib/python3.12/site-packages -name "*.pyc" -delete 2>/dev/null || true \
 && find /usr/local/lib/python3.12/site-packages -name "*.pyo" -delete 2>/dev/null || true \
 && rm -rf /root/.cache/pip /root/.cache/huggingface/xet

# --- Stage 2: Final Production Runner ---
FROM python:3.12-slim AS runner

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PORT=8000 \
    OMP_NUM_THREADS=2 \
    MKL_NUM_THREADS=2 \
    HF_HOME=/root/.cache/huggingface \
    EASYOCR_MODULE_PATH=/root/.EasyOCR

WORKDIR /app

# Install strictly necessary system runtime libraries:
# - libgomp1: OpenMP runtime for LightGBM
# - libglib2.0-0: GLib runtime for OpenCV headless
# - curl: Lightweight health checking
# Note: libgl1 (OpenGL/Mesa/LLVM ~191MB) is omitted as opencv-python-headless does not require it.
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    libglib2.0-0 \
    curl \
 && rm -rf /var/lib/apt/lists/*

# Copy Python packages and binaries from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy baked-in model caches from builder
COPY --from=builder /root/.cache /root/.cache
COPY --from=builder /root/.EasyOCR /root/.EasyOCR

# Copy application code and model artifacts
COPY . /app/

# Ensure uploads directory exists
RUN mkdir -p /app/uploads

EXPOSE 8000

# Health check to ensure FastAPI is responding
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://127.0.0.1:8000/health || exit 1

# Launch Uvicorn with single worker to keep memory usage low (~400MB-600MB)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
