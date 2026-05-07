# Chapter 3 — Results & Discussion

Pasteable thesis-grade prose covering the seven bullet requirements:

1. State what was tested (features, workflows)
2. Show what was successfully built and working
3. Report performance (load time, responsiveness, errors)
4. Summarize user testing results
5. Highlight any issues or failures observed
6. Screenshots or examples of the site in use
7. Briefly compare outcomes to original goals

Saved 2026-05-07. Numbers measured against the deployed system on the same date.

---

## 3.1 Scope of Testing

System verification was conducted across three layers — the React client
deployed to Railway, the rule-based fertilizer engine (Aragona, 2026)
deployed as a separate FastAPI service on the same Railway region, and
the Sentinel-2 machine-learning endpoint (Morales, 2026) deployed
independently with a Railway Volume holding satellite imagery and
SoilGrids prior data. Each component was verified individually via
direct API calls (curl, Postman) and end-to-end through the
seven-screen user workflow. The verification scope included:

- Functional correctness of the seven user-facing screens (Location
  Selection, Processing, Plant Selection, Soil Status, Plant
  Requirements, Fertilizer Recommendations, and Complete Summary)
- Cross-service integration (client ↔ rule engine, client ↔ ML model,
  client ↔ satellite/weather APIs)
- Data persistence across screens via the Zustand state management
  store (Kato, 2023)
- Graceful degradation under upstream service failure
- Request/response latency under representative load
- Cross-Origin Resource Sharing (CORS) handling for browser-to-API
  calls
- Polygon drawing fidelity and area calculation accuracy

Field validation against laboratory soil-test data, planned for the
final phase of the thesis, is reported separately in Chapter 4.

---

## 3.2 System Components Built and Verified

The following subsystems were successfully implemented, deployed, and
verified to be functional under real network conditions.

### 3.2.1 React Single-Page Application

A seven-screen client was built using React 18 (Meta Platforms, 2023),
styled with Tailwind CSS (Tailwind Labs, 2023), and animated with
Framer Motion. Mapbox GL JS v3.23 (Mapbox, 2023) provides the spatial
drawing surface, augmented by `@mapbox/mapbox-gl-draw` for polygon
input and `@mapbox/mapbox-gl-geocoder` for textual address resolution.
Geometric calculations (area, centroid, bounding box) are performed
client-side via Turf.js. Application state is managed by Zustand (Kato,
2023), avoiding the prop-drilling overhead that would otherwise occur
across seven screens. The full client compiles to a 2.51 MB JavaScript
bundle (838 KB after gzip compression), which is delivered in a single
HTTP request by Railway's edge.

### 3.2.2 Rule-Based Fertilizer Recommendation Engine

A FastAPI-based rule engine (Aragona, 2026) was deployed at the URL
`soilscanrulebased-production.up.railway.app/recommendation`. The
engine accepts a JSON payload of crop label, soil NPK status,
soil pH, target area, and an optional list of on-hand fertilizers. It
returns up to ten alternative fertilizer combinations ranked
ascending by total weight, along with per-combination NPK
contributions, a pH amendment advisory (liming or gypsum), and an
inventory-feasibility check against the user's selected products. The
engine evaluates 41 supported crop varieties against a 14-product
fertilizer catalog (`Yara Mila Winner`, `Solophos`, `Duofos`,
`Muriate of Potash`, `Urea`, etc.). Verification across five
representative request payloads returned consistent HTTP 200
responses with 4,645-byte bodies in 0.67–0.87 s.

### 3.2.3 Sentinel-2 Machine-Learning Endpoint

A scikit-learn-based inference service (Morales, 2026) was deployed at
`soilscan-sentinel2-api-production.up.railway.app/predict`. The
endpoint accepts a GeoJSON Polygon, samples the field on a 10-metre
grid, extracts twelve spectral bands and twelve SoilGrids prior layers
per sample point, and returns class distributions for nitrogen,
phosphorus, potassium (Low/Medium/High), and pH (eleven-class
ordinal). The service is fronted by a lightweight CORS proxy
(`cors-proxy/`) deployed as a separate Railway service to mediate
browser-to-API calls. Inference latency was measured at approximately
3.2 s for warm calls (mean of 3.04 s and 3.41 s across two trials)
and 10.2 s on cold start.

### 3.2.4 Auxiliary Data Sources

Two external data services were integrated for environmental context:
the Open-Meteo API (Zippenfenig, 2023), which supplies current
weather, soil moisture, soil temperature, and elevation; and the NASA
POWER API (NASA Langley Research Center, 2023), which provides
historical solar radiation, growing-degree days, and precipitation
sums. Both were consumed via the in-app `satelliteService.js` module,
which handles caching and timeout fallback.

