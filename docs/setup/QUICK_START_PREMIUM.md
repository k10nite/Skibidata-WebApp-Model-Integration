# Quick Start - Premium Design System

## Immediate Implementation Guide

Follow these steps to start using the premium design system in your app right now.

---

## Step 1: Update Your Main Entry Point

**File: `src/main.jsx`**

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Import PREMIUM stylesheet (replaces or works alongside existing styles)
import './styles/premium.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## Step 2: Install New Dependencies

Run this command to install chart libraries and utilities:

```bash
npm install
```

This will install:
- `recharts@3.7.0` (already added to package.json)
- `chart.js@4.4.1` (added)
- `react-chartjs-2@5.2.0` (added)
- `date-fns@3.3.1` (added)

---

## Step 3: View the Component Showcase

Create a new route to view all premium components:

**File: `src/App.jsx`**

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PremiumShowcase from './components/PremiumShowcase'
// ... your other imports

function App() {
  return (
    <Router>
      <Routes>
        {/* Add this route to view the showcase */}
        <Route path="/showcase" element={<PremiumShowcase />} />

        {/* Your existing routes */}
        <Route path="/" element={<YourHomeScreen />} />
        {/* ... */}
      </Routes>
    </Router>
  )
}

export default App
```

Then visit: `http://localhost:5173/showcase`

---

## Step 4: Create Your First Premium Screen

Here's a complete example of a modern dashboard using the premium design system:

**File: `src/screens/PremiumDashboard.jsx`**

