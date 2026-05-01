"""SoilScan ML prediction API — thin FastAPI wrapper around Liam's pipeline.

Phase 1 returns placeholder per-location predictions. The /predict contract is
stable; Phase 2 swaps the inference body without changing the HTTP shape.

Run locally:
    uvicorn app:app --host 0.0.0.0 --port 8000 --reload

CORS is permissive in dev. Tighten ALLOWED_ORIGINS for any deployment that
exposes this backend to the public internet.
"""

from __future__ import annotations

import os

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from inference import SoilPredictor

app = FastAPI(title="SoilScan ML Prediction API", version="0.1.0")

ALLOWED_ORIGINS = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173,http://localhost:8080",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in ALLOWED_ORIGINS if o.strip()],
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)

predictor = SoilPredictor(model_dir=os.environ.get("MODEL_DIR"))


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "predictor_real": predictor.is_real,
        "supported_locations": len(predictor.known_locations()),
    }


@app.get("/locations")
def locations() -> dict:
    return {"locations": predictor.known_locations()}


@app.get("/predict")
def predict(location: str = Query(..., min_length=1, description="CAR location key (e.g., 'La Trinidad')")) -> dict:
    try:
        return predictor.predict_for_location(location)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc
