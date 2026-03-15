# GSAP Components Visual Guide

Visual representation of how each component looks and behaves.

---

## 1. SoilParticles
```
┌────────────────────────────────────┐
│                                    │
│    •      •                  •     │
│                 •                  │
│         •                    •     │
│   •                •               │
│              •         •           │
│                                    │
│  [Falling soil particles]          │
│  [Rotating as they fall]           │
│  [Staggered animation]             │
│                                    │
└────────────────────────────────────┘
```
**Effect**: 20-30 small particles continuously falling with rotation
**Feel**: Ambient, organic, soil-like texture

---

## 2. MagneticButton
```
┌─────────────────────────────┐
│                             │
│   ╔═══════════════════╗     │
│   ║  START ANALYSIS  ║←─┐  │ (mouse cursor)
│   ╚═══════════════════╝  │  │
│          ↑               │  │
│          └───────────────┘  │
│   [Button follows mouse]    │
│   [Enhanced shadow]         │
│                             │
└─────────────────────────────┘
```
**Effect**: Button subtly follows mouse position (0.3x lag)
**Hover**: Scale 1.05, enhanced shadow
**Click**: Scale 0.98

---

## 3. ClayCard
```
┌─────────────────────────────┐
│  ┏━━━━━━━━━━━━━━━━━━━━━┓   │
│  ┃ [Earth Layer →→→]   ┃   │ (on hover)
│  ┃                     ┃   │
│  ┃  Card Content       ┃   │
│  ┃  • Nutrient Data    ┃   │
│  ┃  • Fertilizer Info  ┃   │
│  ┃                     ┃   │
│  ┗━━━━━━━━━━━━━━━━━━━━━┛   │
│     ↑ Lifts -4px            │
└─────────────────────────────┘
```
**Effect**: Green earth layer slides across (left to right)
**Hover**: Card lifts up 4px
**Duration**: 0.6s

---

## 4. TypewriterText
```
┌─────────────────────────────┐
│                             │
│  Analyzing so|              │
│               ↑              │
│          [Blinking cursor]  │
│                             │
│  (After 1s)                 │
│  Analyzing soil...          │
│                             │
└─────────────────────────────┘
```
**Effect**: Text appears character by character
**Speed**: 0.05s per character (default)
**Cursor**: Blinks at 0.5s interval, fades on completion

---

## 5. ProgressBarAnimated
```
┌─────────────────────────────┐
│ Nitrogen (N)           65%  │
│ ┌─────────────────────────┐ │
│ │█████████████░░░░░░░░░░░│ │
│ └─────────────────────────┘ │
│     ↑ [Shimmer effect →]    │
│                             │
│ Phosphorus (P)         45%  │
│ ┌─────────────────────────┐ │
│ │████████░░░░░░░░░░░░░░░░│ │
│ └─────────────────────────┘ │
│                             │
└─────────────────────────────┘
```
**Effect**: Bar animates from 0% to target over 1.5s
**Shimmer**: Infinite shine effect moving left to right
**Colors**: Dynamic based on status (red/gold/green)

---

## 6. StaggerReveal
```
┌─────────────────────────────┐
│                             │
│  [Item 1] ← Appears first   │
│      ↓ 0.1s delay           │
│  [Item 2] ← Then this       │
│      ↓ 0.1s delay           │
│  [Item 3] ← Then this       │
│      ↓ 0.1s delay           │
│  [Item 4] ← Finally this    │
│                             │
│  Each: opacity 0→1          │
│        translateY 20→0      │
│                             │
└─────────────────────────────┘
```
**Effect**: Children appear sequentially with delay
**Direction**: Up (default), down, left, or right
**Timing**: 0.6s per item, stagger delay customizable

---

## 7. ArrowPulse
```
┌─────────────────────────────┐
│                             │
│  ┌──────┐      ┌──────┐     │
│  │ LOW  │  →→  │ HIGH │     │
│  └──────┘      └──────┘     │
│   (Red)         (Green)     │
│                             │
│     ↑ Pulses 1→1.2→1        │
│     ↑ Moves ±10px           │
│     ↑ Color transitions     │
│                             │
│  Nitrogen                   │
│                             │
└─────────────────────────────┘
```
**Effect**: Arrow pulses and moves horizontally
**Colors**:
- LOW = #CD5C5C (red)
- MEDIUM = #DAA520 (gold)
- HIGH = #84934A (green)
**Animation**: Continuous loop

---

## 8. DrillSpinner
```
┌─────────────────────────────┐
│                             │
│        •    •    •          │
│      •   ┌───┐   •         │
│     •    │ ◉ │    •        │
│      •   └───┘   •         │
│        •    •    •          │
│          ↻ Rotates          │
│       • Dots pulse          │
│                             │
│   Analyzing soil...         │
│                             │
└─────────────────────────────┘
```
**Effect**: Circle rotates 360°, dots pulse in sequence
**Dots**: 8 dots around perimeter, pulsing with 0.2s stagger
**Speed**: Adjustable rotation speed
**Size**: Customizable (default 80px)

---

## Component Combinations

### Processing Screen Layout
```
┌─────────────────────────────────────┐
│ • • •  [SoilParticles] • • •        │
│                                     │
│           ┌───────┐                 │
│           │ ◉ ◉ ◉ │ [DrillSpinner]  │
│           └───────┘                 │
│                                     │
│      Analyzing so|                  │
│      [TypewriterText]               │
│                                     │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓      │
│  ┃ ✓ Step 1                  ┃      │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛      │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓      │
│  ┃ • Step 2 (in progress)    ┃      │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛      │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓      │
│  ┃   Step 3                  ┃      │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛      │
│  [StaggerReveal + ClayCards]        │
│                                     │
└─────────────────────────────────────┘
```

