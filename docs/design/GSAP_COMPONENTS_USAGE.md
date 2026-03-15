# GSAP Animated Components - Usage Guide

## Overview

This document provides comprehensive usage examples for all 8 GSAP-powered reusable components created for the Filipino Fertilizer App with "Earthy Farm Tech" aesthetic.

All components follow the design system:
- **Rice Green**: `#84934A`
- **Clay Dark**: `#492828`
- **Golden Harvest**: `#DAA520`
- **Terracotta Red**: `#CD5C5C`

---

## 1. SoilParticles

Generates falling soil grain particles for ambient transitions.

### Props
- `count` (number): Number of particles (default: 25)
- `duration` (number): Fall duration in seconds (default: 8)
- `color` (string): Particle color (default: '#492828')

### Usage

```jsx
import { SoilParticles } from './components';

function WelcomeScreen() {
  return (
    <div className="relative min-h-screen">
      {/* Ambient particles */}
      <SoilParticles count={30} duration={10} />

      <div className="content">
        <h1>Welcome to Soil Analysis</h1>
      </div>
    </div>
  );
}
```

### Use Cases
- Screen transitions
- Loading backgrounds
- Ambient effects during processing

---

## 2. MagneticButton

Button with magnetic hover effect that follows mouse position.

### Props
- `children` (ReactNode): Button content
- `onClick` (function): Click handler
- `variant` (string): 'primary' | 'secondary' (default: 'primary')
- `className` (string): Additional CSS classes

### Usage

```jsx
import { MagneticButton } from './components';

function ActionButtons() {
  return (
    <div className="flex gap-4">
      <MagneticButton
        variant="primary"
        onClick={() => console.log('Analyze!')}
      >
        Start Analysis
      </MagneticButton>

      <MagneticButton
        variant="secondary"
        onClick={() => console.log('Cancel')}
      >
        Go Back
      </MagneticButton>
    </div>
  );
}
```

### Features
- Smooth magnetic follow with 0.3x lag
- Scale 1.05 on hover, 0.98 on click
- Enhanced soil shadow on hover
- Elastic ease-out on mouse leave

---

## 3. ClayCard

Card with clay-morph hover effect and earth layer slide.

### Props
- `children` (ReactNode): Card content
- `className` (string): Additional CSS classes
- `onClick` (function): Optional click handler
- `staggerReveal` (boolean): Enable mount animation (default: false)

### Usage

```jsx
import { ClayCard } from './components';

function SoilStatusCard({ nitrogen, phosphorus, potassium }) {
  return (
    <ClayCard className="p-6" staggerReveal>
      <h3 className="text-xl font-bold mb-4">NPK Status</h3>

      <div className="space-y-3">
        <div>Nitrogen: {nitrogen} ppm</div>
        <div>Phosphorus: {phosphorus} ppm</div>
        <div>Potassium: {potassium} ppm</div>
      </div>
    </ClayCard>
  );
}
```

### Features
- Earth layer slides across on hover (0.6s)
- Card lifts -4px on hover
- Optional stagger-reveal on mount
- Automatic cleanup on unmount

---

## 4. TypewriterText

Character-by-character text reveal with blinking cursor.

### Props
- `text` (string): Text to display
- `duration` (number): Duration per character in seconds (default: 0.05)
- `onComplete` (function): Callback when complete
- `className` (string): Additional CSS classes

### Usage

```jsx
import { TypewriterText } from './components';

function ProcessingScreen() {
  return (
    <div className="text-center">
      <TypewriterText
        text="Analyzing soil composition..."
        duration={0.08}
        onComplete={() => console.log('Typing done!')}
        className="text-2xl font-mono"
      />
    </div>
  );
}
```

### Features
- Blinking cursor animation (0.5s interval)
- Cursor fades out on completion
- Monospace font by default
- Timeline cleanup on unmount

---

## 5. ProgressBarAnimated

Horizontal progress bar with shimmer effect.

### Props
- `value` (number): Progress value 0-100
- `color` (string): Bar color (default: '#84934A')
- `label` (string): Optional label text
- `unit` (string): Optional unit (e.g., '%', 'ppm')
- `className` (string): Additional CSS classes

### Usage

```jsx
import { ProgressBarAnimated } from './components';

function NutrientGauges({ nitrogen, phosphorus, potassium }) {
  return (
    <div className="space-y-4">
      <ProgressBarAnimated
        value={nitrogen.percentage}
        color={nitrogen.status === 'low' ? '#CD5C5C' : '#84934A'}
        label="Nitrogen (N)"
        unit="%"
      />

      <ProgressBarAnimated
        value={phosphorus.percentage}
        color={phosphorus.status === 'low' ? '#CD5C5C' : '#84934A'}
        label="Phosphorus (P)"
        unit="%"
      />

      <ProgressBarAnimated
        value={potassium.percentage}
        color={potassium.status === 'low' ? '#CD5C5C' : '#84934A'}
        label="Potassium (K)"
        unit="%"
      />
    </div>
  );
}
```

### Features
- 1.5s ease-out animation
- Infinite shimmer effect (2s loop)
- Auto-clamps value to 0-100
- Displays label and value

---

## 6. StaggerReveal

Wrapper for stagger-revealing child elements.

### Props
- `children` (ReactNode): Elements to reveal
- `delay` (number): Stagger delay in seconds (default: 0.1)
- `direction` (string): 'up' | 'down' | 'left' | 'right' (default: 'up')
- `distance` (number): Movement distance in pixels (default: 20)
- `className` (string): Additional CSS classes

