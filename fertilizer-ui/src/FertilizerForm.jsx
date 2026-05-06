import React, { useState } from 'react';
import { Eyebrow, Caption, Sep, Pill, NutrientCell, PhCell, STATUS_COLOR } from './components/DesignSystem';

const SECTION_CARD = {
  background: 'var(--color-paper-card)',
  border: '1px solid var(--color-contour)',
  borderRadius: '4px',
  padding: '20px 24px',
};

const LABEL_STYLE = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '9px',
  letterSpacing: '0.22em',
  color: 'var(--color-earth-deep)',
  opacity: 0.55,
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '6px',
};

const NPK_CELLS = [
  { key: 'n_status', label: 'NITROGEN',   sym: 'N' },
  { key: 'p_status', label: 'PHOSPHORUS', sym: 'P' },
  { key: 'k_status', label: 'POTASSIUM',  sym: 'K' },
];

function phStatusToAccentColor(s) {
  if (s === 'acceptable') return 'var(--color-moss)';
  if (s === 'borderline_acidic' || s === 'borderline_alkaline') return 'var(--color-ochre)';
  return 'var(--color-rust)';
}

function phStatusToAccentBg(s) {
  if (s === 'acceptable') return 'rgba(79,91,47,0.06)';
  if (s === 'borderline_acidic' || s === 'borderline_alkaline') return 'rgba(200,137,58,0.06)';
  return 'rgba(162,75,42,0.06)';
}

