# SkibiData Webapp — Design Reference

A cheat-sheet for rebuilding screens in a different codebase (e.g. Lou's
`dost-soil-scan/` mobile app) while keeping visual language consistent with
the satellite webapp at `Skibidata-WebApp-Model-Integration`.

Live reference: https://skibidata-webapp-model-integration-production.up.railway.app

---

## 1. Aesthetic direction

**"Scientific instrument panel" + "soil-survey datasheet."** Earth-toned
editorial-cartographic. Information density over breathing room. Topographic
backdrop. Distinctive serif display + monospace data. Specifically NOT:

- Generic SaaS gradients, purple-on-white, Inter everywhere
- Brand-page hero typography for data values
- Decorative charts (radar/pie) when a table works
- Confetti, celebration animations, emoji-as-icons
- "Friendly mascot" UI for what is a soil lab readout

When in doubt: lab notebook, not landing page.

---

## 2. Color palette

All colors live as CSS custom properties under `:root`. Source:
`src/styles/index.css`. Mirror these in your project.

```css
--color-paper:           #F1EDE5   /* dominant background */
--color-paper-card:      #FAF7F0   /* card surfaces, off-white */
--color-paper-deep:      #E8E2D4   /* deeper background accent */
--color-loam:            #1F1A14   /* very dark earth — only for the
                                       Processing screen pre-redesign;
                                       avoid on read screens */
--color-moss:            #4F5B2F   /* primary green / High status / accents */
--color-moss-soft:       #84934A   /* softer green, secondary accent */
--color-ochre:           #C8893A   /* warm gold / Medium status */
--color-rust:            #A24B2A   /* alert / Low status / warnings */
--color-earth-deep:      #3E2A1F   /* primary dark text / "ink" */
--color-contour:         rgba(79, 91, 47, 0.12)   /* hairlines, dividers */
--color-contour-strong:  rgba(79, 91, 47, 0.24)   /* stronger contours */
```

