# SkibiData — Satellite-Based Soil Nutrient Assessment

> Saint Louis University · Computer Science · Thesis 2026
> Team SkibiData (Aragona, Bravo, Cayton, Fabe, Magpili, Morados, Morales, Palacio)

A web-based decision support system that estimates soil NPK + pH from
Sentinel-2 imagery and produces crop-specific fertilizer recommendations
for highland vegetable farms in the Cordillera Administrative Region
(CAR), Philippines.

**Live deployment:** https://skibidata-webapp-model-integration-production.up.railway.app

---

## Architecture

The webapp is the front-end client of a three-service distributed system,
all deployed on Railway in the same `asia-southeast1-eqsg3a` region.

```
┌────────────────────────────────────────────────────────────────────┐
│  Browser — React SPA (this repo)                                   │
│  Vite + Tailwind + Mapbox GL + Zustand + Framer Motion             │
└──────────────────────┬─────────────────────────────────────────────┘
                       │ HTTPS (CORS-tolerant w/ smart probe)
        ┌──────────────┼──────────────────────────────────┐
        │              │                                  │
        ▼              ▼                                  ▼
┌──────────────┐  ┌────────────────┐          ┌─────────────────────┐
│ Open-Meteo   │  │ Liam's ML API  │          │ Hans's Rule Engine  │
│ NASA POWER   │  │ Sentinel-2 +   │          │ FastAPI service     │
│ (weather +   │  │ scikit-learn   │          │ Crop NPK rules +    │
│  elevation)  │  │ (NPK + pH      │          │ multi-candidate     │
│              │  │  classifiers)  │◄────────►│ fertilizer mixing   │
└──────────────┘  └───────┬────────┘   CORS   │                     │
                          │           proxy   │                     │
                          ▼                   └─────────────────────┘
                   ┌────────────────┐
                   │ cors-proxy/    │  This repo, separate Railway
                   │ (FastAPI       │  service. Forwards Liam's
                   │  forwarder)    │  endpoints with permissive
                   └────────────────┘  CORS headers — bypassed
                                       once upstream ships CORS.
```

