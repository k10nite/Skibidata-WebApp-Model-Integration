# Premium Design System - Implementation Guide

## Apple/Airbnb-Inspired Filipino Fertilizer Recommendation App

This guide explains how to use the premium design system to create a sophisticated, professional SaaS application.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Component Examples](#component-examples)
5. [Layout Patterns](#layout-patterns)
6. [Chart Integration](#chart-integration)
7. [Filipino Context Integration](#filipino-context-integration)

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

The new dependencies include:
- `recharts` - Modern charting library (already installed, updated to latest)
- `chart.js` & `react-chartjs-2` - Alternative charting library
- `date-fns` - Date formatting utilities

### 2. Import the Premium Stylesheet

In your `src/main.jsx`, import the premium stylesheet:

```javascript
// Replace or add alongside existing styles
import './styles/premium.css'
```

### 3. Use Tailwind Classes

The premium Tailwind config is already active. Use the new premium classes throughout your components.

---

## Color System

### Primary Colors

```jsx
// Pure Black Text (Primary)
<h1 className="text-premium-black">Pagsusuri ng Lupa</h1>

// Gray Secondary Text
<p className="text-gray-500">Detalye ng iyong sakahan</p>

// Emerald Accent (Growth/Success)
<button className="bg-emerald-500 text-white">Magpatuloy</button>
```

### Chart Colors

```jsx
const chartColors = {
  nitrogen: '#3B82F6',  // Blue
  phosphorus: '#F59E0B', // Amber
  potassium: '#EF4444',  // Red
  overall: '#10B981'     // Green
}
```

### Semantic Colors

```jsx
// Success State
<div className="bg-success text-white">Natagumpay!</div>

// Warning State
<div className="bg-warning text-white">Babala</div>

// Error State
<div className="bg-error text-white">May Mali</div>
```

---

## Typography

### Headings

```jsx
// Main Page Title - Bold, Tight Tracking
<h1 className="text-5xl font-bold tracking-tighter text-premium-black">
  Fertilizer Recommendation
</h1>

// Section Title
<h2 className="text-3xl font-bold tracking-tight text-premium-black">
  Resulta ng Pagsusuri
</h2>

// Card Title
<h3 className="text-xl font-semibold tracking-tight text-premium-black">
  NPK Levels
</h3>
```

### Body Text

```jsx
// Large Body Text
<p className="text-body-lg">
  Ang iyong lupa ay nangangailangan ng karagdagang nitrogen.
</p>

// Regular Body Text
<p className="text-body">
  Inirerekemenda ang 14-14-14 compound fertilizer.
</p>

// Small Text
<p className="text-body-sm">
  Batay sa pagsusuri noong Enero 2024
</p>

// Caption
<span className="text-caption">
  CAR Region, Benguet Province
</span>
```

### Data/Numbers (Tabular)

```jsx
// Use for aligned numbers
<span className="text-data text-2xl font-semibold">
  ₱1,245.00
</span>

// Or with Tailwind utility
<div className="font-feature-tabular text-3xl font-bold">
  45.2kg
</div>
```

---

## Component Examples

### Premium Cards

```jsx
// Basic Premium Card
<div className="premium-card">
  <h3 className="text-xl font-semibold mb-4">Nitrogen Level</h3>
  <p className="text-gray-500">Mababa ang antas</p>
</div>

// Elevated Card (more shadow)
<div className="premium-card-elevated">
  <h3 className="text-xl font-semibold mb-4">Rekomendasyon</h3>
  <p className="text-gray-500">14-14-14 Complete Fertilizer</p>
</div>

// Surface Card (gray background)
<div className="premium-card-surface">
  <p className="text-sm text-gray-600">Additional information</p>
</div>

// Glass Card (modern blur effect)
<div className="premium-card-glass">
  <h3 className="text-xl font-semibold mb-4">Weather Today</h3>
  <p className="text-gray-500">Partly Cloudy</p>
</div>
```

### Premium Buttons

```jsx
// Primary Button (Black)
<button className="btn-premium btn-primary">
  Simulan ang Pagsusuri
</button>

// Success Button (Green)
<button className="btn-premium btn-success">
  I-save ang Resulta
</button>

// Secondary Button
<button className="btn-premium btn-secondary">
  Tignan ang Detalye
</button>

// Ghost Button
<button className="btn-premium btn-ghost">
  Kanselahin
</button>

// Small Button
<button className="btn-premium btn-primary btn-sm">
  Baguhin
</button>

// Large Button
<button className="btn-premium btn-success btn-lg">
  Bumili Ngayon
</button>

// With Icon (using lucide-react)
import { ArrowRight } from 'lucide-react'

<button className="btn-premium btn-primary">
  Magpatuloy
  <ArrowRight size={20} />
</button>
```

### Premium Inputs

```jsx
// Text Input
<input
  type="text"
  className="input-premium"
  placeholder="Pangalan ng Sakahan"
/>

// Select Dropdown
<select className="select-premium">
  <option>Benguet</option>
  <option>Ifugao</option>
  <option>Kalinga</option>
</select>

// Disabled Input
<input
  type="text"
  className="input-premium"
  disabled
  value="Locked Value"
/>
```

### Badges

```jsx
// Success Badge
<span className="badge-premium badge-success">
  Optimal
</span>

// Warning Badge
<span className="badge-premium badge-warning">
  Moderate
</span>

// Error Badge
<span className="badge-premium badge-error">
  Low
</span>

// Neutral Badge
<span className="badge-premium badge-neutral">
  Pending
</span>
```

### Metric Cards

```jsx
<div className="metric-card">
  <div className="metric-value">45.2</div>
  <div className="metric-label">Nitrogen (ppm)</div>
  <div className="metric-change positive">
    +5.2% mula noong nakaraang buwan
  </div>
</div>

<div className="metric-card">
  <div className="metric-value">₱1,245</div>
  <div className="metric-label">Kabuuang Gastos</div>
  <div className="metric-change negative">
    -2.1% mula noong nakaraang buwan
  </div>
</div>
```

### Progress Bars

```jsx
<div className="progress-premium">
  <div
    className="progress-bar-premium"
    style={{ width: '65%' }}
  />
</div>
```

### Loading States

```jsx
// Spinner
<div className="flex-center h-64">
  <div className="spinner-premium" />
</div>

// Skeleton Loading
<div className="skeleton h-8 w-48 rounded-md" />
<div className="skeleton h-4 w-32 rounded-md mt-2" />
```

### Alerts

```jsx
// Success Alert
<div className="alert-premium alert-success">
  <strong>Tagumpay!</strong> Ang iyong pagsusuri ay natapos na.
</div>

// Warning Alert
<div className="alert-premium alert-warning">
  <strong>Babala:</strong> Mababa ang nitrogen level.
</div>

// Error Alert
<div className="alert-premium alert-error">
  <strong>Error:</strong> Hindi makonekta sa server.
</div>

// Info Alert
<div className="alert-premium alert-info">
  <strong>Paalala:</strong> Mag-apply ng fertilizer bago umulan.
</div>
```

### Tables

```jsx
<table className="table-premium">
  <thead>
    <tr>
      <th>Nutrient</th>
      <th>Level</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Nitrogen (N)</td>
      <td className="font-feature-tabular">45.2 ppm</td>
      <td>
        <span className="badge-premium badge-success">Optimal</span>
      </td>
    </tr>
    <tr>
      <td>Phosphorus (P)</td>
      <td className="font-feature-tabular">12.8 ppm</td>
      <td>
        <span className="badge-premium badge-warning">Low</span>
      </td>
    </tr>
  </tbody>
</table>
```

---

## Layout Patterns

### Container Layouts

```jsx
// Standard Container (1280px max)
<div className="container-premium py-xl">
  <h1>Content Here</h1>
</div>

// Narrow Container (960px max)
<div className="container-premium container-narrow py-xl">
  <h1>Focused Content</h1>
</div>

// Wide Container (1440px max)
<div className="container-premium container-wide py-xl">
  <h1>Dashboard Content</h1>
</div>
```

### Grid Layouts

```jsx
// 2 Column Grid
<div className="grid-premium grid-2">
  <div className="premium-card">Card 1</div>
  <div className="premium-card">Card 2</div>
</div>

// 3 Column Grid
<div className="grid-premium grid-3">
  <div className="metric-card">Metric 1</div>
  <div className="metric-card">Metric 2</div>
  <div className="metric-card">Metric 3</div>
</div>

// 4 Column Grid
<div className="grid-premium grid-4">
  <div className="premium-card">Item 1</div>
  <div className="premium-card">Item 2</div>
  <div className="premium-card">Item 3</div>
  <div className="premium-card">Item 4</div>
</div>

// Or use Tailwind grid utilities
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
  <div className="premium-card">Responsive Card</div>
</div>
```

### Flexbox Utilities

```jsx
// Center Content
<div className="flex-center h-screen">
  <h1>Centered Content</h1>
</div>

// Space Between
<div className="flex-between">
  <h2>Title</h2>
  <button className="btn-premium btn-primary">Action</button>
</div>

// Column Layout
<div className="flex-column gap-lg">
  <div className="premium-card">Item 1</div>
  <div className="premium-card">Item 2</div>
</div>
```

---

## Chart Integration

### Using Recharts (Recommended)

```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Enero', nitrogen: 40, phosphorus: 24 },
  { month: 'Pebrero', nitrogen: 45, phosphorus: 26 },
  { month: 'Marso', nitrogen: 50, phosphorus: 28 },
]

function NutrientChart() {
  return (
    <div className="chart-container">
      <h3 className="chart-title">NPK Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="month"
            stroke="#6B7280"
            style={{ fontSize: '14px', fontFamily: 'Inter' }}
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '14px', fontFamily: 'Inter' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
            }}
          />
          <Line
            type="monotone"
            dataKey="nitrogen"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="phosphorus"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ fill: '#F59E0B', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="chart-legend">
        <div className="chart-legend-item">
          <div className="chart-legend-color" style={{ background: '#3B82F6' }} />
          <span>Nitrogen</span>
        </div>
        <div className="chart-legend-item">
          <div className="chart-legend-color" style={{ background: '#F59E0B' }} />
          <span>Phosphorus</span>
        </div>
      </div>
    </div>
  )
}
```

### Bar Chart Example

```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const fertilizerData = [
  { name: '14-14-14', price: 1245 },
  { name: '16-20-0', price: 1180 },
  { name: 'Urea', price: 890 },
]

function FertilizerPriceChart() {
  return (
    <div className="chart-container">
      <h3 className="chart-title">Presyo ng Fertilizer</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={fertilizerData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            stroke="#6B7280"
            style={{ fontSize: '14px', fontFamily: 'Inter' }}
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '14px', fontFamily: 'Inter' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '12px'
            }}
          />
          <Bar
            dataKey="price"
            fill="#10B981"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

---

## Filipino Context Integration

### Professional Bilingual Layout

```jsx
function SoilAnalysisScreen() {
  return (
    <div className="container-premium py-3xl">
      {/* Header */}
      <div className="mb-2xl">
        <h1 className="text-5xl font-bold tracking-tighter text-premium-black mb-md">
          Pagsusuri ng Lupa
        </h1>
        <p className="text-body-lg">
          Soil Analysis Report para sa iyong sakahan sa CAR Region
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid-premium grid-3 mb-2xl">
        <div className="metric-card">
          <div className="metric-value">45.2</div>
          <div className="metric-label">Nitrogen (N) - ppm</div>
          <span className="badge-premium badge-success mt-md">
            Optimal Level
          </span>
        </div>

        <div className="metric-card">
          <div className="metric-value">12.8</div>
          <div className="metric-label">Phosphorus (P) - ppm</div>
          <span className="badge-premium badge-warning mt-md">
            Mababa - Low
          </span>
        </div>

        <div className="metric-card">
          <div className="metric-value">98.5</div>
          <div className="metric-label">Potassium (K) - ppm</div>
          <span className="badge-premium badge-success mt-md">
            Mataas - High
          </span>
        </div>
      </div>

      {/* Recommendation Card */}
      <div className="premium-card-elevated">
        <h2 className="text-2xl font-semibold mb-lg">
          Rekomendasyon ng Fertilizer
        </h2>

        <div className="alert-premium alert-info mb-lg">
          <strong>Paalala:</strong> Batay sa iyong soil analysis, inirerekemenda namin ang sumusunod na fertilizer.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <div className="premium-card-surface">
            <h3 className="text-lg font-semibold mb-md">14-14-14 Complete</h3>
            <div className="flex-between mb-md">
              <span className="text-gray-500">Dami / Amount:</span>
              <span className="font-feature-tabular font-semibold">2.5 sako (bags)</span>
            </div>
            <div className="flex-between mb-md">
              <span className="text-gray-500">Presyo / Price:</span>
              <span className="font-feature-tabular font-semibold text-lg">₱1,245.00</span>
            </div>
            <button className="btn-premium btn-success w-full mt-md">
              Bumili sa Tindahan
            </button>
          </div>
        </div>
      </div>

      {/* Location Info */}
      <div className="mt-2xl">
        <div className="premium-card">
          <div className="flex items-center gap-md mb-md">
            <div className="status-dot success" />
            <span className="text-sm text-gray-500">
              CAR Region • Benguet Province • La Trinidad
            </span>
          </div>
          <p className="text-body-sm">
            Altitude: 1,400 MASL • Rice Terraces • Rainy Season Ready
          </p>
        </div>
      </div>
    </div>
  )
}
```

### Weather Widget (Modern)

```jsx
import { Cloud, Droplets, Wind } from 'lucide-react'

function WeatherWidget() {
  return (
    <div className="premium-card-glass">
      <h3 className="text-lg font-semibold mb-lg">Panahon Ngayon</h3>

      <div className="flex items-center gap-lg mb-lg">
        <div className="text-6xl">☁️</div>
        <div>
          <div className="text-4xl font-bold">24°C</div>
          <div className="text-gray-500">Partly Cloudy</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-md">
        <div className="text-center">
          <Droplets className="mx-auto mb-sm text-chart-blue" size={24} />
          <div className="text-sm text-gray-500">Humidity</div>
          <div className="font-semibold">75%</div>
        </div>
        <div className="text-center">
          <Wind className="mx-auto mb-sm text-gray-400" size={24} />
          <div className="text-sm text-gray-500">Wind</div>
          <div className="font-semibold">12 km/h</div>
        </div>
        <div className="text-center">
          <Cloud className="mx-auto mb-sm text-gray-400" size={24} />
          <div className="text-sm text-gray-500">Chance</div>
          <div className="font-semibold">40%</div>
        </div>
      </div>
    </div>
  )
}
```

---

## Best Practices

### 1. Spacing

Always use the spacing system variables:
- `gap-sm`, `gap-md`, `gap-lg`, `gap-xl`
- `p-lg`, `p-xl`, `p-2xl` for padding
- `mb-lg`, `mt-xl` for margins

### 2. Hover Effects

Add subtle hover effects to interactive elements:
```jsx
<div className="hover-lift cursor-pointer">
  {/* Content */}
</div>

<button className="hover-scale">
  {/* Button */}
</button>
```

### 3. Responsive Design

Use responsive Tailwind classes:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
  {/* Responsive grid */}
</div>

<h1 className="text-2xl md:text-4xl lg:text-5xl">
  Responsive Text
</h1>
```

### 4. Transitions

All interactive elements should have smooth transitions:
```jsx
<button className="transition-smooth hover:bg-gray-100">
  Smooth Transition
</button>
```

### 5. Focus States

Add focus rings to interactive elements for accessibility:
```jsx
<button className="focus-ring">
  Accessible Button
</button>
```

---

## Complete Screen Example

```jsx
import { MapPin, TrendingUp, Package } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

function FarmDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="nav-premium bg-white sticky top-0 z-50">
        <a href="#" className="nav-item active">Dashboard</a>
        <a href="#" className="nav-item">Pagsusuri</a>
        <a href="#" className="nav-item">Rekomendasyon</a>
        <a href="#" className="nav-item">Tindahan</a>
      </nav>

      {/* Main Content */}
      <div className="container-premium py-3xl">
        {/* Hero Section */}
        <div className="mb-2xl">
          <div className="flex-between mb-lg">
            <div>
              <h1 className="text-5xl font-bold tracking-tighter mb-md">
                Maligayang Pagdating, Juan 👋
              </h1>
              <div className="flex items-center gap-md text-gray-500">
                <MapPin size={20} />
                <span>Benguet Province, CAR Region</span>
              </div>
            </div>
            <button className="btn-premium btn-primary btn-lg">
              <Package size={20} />
              Bumili ng Fertilizer
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid-premium grid-3 mb-2xl">
          <div className="metric-card hover-lift">
            <div className="flex-between mb-md">
              <div className="metric-label">Total Sakahan</div>
              <TrendingUp className="text-success" size={20} />
            </div>
            <div className="metric-value">2.5</div>
            <div className="metric-label">Ektarya (Hectares)</div>
          </div>

          <div className="metric-card hover-lift">
            <div className="metric-label mb-md">Nitrogen Level</div>
            <div className="metric-value text-chart-blue">45.2</div>
            <div className="metric-label">ppm - Optimal</div>
            <div className="metric-change positive">
              +5.2% vs last month
            </div>
          </div>

          <div className="metric-card hover-lift">
            <div className="metric-label mb-md">Gastos (Expenses)</div>
            <div className="metric-value text-premium-black">₱12,450</div>
            <div className="metric-label">This Quarter</div>
            <div className="metric-change negative">
              -8.3% vs last quarter
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          <div className="chart-container">
            <h3 className="chart-title">NPK Trend - 6 Months</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData}>
                <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="premium-card-elevated">
            <h3 className="text-xl font-semibold mb-lg">
              Pinakabagong Rekomendasyon
            </h3>
            <div className="space-y-md">
              <div className="flex-between p-md bg-gray-50 rounded-lg">
                <span className="font-medium">14-14-14 Complete</span>
                <span className="badge-premium badge-success">Ready</span>
              </div>
              <div className="flex-between p-md bg-gray-50 rounded-lg">
                <span className="font-medium">Urea 46-0-0</span>
                <span className="badge-premium badge-warning">Soon</span>
              </div>
            </div>
            <button className="btn-premium btn-secondary w-full mt-lg">
              Tignan Lahat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## Summary

This premium design system gives you:

✅ **Apple/Airbnb-inspired aesthetics** - Clean, minimalist, professional
✅ **Filipino context** - Bilingual labels, local data, CAR region focus
✅ **Premium components** - Cards, buttons, forms, charts
✅ **Modern data visualization** - Recharts integration with custom styling
✅ **Responsive design** - Mobile-first, adaptive layouts
✅ **Professional typography** - Inter font with proper hierarchy
✅ **Subtle animations** - Smooth transitions, hover effects
✅ **Comprehensive utilities** - Spacing, colors, shadows

The design system is production-ready for a premium SaaS fertilizer recommendation app that looks like it was designed by Apple or Airbnb.