### Usage

```jsx
import { StaggerReveal, ClayCard } from './components';

function RecommendationList({ fertilizers }) {
  return (
    <StaggerReveal delay={0.15} direction="up">
      {fertilizers.map((fertilizer) => (
        <ClayCard key={fertilizer.id} className="p-6 mb-4">
          <h3>{fertilizer.name}</h3>
          <p>NPK: {fertilizer.npk}</p>
          <p>{fertilizer.dosage}</p>
        </ClayCard>
      ))}
    </StaggerReveal>
  );
}
```

### Features
- Animates opacity 0→1
- Moves from initial position to 0
- 0.6s power2.out easing
- Four directional options

---

## 7. ArrowPulse

Animated arrow showing nutrient level transitions.

### Props
- `from` (string): Starting level: 'low' | 'medium' | 'high'
- `to` (string): Target level: 'low' | 'medium' | 'high'
- `nutrient` (string): Nutrient name (optional)
- `className` (string): Additional CSS classes

### Usage

```jsx
import { ArrowPulse } from './components';

function NutrientTransition({ currentLevel, targetLevel }) {
  return (
    <div className="flex flex-col gap-4">
      <ArrowPulse
        from="low"
        to="high"
        nutrient="Nitrogen"
      />

      <ArrowPulse
        from="medium"
        to="high"
        nutrient="Phosphorus"
      />

      <ArrowPulse
        from="low"
        to="medium"
        nutrient="Potassium"
      />
    </div>
  );
}
```

### Features
- Color-coded by nutrient level:
  - Low: Red (#CD5C5C)
  - Medium: Golden (#DAA520)
  - High: Green (#84934A)
- Pulses scale 1→1.2→1 (0.6s)
- Horizontal translate ±10px
- Smooth color transition

---

## 8. DrillSpinner

Rotating soil drill loader with pulsing dots.

### Props
- `size` (number): Spinner size in pixels (default: 80)
- `speed` (number): Rotation speed multiplier (default: 1)
- `className` (string): Additional CSS classes

### Usage

```jsx
import { DrillSpinner, TypewriterText } from './components';

function ProcessingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <DrillSpinner size={120} speed={1.5} />

      <TypewriterText
        text="Drilling into soil data..."
        className="mt-8 text-lg"
      />
    </div>
  );
}
```

### Features
- Continuous 360° rotation
- 8 pulsing dots in sequence (0.2s stagger)
- Center icon indicator
- "Analyzing soil..." text below
- Adjustable size and speed

---

## Complete Example: Processing Screen

Here's how to combine multiple components:

```jsx
import {
  SoilParticles,
  DrillSpinner,
  TypewriterText,
  StaggerReveal,
  ClayCard
} from './components';

function ProcessingScreen({ steps, currentStep }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#ECECEC]">
      {/* Ambient particles */}
      <SoilParticles count={20} duration={12} />

      <div className="z-10 max-w-2xl mx-auto px-4">
        {/* Drill spinner */}
        <div className="flex justify-center mb-8">
          <DrillSpinner size={100} speed={1.2} />
        </div>

        {/* Typewriter status */}
        <TypewriterText
          text="Analyzing soil composition and nutrient levels..."
          duration={0.06}
          className="text-2xl text-center mb-12"
        />

        {/* Processing steps */}
        <StaggerReveal delay={0.2} direction="up">
          {steps.map((step, i) => (
            <ClayCard
              key={i}
              className={`p-4 mb-3 ${
                i === currentStep ? 'bg-[#E8F5E9]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i < currentStep ? 'bg-[#84934A] text-white' :
                  i === currentStep ? 'bg-[#DAA520] text-white' :
                  'bg-gray-300'
                }`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className="font-semibold">{step}</span>
              </div>
            </ClayCard>
          ))}
        </StaggerReveal>
      </div>
    </div>
  );
}

export default ProcessingScreen;
```

---

## Performance Notes

### GSAP Cleanup
All components use `useGSAP` hook with proper cleanup:
- Animations are killed on unmount
- Contexts are scoped to container refs
- No memory leaks

### Mobile Optimization
All components are mobile-responsive:
- Touch events supported
- Reduced motion respected (add via CSS)
- Scaled appropriately for small screens

### Accessibility
- `aria-hidden="true"` on decorative elements
- Semantic HTML structure
- Focus states preserved on interactive elements

---

## Design System Integration

### Color Usage
```jsx
// NPK Status colors
const statusColors = {
  low: '#CD5C5C',      // Red terracotta - needs attention
  medium: '#DAA520',   // Golden harvest - monitor
  high: '#84934A',     // Rice green - optimal
};

// Apply to components
<ProgressBarAnimated
  value={75}
  color={statusColors.high}
/>
```

### Typography
```jsx
// Use design system fonts
<TypewriterText
  text="Soil analysis complete"
  className="font-[var(--font-display)] text-3xl"
/>
```

### Spacing
```jsx
// Clay pot radii from design system
<ClayCard className="rounded-[2.5rem] p-6">
  {/* --radius-lg = 2.5rem */}
</ClayCard>
```

---

## Browser Compatibility

All components work on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

GSAP provides excellent cross-browser support for animations.

---

## Questions?

For additional customization or advanced usage, refer to:
- GSAP Documentation: https://greensock.com/docs/
- Design System: `design-system.md`
- Component Source: `src/components/`
