# Premium Design System - Visual Reference

## Quick Visual Guide for Apple/Airbnb-Inspired Filipino Fertilizer App

This is a visual reference showing how to implement the premium design system with real examples.

---

## Color Palette Visual Reference

### Primary Colors
```
████████  #000000  Pure Black     → Primary text, buttons
████████  #6B7280  Gray-500       → Secondary text, labels
████████  #10B981  Emerald-500    → Success, growth, CTAs
████████  #FFFFFF  Pure White     → Backgrounds
████████  #F9FAFB  Gray-50        → Cards, surfaces
████████  #E5E7EB  Gray-200       → Borders, dividers
```

### Chart Colors
```
████████  #3B82F6  Blue           → Nitrogen data
████████  #F59E0B  Amber          → Phosphorus data
████████  #EF4444  Red            → Warnings, potassium
████████  #10B981  Green          → Success, growth
████████  #8B5CF6  Purple         → Additional data
████████  #EC4899  Pink           → Additional data
```

---

## Typography Scale Visual

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Pagsusuri ng Lupa                     ← H1: 56px, Bold    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                                                     │
│  Resulta ng Soil Analysis       ← H2: 40px, Bold   │
│                                                     │
└─────────────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  NPK Levels                 ← H3: 30px, Semibold
└────────────────────────────────────────────┘

┌──────────────────────────────────┐
│  Nitrogen Status  ← H4: 24px, Semibold
└──────────────────────────────────┘

Ang iyong lupa ay nangangailangan ng karagdagang   ← Body Large: 18px
nitrogen para sa optimal growth.

Inirerekemenda ang 14-14-14 complete fertilizer.   ← Body: 16px

Based on analysis from January 2024                 ← Body Small: 14px

CAR Region • Benguet Province                       ← Caption: 12px
```

---

## Component Visual Examples

### 1. Premium Cards

```
┌────────────────────────────────────────────────────┐
│                                                    │
│  Nitrogen Level                   [Leaf Icon]     │
│                                                    │
│          45.2                                      │
│                                                    │
│  ppm - Optimal Range                              │
│                                                    │
│  +5.2% this month                                 │
│                                                    │
└────────────────────────────────────────────────────┘
     ↑ Metric Card (white bg, subtle shadow)
```

```
╔════════════════════════════════════════════════════╗
║                                                    ║
║  Rekomendasyon ng Fertilizer                      ║
║                                                    ║
║  ┌─────────────────────────────────────────────┐  ║
║  │ ℹ️  Paalala: Batay sa soil analysis...     │  ║
║  └─────────────────────────────────────────────┘  ║
║                                                    ║
║  14-14-14 Complete              [Recommended]     ║
║  Dami: 2.5 sako                                   ║
║  Presyo: ₱1,245.00                                ║
║                                                    ║
║  [        Bumili sa Tindahan        ]             ║
║                                                    ║
╚════════════════════════════════════════════════════╝
     ↑ Elevated Card (larger shadow, more visual weight)
```

### 2. Buttons

```
┌──────────────────────────────────┐
│  Simulan ang Pagsusuri      →   │  ← Primary (Black bg, White text)
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  ✓  I-save ang Resulta           │  ← Success (Green bg, White text)
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  Tignan ang Detalye              │  ← Secondary (Gray bg, Black text)
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  Kanselahin                      │  ← Ghost (Border only, transparent)
└──────────────────────────────────┘
```

### 3. Badges

```
[ ✓ Optimal ]      ← Success (Green)
[ ⚠ Moderate ]     ← Warning (Amber)
[ ✗ Low Level ]    ← Error (Red)
[ ℹ Pending ]      ← Neutral (Gray)
```

### 4. Progress Bars

```
Nitrogen (N)                                      85%
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░

Phosphorus (P)                                    45%
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░

