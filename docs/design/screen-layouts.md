# Screen Layouts - Visual Mockup Guide

## Screen Flow Overview

```
1. Location Selection
         ↓
2. Plant Selection
         ↓
3. Processing (Animated)
         ↓
4. Soil Status
         ↓
5. Plant Requirements
         ↓
6. Fertilizer Recommendations
         ↓
7. End Actions
```

---

## 1. Location Selection Screen

### Layout Structure

```
┌─────────────────────────────────────────────┐
│  Header: "Fertilizer Recommendation"        │ ← Primary Green
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [Screen Content]                           │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Select Your Location                  │ │ ← H1 (36px)
│  │                                         │ │
│  │  Help us provide accurate fertilizer   │ │ ← Body1 (16px)
│  │  recommendations for your area          │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │                                         │ │
│  │         [MAP COMPONENT]                 │ │ ← 400px height
│  │                                         │ │   Card elevated
│  │         Interactive Map View            │ │
│  │         with location marker            │ │
│  │                                         │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  📍 Use Current Location               │ │ ← Primary Button
│  └───────────────────────────────────────┘ │   48px height
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  🔍 Search Location                    │ │ ← Outline Button
│  └───────────────────────────────────────┘ │   48px height
│                                             │
└─────────────────────────────────────────────┘
```

### Color Distribution

