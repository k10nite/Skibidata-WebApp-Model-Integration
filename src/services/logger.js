// Structured dev logger for SoilScan webapp data flow.
// Toggle off by setting VITE_DEBUG_LOGS=false in .env.

const ENABLED = import.meta.env.VITE_DEBUG_LOGS !== 'false';
const PREFIX_BG = {
  ml:    'background:#4F5B2F;color:#FAF7F0;padding:2px 6px;border-radius:2px;font-weight:600',
  rule:  'background:#A24B2A;color:#FAF7F0;padding:2px 6px;border-radius:2px;font-weight:600',
  store: 'background:#3E2A1F;color:#FAF7F0;padding:2px 6px;border-radius:2px;font-weight:600',
  flow:  'background:#C8893A;color:#FAF7F0;padding:2px 6px;border-radius:2px;font-weight:600',
  warn:  'background:#A24B2A;color:#FAF7F0;padding:2px 6px;border-radius:2px;font-weight:600'
};

function fmt(channel, label) {
  return [`%c${channel.toUpperCase()}%c ${label}`, PREFIX_BG[channel] || PREFIX_BG.flow, 'color:inherit;font-weight:normal'];
}

export const log = {
  ml(label, data) {
    if (!ENABLED) return;
    console.log(...fmt('ml', label), data ?? '');
  },
  rule(label, data) {
    if (!ENABLED) return;
    console.log(...fmt('rule', label), data ?? '');
  },
  store(label, data) {
    if (!ENABLED) return;
    console.log(...fmt('store', label), data ?? '');
  },
  flow(label, data) {
    if (!ENABLED) return;
    console.log(...fmt('flow', label), data ?? '');
  },
  warn(label, data) {
    if (!ENABLED) return;
    console.warn(...fmt('warn', label), data ?? '');
  },
  group(channel, label, fn) {
    if (!ENABLED) { fn(); return; }
    console.groupCollapsed(...fmt(channel, label));
    try { fn(); } finally { console.groupEnd(); }
  }
};

if (ENABLED && typeof window !== 'undefined') {
  console.log(
    '%cSoilScan%c dev logging enabled — set VITE_DEBUG_LOGS=false to silence',
    'background:#4F5B2F;color:#FAF7F0;padding:3px 8px;border-radius:2px;font-weight:700;font-size:12px',
    'color:inherit;font-style:italic'
  );
}