```javascript
import { MapPin, Leaf, TrendingUp, Package, ArrowRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Sample data
const npkData = [
  { month: 'Enero', nitrogen: 40, phosphorus: 15, potassium: 85 },
  { month: 'Pebrero', nitrogen: 42, phosphorus: 18, potassium: 88 },
  { month: 'Marso', nitrogen: 45, phosphorus: 22, potassium: 92 },
  { month: 'Abril', nitrogen: 48, phosphorus: 28, potassium: 95 },
  { month: 'Mayo', nitrogen: 45, phosphorus: 25, potassium: 98 },
  { month: 'Hunyo', nitrogen: 45, phosphorus: 24, potassium: 98 },
]

export default function PremiumDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Premium Navigation */}
      <nav className="nav-premium sticky top-0 z-50 bg-white">
        <div className="container-premium flex-between">
          <div className="flex items-center gap-lg">
            <div className="flex items-center gap-sm">
              <Leaf className="text-emerald-500" size={28} />
              <span className="text-xl font-bold">AgriTech PH</span>
            </div>
            <div className="flex gap-md">
              <a href="#" className="nav-item active">Dashboard</a>
              <a href="#" className="nav-item">Pagsusuri</a>
              <a href="#" className="nav-item">Rekomendasyon</a>
              <a href="#" className="nav-item">Tindahan</a>
            </div>
          </div>
          <button className="btn-premium btn-primary btn-sm">
            <Package size={16} />
            Bumili Ngayon
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-premium py-3xl">
        {/* Hero Section */}
        <div className="mb-3xl">
          <div className="flex-between items-start mb-lg">
            <div>
              <h1 className="text-5xl font-bold tracking-tighter mb-md">
                Maligayang Pagdating, Juan 👋
              </h1>
              <div className="flex items-center gap-md text-gray-500">
                <MapPin size={20} />
                <span>Benguet Province, CAR Region</span>
                <span className="badge-premium badge-success">Active Farm</span>
              </div>
            </div>
            <button className="btn-premium btn-success btn-lg">
              Simulan ang Pagsusuri
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid-premium grid-3 mb-3xl">
          <div className="metric-card hover-lift">
            <div className="flex-between mb-md">
              <div className="metric-label">Total Sakahan</div>
              <Leaf className="text-emerald-500" size={24} />
            </div>
            <div className="metric-value">2.5</div>
            <div className="metric-label">Ektarya (Hectares)</div>
            <div className="metric-change positive">
              +0.5 ha vs last year
            </div>
          </div>

          <div className="metric-card hover-lift">
            <div className="flex-between mb-md">
              <div className="metric-label">Nitrogen Level</div>
              <TrendingUp className="text-chart-blue" size={24} />
            </div>
            <div className="metric-value text-chart-blue">45.2</div>
            <div className="metric-label">ppm - Optimal Range</div>
            <div className="metric-change positive">
              +5.2% this month
            </div>
          </div>

          <div className="metric-card hover-lift">
            <div className="flex-between mb-md">
              <div className="metric-label">Gastos this Quarter</div>
              <Package className="text-gray-400" size={24} />
            </div>
            <div className="metric-value">₱12,450</div>
            <div className="metric-label">Fertilizer & Supplies</div>
            <div className="metric-change negative">
              -8.3% vs last quarter
            </div>
          </div>
        </div>

        {/* Chart & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg mb-3xl">
          {/* NPK Trend Chart */}
          <div className="chart-container">
            <h3 className="chart-title">NPK Trend - 6 Months</h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={npkData}>
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
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                    fontFamily: 'Inter'
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
                <Line
                  type="monotone"
                  dataKey="potassium"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              <div className="chart-legend-item">
                <div className="chart-legend-color" style={{ background: '#3B82F6' }} />
                <span>Nitrogen (N)</span>
              </div>
              <div className="chart-legend-item">
                <div className="chart-legend-color" style={{ background: '#F59E0B' }} />
                <span>Phosphorus (P)</span>
              </div>
              <div className="chart-legend-item">
                <div className="chart-legend-color" style={{ background: '#10B981' }} />
                <span>Potassium (K)</span>
              </div>
            </div>
          </div>

          {/* Recommendations Card */}
          <div className="premium-card-elevated">
            <h3 className="text-xl font-semibold mb-lg">
              Pinakabagong Rekomendasyon
            </h3>

            <div className="alert-premium alert-info mb-lg">
              <strong>Paalala:</strong> Batay sa inyong soil analysis ngayong buwan.
            </div>

            <div className="space-y-md">
              <div className="premium-card-surface hover-lift cursor-pointer">
                <div className="flex-between mb-md">
                  <h4 className="font-semibold">14-14-14 Complete</h4>
                  <span className="badge-premium badge-success">Recommended</span>
                </div>
                <div className="flex-between mb-sm text-sm">
                  <span className="text-gray-500">Dami:</span>
                  <span className="font-feature-tabular font-semibold">2.5 sako</span>
                </div>
                <div className="flex-between text-sm">
                  <span className="text-gray-500">Presyo:</span>
                  <span className="font-feature-tabular font-semibold text-lg">₱1,245.00</span>
                </div>
              </div>

              <div className="premium-card-surface hover-lift cursor-pointer">
                <div className="flex-between mb-md">
                  <h4 className="font-semibold">Urea 46-0-0</h4>
                  <span className="badge-premium badge-neutral">Optional</span>
                </div>
                <div className="flex-between mb-sm text-sm">
                  <span className="text-gray-500">Dami:</span>
                  <span className="font-feature-tabular font-semibold">1 sako</span>
                </div>
                <div className="flex-between text-sm">
                  <span className="text-gray-500">Presyo:</span>
                  <span className="font-feature-tabular font-semibold text-lg">₱890.00</span>
                </div>
              </div>

              <button className="btn-premium btn-primary w-full mt-lg">
                Tingnan ang Lahat
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Soil Analysis Table */}
        <div className="premium-card-elevated">
          <h3 className="text-xl font-semibold mb-lg">Current Soil Status</h3>

          <table className="table-premium">
            <thead>
              <tr>
                <th>Nutrient</th>
                <th>Current Level</th>
                <th>Optimal Range</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold">Nitrogen (N)</td>
                <td className="font-feature-tabular">45.2 ppm</td>
                <td className="text-gray-500">40-60 ppm</td>
                <td>
                  <span className="badge-premium badge-success">Optimal</span>
                </td>
              </tr>
              <tr>
                <td className="font-semibold">Phosphorus (P)</td>
                <td className="font-feature-tabular">24.0 ppm</td>
                <td className="text-gray-500">20-40 ppm</td>
                <td>
                  <span className="badge-premium badge-success">Optimal</span>
                </td>
              </tr>
              <tr>
                <td className="font-semibold">Potassium (K)</td>
                <td className="font-feature-tabular">98.5 ppm</td>
                <td className="text-gray-500">80-120 ppm</td>
                <td>
                  <span className="badge-premium badge-success">Optimal</span>
                </td>
              </tr>
              <tr>
                <td className="font-semibold">pH Level</td>
                <td className="font-feature-tabular">6.5</td>
                <td className="text-gray-500">6.0-7.0</td>
                <td>
                  <span className="badge-premium badge-success">Optimal</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
```

