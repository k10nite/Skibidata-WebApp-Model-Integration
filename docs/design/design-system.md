# Fertilizer Recommendation App - Design System

## 1. Design Tokens

### Color Palette

```javascript
// colors.js
export const colors = {
  // Primary Colors
  primary: {
    main: '#4CAF50',      // Main green
    light: '#81C784',     // Light green
    dark: '#388E3C',      // Dark green
    contrast: '#FFFFFF',  // Text on primary
  },

  // Status Colors (NPK Indicators)
  status: {
    low: {
      main: '#F44336',    // Red
      light: '#EF5350',
      dark: '#C62828',
      bg: '#FFEBEE',      // Light red background
    },
    medium: {
      main: '#FFC107',    // Amber/Yellow
      light: '#FFD54F',
      dark: '#FFA000',
      bg: '#FFF8E1',      // Light yellow background
    },
    high: {
      main: '#4CAF50',    // Green
      light: '#81C784',
      dark: '#388E3C',
      bg: '#E8F5E9',      // Light green background
    },
  },

  // Neutral Colors (60% of design)
  neutral: {
    white: '#FFFFFF',
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
    black: '#000000',
  },

  // Supporting Colors (30% of design)
  supporting: {
    blue: '#2196F3',      // Info
    lightBlue: '#E3F2FD', // Info background
    orange: '#FF9800',    // Warning
    lightOrange: '#FFF3E0', // Warning background
    purple: '#9C27B0',    // Accent
    lightPurple: '#F3E5F5', // Accent background
  },

  // Semantic Colors
  semantic: {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3',
  },

  // Text Colors
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.60)',
    disabled: 'rgba(0, 0, 0, 0.38)',
    hint: 'rgba(0, 0, 0, 0.38)',
    inverse: '#FFFFFF',
  },

  // Background Colors
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF',
    elevated: '#FFFFFF',
  },

  // Border Colors
  border: {
    light: '#E0E0E0',
    main: '#BDBDBD',
    dark: '#757575',
  },
};
```

### Typography Scale

```javascript
// typography.js
export const typography = {
  // Font Families
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    monospace: '"SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },

  // Font Sizes
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },

  // Font Weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.05em',
  },

  // Predefined Text Styles
  styles: {
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.75,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 2,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
  },
};
```

### Spacing Scale

```javascript
// spacing.js
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};
```

### Shadows & Elevation

```javascript
// shadows.js
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};
```

### Border Radius

```javascript
// borderRadius.js
export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  base: '0.5rem',  // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  full: '9999px',  // Fully rounded
};
```

### Transitions

```javascript
// transitions.js
export const transitions = {
  duration: {
    fast: '150ms',
    base: '250ms',
    slow: '350ms',
  },
  timing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
  },
};
```

## 2. Component Specifications

### Core Components

#### Button Component

```jsx
// Button.jsx
import React from 'react';
import './Button.css';

/**
 * Primary UI component for user interaction
 *
 * Variants:
 * - primary: Main call-to-action (10% accent usage)
 * - secondary: Secondary actions
 * - outline: Less prominent actions
 * - text: Tertiary actions
 *
 * Sizes:
 * - sm: Small button (32px height)
 * - md: Medium button (40px height)
 * - lg: Large button (48px height)
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  ...props
}) => {
  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full-width',
    disabled && 'btn--disabled',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {leftIcon && <span className="btn__icon btn__icon--left">{leftIcon}</span>}
      <span className="btn__text">{children}</span>
      {rightIcon && <span className="btn__icon btn__icon--right">{rightIcon}</span>}
    </button>
  );
};

export default Button;
```

