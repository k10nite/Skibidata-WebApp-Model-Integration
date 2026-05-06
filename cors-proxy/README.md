# SoilScan CORS Proxy

Tiny FastAPI service that forwards every request to Liam's
`SoilScan-Sentinel2-API` (deployed at `soilscan-sentinel2-api-production.up.railway.app`)
and re-emits the response with permissive CORS headers.

## Why

Liam's API works server-to-server but his `main.py` has no `CORSMiddleware`.
Browser preflights for `POST /predict` return 405 and the SkibiData webapp's
ML calls fail at the network boundary. This proxy unblocks browser-based
access until Liam merges the upstream CORS fix (see
`_liam_api/main.py` patch in this repo's local clone).

## How

The webapp uses **smart auto-detection** in `src/services/liamMLService.js`:

1. On module load, probes Liam's URL with a CORS-mode `GET /health` fetch
2. If it works → uses Liam's URL directly (zero proxy hop)
3. If it fails → falls back to this proxy URL for the rest of the session
4. Result is cached so the probe only fires once

When Liam adds `CORSMiddleware` server-side, the probe succeeds, the
webapp bypasses this proxy automatically, no manual env-var swap needed.

## Local

```bash
cd cors-proxy
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8080 --reload
```

Override upstream with `LIAM_API_URL=https://other.example.com`.

## Deploy

Railway service in the `skibidaddling` project, rootDirectory=`cors-proxy`.
Auto-deploys on push to `main`.

Webapp env: `VITE_LIAM_PROXY_URL=https://<this-service>.up.railway.app`