**Usage ratio (don't break this):**
- Backgrounds: 60% paper, 30% paper-card, 10% paper-deep
- Ink (text): 80% earth-deep, 20% earth-deep at reduced opacity
- Accents: moss for selection/CTA, rust for alert/Low, ochre for Medium
- Hairlines: contour everywhere; never solid 1px black

Status → color (canonical mapping for soil readouts):
```
Low    → var(--color-rust)
Medium → var(--color-ochre)
High   → var(--color-moss)
```

---

## 3. Typography

Two distinctive variable fonts. NEVER use Inter, Roboto, Arial, system-ui,
Plus Jakarta Sans, or any default sans stack. Every text element gets an
explicit `fontFamily`.

**Load these in your project:**
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..700&family=JetBrains+Mono:ital,wght@0,400..700;1,400..700&display=swap">
```

### Fraunces — display + editorial
Variable font with optical-size axis (9pt to 144pt) and italic axis. Always
specify `fontVariationSettings`.

```js
// Headings (h1, h2, hero numbers)
{
  fontFamily: '"Fraunces", serif',
  fontVariationSettings: '"opsz" 144, "wght" 600',
}

// Sub-headings, card titles
{
  fontFamily: '"Fraunces", serif',
  fontVariationSettings: '"opsz" 144, "wght" 500',
}

// Body editorial / italic flourishes
{
  fontFamily: '"Fraunces", serif',
  fontVariationSettings: '"opsz" 14, "wght" 400',
  fontStyle: 'italic',  // for marginalia, captions, scientific names
}
```

### JetBrains Mono — data, eyebrows, telemetry
For ALL numbers, percentages, units, technical labels, eyebrow markers.
Always include `fontVariantNumeric: 'tabular-nums'` on numeric output so
columns align.

```js
// Numbers
{
  fontFamily: '"JetBrains Mono", monospace',
  fontVariantNumeric: 'tabular-nums',
}

// Eyebrow (small uppercase section labels, e.g. "FIELD PROFILE")
{
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '10px',
  letterSpacing: '0.22em',
  color: 'var(--color-moss)',
  fontWeight: 600,
}

// Status pill (filled, white text on color)
{
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '10px',
  letterSpacing: '0.18em',
  fontWeight: 700,
  background: '<status color>',
  color: 'var(--color-paper)',
  padding: '4px 8px',
  borderRadius: '2px',
}
```

### Italic for editorial marginalia
```js
{
  fontFamily: '"Fraunces", serif',
  fontStyle: 'italic',
  fontSize: '11px',
  color: 'var(--color-earth-deep)',
  opacity: 0.55,
}
```
Used for: captions, scientific names ("*Oryza sativa*"), data sources,
"draw a polygon to populate" empty states, etc.

---

## 4. Motion (Framer Motion canonical)

One orchestrated page-arrival sequence per screen, ~1s total. Custom easing.

```js
const containerVariants = {
  initial: {},
  animate: { transition: { delayChildren: 0.05, staggerChildren: 0.06 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
  }
};
```

Custom ease `[0.16, 1, 0.3, 1]` — soft, slightly springy. Never use linear
or default ease.

**Per-element micro-interactions:**
- Hover on cards: `whileHover={{ scale: 1.01 }}` with `transition: { duration: 0.15 }`
- Selected chip: subtle scale-bounce (no flashy animation)
- Avoid: rotating, bouncing, scaling above 1.05

Letter-by-letter headline staggers, oversized scaling, parallax — not in this system.

---

## 5. Layout patterns

### Pattern A — 62/38 hero+rail split (LocationSelection, PlantSelection, SoilStatus, FertilizerRecommendations)

```jsx
<div className="min-h-screen flex">
  <div className="w-full lg:w-[62%] px-8 lg:px-12 py-10">
    {/* Hero + main content */}
  </div>
  <div
    className="hidden lg:flex w-[38%] flex-col"
    style={{
      background: 'var(--color-paper-card)',
      borderLeft: '1px solid var(--color-contour)',
      position: 'sticky',
      top: 0,
      height: '100vh'
    }}
  >
    {/* Right rail: index/picker/details */}
  </div>
</div>
```

### Pattern B — Top strip + main + bottom strip (Processing, SoilStatus, FertilizerRecommendations)

```jsx
<div className="h-screen flex flex-col">
  <header className="px-8 lg:px-12 py-3 flex justify-between items-center"
          style={{ borderBottom: '1px solid var(--color-contour)',
                   background: 'var(--color-paper-card)' }}>
    {/* Mono breadcrumb left, mono meta right */}
  </header>
  <div className="flex-1 flex min-h-0">{/* main */}</div>
  <footer className="px-8 lg:px-12 py-4 flex justify-between"
          style={{ borderTop: '1px solid var(--color-contour)',
                   background: 'var(--color-paper-card)' }}>
    {/* Back/Continue */}
  </footer>
</div>
```

### Pattern C — Hairline grid (4-cell telemetry, 4-cell measurements)

Grid lines come from a 1px gap on a contour-coloured grid background:

```jsx
<div
  className="grid grid-cols-4 gap-px"
  style={{
    background: 'var(--color-contour)',
    border: '1px solid var(--color-contour)',
    borderRadius: '4px',
    overflow: 'hidden'
  }}
>
  {/* Each cell has bg: var(--color-paper-card) — the gap shows through as hairlines */}
  <Cell />
  <Cell />
  ...
</div>
```

This produces the instrument-panel "wired-together cells" effect without
double borders.

---

## 6. Reusable components (copy verbatim)

### Eyebrow — small uppercase section label

```jsx
function Eyebrow({ children }) {
  return (
    <div style={{
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '10px',
      letterSpacing: '0.22em',
      color: 'var(--color-moss)',
      fontWeight: 600
    }}>{children}</div>
  );
}
```

### Caption — italic editorial sub-line

```jsx
function Caption({ children }) {
  return (
    <div style={{
      fontFamily: '"Fraunces", serif',
      fontStyle: 'italic',
      fontSize: '11px',
      color: 'var(--color-earth-deep)',
      opacity: 0.55
    }}>{children}</div>
  );
}
```

### TelemetryCell — one cell of a 4-cell hairline grid

```jsx
function TelemetryCell({ label, value, mono }) {
  return (
    <div style={{ background: 'var(--color-paper-card)', padding: '14px 16px' }}>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '9px',
        letterSpacing: '0.22em',
        color: 'var(--color-earth-deep)',
        opacity: 0.5,
        fontWeight: 600,
        marginBottom: '6px'
      }}>{label}</div>
      <div style={{
        fontFamily: mono ? '"JetBrains Mono", monospace' : '"Fraunces", serif',
        fontSize: mono ? '15px' : '17px',
        fontVariationSettings: mono ? undefined : '"opsz" 144, "wght" 500',
        fontVariantNumeric: mono ? 'tabular-nums' : undefined,
        color: 'var(--color-earth-deep)',
        opacity: value ? 1 : 0.35,
        lineHeight: 1.1
      }}>{value || '—'}</div>
    </div>
  );
}
```

### NutrientCell — N/P/K status with confidence bar

```jsx
const STATUS_COLOR = {
  Low:    'var(--color-rust)',
  Medium: 'var(--color-ochre)',
  High:   'var(--color-moss)'
};