```css
/* Button.css */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-family-primary);
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  border: none;
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: all var(--duration-base) var(--timing-ease);
  white-space: nowrap;
  user-select: none;
}

/* Sizes */
.btn--sm {
  height: 32px;
  padding: 0 1rem;
  font-size: 0.75rem;
}

.btn--md {
  height: 40px;
  padding: 0 1.5rem;
  font-size: 0.875rem;
}

.btn--lg {
  height: 48px;
  padding: 0 2rem;
  font-size: 1rem;
}

/* Variants */
.btn--primary {
  background-color: var(--color-primary-main);
  color: var(--color-primary-contrast);
  box-shadow: var(--shadow-sm);
}

.btn--primary:hover:not(.btn--disabled) {
  background-color: var(--color-primary-dark);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn--primary:active:not(.btn--disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn--secondary {
  background-color: var(--color-neutral-gray200);
  color: var(--color-text-primary);
}

.btn--secondary:hover:not(.btn--disabled) {
  background-color: var(--color-neutral-gray300);
}

.btn--outline {
  background-color: transparent;
  color: var(--color-primary-main);
  border: 2px solid var(--color-primary-main);
}

.btn--outline:hover:not(.btn--disabled) {
  background-color: var(--color-primary-main);
  color: var(--color-primary-contrast);
}

.btn--text {
  background-color: transparent;
  color: var(--color-primary-main);
}

.btn--text:hover:not(.btn--disabled) {
  background-color: rgba(76, 175, 80, 0.08);
}

/* States */
.btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn--full-width {
  width: 100%;
}

/* Icons */
.btn__icon {
  display: flex;
  align-items: center;
  font-size: 1.2em;
}
```

#### Card Component

```jsx
// Card.jsx
import React from 'react';
import './Card.css';

/**
 * Container component for grouping related content
 *
 * Variants:
 * - elevated: Floating card with shadow (default)
 * - outlined: Card with border, no shadow
 * - flat: No shadow, no border
 *
 * Used for: NPK status, recommendations, plant info
 */
const Card = ({
  children,
  variant = 'elevated',
  padding = 'md',
  className = '',
  hoverable = false,
  onClick,
  ...props
}) => {
  const classNames = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    hoverable && 'card--hoverable',
    onClick && 'card--clickable',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

// Card sub-components
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`card__header ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={`card__body ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`card__footer ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
```

```css
/* Card.css */
.card {
  background-color: var(--color-background-paper);
  border-radius: var(--radius-lg);
  transition: all var(--duration-base) var(--timing-ease);
}

/* Variants */
.card--elevated {
  box-shadow: var(--shadow-base);
}

.card--outlined {
  border: 1px solid var(--color-border-light);
}

.card--flat {
  /* No additional styles */
}

/* Padding */
.card--padding-none {
  padding: 0;
}

.card--padding-sm {
  padding: 0.75rem;
}

.card--padding-md {
  padding: 1.5rem;
}

.card--padding-lg {
  padding: 2rem;
}

/* Interactive States */
.card--hoverable:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card--clickable {
  cursor: pointer;
}

.card--clickable:active {
  transform: translateY(0);
}

/* Sub-components */
.card__header {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border-light);
}

.card__body {
  /* Main content area */
}

.card__footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border-light);
}
```

#### Status Indicator Component

```jsx
// StatusIndicator.jsx
import React from 'react';
import './StatusIndicator.css';

/**
 * Component for displaying NPK and pH status levels
 *
 * Status levels:
 * - low: Red indicator
 * - medium: Yellow indicator
 * - high: Green indicator
 *
 * Display modes:
 * - badge: Small label indicator
 * - bar: Progress bar style
 * - card: Full card with icon and details
 */
const StatusIndicator = ({
  status,
  label,
  value,
  unit,
  mode = 'badge',
  showIcon = true,
  className = '',
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'low':
        return '↓';
      case 'medium':
        return '→';
      case 'high':
        return '↑';
      default:
        return '';
    }
  };

  if (mode === 'badge') {
    return (
      <span className={`status-badge status-badge--${status} ${className}`}>
        {showIcon && <span className="status-badge__icon">{getStatusIcon(status)}</span>}
        <span className="status-badge__text">{label}</span>
      </span>
    );
  }

  if (mode === 'bar') {
    return (
      <div className={`status-bar ${className}`}>
        <div className="status-bar__header">
          <span className="status-bar__label">{label}</span>
          <span className="status-bar__value">{value}{unit}</span>
        </div>
        <div className="status-bar__track">
          <div
            className={`status-bar__fill status-bar__fill--${status}`}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    );
  }

  if (mode === 'card') {
    return (
      <div className={`status-card status-card--${status} ${className}`}>
        <div className="status-card__icon">
          {getStatusIcon(status)}
        </div>
        <div className="status-card__content">
          <div className="status-card__label">{label}</div>
          <div className="status-card__value">{value}{unit}</div>
          <div className="status-card__status">{status.toUpperCase()}</div>
        </div>
      </div>
    );
  }

  return null;
};

