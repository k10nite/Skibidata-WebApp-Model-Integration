# GSAP Components Quick Reference

## Import Statement
```jsx
import {
  SoilParticles,
  MagneticButton,
  ClayCard,
  TypewriterText,
  ProgressBarAnimated,
  StaggerReveal,
  ArrowPulse,
  DrillSpinner
} from './components';
```

---

## 1. SoilParticles
**Purpose**: Ambient falling particles for transitions

```jsx
<SoilParticles count={30} duration={10} color="#492828" />
```

**Key Props**: count, duration, color

---

## 2. MagneticButton
**Purpose**: Interactive button with mouse-follow effect

```jsx
<MagneticButton variant="primary" onClick={handleClick}>
  Start Analysis
</MagneticButton>
```

**Variants**: primary (green), secondary (outlined)

---

## 3. ClayCard
**Purpose**: Card with hover shimmer effect

```jsx
<ClayCard className="p-6" staggerReveal>
  <h3>Card Content</h3>
</ClayCard>
```

**Key Props**: staggerReveal (boolean)

---

## 4. TypewriterText
**Purpose**: Character-by-character text reveal

```jsx
<TypewriterText
  text="Analyzing soil..."
  duration={0.05}
  onComplete={() => console.log('Done')}
/>
```

**Key Props**: text, duration, onComplete

---

## 5. ProgressBarAnimated
**Purpose**: NPK soil status gauges

```jsx
<ProgressBarAnimated
  value={75}
  color="#84934A"
  label="Nitrogen (N)"
  unit="%"
/>
```

**Key Props**: value (0-100), color, label, unit

---

## 6. StaggerReveal
**Purpose**: Animate list items sequentially

```jsx
<StaggerReveal delay={0.1} direction="up">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</StaggerReveal>
```

**Directions**: up, down, left, right

---

## 7. ArrowPulse
**Purpose**: Show nutrient level transitions

```jsx
<ArrowPulse
  from="low"
  to="high"
  nutrient="Nitrogen"
/>
```

**Levels**: low (red), medium (gold), high (green)

---

## 8. DrillSpinner
**Purpose**: Processing/loading screen spinner

```jsx
<DrillSpinner size={100} speed={1.5} />
```

**Key Props**: size (pixels), speed (multiplier)

---

## Color System
```jsx
const colors = {
  riceGreen: '#84934A',   // Primary, high status
  clayDark: '#492828',    // Text, soil particles
  golden: '#DAA520',      // Medium status
  terracotta: '#CD5C5C',  // Low status, alert
  lightEarth: '#ECECEC',  // Background
  cardBg: '#FAF9F6',      // Card background
};
```

---

## Common Patterns

### Loading Screen
```jsx
<div className="min-h-screen flex items-center justify-center">
  <SoilParticles count={20} />
  <div className="z-10">
    <DrillSpinner size={120} />
    <TypewriterText text="Processing..." />
  </div>
</div>
```

### NPK Status Display
```jsx
<ClayCard className="p-6">
  <h3>Soil Nutrients</h3>
  <ProgressBarAnimated value={65} label="Nitrogen" color="#84934A" />
  <ProgressBarAnimated value={45} label="Phosphorus" color="#CD5C5C" />
  <ProgressBarAnimated value={80} label="Potassium" color="#84934A" />
</ClayCard>
```

### Recommendation Cards
```jsx
<StaggerReveal delay={0.15}>
  {recommendations.map(rec => (
    <ClayCard key={rec.id} className="p-6 mb-4">
      <h4>{rec.name}</h4>
      <ArrowPulse from={rec.current} to={rec.target} nutrient={rec.nutrient} />
    </ClayCard>
  ))}
</StaggerReveal>
```

### Call-to-Action
```jsx
<MagneticButton variant="primary" onClick={handleAnalyze}>
  Analyze My Soil
</MagneticButton>
```

---

## Mobile Considerations

All components are mobile-responsive. For small screens:

```jsx
// Reduce particle count
<SoilParticles count={15} />

// Smaller spinner
<DrillSpinner size={60} />

// Faster typewriter for mobile
<TypewriterText duration={0.03} />
```

---

## Accessibility

Components include:
- Proper ARIA attributes
- Semantic HTML
- Focus states preserved
- Screen reader friendly
- Reduced motion support (add CSS)

---

## Performance Tips

1. **Limit Particles**: Use 15-25 particles max
2. **Cleanup**: Components auto-cleanup GSAP animations
3. **Scope**: All animations scoped to container refs
4. **Stagger**: Use delay 0.1-0.2s for smooth reveals
5. **Mobile**: Reduce animation complexity on small screens

---

## File Locations

```
src/components/
├── SoilParticles.jsx
├── MagneticButton.jsx
├── ClayCard.jsx
├── TypewriterText.jsx
├── ProgressBarAnimated.jsx
├── StaggerReveal.jsx
├── ArrowPulse.jsx
├── DrillSpinner.jsx
└── index.js (exports all)
```

---

## Next Steps

1. Import components into your screens
2. Customize colors for NPK status
3. Adjust animation timings to preference
4. Test on mobile devices
5. Add reduced motion media queries if needed

For detailed examples, see: `GSAP_COMPONENTS_USAGE.md`
