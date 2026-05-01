# SoilScan ML Prediction Backend

Thin FastAPI service that returns soil nutrient predictions per CAR location. The webapp's `mlPredictionService.js` calls `/predict` when `VITE_ML_API_URL` is set; otherwise it uses the static JSON fallback bundled in the webapp.

## Phases

| Phase | What `/predict` does | Status |
|---|---|---|
| 1 | Returns hardcoded placeholder predictions matching the webapp's static JSON | **Done** |
| 2 | Loads Liam's joblib models from `MODEL_DIR` and runs sklearn predict on per-location features | Pending Liam delivering joblibs |
| 3 | Live-fetches Sentinel-2 tiles from Copernicus CDSE, extracts patch features or Clay v1.5 embeddings, then runs Phase 2 inference | Pending Phase 2 + Copernicus credentials + design choice (precompute-and-cache vs on-demand) |

The HTTP contract is stable across phases — only `inference.py:SoilPredictor.predict_for_location` changes.

## Run locally

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate           # Windows
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Then in the webapp `.env`:

```
VITE_ML_API_URL=http://localhost:8000
```

Restart `npm run dev`. Without that env var, the webapp uses the bundled static JSON.

## Endpoints

- `GET /health` → `{status, predictor_real, supported_locations}`
- `GET /locations` → `{locations: [...]}`
- `GET /predict?location=La%20Trinidad` → `{nitrogen, phosphorus, potassium, pH, raw, source}`

Response shape per location matches `src/data/mlPredictions.json` in the webapp. Always returns 200 with a `source: "fallback"` payload if the location key is unknown — never 404 — so the webapp never breaks.

## Deployment

Bundled `Procfile` and `railway.json` deploy as a separate Railway service from the webapp. After deploying, set the webapp's `VITE_ML_API_URL` to the backend URL and rebuild.