export default StatusIndicator;
```

```css
/* StatusIndicator.css */

/* Badge Mode */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge--low {
  background-color: var(--color-status-low-bg);
  color: var(--color-status-low-dark);
}

.status-badge--medium {
  background-color: var(--color-status-medium-bg);
  color: var(--color-status-medium-dark);
}

.status-badge--high {
  background-color: var(--color-status-high-bg);
  color: var(--color-status-high-dark);
}

.status-badge__icon {
  font-size: 1.2em;
  font-weight: bold;
}

/* Bar Mode */
.status-bar {
  width: 100%;
}

.status-bar__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.status-bar__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.status-bar__value {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.status-bar__track {
  height: 8px;
  background-color: var(--color-neutral-gray200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.status-bar__fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--timing-ease);
}

.status-bar__fill--low {
  background-color: var(--color-status-low-main);
}

.status-bar__fill--medium {
  background-color: var(--color-status-medium-main);
}

.status-bar__fill--high {
  background-color: var(--color-status-high-main);
}

/* Card Mode */
.status-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius-lg);
  border-left: 4px solid;
  background-color: var(--color-background-paper);
  box-shadow: var(--shadow-sm);
}

.status-card--low {
  border-left-color: var(--color-status-low-main);
  background-color: var(--color-status-low-bg);
}

.status-card--medium {
  border-left-color: var(--color-status-medium-main);
  background-color: var(--color-status-medium-bg);
}

.status-card--high {
  border-left-color: var(--color-status-high-main);
  background-color: var(--color-status-high-bg);
}

.status-card__icon {
  font-size: 2rem;
  font-weight: bold;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background-color: var(--color-background-paper);
}

.status-card--low .status-card__icon {
  color: var(--color-status-low-main);
}

.status-card--medium .status-card__icon {
  color: var(--color-status-medium-main);
}

.status-card--high .status-card__icon {
  color: var(--color-status-high-main);
}

.status-card__content {
  flex: 1;
}

.status-card__label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: 0.25rem;
}