### Results Screen Layout
```
┌─────────────────────────────────────┐
│                                     │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓    │
│  ┃ NPK Nutrient Levels         ┃    │
│  ┃                             ┃    │
│  ┃ Nitrogen    [████████░] 65% ┃    │
│  ┃ Phosphorus  [█████░░░░] 45% ┃    │
│  ┃ Potassium   [█████████] 80% ┃    │
│  ┃                             ┃    │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛    │
│  [ClayCard + ProgressBars]          │
│                                     │
└─────────────────────────────────────┘
```

### Recommendations Screen
```
┌─────────────────────────────────────┐
│                                     │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓    │
│  ┃ Expected Improvements       ┃    │
│  ┃                             ┃    │
│  ┃  LOW →→ HIGH  (Nitrogen)    ┃    │
│  ┃  LOW →→ MED   (Phosphorus)  ┃    │
│  ┃  MED →→ HIGH  (Potassium)   ┃    │
│  ┃ [ArrowPulse x3]             ┃    │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛    │
│                                     │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓    │
│  ┃ ⭐ RECOMMENDED               ┃    │
│  ┃ Complete Fertilizer 14-14-14┃    │
│  ┃                             ┃    │
│  ┃ ╔═══════════════════════╗   ┃    │
│  ┃ ║ SELECT THIS FERTILIZER║   ┃    │
│  ┃ ╚═══════════════════════╝   ┃    │
│  ┃ [MagneticButton]            ┃    │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛    │
│  [StaggerReveal + ClayCards]        │
│                                     │
└─────────────────────────────────────┘
```

---

## Animation Timing Guide

```
Fast animations (instant feedback):
├─ MagneticButton scale: 0.1-0.3s
├─ ClayCard lift: 0.4s
└─ DrillSpinner rotation: 1.2s

Medium animations (content reveal):
├─ TypewriterText: 0.05s per char
├─ ProgressBar fill: 1.5s
├─ StaggerReveal: 0.6s per item
└─ ArrowPulse: 0.6s pulse cycle

Slow animations (ambient):
├─ SoilParticles: 8-12s fall duration
├─ Shimmer effect: 2s loop
└─ Color transitions: 1.5s
```

---

## Color Psychology

```
┌─────────────────────────────────────┐
│                                     │
│  #CD5C5C (Red Terracotta)           │
│  ████ LOW / NEEDS ATTENTION         │
│  → Used for deficient nutrients     │
│                                     │
│  #DAA520 (Golden Harvest)           │
│  ████ MEDIUM / MONITOR              │
│  → Used for moderate nutrients      │
│                                     │
│  #84934A (Rice Green)               │
│  ████ HIGH / OPTIMAL                │
│  → Used for sufficient nutrients    │
│                                     │
│  #492828 (Clay Dark)                │
│  ████ PRIMARY TEXT / SOIL PARTICLES │
│  → Used for text and particles      │
│                                     │
└─────────────────────────────────────┘
```

---

## Responsive Behavior

### Desktop (≥768px)
- Full particle count (25-30)
- Large spinner (100-120px)
- Normal stagger delays (0.15s)
- Multi-column layouts

### Mobile (<768px)
- Reduced particles (15-20)
- Smaller spinner (60-80px)
- Faster animations (0.1s stagger)
- Single column stack

```
Desktop:                  Mobile:
┌─────────────────┐      ┌──────────┐
│ ┌────┐ ┌────┐  │      │ ┌──────┐ │
│ │Card│ │Card│  │      │ │ Card │ │
│ └────┘ └────┘  │      │ └──────┘ │
│ ┌────┐ ┌────┐  │      │ ┌──────┐ │
│ │Card│ │Card│  │      │ │ Card │ │
│ └────┘ └────┘  │      │ └──────┘ │
└─────────────────┘      │ ┌──────┐ │
                         │ │ Card │ │
                         │ └──────┘ │
                         └──────────┘
```

---

## Accessibility Visual Indicators

```
Focus State:
┌─────────────────┐
│ ╔═══════════╗   │
│ ║ [FOCUSED] ║ ← 2px outline
│ ╚═══════════╝   │
└─────────────────┘

Disabled State:
┌─────────────────┐
│ ┌───────────┐   │
│ │ [DISABLED]│ ← 50% opacity
│ └───────────┘   │
└─────────────────┘

Loading State:
┌─────────────────┐
│     ◉ ◉ ◉       │
│   Analyzing...  │
└─────────────────┘
```

---

## Performance Visual

```
Animation FPS:
┌─────────────────────────────┐
│ 60fps ████████████████████  │ Target
│ 30fps ██████████            │ Minimum
│ 15fps █████                 │ Degraded
└─────────────────────────────┘

All components optimized for 60fps
Hardware-accelerated transforms used
```

---

## Component Size Reference

```
Component Sizes (Recommended):

SoilParticles:
• Particle: 2-4px diameter
• Count: 15-30 particles

MagneticButton:
• Height: 48-56px
• Padding: 32px horizontal
• Border radius: 2rem

ClayCard:
• Border radius: 2.5rem
• Padding: 24px
• Shadow: 0 8px 24px

TypewriterText:
• Font: Roboto Mono
• Cursor: 2px × 1.2em
• Size: Inherits from parent

ProgressBar:
• Height: 24px
• Border radius: 12px
• Label: 14px

DrillSpinner:
• Default: 80px
• Mobile: 60px
• Large: 100-120px

ArrowPulse:
• Arrow: 24-30px
• Labels: 12px
• Total width: ~200px

StaggerReveal:
• Item gap: 12-16px
• Stagger delay: 0.1-0.15s
```

---

This visual guide helps understand the appearance and behavior of each component at a glance.