| Service | Repo | Deployment |
|---|---|---|
| Webapp (this repo) | [`Skibidata-WebApp-Model-Integration`](https://github.com/k10nite/Skibidata-WebApp-Model-Integration) | `skibidata-webapp-model-integration-production.up.railway.app` |
| Rule engine | [`SoilScanRuleBased`](https://github.com/HansFredrick/SoilScanRuleBased) | `soilscanrulebased-production.up.railway.app` |
| ML API | [`SoilScan-Sentinel2-API`](https://github.com/ljiro/SoilScan-Sentinel2-API) | `soilscan-sentinel2-api-production.up.railway.app` |
| CORS proxy | This repo, `cors-proxy/` | `soilscan-cors-proxy-production.up.railway.app` (when deployed) |

---

## Tech stack

- **React 18.3** — component-based UI
- **Vite 5** — build tool + dev server (`npm run dev` opens on `localhost:5173`)
- **Tailwind CSS 3** — utility-first styling, plus a `terrace-*` design system
  layered on top (see `docs/design.md`)
- **Mapbox GL JS 3.23** — satellite basemap, polygon drawing, geocoder
- **`@mapbox/mapbox-gl-draw`** — polygon edit UI
- **`@mapbox/mapbox-gl-geocoder`** — text-to-location search
- **Turf.js** — client-side area, centroid, bounding-box calculations
- **Framer Motion** — orchestrated screen-arrival animations
- **Zustand 4** — single state store across all 7 screens
- **React Router v6** — client-side routing

External APIs:

- **Open-Meteo** — current weather, soil moisture, soil temperature
- **NASA POWER** — historical solar radiation, growing-degree days
- **Mapbox Static Images API** — polygon thumbnails on downstream screens

---

## The seven-screen workflow

1. **Location Selection** (`/location-selection`) — Mapbox satellite map.
   User draws a polygon (or hits "Magic Click" for a demo polygon). Area,
   centroid, and nearest known CAR municipality are saved to the store.
2. **Processing** (`/processing`) — Active loading state showing a 4-step
   pipeline checklist (satellite → spectral extraction → ML prediction →
   normalize). The Liam ML call fires here. ML SOURCE pill shows live
   status: `LIAM-ML` (real inference), `PLACEHOLDER` (fallback), or
   `PENDING`.
3. **Plant Selection** (`/plant-selection`) — Two-panel screen. Left: field
   profile + soil profile + recommended-for-your-soil + engine inputs.
   Right: searchable index of 44 crops grouped by category, English +
   Filipino names.
4. **Soil Status** (`/soil-status`) — Single-screen instrument panel:
   polygon thumbnail, satellite telemetry table, primary measurements
   (N/P/K/pH with status badges + confidence bars), ML metadata strip,
   targets-vs-measured horizontal bar chart.
5. **Plant Requirements** (`/plant-requirements`) — Crop nutrient demands
   in scientific-notebook ledger format.
6. **Fertilizer Recommendations** (`/fertilizer-recommendations`) — POSTs
   to Hans's rule engine, displays up to 10 candidate combinations with a
   per-fertilizer NPK breakdown table. Hover any cell for the explicit
   `qty × NPK% = result` math.
7. **Complete Summary** (`/complete`) — Field report in 2×2 hairline grid
   (FIELD / SOIL / CROP / PRESCRIPTION). Plain-text download supported.

---

## Quick start

Prerequisites: Node 18+, npm 9+, a Mapbox public token.

```bash
git clone git@github.com:k10nite/Skibidata-WebApp-Model-Integration.git
cd Skibidata-WebApp-Model-Integration
npm install
cp .env.example .env
# Edit .env — at minimum, set VITE_MAPBOX_TOKEN to your pk.* token
npm run dev
```

Opens on `http://localhost:5173`. On first load you should see the
Location Selection screen with a satellite map centred on La Trinidad.

### `.env` reference

| Variable | Required | Purpose |
|---|---|---|
| `VITE_MAPBOX_TOKEN` | Yes | Public `pk.*` Mapbox token. Restrict to your dev + production origins on the Mapbox dashboard. |
| `VITE_RULE_API_URL` | Recommended | Hans's rule engine. Defaults work for the live deployment. |
| `VITE_LIAM_API_URL` | Recommended | Direct URL to Liam's ML API. Falls back to CORS proxy if browser preflight fails. |
| `VITE_LIAM_PROXY_URL` | Optional | This repo's CORS proxy. Used when Liam's direct endpoint rejects the browser. |
| `VITE_DEBUG_LOGS` | Optional | Set to `false` to silence the dev logger. Defaults on. |
| `VITE_KIMI_API_KEY` | Optional | Kimi LLM API for ad-hoc dev experiments. Not in the active flow. |

---

## Project structure

```
thesis/
├── src/
│   ├── App.jsx                              # Routes + screen entry
│   ├── main.jsx                             # Vite entry
│   ├── store/appStore.js                    # Zustand store (single source of truth)
│   ├── screens/
│   │   ├── LocationSelection.jsx            # Screen 1 — map + polygon draw
│   │   ├── Processing.jsx                   # Screen 2 — ML pipeline UI
│   │   ├── PlantSelection.jsx               # Screen 3 — crop picker
│   │   ├── SoilStatus.jsx                   # Screen 4 — instrument panel
│   │   ├── PlantRequirements.jsx            # Screen 5 — crop demands
│   │   ├── FertilizerRecommendations.jsx    # Screen 6 — engine call + breakdown
│   │   └── Complete.jsx                     # Screen 7 — summary + download
│   ├── services/
│   │   ├── liamMLService.js                 # POST /predict to Liam (smart CORS probe)
│   │   ├── recommendationService.js         # POST /recommendation to Hans's engine
│   │   ├── mlPredictionService.js           # Placeholder JSON fallback for ML
│   │   ├── satelliteService.js              # Open-Meteo + NASA POWER
│   │   ├── mapboxStaticService.js           # Polygon thumbnail URL builder
│   │   └── logger.js                        # Channel-prefixed dev console logger
│   ├── data/
│   │   ├── mlPredictions.json               # Fallback NPK/pH per municipality
│   │   └── fertilizerRecommendations.js     # (legacy local stub, dead path)
│   └── styles/index.css                     # Terrace design system tokens + classes
├── cors-proxy/                              # FastAPI proxy to Liam's API
│   ├── main.py
│   ├── requirements.txt
│   ├── Procfile
│   └── railway.json
├── docs/
│   ├── design.md                            # Cross-project design reference
│   ├── results-discussion.md                # Thesis Chapter 3 draft
│   ├── results-performance.md               # Performance subsection (real numbers)
│   └── testing/liam-api.md                  # API testing how-to
├── liam-soilscan-api-postman-collection.json # Postman collection for Liam's API
├── .env.example
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md                                 # This file
```

---

## Documentation

- **`docs/design.md`** — Design system reference (colors, typography, motion,
  reusable components, engine integration contract). For anyone rebuilding
  a screen or integrating in another codebase.
- **`docs/results-discussion.md`** — Pasteable Chapter 3 (Results & Discussion)
  draft, screen-by-screen. Honest about scope-met vs scope-pending.
- **`docs/results-performance.md`** — Real measured latency numbers for all
  three services on 2026-05-07.
- **`docs/testing/liam-api.md`** — How to test Liam's `/predict` endpoint
  with curl + Postman.

---

## Development

### Build for production

```bash
npm run build       # → dist/
npm run preview     # serve dist/ on port 4173 (matches Railway runtime)
```

### Lint

```bash
npm run lint
npm run lint:fix
```

ESLint config blocks unused-disable-directives and treats warnings as
errors. Fix locally before pushing.

### The CORS proxy (separate Railway service)

Liam's deployed API doesn't have CORS middleware yet, so browser-to-API
calls fail at preflight. The webapp's `liamMLService.js` performs a
one-time CORS probe at startup; if the upstream rejects the probe it
falls back to a proxy URL. The proxy is a tiny FastAPI service in
`cors-proxy/` deployed as a separate Railway service.

To run the proxy locally:

```bash
cd cors-proxy
python -m venv .venv
.venv/Scripts/activate    # or source .venv/bin/activate on Mac/Linux
pip install -r requirements.txt
uvicorn main:app --port 8080 --reload
```

When Liam adds `CORSMiddleware` upstream, the smart probe detects it on
the next page reload and the proxy is bypassed automatically — no env
var change needed.

### Dev logging

`src/services/logger.js` provides channel-prefixed console output
(`ML`, `RULE`, `STORE`, `FLOW`, `WARN`) with color-coded backgrounds.
Open DevTools console while walking the workflow to trace the full data
flow:

```
SoilScan dev logging enabled
STORE  fertilizer chip added         {name: "Urea", count: 1}
FLOW   PlantSelection → /soil-status {crop: "Cabbage", areaHectares: 0.5}
ML     POST /predict → DIRECT        {url, polygonVertices: 8}
ML     Liam response 200 in 230ms    {sampleCount, n: "Low", ...}
RULE   POST /recommendation → engine {body: {selected_inventory_names: ["Urea", ...]}}
RULE   engine response 200 in 187ms  {candidates: 10, inventory_check_valid: true}
```

Set `VITE_DEBUG_LOGS=false` in `.env` to silence.

---

## Deployment

The webapp deploys to Railway via GitHub integration on every push to
`main`. Build command is `npm install && npm run build`; start command
is `npm run preview -- --host 0.0.0.0 --port $PORT`.

The `cors-proxy/` directory deploys as a separate Railway service in
the same project (`skibidaddling`), with `Root Directory = cors-proxy/`
configured in service settings.

Railway env vars match the `.env.example` keys — `VITE_MAPBOX_TOKEN`,
`VITE_RULE_API_URL`, `VITE_LIAM_API_URL`, `VITE_LIAM_PROXY_URL` — all
inlined into the JS bundle at build time, so changes require a
redeploy.

---

## Performance (deployed system, measured 2026-05-07)

| Component | Cold | Warm |
|---|---|---|
| Webapp HTML shell | n/a | 0.73 s TTFB |
| JS bundle (838 KB gzipped) | n/a | 0.66 s TTFB |
| Rule engine `/recommendation` | 0.79 s | 0.79 s |
| Sentinel-2 ML `/predict` | 10.18 s | 3.23 s |
| Page-to-page navigation | n/a | < 50 ms |
| End-to-end pipeline | 11–13 s | 4.0–5.5 s |

Detailed measurement in `docs/results-performance.md`.

---

## Project status

- **Field data:** 211 unique field observations across La Trinidad and Atok
  (proposal scope was 5 CAR municipalities; remaining 3 are pending data
  collection).
- **ML accuracy** (XGBoost overall accuracy):
  - Nitrogen: **0.782** ✅ (target ≥0.65)
  - Phosphorus: **0.750** ✅
  - Potassium: **0.723** ✅
  - pH: **0.216** ❌ (largest open accuracy gap; 11-class ordinal classification
    is materially harder than 3-class NPK)
- **Validation:** TAM survey of 65 farmers and RCBD field trials are scheduled
  post-defense.

---

## Team

- **Aragona, Hans Fredrick** — Rule-based fertilizer recommendation engine
  (`SoilScanRuleBased`)
- **Bravo, Matt Danielle** — Rule-based engine support
- **Cayton, Neil Clarence** — Web application + system integration (this repo)
- **Fabe, Milton Junsel** — UI prototyping (`fertilizer-ui/`, `mapbox/`)
- **Magpili, Dylan Yeoj** — Field data collection
- **Morados, Lou Diamond** — Mobile app & backend, fertilizer inventory naming
- **Morales, Liam Jiro** — ML model + Sentinel-2 inference API
  (`SoilScan-Sentinel2-API`)
- **Palacio, Malmar** — Field operations

Advisor: Saint Louis University Computer Science Department, in
coordination with Benguet State University and DA-Cordillera
Administrative Region.

---

## License

Academic / thesis project. Not for production agronomic use without
local extension-officer validation.