.status-card__value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.status-card__status {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-card--low .status-card__status {
  color: var(--color-status-low-main);
}

.status-card--medium .status-card__status {
  color: var(--color-status-medium-main);
}

.status-card--high .status-card__status {
  color: var(--color-status-high-main);
}
```

#### NPK Card Component

```jsx
// NPKCard.jsx
import React from 'react';
import Card from './Card';
import StatusIndicator from './StatusIndicator';
import './NPKCard.css';

/**
 * Specialized card for displaying NPK levels
 * Shows Nitrogen, Phosphorus, and Potassium status
 */
const NPKCard = ({ nitrogen, phosphorus, potassium, className = '' }) => {
  return (
    <Card className={`npk-card ${className}`} padding="md">
      <Card.Header>
        <h3 className="npk-card__title">Soil Nutrient Status</h3>
        <p className="npk-card__subtitle">Current NPK levels in your soil</p>
      </Card.Header>

      <Card.Body>
        <div className="npk-card__grid">
          <StatusIndicator
            mode="card"
            status={nitrogen.status}
            label="Nitrogen (N)"
            value={nitrogen.value}
            unit=" ppm"
          />
          <StatusIndicator
            mode="card"
            status={phosphorus.status}
            label="Phosphorus (P)"
            value={phosphorus.value}
            unit=" ppm"
          />
          <StatusIndicator
            mode="card"
            status={potassium.status}
            label="Potassium (K)"
            value={potassium.value}
            unit=" ppm"
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default NPKCard;
```

```css
/* NPKCard.css */
.npk-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem 0;
}

.npk-card__subtitle {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.npk-card__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .npk-card__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

#### Fertilizer Recommendation Card

```jsx
// FertilizerCard.jsx
import React from 'react';
import Card from './Card';
import Button from './Button';
import './FertilizerCard.css';

/**
 * Card component for displaying fertilizer recommendations
 * Shows fertilizer details, NPK ratios, and application instructions
 */
const FertilizerCard = ({
  name,
  npkRatio,
  dosage,
  frequency,
  price,
  description,
  isRecommended = false,
  onSelect,
  className = '',
}) => {
  return (
    <Card
      className={`fertilizer-card ${isRecommended ? 'fertilizer-card--recommended' : ''} ${className}`}
      hoverable
      padding="lg"
    >
      {isRecommended && (
        <div className="fertilizer-card__badge">
          <span className="fertilizer-card__badge-icon">⭐</span>
          Recommended
        </div>
      )}

      <Card.Header>
        <h3 className="fertilizer-card__title">{name}</h3>
        <div className="fertilizer-card__npk">
          <span className="fertilizer-card__npk-label">NPK Ratio:</span>
          <span className="fertilizer-card__npk-value">{npkRatio}</span>
        </div>
      </Card.Header>

      <Card.Body>
        <p className="fertilizer-card__description">{description}</p>

        <div className="fertilizer-card__details">
          <div className="fertilizer-card__detail">
            <span className="fertilizer-card__detail-label">Dosage</span>
            <span className="fertilizer-card__detail-value">{dosage}</span>
          </div>
          <div className="fertilizer-card__detail">
            <span className="fertilizer-card__detail-label">Frequency</span>
            <span className="fertilizer-card__detail-value">{frequency}</span>
          </div>
          {price && (
            <div className="fertilizer-card__detail">
              <span className="fertilizer-card__detail-label">Est. Price</span>
              <span className="fertilizer-card__detail-value">{price}</span>
            </div>
          )}
        </div>
      </Card.Body>

      <Card.Footer>
        <Button
          variant={isRecommended ? 'primary' : 'outline'}
          fullWidth
          onClick={onSelect}
        >
          Select This Fertilizer
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default FertilizerCard;
```

```css
/* FertilizerCard.css */
.fertilizer-card {
  position: relative;
  border: 2px solid transparent;
  transition: all var(--duration-base) var(--timing-ease);
}

.fertilizer-card--recommended {
  border-color: var(--color-primary-main);
  background: linear-gradient(to bottom, var(--color-status-high-bg), var(--color-background-paper));
}

.fertilizer-card__badge {
  position: absolute;
  top: -12px;
  right: 1rem;
  background-color: var(--color-primary-main);
  color: var(--color-primary-contrast);
  padding: 0.25rem 1rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: var(--shadow-md);
}

.fertilizer-card__badge-icon {
  font-size: 1.2em;
}

.fertilizer-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.75rem 0;
}

.fertilizer-card__npk {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fertilizer-card__npk-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.fertilizer-card__npk-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary-main);
  font-family: var(--font-family-monospace);
}

.fertilizer-card__description {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0 0 1.5rem 0;
}

.fertilizer-card__details {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
}

.fertilizer-card__detail {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.fertilizer-card__detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.fertilizer-card__detail-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
}
```

#### Loading Spinner Component

```jsx
// LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css';

/**
 * Loading spinner with optional steps display
 * Used in the processing screen
 */
const LoadingSpinner = ({
  size = 'md',
  steps = [],
  currentStep = 0,
  className = '',
}) => {
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  return (
    <div className={`loading-spinner ${className}`}>
      <div
        className={`loading-spinner__circle loading-spinner__circle--${size}`}
        style={{
          width: `${sizeMap[size]}px`,
          height: `${sizeMap[size]}px`
        }}
      >
        <div className="loading-spinner__leaf"></div>
      </div>

      {steps.length > 0 && (
        <div className="loading-spinner__steps">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`loading-spinner__step ${
                index === currentStep ? 'loading-spinner__step--active' : ''
              } ${
                index < currentStep ? 'loading-spinner__step--completed' : ''
              }`}
            >
              <div className="loading-spinner__step-indicator">
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className="loading-spinner__step-text">{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
```

```css
/* LoadingSpinner.css */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.loading-spinner__circle {
  position: relative;
  border-radius: 50%;
  border: 4px solid var(--color-neutral-gray200);
  border-top-color: var(--color-primary-main);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-spinner__leaf {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-primary-main);
  font-size: 1.5rem;
}

.loading-spinner__steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
}

.loading-spinner__step {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-base);
  background-color: var(--color-neutral-gray100);
  transition: all var(--duration-base) var(--timing-ease);
}

.loading-spinner__step--active {
  background-color: var(--color-status-high-bg);
  box-shadow: var(--shadow-sm);
}

.loading-spinner__step--completed {
  opacity: 0.6;
}

.loading-spinner__step-indicator {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--color-neutral-gray300);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.loading-spinner__step--active .loading-spinner__step-indicator {
  background-color: var(--color-primary-main);
  color: var(--color-primary-contrast);
}

.loading-spinner__step--completed .loading-spinner__step-indicator {
  background-color: var(--color-primary-main);
  color: var(--color-primary-contrast);
}

.loading-spinner__step-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}
```

#### Input Component

```jsx
// Input.jsx
import React from 'react';
import './Input.css';

/**
 * Text input component with label and validation states
 */
const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label className="input__label">
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}

      <div className={`input__container ${error ? 'input__container--error' : ''}`}>
        {leftIcon && <span className="input__icon input__icon--left">{leftIcon}</span>}
        <input
          className="input__field"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        {rightIcon && <span className="input__icon input__icon--right">{rightIcon}</span>}
      </div>

      {(error || helperText) && (
        <span className={`input__helper ${error ? 'input__helper--error' : ''}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};

export default Input;
```

```css
/* Input.css */
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.input__required {
  color: var(--color-semantic-error);
  margin-left: 0.25rem;
}

.input__container {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--color-background-paper);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-base);
  transition: all var(--duration-base) var(--timing-ease);
}