---

## Step 5: Start the Development Server

```bash
npm run dev
```

Then open:
- Main app: `http://localhost:5173/`
- Premium showcase: `http://localhost:5173/showcase`

---

## Common Use Cases

### 1. Replace Existing Card Styles

**Before:**
```jsx
<div className="clay-card">
  <h3>My Card</h3>
</div>
```

**After (Premium):**
```jsx
<div className="premium-card">
  <h3 className="text-xl font-semibold mb-md">My Card</h3>
</div>
```

### 2. Update Button Styles

**Before:**
```jsx
<button className="btn-magnetic bg-primary">
  Click Me
</button>
```

**After (Premium):**
```jsx
<button className="btn-premium btn-primary">
  Click Me
</button>
```

### 3. Modern Typography

**Before:**
```jsx
<h1 style={{ fontSize: '2rem' }}>Title</h1>
<p className="text-secondary">Description</p>
```

**After (Premium):**
```jsx
<h1 className="text-5xl font-bold tracking-tighter">Title</h1>
<p className="text-body-lg text-gray-500">Description</p>
```

### 4. Professional Metrics

**Before:**
```jsx
<div className="stat-card">
  <span>45.2</span>
  <label>Nitrogen</label>
</div>
```

**After (Premium):**
```jsx
<div className="metric-card">
  <div className="metric-value">45.2</div>
  <div className="metric-label">Nitrogen (N) - ppm</div>
  <span className="badge-premium badge-success">Optimal</span>
</div>
```

---

## Design System Files Created

✅ **`src/styles/premium.css`** - Complete premium CSS design system
✅ **`tailwind.config.js`** - Updated with Apple/Airbnb aesthetic
✅ **`package.json`** - Added chart libraries and utilities
✅ **`PREMIUM_DESIGN_SYSTEM_GUIDE.md`** - Comprehensive documentation
✅ **`src/components/PremiumShowcase.jsx`** - Live component examples
✅ **`QUICK_START_PREMIUM.md`** - This quick start guide

---

## Next Steps

1. **Install dependencies**: `npm install`
2. **Start dev server**: `npm run dev`
3. **View showcase**: Visit `/showcase` route
4. **Implement in your screens**: Use the examples above
5. **Customize**: Adjust colors in `tailwind.config.js` if needed

---

## Key Differences from Old System

| Old System | Premium System |
|------------|----------------|
| `.clay-card` | `.premium-card` |
| `.btn-magnetic` | `.btn-premium btn-primary` |
| `--color-earth` | `--color-premium-black` |
| `--radius-clay-lg` | `--radius-lg` (16px) |
| Soil/farm theme | Professional SaaS theme |
| `Plus Jakarta Sans` | `Inter` font |
| Warm earth tones | Clean black/white/emerald |

---

## Support

For questions or issues:
1. Check the comprehensive guide: `PREMIUM_DESIGN_SYSTEM_GUIDE.md`
2. View live examples: `http://localhost:5173/showcase`
3. Reference component code: `src/components/PremiumShowcase.jsx`

Happy building! 🚀