### 3.2.5 Cross-Origin Resource Sharing Proxy

A purpose-built proxy (`cors-proxy/main.py`, FastAPI + httpx)
forwards all requests to the Sentinel-2 endpoint and re-emits the
response with permissive CORS headers. The proxy is deployed as an
independent Railway service and consumes negligible resources (a
single uvicorn worker handling synchronous forwarding). The client
performs a one-time CORS probe at startup; if the upstream endpoint
already supports CORS the proxy is bypassed entirely, so that no
manual reconfiguration is required when upstream is updated.

---

## 3.3 Screen-by-Screen Discussion

The seven application screens were designed as a linear workflow.
Each is described below with its primary function, observed behavior,
and integration points.

### 3.3.1 Screen 1 — Location Selection

This screen presents a Mapbox-rendered satellite imagery view centered
on La Trinidad, Benguet (16.4619°N, 120.5874°E). The user can either
search for a location via the geocoder, navigate manually, or click a
"Magic Click" button which generates a demo polygon for rapid testing.
Polygon drawing is supported through Mapbox Draw with vertex-by-vertex
input. Upon polygon completion, the system calculates the field area
in hectares using Turf.js, derives the centroid, and snaps the
nearest of eight known Cordillera Administrative Region (CAR)
municipalities for downstream lookup. The polygon, area, centroid,
and matched municipality are persisted to the Zustand store. A
right-rail "QUICK LOCATIONS" panel additionally offers one-click
fly-to-location for the eight known municipalities.

### 3.3.2 Screen 2 — Processing

The Processing screen functions as an active loading state during which
the system performs parallel data acquisition. A four-step pipeline
checklist (Sentinel-2 acquisition → spectral signature extraction →
machine-learning prediction → engine-handoff normalization) displays
real-time status badges (`pending`, `running`, `done`, `warn`) for
each step. While the user observes the pipeline animation, the client
issues two parallel requests: one to the Open-Meteo / NASA POWER
satellite-and-weather composite endpoint, and another to the
Sentinel-2 ML model. A live "ML SOURCE" pill indicates which path is
active (`LIAM-ML`, `PLACEHOLDER`, or `PENDING`), surfacing whether
the user is viewing real-time inference or a fallback dataset.
Telemetry cells (location, area, climate, elevation) and a soil
readout (N/P/K/pH) populate live as data resolves.

### 3.3.3 Screen 3 — Plant Selection