const FertilizerForm = () => {
  const [formData, setFormData] = useState({
    crop_label: 'Ampalaya',
    n_status: 'Low',
    p_status: 'Low',
    k_status: 'Low',
    soil_ph: 6.5,
    raw_area: 1000,
    area_unit: 'Square Meters (sqm)',
    selected_inventory_names: []
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const crops = ["Ampalaya", "Batao", "String Beans", "Cabbage", "Carrot", "Tomato", "Potato", "Lettuce"];
  const nutrientLevels = ["Low", "Medium", "High"];
  const availableFertilizers = [
    "Urea", "Complete (14-14-14)", "Muriate of Potash", "Ammophos",
    "Calcium Nitrate", "15-9-20 Compound", "13-33-21 Compound",
    "Complete (16-16-16)", "13-31-21 Compound", "19-4-19 Compound",
    "Single Superphosphate (18)", "Single Superphosphate (20)",
    "Single Superphosphate (22)", "Ammonium Sulfate"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInventoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      selected_inventory_names: checked
        ? [...prev.selected_inventory_names, value]
        : prev.selected_inventory_names.filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setActiveTab(0);

    const payload = {
      ...formData,
      soil_ph: parseFloat(formData.soil_ph),
      raw_area: parseFloat(formData.raw_area)
    };

    const RAILWAY_URL = 'https://soilscanrulebased-production.up.railway.app/recommendation';

    try {
      const response = await fetch(RAILWAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrescriptionText = (text) => {
    return text.replace(/\/[\d.]+\s*(sqm|ha)\s*/i, ' ');
  };

  const ph = parseFloat(formData.soil_ph) || 6.5;
  const phPct = Math.max(0, Math.min(100, ((ph - 4) / 4) * 100));
  const unitLabel = formData.area_unit === 'Hectares (ha)' ? 'ha' : 'sqm';

  const activeMix = result?.standard_mix?.[activeTab];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-paper)' }}>

      {/* HEADER STRIP */}
      <header style={{
        borderBottom: '1px solid var(--color-contour)',
        background: 'var(--color-paper-card)',
        padding: '12px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '11px',
          letterSpacing: '0.18em',
          color: 'var(--color-earth-deep)',
          opacity: 0.85,
          display: 'flex',
          alignItems: 'center',
        }}>
          FARM PLAN GENERATOR
          <Sep />
          <span style={{ color: 'var(--color-moss)' }}>{formData.crop_label}</span>
          <Sep />
          {formData.raw_area} {unitLabel}
        </div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '11px',
          letterSpacing: '0.18em',
          color: 'var(--color-earth-deep)',
          opacity: 0.85,
          display: 'flex',
          alignItems: 'center',
        }}>
          N·{formData.n_status[0]}
          <Sep />
          P·{formData.p_status[0]}
          <Sep />
          K·{formData.k_status[0]}
          <Sep />
          pH {ph.toFixed(1)}
        </div>
      </header>

      {/* MAIN */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
        <h2 style={{
          fontFamily: '"Fraunces", serif',
          fontVariationSettings: '"opsz" 144, "wght" 600',
          fontSize: '28px',
          color: 'var(--color-earth-deep)',
          lineHeight: 1.1,
          marginBottom: '4px',
        }}>
          Farm Plan Generator
        </h2>
        <Caption>Enter your soil details to get a step-by-step fertilizer recipe.</Caption>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px', maxWidth: '760px' }}>

          {/* Card 1 — FIELD PARAMETERS */}
          <div style={SECTION_CARD}>
            <Eyebrow>FIELD PARAMETERS</Eyebrow>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
              <div>
                <span style={LABEL_STYLE}>Crop</span>
                <select name="crop_label" value={formData.crop_label} onChange={handleChange} className="terrace-input">
                  {crops.map(crop => <option key={crop} value={crop}>{crop}</option>)}
                </select>
              </div>
              <div>
                <span style={LABEL_STYLE}>Field Area</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                  <input
                    type="number"
                    name="raw_area"
                    value={formData.raw_area}
                    onChange={handleChange}
                    required
                    className="terrace-input"
                    style={{ flex: 2 }}
                  />
                  <select name="area_unit" value={formData.area_unit} onChange={handleChange} className="terrace-input" style={{ flex: 1 }}>
                    <option value="Square Meters (sqm)">sqm</option>
                    <option value="Hectares (ha)">ha</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 — SOIL NPK STATUS */}
          <div style={SECTION_CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Eyebrow>SOIL NPK STATUS</Eyebrow>
              <Caption>from lab or sensor test results</Caption>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1px',
              background: 'var(--color-contour)',
              border: '1px solid var(--color-contour)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginTop: '14px',
            }}>
              {NPK_CELLS.map(({ key, label, sym }) => {
                const statusVal = formData[key];
                const color = STATUS_COLOR[statusVal];
                return (
                  <div key={key} style={{ background: 'var(--color-paper-card)', padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '9px',
                        letterSpacing: '0.22em',
                        color: 'var(--color-earth-deep)',
                        opacity: 0.55,
                        textTransform: 'uppercase',
                      }}>
                        {label}
                      </span>
                      <span style={{
                        fontFamily: '"Fraunces", serif',
                        fontVariationSettings: '"opsz" 144, "wght" 600',
                        fontSize: '20px',
                        color,
                        lineHeight: 1,
                      }}>
                        {sym}
                      </span>
                    </div>
                    <select
                      name={key}
                      value={statusVal}
                      onChange={handleChange}
                      className="terrace-input"
                      style={{ color, fontWeight: 600 }}
                    >
                      {nutrientLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3 — SOIL ACIDITY */}
          <div style={SECTION_CARD}>
            <Eyebrow>SOIL ACIDITY</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '16px' }}>
              <input
                type="number"
                step="0.1"
                min="0"
                max="14"
                name="soil_ph"
                value={formData.soil_ph}
                onChange={handleChange}
                required
                className="terrace-input"
                style={{ flex: '0 0 140px', fontSize: '22px', fontWeight: 700 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{
                  position: 'relative',
                  height: '6px',
                  borderRadius: '1px',
                  background: 'linear-gradient(to right, var(--color-rust), var(--color-ochre), var(--color-moss), var(--color-ochre), var(--color-rust))',
                  marginBottom: '10px',
                  overflow: 'visible',
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: `${phPct}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'var(--color-paper)',
                    border: '2px solid var(--color-earth-deep)',
                    boxSizing: 'border-box',
                  }} />
                </div>
                <Caption>4.0 (acidic) → 8.0 (alkaline) · optimal range 6.0 – 7.0</Caption>
              </div>
            </div>
          </div>

          {/* Card 4 — ON-HAND INVENTORY */}
          <div style={SECTION_CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Eyebrow>ON-HAND INVENTORY</Eyebrow>
              <Caption>optional — engine draws from full catalog if empty</Caption>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', marginTop: '14px' }}>
              {availableFertilizers.map(fert => {
                const checked = formData.selected_inventory_names.includes(fert);
                return (
                  <label
                    key={fert}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      background: checked ? 'var(--color-paper-deep)' : 'transparent',
                      transition: 'background 150ms ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-paper-deep)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = checked ? 'var(--color-paper-deep)' : 'transparent'; }}
                  >
                    <input
                      type="checkbox"
                      value={fert}
                      checked={checked}
                      onChange={handleInventoryChange}
                      style={{ accentColor: 'var(--color-moss)', width: '14px', height: '14px', cursor: 'pointer', flexShrink: 0 }}
                    />
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', letterSpacing: '0.05em', color: 'var(--color-earth-deep)' }}>
                      {fert}
                    </span>
                  </label>
                );
              })}
            </div>
            {formData.selected_inventory_names.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
                {formData.selected_inventory_names.map(name => (
                  <Pill key={name} label="on-hand" value={name} accent="var(--color-moss)" />
                ))}
              </div>
            )}
          </div>

          {/* ERROR BANNER */}
          {error && (
            <div style={{ background: 'rgba(162,75,42,0.06)', border: '1px solid var(--color-rust)', borderRadius: '4px', padding: '14px 18px' }}>
              <Eyebrow>ERROR</Eyebrow>
              <div style={{ fontFamily: '"Fraunces", serif', fontStyle: 'italic', fontSize: '13px', color: 'var(--color-rust)', marginTop: '6px' }}>
                {error}
              </div>
            </div>
          )}

          {/* ── RESULTS DASHBOARD ── */}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Block A — PRIMARY MEASUREMENTS: NPK + pH 4-col hairline grid */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                  <Eyebrow>PRIMARY MEASUREMENTS</Eyebrow>
                  <Caption>{result.selected_crop_label}</Caption>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '1px',
                  background: 'var(--color-contour)',
                  border: '1px solid var(--color-contour)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <NutrientCell label="NITROGEN"   sym="N" status={formData.n_status} />
                  <NutrientCell label="PHOSPHORUS" sym="P" status={formData.p_status} />
                  <NutrientCell label="POTASSIUM"  sym="K" status={formData.k_status} />
                  <PhCell ph={result.ph_result.soil_ph} />
                </div>
              </div>

              {/* Block B — pH ADVISORY */}
              {(() => {
                const s = result.ph_result.ph_status;
                return (
                  <div style={{
                    background: phStatusToAccentBg(s),
                    border: `1px solid ${phStatusToAccentColor(s)}`,
                    borderRadius: '4px',
                    padding: '14px 18px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                      <Eyebrow>pH ADVISORY</Eyebrow>
                      <Caption>pH {result.ph_result.soil_ph} · {s.replace(/_/g, ' ')}</Caption>
                    </div>
                    <div style={{ fontFamily: '"Fraunces", serif', fontStyle: 'italic', fontSize: '13px', color: 'var(--color-earth-deep)' }}>
                      {result.ph_result.recommendation_message}
                    </div>
                  </div>
                );
              })()}

              {/* Block C — INVENTORY ALERT (conditional) */}
              {!result.inventory_check.valid && result.user_inventory.length > 0 && (
                <div style={{ background: 'rgba(162,75,42,0.06)', border: '1px solid var(--color-rust)', borderRadius: '4px', padding: '14px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <Eyebrow>INVENTORY ALERT</Eyebrow>
                    <Caption>insufficient coverage — using standard catalog</Caption>
                  </div>
                  <div style={{ fontFamily: '"Fraunces", serif', fontStyle: 'italic', fontSize: '12px', color: 'var(--color-earth-deep)' }}>
                    {result.inventory_check.reason}
                  </div>
                </div>
              )}

              {/* Block D — OPTION TABS */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                  <Eyebrow>FERTILIZER OPTIONS ({result.standard_mix.length})</Eyebrow>
                  <Caption>ranked ascending by total weight</Caption>
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  borderBottom: '1px solid var(--color-contour)',
                  paddingBottom: '12px',
                }}>
                  {result.standard_mix.map((mix, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveTab(i)}
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '10px',
                        letterSpacing: '0.14em',
                        fontWeight: 600,
                        padding: '6px 12px',
                        borderRadius: '2px',
                        border: '1px solid var(--color-contour)',
                        cursor: 'pointer',
                        background: activeTab === i ? 'var(--color-moss)' : 'var(--color-paper-deep)',
                        color: activeTab === i ? 'var(--color-paper)' : 'var(--color-earth-deep)',
                        opacity: activeTab === i ? 1 : 0.7,
                        transition: 'background 150ms ease, color 150ms ease, opacity 150ms ease',
                      }}
                    >
                      [{i + 1}] {mix.Source}
                    </button>
                  ))}
                </div>
              </div>

              {/* Block E — RECIPE CARD */}
              {activeMix && (
                <div style={{
                  background: 'var(--color-paper-card)',
                  border: '1px solid var(--color-contour)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  {/* Recipe header strip */}
                  <div style={{
                    background: 'var(--color-paper-deep)',
                    borderBottom: '1px solid var(--color-contour)',
                    padding: '14px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <Eyebrow>OPTION {activeTab + 1} · {activeMix.Source}</Eyebrow>
                      <div style={{
                        fontFamily: '"Fraunces", serif',
                        fontVariationSettings: '"opsz" 144, "wght" 500',
                        fontSize: '16px',
                        color: 'var(--color-earth-deep)',
                        marginTop: '2px',
                      }}>
                        Fertilizer Recipe
                      </div>
                    </div>
                    <div style={{
                      background: 'var(--color-paper-card)',
                      border: '1px solid var(--color-contour)',
                      borderRadius: '4px',
                      padding: '8px 14px',
                      textAlign: 'right',
                    }}>
                      <div style={LABEL_STYLE}>TOTAL WEIGHT</div>
                      <div style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '20px',
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                        color: 'var(--color-earth-deep)',
                        lineHeight: 1,
                      }}>
                        {activeMix['Total Weight'].toFixed(1)} kg
                      </div>
                    </div>
                  </div>

                  {/* Recipe body */}
                  <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Step 1 — Shopping List */}
                    <div>
                      <Eyebrow>STEP 1 · SHOPPING LIST</Eyebrow>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                        {activeMix.Prescription.map((step, i) => (
                          <div key={i} style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '12px',
                            background: 'var(--color-paper)',
                            border: '1px solid var(--color-contour)',
                            borderRadius: '4px',
                            padding: '12px 16px',
                          }}>
                            <span style={{
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: '10px',
                              letterSpacing: '0.1em',
                              fontWeight: 700,
                              color: 'var(--color-moss)',
                              flexShrink: 0,
                            }}>
                              [{i + 1}]
                            </span>
                            <span style={{ fontFamily: '"Fraunces", serif', fontSize: '14px', color: 'var(--color-earth-deep)' }}>
                              Buy <strong>{formatPrescriptionText(step)}</strong>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step 2 — Application */}
                    <div>
                      <Eyebrow>STEP 2 · APPLICATION</Eyebrow>
                      <div style={{
                        background: 'var(--color-paper)',
                        border: '1px solid var(--color-contour)',
                        borderRadius: '4px',
                        padding: '16px 20px',
                        marginTop: '12px',
                      }}>
                        <div style={{ fontFamily: '"Fraunces", serif', fontSize: '14px', color: 'var(--color-earth-deep)', marginBottom: '8px' }}>
                          Mix the items from your shopping list together.
                        </div>
                        <div style={{
                          fontFamily: '"Fraunces", serif',
                          fontVariationSettings: '"opsz" 14, "wght" 600',
                          fontSize: '14px',
                          color: 'var(--color-earth-deep)',
                        }}>
                          Apply this entire mixture evenly across your {result.raw_area} {result.unit_label} of land.
                        </div>
                      </div>
                    </div>

                    {/* Nutrient pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <Pill label="N applied" value={`${activeMix['Applied N']} kg`} accent="var(--color-moss)" />
                      <Pill label="P applied" value={`${activeMix['Applied P']} kg`} accent="var(--color-ochre)" />
                      <Pill label="K applied" value={`${activeMix['Applied K']} kg`} accent="var(--color-rust)" />
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </main>

      {/* FOOTER STRIP */}
      <footer style={{
        borderTop: '1px solid var(--color-contour)',
        background: 'var(--color-paper-card)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '10px',
          letterSpacing: '0.14em',
          color: 'var(--color-earth-deep)',
          opacity: 0.55,
        }}>
          {result ? `${result.standard_mix.length} option${result.standard_mix.length !== 1 ? 's' : ''} available` : ''}
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="terrace-btn"
        >
          {loading ? 'ANALYZING...' : 'GENERATE RECIPE'}
        </button>
      </footer>

    </div>
  );
};

export default FertilizerForm;
