import anesLogo from '../assets/anes-logo.png';

export default function AnesBrand({ compact = false, className = '' }) {
  const logoSize = compact ? 40 : 58;

  return (
    <div className={`flex items-center gap-3 min-w-0 ${className}`}>
      <img
        src={anesLogo}
        alt="ANES logo"
        width={logoSize}
        height={logoSize}
        className="shrink-0"
        style={{
          width: `${logoSize}px`,
          height: `${logoSize}px`,
          objectFit: 'contain'
        }}
      />
      <div className="min-w-0">
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: compact ? '13px' : '15px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: 'var(--color-earth-deep)',
            lineHeight: 1.1
          }}
        >
          ANES
        </div>
        <div
          className="truncate"
          style={{
            fontFamily: '"Fraunces", serif',
            fontSize: compact ? '12px' : '14px',
            fontStyle: 'italic',
            color: 'var(--color-earth-deep)',
            opacity: 0.65,
            lineHeight: 1.2
          }}
        >
          Smart Fertilizer Recommendations
        </div>
      </div>
    </div>
  );
}