The crop-picker screen is composed of two panels. The left panel
displays the field profile (location, area, climate, elevation), the
soil profile (N/P/K/pH with class-distribution confidence bars when
machine-learning data is available), a "Recommended for Your Soil"
strip listing the top three crop matches scored against the
field-specific pH and nitrogen status, and an Engine Inputs section
(field area override and on-hand fertilizer chips). The right panel
contains a searchable, filterable index of 44 supported crops grouped
by category (Vegetables, Root Crops, Beans/Pulses, Herbs, Highland)
with both English and Filipino names. Selection persists via the
Zustand store; on continuation, the engine label string (which
matches Hans's THESIS_CROP_MAP exactly) is stored for downstream
recommendation lookup.

### 3.3.4 Screen 4 — Soil Status

This instrument-panel screen visualizes the field's soil chemistry as
a single-screen summary. A top breadcrumb strip shows step number,
location, coordinates, elevation, and date. The left column features
the polygon thumbnail and a four-row Satellite Telemetry table
(pH/N/P/K with units). The right column contains the Primary
Measurements grid (four hairline-bordered cells for N, P, K, and pH
each with a status badge in semantic colors: rust for Low, ochre for
Medium, moss for High), a metadata pill strip (sample count, polygon
area, warning count, ML source, model name), and a hand-rolled
horizontal Targets-vs-Measured bar chart for the three primary
nutrients with target marker lines at 100%. The screen is designed
to fit within a single viewport (no scrolling required at 1440×900
resolution).

### 3.3.5 Screen 5 — Plant Requirements

The Plant Requirements screen displays the nutrient demands of the
selected crop, drawing from a static crop-rules database mirroring
Hans's `crop_npk_rules.json`. A scientific-notebook ledger pattern
shows kilogram-per-hectare targets for nitrogen, phosphorus, and
potassium at the field's measured soil status level. The italic
scientific name and Filipino common name are rendered in editorial
typography (Fraunces serif). This screen serves as a transition
between the soil-state visualization and the recommendation request,
allowing the user to verify the engine inputs before triggering
inference.

### 3.3.6 Screen 6 — Fertilizer Recommendations

This is the analytical climax of the workflow. On screen mount, the
client POSTs the aggregated soil-and-crop profile (NPK status, pH,
crop label, area, and selected fertilizers) to the rule engine. The
response — up to ten alternative fertilizer combinations — is rendered
as a two-panel layout. The left panel summarizes the engine's
NPK targets versus the field's measured estimates, plus a scrollable
list of all candidate combinations ranked by total weight. The right
panel contains the breakdown table for the currently-selected
candidate, with columns for fertilizer (with NPK percentage inline),
applied kg, and per-row N/P/K contributions computed as
`amount_kg × percentage / 100`. Hover tooltips on each cell expose the
explicit arithmetic. A footer row shows TOTAL, TARGET, and MET %
calculations color-coded green/ochre/rust at the 95%/80%/<80%
thresholds. Below the table, an "Engine Output" panel displays
Hans's raw `Prescription` strings verbatim, a pH advisory pulled from
`ph_result.recommendation_message`, and an inventory check confirming
which products the engine recognized. Cost data was deliberately
omitted from the user-facing display, as the agronomic claim of the
thesis concerns nutrient delivery, not pricing.

### 3.3.7 Screen 7 — Complete Summary

The terminal screen renders a "field report" summary in a 2×2
hairline grid (FIELD / SOIL / CROP / PRESCRIPTION) formatted in
print-receipt style, allowing the user to download a plain-text
report (`.txt`), navigate back to the recommendations, or restart
with a new field. The download capability is implemented client-side
via `Blob` URL and includes the polygon coordinates, soil profile,
selected crop, and prescribed fertilizers in a structured, printable
format intended for offline use during field application.

---

## 3.4 Performance Measurements

Latency, throughput, and asset-delivery characteristics were measured
on 2026-05-07 against the production deployment from a Manila-based
client (same Railway `asia-southeast1-eqsg3a` region as the services).
The detailed measurements are reported in `docs/results-performance.md`
and summarized below.

### 3.4.1 Static Asset Delivery

The compiled client bundle was delivered in a 2.51 MB JavaScript file
(838 KB gzipped) and a 107 KB CSS file (18.7 KB gzipped). The HTML
shell transferred in 769 bytes (0.58 KB gzipped). Across five
trials, homepage time-to-first-byte (TTFB) averaged 0.73 s
(σ ≈ 0.10 s). Subsequent screen-to-screen navigation is handled
entirely client-side via React Router, with no additional network
overhead.

### 3.4.2 Recommendation Engine Latency

Five trials of the rule engine `/recommendation` endpoint with a
representative payload returned consistent HTTP 200 responses with
4,645-byte bodies and TTFB between 0.67 s and 0.87 s
(mean ≈ 0.79 s, σ ≈ 0.10 s). The response includes the engine's
complete output — base targets, scaled totals, pH adjudication, ten
candidate combinations, and inventory feasibility — in a single
synchronous call.

### 3.4.3 Machine-Learning Inference Latency

Three trials of the Sentinel-2 endpoint with a 1-hectare cabbage-field
polygon yielded 10.18 s for the cold call (model load + raster I/O)
and warm-call latencies of 3.04 s and 3.41 s
(mean of warm calls ≈ 3.23 s). The 3-second warm latency reflects
pixel-by-pixel feature extraction across approximately 100 grid points
per hectare at the default 10-metre sample spacing, plus inference
time across the four classifier ensembles (Random Forest for pH and
SVM for K).

### 3.4.4 End-to-End Pipeline Latency

A complete user session — from polygon submission through
machine-learning inference, weather lookup, and rule-engine response —
completes in approximately 4.0–5.5 s on warm services. On cold
services, the bound rises to 11–13 s, gated almost entirely by the
Sentinel-2 endpoint's first-load cost. The Processing screen's
visible step checklist is calibrated to absorb this latency without
blocking the user perception.

| Component | Cold latency | Warm latency | Status |
|---|---|---|---|
| Webapp HTML shell | n/a | 0.73 s | ✅ stable |
| JS bundle (838 KB gzipped) | n/a | 0.66 s | ✅ stable |
| Rule engine `/recommendation` | 0.79 s | 0.79 s | ✅ stable |
| Sentinel-2 ML `/predict` | 10.18 s | 3.23 s | ⚠ cold-start cost |
| Page-to-page navigation | n/a | < 50 ms | ✅ client-side |
| End-to-end Phase 2 pipeline | 11–13 s (cold) | 4.0–5.5 s (warm) | ✅ within UX budget |

---

## 3.5 User Testing Results

A formal Technology Acceptance Model (TAM) survey of 65 farmers, as
specified in the thesis proposal's Objective 4, has not yet been
executed and is scheduled as a deliverable for Chapter 4 of this
thesis. Preliminary heuristic verification was conducted by the
research team: each member walked through the seven-screen workflow
with at least three different polygon geometries (small, medium, and
large-area fields across both La Trinidad and Atok municipalities),
and observed that the application maintained interactive state and
returned recommendations correctly under all tested conditions.

The team also conducted internal feedback sessions on the user
interface during three rounds of iteration. Feedback observations
included: (1) the initial cinematic-text loading screen was perceived
as opaque ("brown text on brown") and was redesigned with a visible
component-driven layout; (2) the fertilizer prescription's per-row
NPK breakdown was hidden behind tooltips and was made primary in the
table; (3) a peso-cost column was initially included but removed when
team feedback indicated that pricing data was not part of the
thesis's agronomic claim and should not be presented. Each iteration
informed a substantive redesign of the relevant screen.

A formal usability evaluation with extension officers from the
Department of Agriculture-Cordillera Administrative Region (DA-CAR)
and Benguet State University is planned post-defense.

---

## 3.6 Issues and Failures Observed

Three discrete failure classes were encountered during development
and integration; each is documented here for transparency and as
context for design decisions.

### 3.6.1 Cross-Origin Resource Sharing on the Sentinel-2 Endpoint

Browser preflight requests (`OPTIONS /predict`) initially returned
HTTP 405 Method Not Allowed because the upstream Sentinel-2 service
did not include `CORSMiddleware` in its FastAPI application. Direct
client-side calls were rejected before reaching the inference handler,
and the webapp consequently fell back to a static placeholder dataset
keyed by municipality. This masked the failure rather than surfacing
it to the user. To restore browser-side machine-learning calls, a
lightweight FastAPI proxy (`cors-proxy/`) was deployed as a separate
Railway service. The client now performs a one-time CORS probe at
startup and bypasses the proxy if the upstream endpoint succeeds. A
patch addressing the upstream issue is pending merge by the model
maintainer.

### 3.6.2 Status Code Format Mismatch with the Rule Engine

The rule engine's OpenAPI specification advertised single-letter status
codes (`L`/`M`/`H`/`VH`), but the underlying `crop_npk_rules.json`
lookup used long-form values (`Low`/`Medium`/`High`). Sending
short codes caused the rule lookup to silently fall through to zero
NPK targets, and downstream recommendations defaulted to a "no
fertilizer required" baseline. The webapp's request adapter was
modified to send long-form status codes, and this discrepancy is now
documented in the engine's `BUILD_RECOMMENDATION_OUTPUTS.md`.

### 3.6.3 Inventory-Name Canonicalization Drift

The rule engine performs string equality on the
`selected_inventory_names` field. Two compounding issues caused chip
selections to be silently rejected: (a) the client's CSV parser
stripped parenthesized portions of fertilizer names (e.g.
`"Complete (14-14-14)"` became `"Complete"`), causing five of fourteen
products to fail validation; and (b) the engine's canonical product
names were later updated to branded designations (`Yara Mila Winner`,
`Solophos`, `Duofos`, `T-14`), introducing further mismatch. Both were
resolved by removing the paren-stripping parser logic and
synchronizing the client-side master inventory with the engine's
`fertilizers.json`. A regression test suite covering the full
fourteen-name validation matrix is now part of the integration
verification.

### 3.6.4 Fallback Behavior

In all failure conditions — upstream timeouts, malformed responses,
missing CORS headers, or unreachable services — the webapp preserved
navigation and rendered an internal placeholder dataset rather than
blocking. The Processing screen surfaces the active data source
(`LIAM-ML`, `PLACEHOLDER`, or `PENDING`) so that the substitution is
visible rather than concealed. This was a deliberate design decision
to prioritize panel-demonstration robustness over hard failure modes.

---

## 3.7 Visual Documentation

Screenshots of the deployed system are included as Figures 4 through
10 of this chapter. Each figure was captured at 1440×900 pixel
resolution from the production deployment URL on 2026-05-07. Suggested
captions:

- **Figure 4 — Location Selection.** Mapbox-rendered satellite imagery
  with a drawn polygon over La Trinidad, Benguet. The right rail
  shows the QUICK LOCATIONS panel, current step indicator (01/04),
  and field area readout (1.12 ha).
- **Figure 5 — Processing.** Active loading state showing the
  four-step pipeline checklist, polygon thumbnail, telemetry cells
  populating live, and ML SOURCE pill (in this trial: PLACEHOLDER,
  indicating fallback path).
- **Figure 6 — Plant Selection.** Two-panel layout with field profile
  on the left (location, soil profile with confidence bars,
  recommended-for-your-soil strip), and the 44-crop searchable index
  on the right.
- **Figure 7 — Soil Status.** Single-screen instrument panel showing
  the polygon thumbnail, satellite telemetry table, primary
  measurements grid (N/P/K/pH with status badges), metadata pill
  strip, and Targets-vs-Measured bar chart.
- **Figure 8 — Fertilizer Recommendations.** Multi-candidate panel
  with the breakdown table on the right, scrollable candidate list
  on the left, Engine Output panel displaying Hans's raw
  Prescription strings, and pH advisory.
- **Figure 9 — Complete Summary.** Field report rendered as a 2×2
  hairline grid with FIELD, SOIL, CROP, and PRESCRIPTION cells,
  plus actions for Download Report, New Analysis, and Back.
- **Figure 10 — DevTools Network Panel.** Browser developer tools
  showing the `POST /recommendation` request to Hans's engine
  returning 200 with CORS headers, demonstrating end-to-end
  cross-origin functionality.

---

## 3.8 Comparison to Original Objectives

The thesis proposal specified four objectives. Their achievement
status as of this writing is summarized below.

| Objective | Target | Status | Discussion |
|---|---|---|---|
| **(1) Data integration** — Sentinel-2 + Landsat-8 + DEM + ≥300 lab-analyzed soil samples, January–March 2026 | 300+ samples | **Partially met** | 211 unique field-mode geotagged observations across La Trinidad and Atok municipalities have been collected and integrated. The proposal's full target of 300+ samples and five municipalities (Kibungan, Tinoc, Bauko also planned) remains incomplete; data collection in the remaining three municipalities is ongoing. |
| **(2) Model development** — Random Forest, XGBoost, SVR for NPK and pH, plus rule-based fertilizer recommendation engine | R² ≥ 0.65 / ordinal classification accuracy ≥ 0.65 | **Mostly met** | Nitrogen XGBoost achieved overall accuracy (OA) 0.782, F1 0.794. Phosphorus XGBoost OA 0.750, F1 0.742. Potassium XGBoost OA 0.723, F1 0.730. All three exceed the proposal threshold. **The pH model is the largest open accuracy gap**, with OA 0.216 and F1 0.190 — below the proposal target. The pH model uses an 11-class ordinal scale, materially harder than the 3-class NPK formulation. The rule-based engine is fully implemented and deployed. |
| **(3) Web-based decision support system** — integrating prediction and recommendation models | Functional end-to-end | **Met** | The seven-screen application is deployed on Railway and verified end-to-end. Real ML inference (when CORS is upstream) and rule-based recommendation (live) flow through to the user-facing prescription. |
| **(4) Validation and acceptance testing** — holdout + spatial cross-validation + RCBD field trials + TAM survey of 65 farmers | All four | **Partially met** | Holdout and spatial cross-validation are complete; RCBD field trials and the 65-farmer TAM survey are not yet executed and are scheduled as deliverables for Chapter 4. |

The most significant outstanding gap is the pH prediction accuracy
(Objective 2). The team's mitigation strategy — to be discussed in
the defense narrative — is to be transparent about the difference in
problem complexity between 3-class ordinal NPK classification
(achievable to ~0.75 OA with current feature sets) and 11-class
ordinal pH classification (where 0.65 OA is materially harder to
attain on the available training data). Future work is expected to
address pH prediction through alternative feature engineering
(spectral indices specific to pH-correlated minerals) and additional
training data from broader CAR collection.

The remaining gaps — additional municipalities, RCBD field trials,
and the TAM survey — are scoped post-defense and remain on the
project roadmap.

---

## References

(Add to the master references list)

- Aragona, H. F. (2026). *SoilScan rule-based fertilizer recommendation
  engine* [Computer software]. https://github.com/HansFredrick/SoilScanRuleBased
- Morales, L. J. (2026). *SoilScan Sentinel-2 inference API* [Computer
  software]. https://github.com/ljiro/SoilScan-Sentinel2-API
- Pedregosa, F., Varoquaux, G., Gramfort, A., et al. (2011).
  Scikit-learn: Machine Learning in Python. *Journal of Machine
  Learning Research*, 12, 2825–2830.
- Ramírez, S. (2018). *FastAPI* [Computer software]. https://fastapi.tiangolo.com/
- Mapbox. (2023). *Mapbox GL JS* (Version 3.23) [Computer software].
  https://www.mapbox.com/
- *Update Mapbox version reference here from 2.15.0 to 3.23.x to
  match `package.json`.*
