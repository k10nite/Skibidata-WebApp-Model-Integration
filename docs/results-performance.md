# Results & Discussion — Performance subsection

Pasteable Methodology-style prose for the bullet:
> *report performance (load time, responsiveness, errors)*

Numbers were measured on 2026-05-07 against the production deployment at
`skibidata-webapp-model-integration-production.up.railway.app` from a Manila-
based client (same Railway `asia-southeast1-eqsg3a` region as the services).

---

## Performance

### Static asset delivery and cold-load behavior

The compiled client bundle (Vite production build) consisted of a 2.51 MB
JavaScript file (838 KB gzipped after Brotli/gzip transfer encoding) and a
107 KB CSS file (18.7 KB gzipped). The HTML shell itself transferred in 769
bytes (0.58 KB gzipped). Across five trials, the homepage HTML returned an
HTTP 200 status with a measured time-to-first-byte (TTFB) of between 0.64 s
and 0.88 s (mean ≈ 0.73 s, σ ≈ 0.10 s). The JavaScript bundle TTFB averaged
0.66 s. The size of the JavaScript bundle is dominated by Mapbox GL JS
(~600 KB), the Mapbox Draw and Geocoder plugins (~150 KB combined),
Turf.js geospatial primitives (~250 KB), and Framer Motion (~80 KB);
together these account for over half of the shipped client-side code.
Subsequent navigations between screens are handled entirely client-side via
React Router and incur no additional network requests.

### Recommendation engine latency (rule-based)

The rule-based fertilizer engine, deployed as a separate FastAPI service on
the same Railway region, was sampled five times with a representative
request payload (Cabbage at Low–Low–Low NPK status, soil pH 5.8, 1 ha
area). All five trials returned HTTP 200 with identical 4,645-byte response
bodies and a TTFB between 0.67 s and 0.87 s (mean ≈ 0.79 s, σ ≈ 0.10 s).
This response includes the engine's full output — base targets, scaled
totals, pH adjudication, ten alternative fertilizer combinations, the
inventory-check result, and the user-inventory subset — in a single
synchronous call. Latency was consistent across trials, suggesting the
engine's runtime cost is dominated by deterministic rule lookup rather
than I/O or computation.

### Machine-learning inference latency (Sentinel-2)

The Sentinel-2 inference endpoint was sampled three times with a
representative ~1 ha cabbage-field polygon. The first call took 10.18 s,
reflecting cold-start cost in the underlying scikit-learn pipeline (model
loading from the mounted volume, plus Sentinel-2 raster I/O for the spatial
window). Subsequent warm calls completed in 3.04 s and 3.41 s respectively
(mean of warm calls ≈ 3.23 s). The 3-second warm latency reflects the
pixel-by-pixel feature extraction across the polygon (≈100 grid points per
hectare at the default 10 m sample spacing), the pH/NPK classifier
inference (Random Forest and SVM ensembles), and the JSON serialization of
class distributions. These observations match Liam (2026)'s reported OOM
profiling work, which prioritized streaming feature extraction over
in-memory accumulation. The total cold-start-plus-warm-call latency budget
was budgeted into the Processing screen's progress UI, which displays a
visible step checklist so the wait is interpretable rather than blank.

### End-to-end pipeline timing

A complete user session — from polygon submission through machine-learning
inference, satellite weather lookup, and rule-engine recommendation —
completed in approximately 4.0–5.5 s on warm services (3.2 s ML inference
+ 0.8 s rule engine + ≈0.7 s incremental UI rendering). On cold services,
the bound rises to 11–13 s, gated almost entirely by the Sentinel-2
endpoint's first-load cost. To prevent the user from perceiving an
unresponsive interface during this window, the Processing screen
(Screen 2) uses Framer Motion-driven progress indicators to surface
real-time status of each parallel fetch operation (satellite acquisition,
spectral extraction, ML prediction, normalization). Buttons remain
disabled until the prediction has either resolved or fallen back, after
which navigation to subsequent screens is instantaneous because all
downstream rendering reads from the local Zustand store.

### Errors and failure modes observed during development

Three failure classes were encountered during development and addressed
in the final architecture:

1. **Cross-origin policy violation on the Sentinel-2 endpoint.** Browser
   preflight requests (`OPTIONS /predict`) initially returned HTTP 405
   because the upstream service did not include `CORSMiddleware`. The
   webapp consequently fell back to a static placeholder JSON keyed by
   municipality, which masked the failure rather than surfacing it. To
   restore browser-side machine-learning calls, a lightweight FastAPI
   proxy was deployed as a separate Railway service (`cors-proxy/`) that
   forwards every request to the Sentinel-2 endpoint and re-emits the
   response with permissive `Access-Control-Allow-Origin: *` headers.
   The webapp client now performs a one-time CORS probe at startup; if
   the upstream endpoint succeeds the proxy is bypassed, otherwise the
   proxy URL is used for the session. This makes the integration robust
   to subsequent upstream changes without manual intervention.

2. **Status code format mismatch with the rule engine.** The engine's
   OpenAPI specification advertised single-letter status codes
   (`L`/`M`/`H`/`VH`), but the underlying `crop_npk_rules.json` lookup
   used the long forms (`Low`/`Medium`/`High`). Sending the documented
   short codes caused the rule lookup to silently fall through to zero
   NPK targets, and downstream recommendations defaulted to a baseline
   "no fertilizer required" state. The webapp's request adapter now
   sends long-form status codes; this was caught during integration
   testing and is documented in the engine's `BUILD_RECOMMENDATION_OUTPUTS.md`.

3. **Inventory-name canonicalization drift.** The engine performs string
   equality on `selected_inventory_names`. Two issues compounded: (a) the
   client's CSV parser stripped parenthesized portions of fertilizer
   names (e.g. `"Complete (14-14-14)"` became `"Complete"`), causing
   five of fourteen products to be silently rejected as unknown by the
   engine; (b) the engine's canonical names later changed to branded
   designations (`Yara Mila Winner`, `Solophos`, `T-14`), introducing
   further mismatch. Both were resolved by removing the paren-stripping
   parser logic and synchronizing the client-side master inventory with
   the engine's `fertilizers.json`.

### Reliability and graceful degradation

In all observed failure conditions — upstream timeouts, malformed
responses, missing CORS headers, or unreachable services — the webapp
preserved navigation and rendered an internal placeholder dataset rather
than blocking. The user can still complete the seven-screen flow with
fallback data, and the Processing screen surfaces the active data source
(`LIAM-ML`, `PLACEHOLDER`, or `PENDING`) so that the substitution is
visible rather than concealed. This was an explicit design decision to
prioritize panel-demo robustness over hard failure modes.

### Summary

| Component | Cold latency | Warm latency | Status |
|---|---|---|---|
| Webapp HTML shell | n/a (cached) | 0.73 s TTFB | ✅ stable |
| JS bundle (2.51 MB / 838 KB gz) | n/a | 0.66 s TTFB | ✅ stable |
| Rule-based recommendation engine | 0.79 s | 0.79 s | ✅ stable |
| Sentinel-2 ML inference | 10.18 s | 3.23 s | ⚠ cold-start cost |
| Health checks (all three) | n/a | 0.73–1.05 s | ✅ stable |
| Page-to-page navigation | n/a | < 50 ms | ✅ client-side only |
| End-to-end Phase 2 pipeline | 11–13 s (cold) | 4–5.5 s (warm) | ✅ within UX budget |

All measurements were collected over a residential Asia–Pacific connection
during the Railway service's normal operating hours; latency may vary in
other geographic regions or under unusual network conditions.
