# 🛡️ ScamShield — AI-Powered Job Scam Detection Platform

ScamShield is a full-stack, production-ready AI platform designed to protect job seekers by detecting fraudulent job postings, offer letters, and recruitment messages using machine learning, deep NLP sentence embeddings, and LLM reasoning.

Users can evaluate opportunities via raw text descriptions, PDF document uploads, screenshot images (OCR), or direct Gmail inbox analysis.

---

## 🏗️ Architecture Overview

```
User Input (Text / PDF / Image / Gmail)
                   ↓
        FastAPI Backend Engine
                   ↓
   Text Extraction & OCR (PyMuPDF / EasyOCR)
                   ↓
   Relevance Verification & LLM Parsing (Groq)
                   ↓
       Feature Engineering Pipeline
    (Sentence Transformers 384d + 21 Tabular)
                   ↓
      LightGBM Classifier Inference
             (405-dim vector)
                   ↓
   Explainability & Risk Reporting (Groq / Rules)
                   ↓
       Cloud Logging (Supabase REST)
                   ↓
     Modern Reactive UI (React + Vite)
```

---

## 📁 Repository Structure

```
ScamShield/
├── .env.example                  # Environment configuration template
├── .gitignore                    # Git ignore rules (protects credentials & artifacts)
├── README.md                     # Project documentation
├── start.ps1                     # Dev backend server launcher script (Windows)
│
├── backend/                      # FastAPI Backend & ML Service
│   ├── app.py                    # Application entry point & CORS configuration
│   ├── config.py                 # Paths, thresholds, model settings, and env loader
│   ├── embedding.py              # SentenceTransformer embedding extraction (MiniLM-L6)
│   ├── feature_engineering.py    # Structured tabular feature engineering
│   ├── pipeline.py               # Feature encoding and vector assembly
│   ├── predictor.py              # Unified prediction, explanation, and logging workflow
│   ├── requirements.txt          # Python package dependencies
│   ├── schemas.py                # Pydantic request and response models
│   ├── models/                   # Pre-trained ML artifacts
│   │   ├── best_model.pkl        # Trained LightGBM classifier
│   │   ├── encoder.pkl           # OneHotEncoder for categorical attributes
│   │   ├── feature_columns.pkl   # Ordered input feature names
│   │   └── metadata.pkl          # Training metadata
│   ├── routes/                   # API route handlers
│   │   ├── chat.py               # AI Assistant conversation endpoint
│   │   ├── image.py              # OCR screenshot scanning endpoint (/predict/image)
│   │   └── pdf.py                # PDF document parsing endpoint (/predict/pdf)
│   ├── tests/                    # Integration and unit tests
│   │   ├── __init__.py
│   │   ├── sample.pdf            # Sample test job posting PDF
│   │   └── test_routes.py        # Automated API integration tests
│   ├── uploads/                  # Temporary upload processing directory (.gitkeep)
│   └── utils/                    # Utility helper modules
│       ├── __init__.py
│       ├── db_utils.py           # Supabase async prediction logger
│       ├── feature_utils.py      # Feature parsing and URL/domain helpers
│       ├── groq_client.py        # Groq LLM integration & fallback reasoning
│       └── pdf_parser.py         # PyMuPDF text extractor
│
└── scamshield-frontend/          # React + Vite Frontend Application
    ├── .env.example              # Frontend environment variables template
    ├── .gitignore                # Frontend-specific ignore rules
    ├── index.html                # Single-page application entry HTML
    ├── package.json              # NPM dependencies and scripts
    ├── postcss.config.js         # PostCSS configuration
    ├── tailwind.config.js        # Tailwind CSS design system and tokens
    ├── vite.config.js            # Vite build configuration
    └── src/
        ├── App.jsx               # Root application router
        ├── main.jsx              # React DOM mounting
        ├── index.css             # Global styling and Tailwind directives
        ├── components/           # UI and layout component libraries
        │   ├── landing/          # Landing page hero and demo animations
        │   ├── layout/           # Navbar, Footer, Page transitions
        │   └── ui/               # Cards, badges, buttons, scanning loaders
        ├── contexts/             # React context providers (e.g. Google Auth)
        ├── hooks/                # Custom React hooks (toast, countup, theme)
        ├── pages/                # Screen views (Home, Scan, Result, History, etc.)
        ├── services/             # API clients and HTTP services
        └── utils/                # Frontend helper utilities
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python**: 3.10+ (tested with Python 3.11 - 3.14)
- **Node.js**: 18+ and `npm`

### 2. Backend Setup

```powershell
# 1. Create and activate a virtual environment
python -m venv .venv
.venv\Scripts\Activate.ps1

# 2. Install backend dependencies
pip install -r backend/requirements.txt

# 3. Create your local .env configuration
Copy-Item .env.example .env
```

Open `.env` and configure your credentials:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama3-8b-8192
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
```

### 3. Frontend Setup

```powershell
cd scamshield-frontend

# 1. Install NPM packages
npm install

# 2. Configure local frontend environment
Copy-Item .env.example .env.local
```

In `scamshield-frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
```

---

## 🏃 Running the Application

### Option A: Using the Launcher Script (Backend)
From the repository root:
```powershell
.\start.ps1
```

### Option B: Manual Startup

**Terminal 1 — Backend:**
```powershell
cd backend
..\.venv\Scripts\uvicorn.exe app:app --reload --host 0.0.0.0 --port 8000
```
- API Base URL: `http://localhost:8000`
- Swagger UI / Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

**Terminal 2 — Frontend:**
```powershell
cd scamshield-frontend
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🧪 Running Integration Tests

ScamShield includes an end-to-end integration test suite verifying health, text classification, PDF extraction, and image OCR:

```powershell
# From the project root with the virtual environment activated:
python backend/tests/test_routes.py
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/health` | Server health check |
| `POST` | `/predict/text` | Predict scam probability from text or JSON fields |
| `POST` | `/predict/pdf` | Upload and analyze a PDF job posting or offer letter |
| `POST` | `/predict/image` | Upload and analyze a screenshot via OCR |
| `POST` | `/chat` | Embedded AI assistant conversational endpoint |

---

## 🧠 Machine Learning Engine

- **Model**: LightGBM Gradient Boosted Decision Tree
- **Text Embedding**: `sentence-transformers/all-MiniLM-L6-v2` (384 dimensions)
- **Engineered Features**: 21 structured indicators (salary clarity, domain reputation, contact authenticity, requirements depth, etc.)
- **Total Features**: 405-dimensional vector
- **Performance**: ~97.5% validation accuracy

---

## 🔒 Security & Privacy

- All sensitive keys (`GROQ_API_KEY`, `SUPABASE_KEY`, Google OAuth tokens) are kept strictly out of git tracking via `.gitignore`.
- Uploaded PDFs and images are processed in-memory / temporary storage and immediately cleaned up to prevent data retention.
- Requests without credentials automatically fallback to rule-based verification so core functionality remains robust.
