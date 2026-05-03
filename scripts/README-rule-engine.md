# Rule-Based Engine Startup Script

## What it does
Boots Hans's rule-based fertility recommendation engine on `localhost:8001`. The script automatically clones the engine repo, sets up a Python virtual environment, installs dependencies, and starts the FastAPI server.

## Usage
```cmd
scripts\run-rule-engine.bat
```

## Webapp Integration
Set in your `.env`:
```
VITE_RULE_API_URL=http://localhost:8001
```

## Health Check
Visit FastAPI's auto-generated docs:
```
curl http://localhost:8001/docs
```

## Smoke Test
```bash
curl -X POST http://localhost:8001/recommendation \
  -H "Content-Type: application/json" \
  -d '{"crop_label":"Cabbage","n_status":"L","p_status":"MH","k_status":"S","soil_ph":5.5,"raw_area":1.0,"area_unit":"ha","selected_inventory_names":["Urea","14-14-14"]}'
```

## Engine Source Location
After first run: `_stashed_untracked/soil-fertility-engine/RulebasedTest/`

Note: `_stashed_untracked/` is gitignored at the parent repo level, so the cloned engine source remains local-only and won't be committed to version control.