"""Soil nutrient prediction inference layer.

Phase 1 (today): returns hardcoded placeholder predictions per CAR location.
Phase 2 (when Liam delivers joblibs): load joblib models from MODEL_DIR and run
sklearn pipeline prediction on per-location feature vectors.
Phase 3 (when Sentinel-2 fetch is wired): pull tiles from Copernicus CDSE,
extract patch statistics or Clay v1.5 embeddings, then call Phase 2 predict.

Swap point for Phase 2 is `SoilPredictor.predict_for_location` body.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Optional


# Mirror of the webapp's static JSON. Identical shape and values so the
# /predict endpoint is contract-equivalent to the webapp's static fallback.
PLACEHOLDER_PREDICTIONS: dict[str, dict] = {
    "La Trinidad":  {"nitrogen": "Medium", "phosphorus": "Low",    "potassium": "Medium", "pH": "Slightly Acidic", "raw": None},
    "Atok":         {"nitrogen": "Low",    "phosphorus": "Low",    "potassium": "Medium", "pH": "Acidic",          "raw": None},
    "Benguet":      {"nitrogen": "Medium", "phosphorus": "Medium", "potassium": "Medium", "pH": "Slightly Acidic", "raw": None},
    "Baguio":       {"nitrogen": "Medium", "phosphorus": "Low",    "potassium": "High",   "pH": "Slightly Acidic", "raw": None},
    "Tublay":       {"nitrogen": "Low",    "phosphorus": "Medium", "potassium": "Medium", "pH": "Slightly Acidic", "raw": None},
    "Kapangan":     {"nitrogen": "Medium", "phosphorus": "Low",    "potassium": "Medium", "pH": "Acidic",          "raw": None},
    "Bokod":        {"nitrogen": "Low",    "phosphorus": "Medium", "potassium": "High",   "pH": "Slightly Acidic", "raw": None},
    "Kabayan":      {"nitrogen": "Medium", "phosphorus": "Medium", "potassium": "Medium", "pH": "Slightly Acidic", "raw": None},
}

PLACEHOLDER_FALLBACK = {
    "nitrogen": "Medium",
    "phosphorus": "Medium",
    "potassium": "Medium",
    "pH": "Slightly Acidic",
    "raw": None,
}


class SoilPredictor:
    def __init__(self, model_dir: Optional[Path | str] = None):
        self.model_dir = Path(model_dir) if model_dir else None
        self._models: Optional[dict] = None

    @property
    def is_real(self) -> bool:
        """True once Phase 2 is implemented and joblibs are loaded."""
        return self._models is not None

    def predict_for_location(self, location_name: str) -> dict:
        # Phase 2 swap point — load self._models lazily, extract features,
        # run sklearn predict, translate logits → ordinal classes.
        prediction = PLACEHOLDER_PREDICTIONS.get(location_name)
        if prediction is None:
            return {**PLACEHOLDER_FALLBACK, "source": "fallback"}
        return {**prediction, "source": _source_label()}

    def known_locations(self) -> list[str]:
        return sorted(PLACEHOLDER_PREDICTIONS.keys())


def _source_label() -> str:
    """`placeholder` until Phase 2 swaps in real inference. Override via env if
    you want to label the response differently for testing."""
    return os.environ.get("ML_SOURCE_LABEL", "placeholder")
