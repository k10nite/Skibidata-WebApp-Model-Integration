// StatusIndicator Component
// Displays categorical status (Low/Medium/High) with color coding and icon
// Triple redundancy: Color + Icon + Text for accessibility

import { motion } from 'framer-motion';

const STATUS_CONFIG = {
  Low: {
    color: '#EF4444',      // Red
    bgColor: '#FEE2E2',    // Light red bg
    icon: '⬇️',
    label: 'Low'
  },
  Medium: {
    color: '#F59E0B',      // Amber/Yellow
    bgColor: '#FEF3C7',    // Light yellow bg
    icon: '➡️',
    label: 'Medium'
  },
  High: {
    color: '#10B981',      // Green
    bgColor: '#D1FAE5',    // Light green bg
    icon: '⬆️',
    label: 'High'
  },
  'Acidic': {
    color: '#EF4444',
    bgColor: '#FEE2E2',
    icon: '🔴',
    label: 'Acidic'
  },
  'Slightly Acidic': {
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    icon: '🟡',
    label: 'Slightly Acidic'
  },
  'Neutral': {
    color: '#10B981',
    bgColor: '#D1FAE5',
    icon: '🟢',
    label: 'Neutral'
  },
  'Slightly Alkaline': {
    color: '#60A5FA',
    bgColor: '#DBEAFE',
    icon: '🔵',
    label: 'Slightly Alkaline'
  },
  'Alkaline': {
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    icon: '🟣',
    label: 'Alkaline'
  }
};

export default function StatusIndicator({ status, size = 'medium', showLabel = true, animate = false }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Medium'];

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl'
  };

  const Component = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.3 }
      }
    : {};

  return (
    <Component
      className={`inline-flex items-center gap-2 rounded-full font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        border: `2px solid ${config.color}`
      }}
      {...animationProps}
    >
      <span className={iconSizes[size]} role="img" aria-label={config.label}>
        {config.icon}
      </span>
      {showLabel && <span className="font-semibold">{config.label}</span>}
    </Component>
  );
}