- **60% Neutral**: Background (#FAFAFA), Map card (#FFFFFF)
- **30% Supporting**: Gray borders, secondary button
- **10% Accent**: Primary button background (#4CAF50)

---

## 2. Plant Selection Screen

### Layout Structure

```
┌─────────────────────────────────────────────┐
│  ← Back   Plant Selection                   │ ← Header
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [Screen Content]                           │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Choose Your Crop                      │ │ ← H1
│  │                                         │ │
│  │  Select the plant you want to grow     │ │ ← Body1
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  ┌─────────────────────────────────┐  │ │
│  │  │  Crop Type *                     │  │ │ ← Card elevated
│  │  │  ┌───────────────────────────┐  │  │ │   24px padding
│  │  │  │ Select crop type       ▼  │  │  │ │
│  │  │  └───────────────────────────┘  │  │ │ ← Select input
│  │  │                                  │  │ │
│  │  │  Crop Variety (Optional)         │  │ │
│  │  │  ┌───────────────────────────┐  │  │ │
│  │  │  │ Enter variety            │  │  │ │ ← Text input
│  │  │  └───────────────────────────┘  │  │ │
│  │  │                                  │  │ │
│  │  │  Location: Latitude 14.5°N       │  │ │ ← Body2
│  │  │             Longitude 121.0°E    │  │ │   Gray text
│  │  └─────────────────────────────────┘  │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  ℹ️  Crop Information                 │ │ ← Info Card
│  │                                         │ │   Outlined
│  │  Growing Season: 90-120 days           │ │   Gray-200 border
│  │  Climate: Tropical                     │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Continue                              │ │ ← Primary Button
│  └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

### Responsive Behavior

**Mobile (< 768px)**
- Full width inputs
- Stacked buttons
- 16px side padding

**Tablet/Desktop (≥ 768px)**
- Max width 800px centered
- 32px side padding
- Buttons can be inline if multiple

---

## 3. Processing Screen

### Layout Structure

```
┌─────────────────────────────────────────────┐
│  Processing                                 │ ← Header
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [Screen Content - Centered]               │
│                                             │
│              Analyzing Data                 │ ← H2
│                                             │
│              ┌─────────┐                    │
│              │         │                    │
│              │    🌱   │                    │ ← Spinner 64px
│              │         │                    │   Green (#4CAF50)
│              └─────────┘                    │   Rotating border
│                                             │
│              Please wait...                 │ ← Body2
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  ✓  Fetching soil data               │ │ ← Completed step
│  └───────────────────────────────────────┘ │   Green background
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  2  Analyzing nutrient levels        │ │ ← Active step
│  └───────────────────────────────────────┘ │   Light green bg
│                                             │   Box shadow
│  ┌───────────────────────────────────────┐ │
│  │  3  Matching plant requirements      │ │ ← Pending step
│  └───────────────────────────────────────┘ │   Gray background
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  4  Generating recommendations       │ │ ← Pending step
│  └───────────────────────────────────────┘ │   Gray background
│                                             │
└─────────────────────────────────────────────┘
```

### Animation Details

- Spinner: Continuous 360° rotation (1s duration)
- Active step: Subtle pulse animation
- Step completion: Checkmark fade-in with scale
- Progress: Steps fade between states (250ms)

---

## 4. Soil Status Screen

### Layout Structure

```
┌─────────────────────────────────────────────┐
│  ← Back   Soil Analysis                     │ ← Header
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [Screen Content]                           │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Soil Analysis Results                 │ │ ← H1
│  │  Based on data from Quezon City        │ │ ← Body2 (gray)
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Soil Nutrient Status                  │ │ ← Card H3
│  │  Current NPK levels in your soil       │ │
│  │  ────────────────────────────────────  │ │
│  │                                         │ │
│  │  ┌─────────────────────────────────┐  │ │ ← Desktop: 3 cols
│  │  │ ↓  NITROGEN (N)    │ → PHOSPHORUS (P) │ POTASSIUM (K) ↑ │
│  │  │    Low             │    Medium    │    High         │ │
│  │  │    45 ppm          │    125 ppm   │    250 ppm      │ │
│  │  │    [Red card]      │ [Yellow card]│    [Green card] │ │
│  │  └─────────────────────────────────┘  │ │ ← Mobile: stacked
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Soil pH Level                         │ │ ← Card H3
│  │  ────────────────────────────────────  │ │
│  │                                         │ │
│  │  pH: 6.8                               │ │
│  │  ┌─────────────────────────────────┐  │ │
│  │  │ ████████████████░░░░░░░░░░░░░░  │  │ │ ← Progress bar
│  │  └─────────────────────────────────┘  │ │   Green fill
│  │                                         │ │
│  │  Acidic (0-6.5) | Neutral (6.5-7.5) | Alkaline (7.5-14) │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  ℹ️  Understanding Your Results        │ │ ← Info card
│  │                                         │ │   Outlined
│  │  These values indicate the current     │ │   Blue tint
│  │  nutrient levels in your soil. We'll   │ │
│  │  recommend fertilizers to optimize     │ │
│  │  these levels for your selected crop.  │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Continue to Recommendations           │ │ ← Primary Button
│  └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

### Status Card Color Coding

**Low (Red)**
- Border-left: #F44336 (4px)
- Background: #FFEBEE
- Icon: Red down arrow
- Text: Dark red (#C62828)

**Medium (Yellow)**
- Border-left: #FFC107 (4px)
- Background: #FFF8E1
- Icon: Yellow horizontal arrow
- Text: Dark yellow (#FFA000)

**High (Green)**
- Border-left: #4CAF50 (4px)
- Background: #E8F5E9
- Icon: Green up arrow
- Text: Dark green (#388E3C)

---

## 5. Plant Requirements Screen

### Layout Structure

```
┌─────────────────────────────────────────────┐
│  ← Back   Plant Requirements                │ ← Header
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [Screen Content]                           │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Rice Nutrient Requirements            │ │ ← H1
│  │  Optimal levels for healthy growth     │ │ ← Body2
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Required NPK Levels                   │ │ ← Card H3
│  │  ────────────────────────────────────  │ │
│  │                                         │ │
│  │  ┌─────────────────────────────────┐  │ │
│  │  │  NITROGEN (N)                    │  │ │
│  │  │  Target: 120-150 ppm             │  │ │
│  │  │  ████████████████░░░░░░░░░░     │  │ │ ← Progress bar
│  │  │  Current: 45 ppm | Required: 120 ppm │ │
│  │  └─────────────────────────────────┘  │ │
│  │                                         │ │
│  │  ┌─────────────────────────────────┐  │ │
│  │  │  PHOSPHORUS (P)                  │  │ │
│  │  │  Target: 60-80 ppm               │  │ │
│  │  │  ██████████████████████████████ │  │ │ ← Full progress
│  │  │  Current: 125 ppm | Within range │  │ │   Green
│  │  └─────────────────────────────────┘  │ │
│  │                                         │ │
│  │  ┌─────────────────────────────────┐  │ │
│  │  │  POTASSIUM (K)                   │  │ │
│  │  │  Target: 150-200 ppm             │  │ │
│  │  │  ██████████████████████████████ │  │ │ ← Full progress
│  │  │  Current: 250 ppm | Excessive    │  │ │   Yellow/Orange
│  │  └─────────────────────────────────┘  │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Growth Stage Requirements             │ │ ← Card H4
│  │                                         │ │
│  │  ┌─────────┬──────────┬───────────┐   │ │ ← Table
│  │  │ Stage   │ Duration │ Key Needs │   │ │   Striped rows
│  │  ├─────────┼──────────┼───────────┤   │ │
│  │  │Vegetative│ 40 days │ High N    │   │ │
│  │  │Flowering │ 30 days │ High P, K │   │ │
│  │  │Ripening  │ 20 days │ Low N     │   │ │
│  │  └─────────┴──────────┴───────────┘   │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  View Recommendations                  │ │ ← Primary Button
│  └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

### Progress Indicator Logic

- **Below target**: Red/Yellow fill, shows deficit
- **Within range**: Green fill, "Optimal" label
- **Above target**: Yellow/Orange fill, "Excessive" warning

---

## 6. Fertilizer Recommendations Screen

### Layout Structure

```
┌─────────────────────────────────────────────┐
│  ← Back   Recommendations                   │ ← Header
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [Screen Content]                           │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Fertilizer Recommendations            │ │ ← H1
│  │  Based on your soil analysis           │ │ ← Body2
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  ⭐ RECOMMENDED                        │ │ ← Badge (top-right)
│  │  ────────────────────────────────────  │ │
│  │  Complete NPK Fertilizer 14-14-14      │ │ ← H3
│  │  NPK Ratio: 14-14-14                   │ │ ← Body1 monospace
│  │                                         │ │   Green accent
│  │  Balanced formula providing nitrogen,  │ │
│  │  phosphorus, and potassium. Ideal for  │ │ ← Body2
│  │  rice vegetative stage.                │ │
│  │                                         │ │
│  │  Dosage: 2-3 bags per hectare          │ │
│  │  Frequency: Every 2 weeks              │ │ ← Detail grid
│  │  Est. Price: ₱850-950 per bag          │ │
│  │                                         │ │
│  │  ┌───────────────────────────────────┐ │ │
│  │  │  Select This Fertilizer            │ │ │ ← Primary Button
│  │  └───────────────────────────────────┘ │ │
│  └───────────────────────────────────────┘ │ ← Card with green
│                                             │   border (2px)
│  ┌───────────────────────────────────────┐ │   Light green bg
│  │  Urea (46-0-0)                         │ │
│  │  NPK Ratio: 46-0-0                     │ │
│  │                                         │ │
│  │  High nitrogen fertilizer for boosting│ │ ← Regular card
│  │  vegetative growth and leaf development│ │   White bg
│  │                                         │ │
│  │  Dosage: 1-2 bags per hectare          │ │
│  │  Frequency: Monthly                    │ │
│  │  Est. Price: ₱650-750 per bag          │ │
│  │                                         │ │
│  │  ┌───────────────────────────────────┐ │ │
│  │  │  Select This Fertilizer            │ │ │ ← Outline Button
│  │  └───────────────────────────────────┘ │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Muriate of Potash (0-0-60)            │ │
│  │  NPK Ratio: 0-0-60                     │ │
│  │                                         │ │
│  │  High potassium fertilizer for grain   │ │ ← Regular card
│  │  filling and disease resistance         │ │
│  │                                         │ │
│  │  Dosage: 1 bag per hectare             │ │
│  │  Frequency: Flowering stage            │ │
│  │  Est. Price: ₱550-650 per bag          │ │
│  │                                         │ │
│  │  ┌───────────────────────────────────┐ │ │
│  │  │  Select This Fertilizer            │ │ │ ← Outline Button
│  │  └───────────────────────────────────┘ │ │
│  └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

### Card Hierarchy

**Recommended Card (Top)**
- 2px green border (#4CAF50)
- Light green background gradient
- Star badge (absolute positioned)
- Primary button (green)
- Elevated shadow (md)

**Alternative Cards**
- 1px gray border
- White background
- Outline button (green border)
- Base shadow

**Responsive Grid**
- Mobile: 1 column
- Tablet: 1 column (cards wider)
- Desktop: 2 columns (if space allows)

---

## 7. End Actions Screen

### Layout Structure

```
┌─────────────────────────────────────────────┐
│  ← Back   Next Steps                        │ ← Header
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [Screen Content]                           │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Recommendation Complete!               │ │ ← H1
│  │  Here's what you can do next           │ │ ← Body2
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  ✅  Your Selection                    │ │ ← Card H4
│  │  ────────────────────────────────────  │ │   Green accent
│  │                                         │ │
│  │  Complete NPK Fertilizer 14-14-14      │ │ ← H5
│  │                                         │ │
│  │  Application Schedule:                 │ │ ← Body2
│  │  • Apply 2-3 bags per hectare          │ │   Bulleted list
│  │  • Repeat every 2 weeks                │ │
│  │  • Continue for 8 weeks                │ │
│  │                                         │ │
│  │  Total Estimate: ₱5,100-5,700          │ │ ← Body1 bold
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  📥  Download Report                   │ │ ← Primary Button
│  └───────────────────────────────────────┘ │   48px height
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  📧  Email Recommendations             │ │ ← Outline Button
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  📱  Save to My Account                │ │ ← Outline Button
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  🔄  Start New Recommendation          │ │ ← Secondary Button
│  └───────────────────────────────────────┘ │   Gray background
│                                             │
│  ────────────────────────────────────────  │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  Need Help?                            │ │ ← Info card
│  │                                         │ │   Outlined
│  │  Contact our agricultural experts:     │ │   Blue tint
│  │  📞 (02) 1234-5678                     │ │
│  │  📧 support@fertireco.ph               │ │
│  └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

### Action Button Hierarchy

1. **Primary (Download)**: Most important action
   - Green background
   - White text
   - Icon on left

2. **Secondary (Email, Save)**: Alternative actions
   - White background
   - Green border
   - Green text
   - Icons on left

3. **Tertiary (Start Over)**: Reset action
   - Gray background
   - Dark gray text
   - Icon on left

---

## Mobile Responsive Patterns

### Breakpoint Strategy

**Mobile (< 768px)**

```
┌─────────────────────┐
│ Full Width Layout   │
│ 16px side padding   │
│ Stack all elements  │
│ Full-width buttons  │
│ Single column cards │
└─────────────────────┘
```

**Tablet (768px - 1024px)**

```
┌───────────────────────────┐
│  Centered Layout          │
│  Max-width: 768px         │
│  24px side padding        │
│  2-column cards (if fits) │
└───────────────────────────┘
```

**Desktop (≥ 1024px)**

```
┌─────────────────────────────────┐
│    Centered Layout              │
│    Max-width: 1024px            │
│    32px side padding            │
│    Multi-column cards           │
│    Inline button groups         │
└─────────────────────────────────┘
```

### Touch Target Sizes

All interactive elements maintain minimum 40px height:
- Buttons: 40px (md), 48px (lg)
- Input fields: 40px
- Selects: 40px
- Touch cards: Minimum 48px height

---

## Accessibility Features

### Visual Indicators

1. **Focus States**
   ```
   ┌────────────────────────┐
   │  Focused Button        │ ← 2px green outline
   └────────────────────────┘   2px offset
   ```

2. **Status Colors**
   ```
   ┌──────────────┐
   │ ↓ LOW        │ ← Icon + Color + Text
   │ Red indicator│   Triple redundancy
   └──────────────┘
   ```

3. **Error States**
   ```
   ┌──────────────────┐
   │ Invalid input    │ ← Red border
   └──────────────────┘
   ⚠️ Error message     ← Icon + Text
   ```

### Screen Reader Support

- Semantic headings (H1→H6)
- Alt text on all images
- ARIA labels on icons
- Form labels properly associated
- Status announcements for loading states

---

## Animation Specifications

### Page Transitions

```css
/* Fade In */
opacity: 0 → 1
duration: 250ms
timing: ease-in

/* Slide Up */
transform: translateY(20px) → translateY(0)
opacity: 0 → 1
duration: 350ms
timing: ease-out
```

### Component Animations

```css
/* Button Hover */
transform: translateY(-1px)
box-shadow: sm → md
duration: 150ms

/* Card Hover */
transform: translateY(-2px)
box-shadow: base → md
duration: 250ms

/* Loading Spinner */
transform: rotate(360deg)
duration: 1000ms
timing: linear
iteration: infinite
```

### Micro-interactions

```css
/* Status Badge Appear */
scale: 0.8 → 1
opacity: 0 → 1
duration: 200ms
timing: ease-out

/* Checkmark Complete */
scale: 0 → 1.2 → 1
duration: 400ms
timing: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

---

## Dark Mode Considerations (Future)

### Color Adaptations

```
Light Mode         →  Dark Mode
──────────────────────────────────
#FAFAFA (bg)      →  #121212
#FFFFFF (paper)   →  #1E1E1E
#212121 (text)    →  #FFFFFF
#4CAF50 (primary) →  #66BB6A (lighter)
#F44336 (error)   →  #EF5350 (lighter)
```

### Implementation

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background-default: #121212;
    --color-background-paper: #1E1E1E;
    --color-text-primary: rgba(255, 255, 255, 0.87);
    --color-primary-main: #66BB6A;
  }
}
```

---

## Print Styles (for PDF Export)

### Layout Adjustments

```css
@media print {
  /* Remove interactive elements */
  header, button { display: none; }

  /* Optimize for A4 */
  @page { size: A4; margin: 2cm; }

  /* Prevent page breaks in cards */
  .card { page-break-inside: avoid; }

  /* Use print-friendly colors */
  .status-card { border: 2px solid #000; }
}
```

---

## Performance Optimization

### Image Loading

```jsx
<img
  src="map-thumbnail.jpg"
  loading="lazy"
  alt="Location map"
/>
```

### Code Splitting

```jsx
const RecommendationsScreen = lazy(() =>
  import('./screens/RecommendationsScreen')
);
```

### CSS Optimization

```css
/* Use containment for independent cards */
.card {
  contain: layout style paint;
}

/* Hardware acceleration for animations */
.loading-spinner {
  transform: translateZ(0);
  will-change: transform;
}
```

---

This completes the visual mockup guide with detailed layouts for all 7 screens!
