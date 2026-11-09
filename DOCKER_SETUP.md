# ScamShield Docker Deployment Guide (Windows & Docker Desktop)

This guide walks you through building and running the complete **ScamShield** platform (FastAPI backend + React Vite frontend) inside Docker containers using **Docker Desktop for Windows**.

---

## 1. Architecture Overview

```
                                      ┌──────────────────────────────────────────────┐
                                      │              Docker Host (Windows)           │
                                      │                                              │
[ User Browser ]                      │  ┌──────────────────┐  ┌──────────────────┐  │
  ├─ http://localhost:3000 (UI) ─────┼─>│ Frontend (Nginx) │  │  Backend (API)   │  │
  ├─ http://localhost:5173 (UI) ─────┼─>│ Ports 3000 & 5173│  │  Port: 8000:8000 │  │
  │                                   │  └────────┬─────────┘  └────────┬─────────┘  │
  └─ http://localhost:8000 (API) ────┼───────────┼───────────>│  FastAPI/Uvicorn │  │
                                      │  └────────┬─────────┘  └────────┬─────────┘  │
                                      │           │                     │            │
                                      │           └─── scamshield-net ──┘            │
                                      │                     │                        │
                                      │            ┌────────┴────────┐               │
                                      │            │  Docker Volumes │               │
                                      │            │ (Model Caches)  │               │
                                      │            └─────────────────┘               │
                                      └──────────────────────────────────────────────┘
```

- **Frontend Service (`scamshield-frontend`)**: Multi-stage build (Node 20 -> Nginx Alpine), exposed on **`http://localhost:3000`** and **`http://localhost:5173`**. Configured with SPA fallback routing and Gzip compression.
- **Backend Service (`scamshield-backend`)**: Python 3.12-slim container with CPU-only PyTorch, LightGBM, EasyOCR, Sentence Transformers, and PyMuPDF, exposed on **`http://localhost:8000`**.
- **Model Caching**: Sentence Transformer and EasyOCR weights are baked in during the Docker build and backed by persistent Docker named volumes so containers start in ~2 seconds without re-downloading model weights.

---

## 2. Prerequisites

1. **Install Docker Desktop for Windows**:
   - Download from: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
   - Ensure the **WSL 2 backend** option is checked during installation.
2. **Start Docker Desktop**:
   - Open Docker Desktop from the Start Menu.
   - Wait until the whale icon in the bottom-left shows **Engine running** (green).

---

## 3. Step-by-Step Setup

### Step 1: Configure Environment Variables

Open Windows PowerShell in the project root (`ScamShield` directory) and copy the `.env.example` template:

```powershell
Copy-Item .env.example .env
```

Open `.env` in your text editor (e.g., VS Code or Notepad) and configure your keys:

```dotenv
# Required for AI fraud intelligence reports
GROQ_API_KEY=your_actual_groq_api_key_here

# Model selection (defaults to high-accuracy model with automatic fallback)
GROQ_MODEL=openai/gpt-oss-120b

# Optional: Supabase logging
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here

# Frontend API Endpoint (default is localhost:8000 for browser access)
VITE_API_BASE_URL=http://localhost:8000

# Optional: Google OAuth Client ID (only needed if you use Gmail Scan)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

> [!IMPORTANT]
> If using Gmail scanning: Go to your [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials), edit your OAuth 2.0 Client ID, and add **`http://localhost:3000`** to **Authorized JavaScript Origins**.

---

### Step 2: Build and Launch Containers

Run this single command from PowerShell in the project root:

```powershell
docker compose up --build -d
```

**What this does automatically:**
1. Installs CPU-only PyTorch (saving ~2GB vs default CUDA wheels).
2. Installs LightGBM, EasyOCR, and Sentence Transformers with all required system libraries (`libgomp1`, `libgl1`).
3. Pre-caches ML and OCR model weights into the container image.
4. Compiles the Vite React application into production static assets.
5. Launches Nginx on port 3000 and FastAPI on port 8000.
6. Waits for the backend health check to turn green before completing.

---

### Step 3: Verify Running Services

Open your web browser and visit:

| Service | URL | Description |
| :--- | :--- | :--- |
| **ScamShield Web UI** | [http://localhost:3000](http://localhost:3000) | Full web application interface |
| **FastAPI Swagger Docs** | [http://localhost:8000/docs](http://localhost:8000/docs) | Interactive API testing console |
| **Backend Health Check** | [http://localhost:8000/health](http://localhost:8000/health) | Returns `{"status":"running"}` |

---

## 4. Daily Operations & PowerShell Cheat Sheet

### View Container Status
```powershell
docker compose ps
```

### View Live Logs (Streamed)
```powershell
# All services
docker compose logs -f

# Backend only
docker compose logs -f backend

# Frontend only
docker compose logs -f frontend
```

### Stop the Application
```powershell
# Stop containers (keeps state and volumes)
docker compose stop

# Resume stopped containers
docker compose start
```

### Restart the Application
```powershell
docker compose restart
```

### Rebuild After Code Changes
When you make changes to frontend components or backend logic, run:
```powershell
docker compose up --build -d
```

### Tear Down and Remove Containers
```powershell
# Stop and remove containers and networks
docker compose down

# Stop, remove containers, and purge model cache volumes
docker compose down -v
```

---

## 5. Security & Privacy: Are My Gmail APIs Safe?

**Yes, your Gmail API integration is fully safe and secure.** Here is exactly how it is architected:

1. **Read-Only Scope (`gmail.readonly`)**:
   - ScamShield only requests the `https://www.googleapis.com/auth/gmail.readonly` permission.
   - It is technically impossible for the application to send, delete, edit, or modify any emails or account settings.
2. **Browser-Only Token Storage**:
   - The Google OAuth 2.0 token is stored exclusively in your browser's temporary `sessionStorage`.
   - When you close your browser tab or window, the token is automatically wiped out.
3. **Zero Token Transmission to Backend**:
   - The backend server **never receives** your Google OAuth token or your credentials.
   - The frontend reads your inbox headers locally in the browser to display message stubs.
4. **Selective Scanning Only**:
   - Nothing in your inbox is ever automatically crawled, stored, or indexed.
   - Only when you explicitly select a single email and click **"Scan Email"**, the plain-text body of that single email is submitted to `/predict/text` for scam evaluation.
5. **No Exposed Secrets**:
   - Client-side OAuth utilizes only the public `VITE_GOOGLE_CLIENT_ID`. No `client_secret` is required or stored.
   - Credentials in `.env` are protected by `.gitignore` and `.dockerignore` so they are never leaked into container images or version control.

---

## 6. Troubleshooting

### Problem: Port 3000 or 8000 is already in use
**Solution**: Check if local node or uvicorn processes are running outside Docker:
```powershell
Get-NetTCPConnection -LocalPort 3000, 8000 -ErrorAction SilentlyContinue | Select-Object LocalPort, OwningProcess
```
Stop the conflicting process or change the port mapping in `compose.yaml` (e.g. `"3001:80"` or `"8001:8000"`).

### Problem: EasyOCR or Sentence Transformer takes long on first start
**Solution**: Weights are pre-cached during the Docker build stage. If the named volume was reset, the container will download them once and save them in the `scamshield-hf-cache` and `scamshield-easyocr-cache` Docker volumes.

### Problem: Google Sign-in popup says `origin_mismatch`
**Solution**: Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials), click your OAuth Client ID, and ensure `http://localhost:3000` is listed under **Authorized JavaScript origins**.