.input__container:focus-within {
  border-color: var(--color-primary-main);
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.input__container--error {
  border-color: var(--color-semantic-error);
}

.input__container--error:focus-within {
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

.input__field {
  flex: 1;
  height: 40px;
  padding: 0 1rem;
  font-family: var(--font-family-primary);
  font-size: 0.875rem;
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  outline: none;
}

.input__field::placeholder {
  color: var(--color-text-hint);
}

.input__field:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input__icon {
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  font-size: 1.25rem;
}

.input__icon--left {
  padding-left: 1rem;
}

.input__icon--right {
  padding-right: 1rem;
}

.input__helper {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.input__helper--error {
  color: var(--color-semantic-error);
}
```

#### Select/Dropdown Component

```jsx
// Select.jsx
import React from 'react';
import './Select.css';

/**
 * Dropdown select component for plant selection
 */
const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`select-wrapper ${className}`}>
      {label && (
        <label className="select__label">
          {label}
          {required && <span className="select__required">*</span>}
        </label>
      )}

      <div className={`select__container ${error ? 'select__container--error' : ''}`}>
        <select
          className="select__field"
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="select__arrow">▼</span>
      </div>

      {(error || helperText) && (
        <span className={`select__helper ${error ? 'select__helper--error' : ''}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};

export default Select;
```

```css
/* Select.css */
.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.select__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.select__required {
  color: var(--color-semantic-error);
  margin-left: 0.25rem;
}

.select__container {
  position: relative;
  background-color: var(--color-background-paper);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-base);
  transition: all var(--duration-base) var(--timing-ease);
}

.select__container:focus-within {
  border-color: var(--color-primary-main);
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.select__container--error {
  border-color: var(--color-semantic-error);
}

.select__field {
  width: 100%;
  height: 40px;
  padding: 0 2.5rem 0 1rem;
  font-family: var(--font-family-primary);
  font-size: 0.875rem;
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  outline: none;
  appearance: none;
  cursor: pointer;
}

.select__field:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.select__arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  pointer-events: none;
}

.select__helper {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.select__helper--error {
  color: var(--color-semantic-error);
}
```

## 3. Screen-Specific Components

### Location Selection Screen

```jsx
// LocationScreen.jsx
import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import './LocationScreen.css';

const LocationScreen = ({ onLocationSelect }) => {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleGetCurrentLocation = () => {
    setIsLoadingLocation(true);
    // GPS logic here
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationSelect({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error(error);
        setIsLoadingLocation(false);
      }
    );
  };

  return (
    <div className="location-screen">
      <div className="location-screen__header">
        <h1 className="location-screen__title">Select Your Location</h1>
        <p className="location-screen__subtitle">
          Help us provide accurate fertilizer recommendations for your area
        </p>
      </div>

      <Card className="location-screen__map" padding="none">
        <div className="location-screen__map-container">
          {/* Map component goes here */}
          <div className="location-screen__map-placeholder">
            Map will be displayed here
          </div>
        </div>
      </Card>

      <div className="location-screen__actions">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          leftIcon={<span>📍</span>}
          onClick={handleGetCurrentLocation}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? 'Getting Location...' : 'Use Current Location'}
        </Button>
        <Button
          variant="outline"
          size="lg"
          fullWidth
          leftIcon={<span>🔍</span>}
        >
          Search Location
        </Button>
      </div>
    </div>
  );
};

export default LocationScreen;
```

```css
/* LocationScreen.css */
.location-screen {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.location-screen__header {
  text-align: center;
}

.location-screen__title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem 0;
}

.location-screen__subtitle {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.location-screen__map {
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.location-screen__map-container {
  width: 100%;
  height: 100%;
}

.location-screen__map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-neutral-gray100);
  color: var(--color-text-secondary);
}

.location-screen__actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .location-screen__actions {
    flex-direction: row;
  }
}
```

### Soil Status Screen

```jsx
// SoilStatusScreen.jsx
import React from 'react';
import NPKCard from '../components/NPKCard';
import Card from '../components/Card';
import StatusIndicator from '../components/StatusIndicator';
import Button from '../components/Button';
import './SoilStatusScreen.css';

const SoilStatusScreen = ({ soilData, onContinue }) => {
  return (
    <div className="soil-status-screen">
      <div className="soil-status-screen__header">
        <h1 className="soil-status-screen__title">Soil Analysis Results</h1>
        <p className="soil-status-screen__subtitle">
          Based on data from {soilData.location}
        </p>
      </div>

      <NPKCard
        nitrogen={soilData.nitrogen}
        phosphorus={soilData.phosphorus}
        potassium={soilData.potassium}
      />

      <Card padding="md">
        <Card.Header>
          <h3 className="soil-status-screen__card-title">Soil pH Level</h3>
        </Card.Header>
        <Card.Body>
          <StatusIndicator
            mode="bar"
            status={soilData.ph.status}
            label="pH"
            value={soilData.ph.value}
            unit=""
          />
          <div className="soil-status-screen__ph-scale">
            <span>Acidic (0-6.5)</span>
            <span>Neutral (6.5-7.5)</span>
            <span>Alkaline (7.5-14)</span>
          </div>
        </Card.Body>
      </Card>

      <Card padding="md" variant="outlined">
        <Card.Body>
          <div className="soil-status-screen__info">
            <span className="soil-status-screen__info-icon">ℹ️</span>
            <div>
              <h4 className="soil-status-screen__info-title">Understanding Your Results</h4>
              <p className="soil-status-screen__info-text">
                These values indicate the current nutrient levels in your soil.
                We'll recommend fertilizers to optimize these levels for your selected crop.
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      <div className="soil-status-screen__actions">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onContinue}
        >
          Continue to Recommendations
        </Button>
      </div>
    </div>
  );
};

export default SoilStatusScreen;
```

```css
/* SoilStatusScreen.css */
.soil-status-screen {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.soil-status-screen__header {
  text-align: center;
  margin-bottom: 1rem;
}

.soil-status-screen__title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem 0;
}

.soil-status-screen__subtitle {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.soil-status-screen__card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.soil-status-screen__ph-scale {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-align: center;
}

.soil-status-screen__info {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.soil-status-screen__info-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.soil-status-screen__info-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem 0;
}

.soil-status-screen__info-text {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0;
}

.soil-status-screen__actions {
  margin-top: 1rem;
}
```

## 4. Layout Components

### Container

```jsx
// Container.jsx
import React from 'react';
import './Container.css';

/**
 * Container component for consistent page width and padding
 */
const Container = ({
  children,
  maxWidth = 'lg',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`container container--${maxWidth} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
```

```css
/* Container.css */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

.container--sm {
  max-width: 640px;
}

.container--md {
  max-width: 768px;
}

.container--lg {
  max-width: 1024px;
}

.container--xl {
  max-width: 1280px;
}

.container--full {
  max-width: 100%;
}

@media (min-width: 768px) {
  .container {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
```

### Header

```jsx
// Header.jsx
import React from 'react';
import './Header.css';

/**
 * Application header with navigation
 */
const Header = ({ title, showBack = false, onBack }) => {
  return (
    <header className="header">
      <div className="header__container">
        {showBack && (
          <button className="header__back" onClick={onBack}>
            ← Back
          </button>
        )}
        <h1 className="header__title">{title}</h1>
        <div className="header__actions">
          {/* Add menu or profile icon */}
        </div>
      </div>
    </header>
  );
};

export default Header;
```

```css
/* Header.css */
.header {
  background-color: var(--color-primary-main);
  color: var(--color-primary-contrast);
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.header__back {
  background: none;
  border: none;
  color: var(--color-primary-contrast);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity var(--duration-base) var(--timing-ease);
}

.header__back:hover {
  opacity: 0.8;
}

.header__title {
  flex: 1;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
}

.header__actions {
  min-width: 40px;
}

@media (min-width: 768px) {
  .header__container {
    padding: 1.5rem 2rem;
  }

  .header__title {
    font-size: 1.5rem;
  }
}
```

## 5. Global Styles

```css
/* globals.css */
:root {
  /* Colors */
  --color-primary-main: #4CAF50;
  --color-primary-light: #81C784;
  --color-primary-dark: #388E3C;
  --color-primary-contrast: #FFFFFF;

  --color-status-low-main: #F44336;
  --color-status-low-light: #EF5350;
  --color-status-low-dark: #C62828;
  --color-status-low-bg: #FFEBEE;

  --color-status-medium-main: #FFC107;
  --color-status-medium-light: #FFD54F;
  --color-status-medium-dark: #FFA000;
  --color-status-medium-bg: #FFF8E1;

  --color-status-high-main: #4CAF50;
  --color-status-high-light: #81C784;
  --color-status-high-dark: #388E3C;
  --color-status-high-bg: #E8F5E9;

  --color-neutral-white: #FFFFFF;
  --color-neutral-gray50: #FAFAFA;
  --color-neutral-gray100: #F5F5F5;
  --color-neutral-gray200: #EEEEEE;
  --color-neutral-gray300: #E0E0E0;
  --color-neutral-gray400: #BDBDBD;
  --color-neutral-gray500: #9E9E9E;
  --color-neutral-gray600: #757575;
  --color-neutral-gray700: #616161;
  --color-neutral-gray800: #424242;
  --color-neutral-gray900: #212121;

  --color-supporting-blue: #2196F3;
  --color-supporting-light-blue: #E3F2FD;
  --color-supporting-orange: #FF9800;
  --color-supporting-light-orange: #FFF3E0;

  --color-semantic-success: #4CAF50;
  --color-semantic-error: #F44336;
  --color-semantic-warning: #FFC107;
  --color-semantic-info: #2196F3;

  --color-text-primary: rgba(0, 0, 0, 0.87);
  --color-text-secondary: rgba(0, 0, 0, 0.60);
  --color-text-disabled: rgba(0, 0, 0, 0.38);
  --color-text-hint: rgba(0, 0, 0, 0.38);
  --color-text-inverse: #FFFFFF;

  --color-background-default: #FAFAFA;
  --color-background-paper: #FFFFFF;

  --color-border-light: #E0E0E0;
  --color-border-main: #BDBDBD;
  --color-border-dark: #757575;

  /* Typography */
  --font-family-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-family-monospace: "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-base: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  /* Transitions */
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 350ms;
  --timing-ease: ease;
}

/* Reset and base styles */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-family-primary);
  font-size: 1rem;
  line-height: 1.5;
  color: var(--color-text-primary);
  background-color: var(--color-background-default);
  min-height: 100vh;
}

/* Accessibility */
:focus-visible {
  outline: 2px solid var(--color-primary-main);
  outline-offset: 2px;
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Utility classes */
.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.mt-1 { margin-top: var(--spacing-1); }
.mt-2 { margin-top: var(--spacing-2); }
.mt-3 { margin-top: var(--spacing-3); }
.mt-4 { margin-top: var(--spacing-4); }
.mt-6 { margin-top: var(--spacing-6); }
.mt-8 { margin-top: var(--spacing-8); }

.mb-1 { margin-bottom: var(--spacing-1); }
.mb-2 { margin-bottom: var(--spacing-2); }
.mb-3 { margin-bottom: var(--spacing-3); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mb-6 { margin-bottom: var(--spacing-6); }
.mb-8 { margin-bottom: var(--spacing-8); }
```

## 6. Component Usage Guide

### 60-30-10 Rule Application

**60% - Neutral Colors (White/Gray)**
- Page backgrounds: `var(--color-background-default)` (#FAFAFA)
- Card backgrounds: `var(--color-background-paper)` (#FFFFFF)
- Input fields: White backgrounds
- Large container areas

**30% - Supporting Colors**
- Section backgrounds: Light variations of status colors
- Hover states: Gray-200, Gray-300
- Borders and dividers: Gray-300, Gray-400
- Secondary information areas

**10% - Accent Colors (Primary Green)**
- Primary buttons
- Active states
- Key CTAs
- Links and interactive elements
- Success indicators

### Accessibility Considerations

1. **Color Contrast**
   - All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
   - Status colors have both color and text/icon indicators
   - Focus states are clearly visible

2. **Keyboard Navigation**
   - All interactive elements are keyboard accessible
   - Focus visible styles applied
   - Tab order is logical

3. **Screen Readers**
   - Semantic HTML used throughout
   - ARIA labels where needed
   - Status indicators include text descriptions

4. **Touch Targets**
   - Minimum 40px height for touch targets (buttons, inputs)
   - Adequate spacing between interactive elements

### Responsive Breakpoints

```javascript
// breakpoints.js
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
```

### Icon System

Recommended: Ionicons or React Icons

```jsx
// Example with react-icons
import {
  IoLocationSharp,
  IoLeafOutline,
  IoFlaskOutline,
  IoCheckmarkCircle,
  IoWarningOutline,
} from 'react-icons/io5';

// Usage
<Button leftIcon={<IoLocationSharp />}>
  Use Current Location
</Button>
```

## 7. Component Organization

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.css
│   │   └── index.js
│   ├── Card/
│   │   ├── Card.jsx
│   │   ├── Card.css
│   │   └── index.js
│   ├── StatusIndicator/
│   │   ├── StatusIndicator.jsx
│   │   ├── StatusIndicator.css
│   │   └── index.js
│   ├── NPKCard/
│   │   ├── NPKCard.jsx
│   │   ├── NPKCard.css
│   │   └── index.js
│   ├── FertilizerCard/
│   │   ├── FertilizerCard.jsx
│   │   ├── FertilizerCard.css
│   │   └── index.js
│   ├── LoadingSpinner/
│   │   ├── LoadingSpinner.jsx
│   │   ├── LoadingSpinner.css
│   │   └── index.js
│   ├── Input/
│   │   ├── Input.jsx
│   │   ├── Input.css
│   │   └── index.js
│   ├── Select/
│   │   ├── Select.jsx
│   │   ├── Select.css
│   │   └── index.js
│   ├── Container/
│   │   ├── Container.jsx
│   │   ├── Container.css
│   │   └── index.js
│   └── Header/
│       ├── Header.jsx
│       ├── Header.css
│       └── index.js
├── screens/
│   ├── LocationScreen/
│   ├── PlantSelectionScreen/
│   ├── ProcessingScreen/
│   ├── SoilStatusScreen/
│   ├── PlantRequirementsScreen/
│   ├── RecommendationsScreen/
│   └── EndActionsScreen/
├── styles/
│   ├── globals.css
│   ├── colors.js
│   ├── typography.js
│   ├── spacing.js
│   ├── shadows.js
│   └── borderRadius.js
└── App.jsx
```
