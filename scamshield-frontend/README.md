# ScamShield — Frontend

AI-powered job scam detection UI. React + Vite + Tailwind CSS + Framer Motion.

## Getting started

```bash
npm install
cp .env.example .env      # then set VITE_API_BASE_URL to your FastAPI backend
npm run dev
```

Open http://localhost:5173.

## Connecting to your FastAPI backend

Set `VITE_API_BASE_URL` in `.env` (e.g. `http://localhost:8000`). The app calls:

- `POST /predict/text` — body `{ text }`
- `POST /predict/pdf` — multipart form, field `file`
- `POST /predict/image` — multipart form, field `file`

See `src/services/predictService.js`. If a call fails (e.g. backend not running yet),
the UI falls back to a sample result so every screen stays demoable — remove that
fallback in `TextScan.jsx` / `PdfScan.jsx` / `ImageScan.jsx` once your backend is live.

### Expected response shape

The Result page (`src/pages/Result.jsx`) expects:

```json
{
  "verdict": "scam" | "genuine",
  "confidence": 0.93,
  "riskLevel": "High" | "Medium" | "Low",
  "probabilities": { "scam": 0.93, "genuine": 0.07 },
  "reasons": [{ "label": "string", "weight": 0.31 }],
  "recommendation": "string"
}
```

Adjust the shape to match your backend, or map your backend's response into this
shape inside `predictService.js`. The "AI explanation" block at the bottom of the
Result page is still static copy — wire it to your Groq endpoint when it's ready.

## Project structure

```
src/
  assets/          static assets
  components/
    layout/        Navbar, Footer, AppLayout, PageTransition
    ui/             Button, GlassCard, ScanningLoader, CircularProgress, etc.
  pages/            Landing, Home, TextScan, PdfScan, ImageScan, Result,
                     History, Profile, Settings, About, NotFound
  hooks/            useTheme, useToast, useCountUp
  services/         apiClient.js, predictService.js
  utils/            cn.js, dummyData.js
```

## Design tokens

Colors, fonts, and animation keyframes live in `tailwind.config.js`. The signature
visual — a cyan/violet scanning beam sweeping a mock document — appears in the
landing hero, `ScanningLoader`, and loading states across all three scan pages, to
keep the "AI actively reading your document" idea consistent throughout.

## Not yet wired (build the backend logic, hook it up here)

- Real Groq-powered explanation panel (`Result.jsx`, bottom card)
- Auth / real user profile (`Profile.jsx` uses a dummy user)
- Persisted history (`History.jsx` uses in-memory dummy data)
- Light theme palette (toggle exists in `Settings.jsx`; only dark tokens are styled)
