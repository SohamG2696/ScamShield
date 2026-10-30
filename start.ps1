# ============================================================
# ScamShield API Server Launcher
# Run this script from the project root (ScamShield/)
# ============================================================

Write-Host ""
Write-Host "  ╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║         ScamShield API Server        ║" -ForegroundColor Cyan
Write-Host "  ╚══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Activate venv
$venvPython = "$PSScriptRoot\.venv\Scripts\python.exe"
$venvUvicorn = "$PSScriptRoot\.venv\Scripts\uvicorn.exe"

if (-Not (Test-Path $venvPython)) {
    Write-Host "[ERROR] Virtual environment not found at .venv/" -ForegroundColor Red
    Write-Host "Please run: python -m venv .venv; .venv\Scripts\pip install -r backend\requirements.txt" -ForegroundColor Yellow
    exit 1
}

if (-Not (Test-Path "$PSScriptRoot\backend\.env") -And -Not (Test-Path "$PSScriptRoot\.env")) {
    Write-Host "[WARN] No .env file found. Groq and Supabase integrations will run in fallback mode." -ForegroundColor Yellow
    Write-Host "       Create a .env file in the project root with GROQ_API_KEY and SUPABASE credentials." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "[INFO] Starting ScamShield backend on http://localhost:8000" -ForegroundColor Green
Write-Host "[INFO] Swagger UI: http://localhost:8000/docs" -ForegroundColor Green
Write-Host "[INFO] Health check: http://localhost:8000/health" -ForegroundColor Green
Write-Host "[INFO] To run the frontend: cd scamshield-frontend; npm run dev" -ForegroundColor Cyan
Write-Host ""

# Set encoding and launch from backend/
$env:PYTHONIOENCODING = "utf-8"
Set-Location "$PSScriptRoot\backend"
& $venvUvicorn app:app --reload --host 0.0.0.0 --port 8000
