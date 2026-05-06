export const STATUS_COLOR = {
  Low:    'var(--color-rust)',
  Medium: 'var(--color-ochre)',
  High:   'var(--color-moss)',
};

export function Eyebrow({ children }) {
  return (
    <div style={{
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '10px',
      letterSpacing: '0.22em',
      color: 'var(--color-moss)',
      fontWeight: 600,
    }}>{children}</div>
  );
}

export function Caption({ children }) {
  return (
    <div style={{
      fontFamily: '"Fraunces", serif',
      fontStyle: 'italic',
      fontSize: '11px',
      color: 'var(--color-earth-deep)',
      opacity: 0.55,
    }}>{children}</div>
  );
}

export function Sep() {
  return (
    <span style={{ opacity: 0.4, margin: '0 10px' }}>·</span>
  );
}

export function Pill({ label, value, accent }) {
  return (
    <div style={{
      background: 'var(--color-paper-card)',
      border: '1px solid var(--color-contour)',
      borderRadius: '999px',
      padding: '4px 12px',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '10px',
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: '6px',
    }}>
      <span style={{ opacity: 0.5, fontWeight: 600, letterSpacing: '0.18em' }}>
        {label.toUpperCase()}
      </span>
      <span style={{
        color: accent ?? 'var(--color-earth-deep)',
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </span>
    </div>
  );
}

export function TelemetryCell({ label, value, mono }) {
  return (
    <div style={{ background: 'var(--color-paper-card)', padding: '14px 16px' }}>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '9px',
        letterSpacing: '0.22em',
        color: 'var(--color-earth-deep)',
        opacity: 0.5,
        fontWeight: 600,
        marginBottom: '6px',
      }}>{label}</div>
      <div style={{
        fontFamily: mono ? '"JetBrains Mono", monospace' : '"Fraunces", serif',
        fontSize: mono ? '15px' : '17px',
        fontVariationSettings: mono ? undefined : '"opsz" 144, "wght" 500',
        fontVariantNumeric: mono ? 'tabular-nums' : undefined,
        color: 'var(--color-earth-deep)',
        opacity: value ? 1 : 0.35,
        lineHeight: 1.1,
      }}>{value || '—'}</div>
    </div>
  );
}

export function NutrientCell({ label, sym, status, ppm, dist }) {
  const color = STATUS_COLOR[status];
  return (
    <div style={{ background: 'var(--color-paper-card)', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
        <Eyebrow>{label}</Eyebrow>
        <div style={{
          fontFamily: '"Fraunces", serif',
          fontVariationSettings: '"opsz" 144, "wght" 600',
          fontSize: '20px',
          color,
          lineHeight: 1,
        }}>{sym}</div>
      </div>
      <div style={{
        background: color,
        color: 'var(--color-paper)',
        padding: '4px 8px',
        borderRadius: '2px',
        display: 'inline-block',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '10px',
        letterSpacing: '0.18em',
        fontWeight: 700,
      }}>{status.toUpperCase()}</div>
      {ppm != null && (
        <div style={{
          marginTop: '8px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '11px',
          opacity: 0.7,
          fontVariantNumeric: 'tabular-nums',
        }}>{ppm.toFixed(1)} ppm</div>
      )}
      {dist && (
        <div style={{
          display: 'flex',
          height: '6px',
          marginTop: '8px',
          overflow: 'hidden',
          background: 'var(--color-paper-deep)',
          borderRadius: '1px',
        }}>
          <div style={{ width: `${(dist.Low ?? 0) * 100}%`, background: 'var(--color-rust)' }} />
          <div style={{ width: `${(dist.Medium ?? 0) * 100}%`, background: 'var(--color-ochre)' }} />
          <div style={{ width: `${(dist.High ?? 0) * 100}%`, background: 'var(--color-moss)' }} />
        </div>
      )}
    </div>
  );
}

export function PhCell({ ph }) {
  const pct = Math.max(0, Math.min(100, ((ph - 4) / 4) * 100));
  return (
    <div style={{ background: 'var(--color-paper-card)', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
        <Eyebrow>ACIDITY</Eyebrow>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', opacity: 0.55 }}>pH</span>
      </div>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '24px',
        fontWeight: 700,
        color: 'var(--color-earth-deep)',
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1,
      }}>{ph.toFixed(1)}</div>
      <div style={{
        position: 'relative',
        height: '6px',
        marginTop: '12px',
        background: 'linear-gradient(to right, var(--color-rust), var(--color-ochre), var(--color-moss), var(--color-ochre), var(--color-rust))',
        borderRadius: '1px',
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: `${pct}%`,
          transform: 'translate(-50%, -50%)',
          width: '8px',
          height: '8px',
          background: 'var(--color-paper)',
          border: '2px solid var(--color-earth-deep)',
          borderRadius: '50%',
        }} />
      </div>
    </div>
  );
}