Potassium (K)                                     92%
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░
```

### 5. Alerts

```
┌──────────────────────────────────────────────────────┐
│ ✓ Tagumpay! Ang iyong pagsusuri ay natapos na.     │  ← Success Alert
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ ⚠ Babala: Mababa ang nitrogen level.               │  ← Warning Alert
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ ✗ Error: Hindi makonekta sa server.                │  ← Error Alert
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ ℹ Paalala: Best time para mag-apply ay bago umulan.│  ← Info Alert
└──────────────────────────────────────────────────────┘
```

---

## Layout Patterns Visual

### Dashboard Grid Layout

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  Maligayang Pagdating, Juan 👋        [ Bumili ng Fertilizer ]  │
│  📍 Benguet Province, CAR Region                                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐  ┌──────────────────┐
│ 🌾                  │  │ 📈                  │  │ 📦               │
│                     │  │                     │  │                  │
│      2.5            │  │     45.2            │  │   ₱12,450        │
│                     │  │                     │  │                  │
│ Total Sakahan       │  │ Nitrogen Level      │  │ Gastos           │
│                     │  │                     │  │                  │
│ +0.5 ha this year   │  │ +5.2% this month    │  │ -8.3% vs last Q  │
│                     │  │                     │  │                  │
└─────────────────────┘  └─────────────────────┘  └──────────────────┘

┌────────────────────────────────┐  ┌──────────────────────────────┐
│                                │  │                              │
│  NPK Trend - 6 Months          │  │  Pinakabagong Rekomendasyon │
│                                │  │                              │
│  ╱╲                            │  │  14-14-14 Complete           │
│ ╱  ╲    ╱╲                     │  │  ₱1,245.00 | 2.5 sako       │
│      ╲ ╱  ╲                    │  │  [Recommended]               │
│           ╲                    │  │                              │
│                                │  │  Urea 46-0-0                 │
│ — Nitrogen                     │  │  ₱890.00 | 1 sako           │
│ — Phosphorus                   │  │  [Optional]                  │
│ — Potassium                    │  │                              │
│                                │  │  [ Tingnan ang Lahat → ]    │
│                                │  │                              │
└────────────────────────────────┘  └──────────────────────────────┘
```

### Form Layout

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Sample Form                                         │
│                                                      │
│  Pangalan ng Sakahan                                │
│  ┌────────────────────────────────────────────────┐ │
│  │ Halimbawa: Rice Field A                       │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  Probinsya                                          │
│  ┌────────────────────────────────────────────────┐ │
│  │ Piliin ang probinsya...                    ▼  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  Laki ng Lupa                                       │
│  ┌────────────────────────────────────────────────┐ │
│  │ Hectares                                      │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌──────────────────────┐  ┌─────────────────────┐ │
│  │     I-save          │  │    Kanselahin       │ │
│  └──────────────────────┘  └─────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Data Table Visual