function NutrientCell({ label, sym, status, ppm, dist }) {
  const color = STATUS_COLOR[status];
  return (
    <div style={{ background: 'var(--color-paper-card)', padding: '16px' }}>
      <div className="flex items-baseline justify-between mb-2">
        <Eyebrow>{label}</Eyebrow>
        <div style={{
          fontFamily: '"Fraunces", serif',
          fontVariationSettings: '"opsz" 144, "wght" 600',
          fontSize: '20px', color, lineHeight: 1
        }}>{sym}</div>
      </div>
      <div style={{
        background: color, color: 'var(--color-paper)',
        padding: '4px 8px', borderRadius: '2px', display: 'inline-block',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '10px', letterSpacing: '0.18em', fontWeight: 700
      }}>{status.toUpperCase()}</div>
      <div style={{
        marginTop: '8px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '11px', opacity: 0.7, fontVariantNumeric: 'tabular-nums'
      }}>{ppm.toFixed(1)} ppm</div>
      {/* Stacked confidence bar (Liam class_distribution) */}
      {dist && (
        <div className="flex h-1.5 mt-2 overflow-hidden"
             style={{ background: 'var(--color-paper-deep)', borderRadius: '1px' }}>
          <div style={{ width: `${(dist.Low ?? 0) * 100}%`,
                        background: 'var(--color-rust)' }} />
          <div style={{ width: `${(dist.Medium ?? 0) * 100}%`,
                        background: 'var(--color-ochre)' }} />
          <div style={{ width: `${(dist.High ?? 0) * 100}%`,
                        background: 'var(--color-moss)' }} />
        </div>
      )}
    </div>
  );
}
```

### PhCell — pH readout with gradient bar + marker

```jsx
function PhCell({ ph }) {
  const pct = Math.max(0, Math.min(100, ((ph - 4) / 4) * 100));
  return (
    <div style={{ background: 'var(--color-paper-card)', padding: '16px' }}>
      <div className="flex items-baseline justify-between mb-2">
        <Eyebrow>ACIDITY</Eyebrow>
        <span style={{ fontFamily: '"JetBrains Mono", monospace',
                       fontSize: '11px', opacity: 0.55 }}>pH</span>
      </div>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '24px', fontWeight: 700,
        color: 'var(--color-earth-deep)',
        fontVariantNumeric: 'tabular-nums', lineHeight: 1
      }}>{ph.toFixed(1)}</div>
      <div className="relative h-1.5 mt-3" style={{
        background: 'linear-gradient(to right, var(--color-rust), var(--color-ochre), var(--color-moss), var(--color-ochre), var(--color-rust))',
        borderRadius: '1px'
      }}>
        <div className="absolute top-1/2"
             style={{
               left: `${pct}%`,
               transform: 'translate(-50%, -50%)',
               width: '8px', height: '8px',
               background: 'var(--color-paper)',
               border: '2px solid var(--color-earth-deep)',
               borderRadius: '50%'
             }} />
      </div>
    </div>
  );
}
```

### Pill — small mono badge for metadata strips

```jsx
function Pill({ label, value, accent }) {
  return (
    <div style={{
      background: 'var(--color-paper-card)',
      border: '1px solid var(--color-contour)',
      borderRadius: '999px',
      padding: '4px 12px',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '10px',
      display: 'inline-flex', alignItems: 'baseline', gap: '6px'
    }}>
      <span style={{ opacity: 0.5, fontWeight: 600,
                     letterSpacing: '0.18em' }}>{label.toUpperCase()}</span>
      <span style={{ color: accent ?? 'var(--color-earth-deep)',
                     fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}
```

### Topographic backdrop SVG

Add to every screen's root for atmospheric continuity. Opacity 4–6%.

```jsx
<svg className="terrace-topo opacity-[0.04] absolute inset-0 pointer-events-none"
     viewBox="0 0 1200 800" preserveAspectRatio="none">
  <path d="M0,200 Q300,150 600,200 T1200,200" fill="none" stroke="currentColor" strokeWidth="1" />
  <path d="M0,360 Q400,310 800,360 T1200,360" fill="none" stroke="currentColor" strokeWidth="1" />
  <path d="M0,520 Q200,470 500,520 T1200,520" fill="none" stroke="currentColor" strokeWidth="1" />
</svg>
```

The `terrace-topo` class sets `color: var(--color-contour)` and
`pointer-events: none`. Add to your CSS:
```css
.terrace-topo { color: var(--color-contour); pointer-events: none; }
```

---

## 7. Engine integration contract

If you're rebuilding the fertilizer UI, you'll talk to the same engine.

### Endpoint
`POST https://soilscanrulebased-production.up.railway.app/recommendation`

### Request body
```json
{
  "crop_label":   "Cabbage",
  "n_status":     "Low",
  "p_status":     "Low",
  "k_status":     "Low",
  "soil_ph":       5.6,
  "raw_area":      1.0,
  "area_unit":    "ha",
  "selected_inventory_names": ["Urea", "Complete (14-14-14)", "Muriate of Potash"]
}
```

**CRITICAL: `n/p/k_status` accepts `"Low" | "Medium" | "High"` long-form
ONLY.** The engine's OpenAPI advertises `L/M/H` but the rule lookup uses
the long form — sending short codes silently returns 0 NPK targets.

### Response (200) — fields you'll likely use

```json
{
  "selected_crop_label": "Cabbage",
  "area_ha": 1.0,
  "base_targets_per_ha": { "N": 150, "P": 60, "K": 75 },
  "total_base":          { "N": 150, "P": 60, "K": 75 },
  "ph_result": {
    "ph_status":  "acidic | borderline_acidic | acceptable | borderline_alkaline | alkaline",
    "ph_action":  "none | liming_required | gypsum_recommended",
    "borderline_warning":     true | false,
    "borderline_message":     null | string,
    "recommendation_message": string
  },
  "user_inventory": [
    { "name": "Urea", "n": 46, "p": 0, "k": 0 },
    ...
  ],
  "inventory_check": {
    "valid":  true | false,
    "reason": string,
    "details": null | { ... }
  },
  "inventory_sufficiency": {
    "has_n": bool, "has_p": bool, "has_k": bool,
    "missing_nutrients": ["Phosphorus (P)", ...]
  },
  "standard_mix": [
    {
      "Source":       "13-33-21 Compound",
      "Total Weight":  517.88,
      "Applied N":     150.0,
      "Applied P":      60.0,
      "Applied K":      75.0,
      "Prescription": [
        "274.7 kg/1.0 ha of Urea",
        "181.82 kg/1.0 ha of 13-33-21 Compound",
        "61.36 kg/1.0 ha of Muriate of Potash"
      ]
    },
    ... up to 10 alternatives, ranked ASCENDING by Total Weight
  ]
}
```

### Parsing the prescription strings
Format: `"{qty} kg/{area} {unit} of {fertilizer_name}"`
```js
const PRESCRIPTION_RE = /^([\d.]+)\s*kg\/([\d.]+)\s+(\S+)\s+of\s+(.+)$/;
```

### Per-fertilizer NPK breakdown

Engine response does NOT include a master inventory map. Hardcode this list
for NPK percentage lookup (mirrors `_hans_rulebased/fertilizers.json`):

```js
const MASTER_INVENTORY = {
  'Urea':                       { n: 46,   p: 0,  k: 0 },
  'Ammonium Sulfate':           { n: 21,   p: 0,  k: 0 },
  'Calcium Nitrate':            { n: 15.4, p: 0,  k: 0 },
  'Complete (14-14-14)':        { n: 14,   p: 14, k: 14 },
  'Complete (16-16-16)':        { n: 16,   p: 16, k: 16 },
  'Ammophos':                   { n: 16,   p: 20, k: 0 },
  '15-9-20 Compound':           { n: 15,   p: 9,  k: 20 },
  '13-33-21 Compound':          { n: 13,   p: 33, k: 21 },
  '13-31-21 Compound':          { n: 13,   p: 31, k: 21 },
  '19-4-19 Compound':           { n: 19,   p: 4,  k: 19 },
  'Single Superphosphate (18)': { n: 0,    p: 18, k: 0 },
  'Single Superphosphate (20)': { n: 0,    p: 20, k: 0 },
  'Single Superphosphate (22)': { n: 0,    p: 22, k: 0 },
  'Muriate of Potash':          { n: 0,    p: 0,  k: 60 }
};
```

Per-fertilizer kg N delivered = `qty × percentage / 100`.

---

## 8. ML data flow (if you also wire Liam)

ML predictions land at:
- **Direct (with CORS):** `https://soilscan-sentinel2-api-production.up.railway.app/predict`
- **CORS proxy** (if direct CORS fails): `https://soilscan-cors-proxy-production.up.railway.app/predict` (subject to your project setup — see `cors-proxy/` in this repo)

`POST /predict` body:
```json
{
  "polygon": { "type": "Polygon", "coordinates": [[[lng,lat], ...]] },
  "crop_type": "cabbage",
  "sample_spacing_m": 10.0
}
```

Response (200):
```json
{
  "nitrogen": {
    "dominant_class": "Low (<11 mg/kg)",
    "class_distribution": {"Low": 0.72, "Medium": 0.28, "High": 0.0},
    "mean_probability":   {"Low": 0.68, ...}
  },
  "phosphorus": { ... },
  "potassium":  { ... },
  "ph": { "dominant_class": "6.4", ... },
  "sample_count":    143,
  "polygon_area_ha": 1.43,
  "warnings": []
}
```

**Strip the parens** from `dominant_class` before passing downstream:
`"Low (<11 mg/kg)"` → `"Low"`. The rule engine does string equality on
the bare class.

---

## 9. Anti-patterns (don't ship these)

- `font-family: Inter, sans-serif` or any default sans
- Hardcoded hex literals (use `var(--color-*)`)
- `text-gray-600` / `bg-white` Tailwind defaults
- Display-italic Fraunces for data values (e.g. "Medium" at 64px italic)
- Centered hero headlines with location names (use breadcrumb strips)
- Confetti, glow, gradient backgrounds, animated checkmarks for success
- Emoji as icons in core flow (🌱 ✅ 🎉 etc — fine for tutorials, never primary)
- Radar/pie charts for comparing 3-4 quantities (use horizontal bars or tables)
- Decorative SVG illustrations as empty states larger than 140px
- Modal pop-ups for confirmations (use inline strips)
- Sticky tooltips revealing essential info (info should be visible)
- Hover-only states on touch screens

---

## 10. Quick reference — when in doubt

| What you're rendering | Use |
|---|---|
| Section header | `<Eyebrow>` |
| Sub-line / data source / scientific name | `<Caption>` |
| Number or unit | JetBrains Mono + tabular-nums |
| Field name | Fraunces 14-17px |
| Hero number (area, pH, total cost) | Fraunces 24-32px or JetBrains Mono 24px (consistent within a screen) |
| 4 measurements (N/P/K/pH or telemetry) | Pattern C hairline grid |
| Status indicator (Low/Med/High) | Filled mono pill in status color |
| Page title | Fraunces opsz 144 weight 600 ~32px |
| Step in flow | Top breadcrumb strip ("STEP 03 / 04 · Cabbage · ...") |
| Help / hint / contextual note | italic Fraunces small, opacity 0.55 |
| Action button | `terrace-btn` class — uppercase, letter-spacing 0.18em |
| Selected state | moss left-border + paper-deep background + ✓ SELECTED mono badge |

If your screen has empty space and feels thin, **don't ornament it** — add
real data. The rule of thumb: every cell on screen earns its real estate
either by being a measurement, a control, or genuine editorial guidance.
Decoration that doesn't carry information is the trap.

---

## License & ownership

This is a working reference, not a final spec. Tokens, components, and
patterns may shift as the panel-defense version stabilizes. Pull this
file periodically if you're keeping in sync with the satellite webapp.

Questions / contradictions / "Neil what did you mean by X" → message in
the team chat. The canonical implementation is in
`Skibidata-WebApp-Model-Integration` repo's `src/screens/` —
`SoilStatus.jsx`, `PlantSelection.jsx`, `FertilizerRecommendations.jsx`
are the cleanest examples.