```
┌─────────────────────────────────────────────────────────────────────┐
│ NUTRIENT       │ CURRENT LEVEL │ OPTIMAL RANGE │ STATUS            │
├─────────────────────────────────────────────────────────────────────┤
│ Nitrogen (N)   │ 45.2 ppm      │ 40-60 ppm     │ [✓ Optimal]      │
│ Phosphorus (P) │ 24.0 ppm      │ 20-40 ppm     │ [✓ Optimal]      │
│ Potassium (K)  │ 98.5 ppm      │ 80-120 ppm    │ [✓ Optimal]      │
│ pH Level       │ 6.5           │ 6.0-7.0       │ [✓ Optimal]      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Chart Styling Visual

```
NPK Trend - 6 Months
┌───────────────────────────────────────────────────────────┐
│                                                           │
│ 100 ┤                                          ○          │
│  90 ┤                                    ○                │
│  80 ┤                              ○                      │
│  70 ┤                        ○                            │
│  60 ┤                  ○                                  │
│  50 ┤            ○                                        │
│  40 ┤      ○                                              │
│  30 ┤ ○                                                   │
│     └───────────────────────────────────────────────────  │
│       Jan   Feb   Mar   Apr   May   Jun                  │
│                                                           │
│  — Nitrogen (Blue)                                       │
│  — Phosphorus (Amber)                                    │
│  — Potassium (Green)                                     │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**Chart Properties:**
- Grid: Light gray (#E5E7EB)
- Axis: Gray text (#6B7280)
- Lines: 2px stroke width
- Dots: 4px radius
- Tooltip: White bg, rounded corners, subtle shadow

---

## Weather Widget Visual

```
╔═══════════════════════════════════════════════════╗
║                                                   ║
║  Panahon Ngayon                                  ║
║                                                   ║
║      ☁️          24°C                            ║
║                  Partly Cloudy                    ║
║                                                   ║
║  ┌───────────┐  ┌───────────┐  ┌───────────┐   ║
║  │     💧    │  │     💨    │  │     ☁️    │   ║
║  │ Humidity  │  │   Wind    │  │   Rain    │   ║
║  │   75%     │  │  12 km/h  │  │   40%     │   ║
║  └───────────┘  └───────────┘  └───────────┘   ║
║                                                   ║
║  📍 Benguet, CAR Region                          ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
     ↑ Glass Card Effect (backdrop blur)
```

---

## Spacing Visual Guide

```
Component Padding Examples:

┌─── 4px ────┐
│  xs        │
└────────────┘

┌──── 8px ─────┐
│  sm          │
└──────────────┘

┌────── 16px ────────┐
│  md                │
└────────────────────┘

┌────────── 24px ──────────────┐
│  lg (Minimum card padding)   │
└──────────────────────────────┘

┌────────────── 32px ──────────────────┐
│  xl (Premium card padding)           │
└──────────────────────────────────────┘

┌──────────────────── 48px ──────────────────────────┐
│  2xl (Section spacing)                             │
└────────────────────────────────────────────────────┘
```

---

## Shadow Depth Visual

```
Shadow sm (Subtle - Basic cards)
┌────────────────┐
│   Content      │
└────────────────┘
  ░ (very light)

Shadow md (Standard hover)
┌────────────────┐
│   Content      │
└────────────────┘
  ░░ (light)

Shadow lg (Elevated cards)
┌────────────────┐
│   Content      │
└────────────────┘
  ░░░ (medium)

Shadow xl (Modals, overlays)
┌────────────────┐
│   Content      │
└────────────────┘
  ░░░░ (prominent)
```

---

## Border Radius Visual

```
sm (8px) - Buttons, badges
┌──────────┐
│          │
└──────────┘

md (12px) - Inputs, small cards
┌───────────┐
│           │
└───────────┘

lg (16px) - Cards
┌────────────┐
│            │
└────────────┘

xl (24px) - Large cards
┌─────────────┐
│             │
└─────────────┘

full (9999px) - Pills
┌──────────────┐
│              │
└──────────────┘
```

---

## Responsive Breakpoints Visual

```
Mobile (< 768px)
┌─────────────────────┐
│                     │
│   Single Column     │
│                     │
│  ┌───────────────┐  │
│  │   Card        │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │   Card        │  │
│  └───────────────┘  │
│                     │
└─────────────────────┘

Tablet (768px - 1024px)
┌────────────────────────────────────┐
│                                    │
│        Two Columns                 │
│                                    │
│  ┌──────────────┐  ┌──────────────┐│
│  │   Card       │  │   Card       ││
│  └──────────────┘  └──────────────┘│
│                                    │
└────────────────────────────────────┘

Desktop (> 1024px)
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              Three or Four Columns                      │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │  Card    │  │  Card    │  │  Card    │  │  Card   ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Filipino Context Integration Visual

### Bilingual Status Display
```
┌──────────────────────────────────────┐
│                                      │
│  Nitrogen Level: 45.2 ppm           │
│  Antas ng Nitrogen: 45.2 ppm        │
│                                      │
│  [✓ Optimal] Mataas - High          │
│                                      │
└──────────────────────────────────────┘
```

### Location Information
```
📍 Benguet Province, CAR Region
   Altitude: 1,400 MASL
   Rice Terraces • Rainy Season Ready
```

### Price Display
```
┌───────────────────────────────────┐
│  14-14-14 Complete Fertilizer    │
│                                   │
│  Dami: 2.5 sako (bags)           │
│  Presyo: ₱1,245.00               │
│                                   │
│  [ Bumili sa Tindahan ]          │
└───────────────────────────────────┘
```

---

## Complete Screen Example Visual

```
╔════════════════════════════════════════════════════════════════════╗
║ 🌾 AgriTech PH   Dashboard  Pagsusuri  Rekomendasyon  [ Bumili ] ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Maligayang Pagdating, Juan 👋         [ Simulan ang Pagsusuri ]  ║
║  📍 Benguet Province, CAR Region  [Active Farm]                   ║
║                                                                    ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           ║
║  │ 🌾           │  │ 📈           │  │ 📦           │           ║
║  │              │  │              │  │              │           ║
║  │    2.5       │  │    45.2      │  │  ₱12,450     │           ║
║  │              │  │              │  │              │           ║
║  │ Sakahan      │  │ Nitrogen     │  │ Gastos       │           ║
║  │ +0.5 ha      │  │ +5.2%        │  │ -8.3%        │           ║
║  └──────────────┘  └──────────────┘  └──────────────┘           ║
║                                                                    ║
║  ┌─────────────────────────────┐  ┌─────────────────────────────┐║
║  │                             │  │                             │║
║  │  NPK Trend - 6 Months       │  │  Pinakabagong               │║
║  │                             │  │  Rekomendasyon              │║
║  │       ╱╲                    │  │                             │║
║  │      ╱  ╲                   │  │  14-14-14 Complete          │║
║  │     ╱    ╲                  │  │  ₱1,245.00                  │║
║  │    ╱      ╲                 │  │  [Recommended]              │║
║  │                             │  │                             │║
║  │  — N — P — K                │  │  [ Tingnan ang Lahat → ]   │║
║  │                             │  │                             │║
║  └─────────────────────────────┘  └─────────────────────────────┘║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │ Nutrient    │ Level    │ Range      │ Status               │ ║
║  ├──────────────────────────────────────────────────────────────┤ ║
║  │ Nitrogen    │ 45.2 ppm │ 40-60 ppm  │ [✓ Optimal]         │ ║
║  │ Phosphorus  │ 24.0 ppm │ 20-40 ppm  │ [✓ Optimal]         │ ║
║  │ Potassium   │ 98.5 ppm │ 80-120 ppm │ [✓ Optimal]         │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

---

## Implementation Checklist

Use this checklist when implementing the design system:

**Initial Setup:**
- [ ] `npm install` to get new dependencies
- [ ] Import `premium.css` in `main.jsx`
- [ ] Test `/showcase` route works

**Component Migration:**
- [ ] Replace `.clay-card` with `.premium-card`
- [ ] Update button classes to `.btn-premium btn-*`
- [ ] Change typography to use new hierarchy
- [ ] Update colors to use premium palette
- [ ] Apply new spacing system

**Chart Integration:**
- [ ] Import Recharts components
- [ ] Apply premium styling to charts
- [ ] Use premium chart colors
- [ ] Add proper tooltips

**Testing:**
- [ ] Test responsive behavior
- [ ] Verify Filipino labels display correctly
- [ ] Check hover states work
- [ ] Validate data formatting (₱, numbers)
- [ ] Test on mobile devices

---

## Quick Reference Card

**Most Used Classes:**
```
Cards:       premium-card, premium-card-elevated
Buttons:     btn-premium btn-primary
Metrics:     metric-card, metric-value, metric-label
Typography:  text-5xl font-bold tracking-tighter
Spacing:     gap-lg, p-xl, mb-2xl
Badges:      badge-premium badge-success
Tables:      table-premium
```

**Most Used Colors:**
```
Text:        text-premium-black, text-gray-500
Background:  bg-white, bg-gray-50
Accent:      bg-emerald-500, text-emerald-500
Charts:      #3B82F6, #F59E0B, #EF4444, #10B981
```

This visual reference should help you quickly implement the premium design system across your app!
