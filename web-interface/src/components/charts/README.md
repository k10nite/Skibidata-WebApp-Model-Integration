# Chart Components Documentation

Professional data visualization components using Recharts with smooth animations and clean design.

## Installation

```bash
npm install recharts lucide-react
```

## Components

### 1. BarChart

Comparison bar chart for displaying nutrient levels (current vs optimal).

**Usage:**
```jsx
import { BarChart } from '@/components/charts';

const nutrientData = [
  { name: 'Nitrogen', current: 45, optimal: 60, unit: 'kg/ha' },
  { name: 'Phosphorus', current: 30, optimal: 40, unit: 'kg/ha' },
  { name: 'Potassium', current: 50, optimal: 55, unit: 'kg/ha' },
];

<BarChart data={nutrientData} height={300} showLegend={true} />
```

**Props:**
- `data` (required): Array of objects with `name`, `current`, `optimal`, and optional `unit`
- `height`: Chart height in pixels (default: 300)
- `showLegend`: Show/hide legend (default: true)

---

### 2. LineChart

Trend chart for displaying soil health metrics over time.

**Usage:**
```jsx
import { LineChart } from '@/components/charts';

const soilHealthData = [
  { name: 'Jan', ph: 6.5, moisture: 45, unit: '%' },
  { name: 'Feb', ph: 6.6, moisture: 48, unit: '%' },
  { name: 'Mar', ph: 6.7, moisture: 52, unit: '%' },
  { name: 'Apr', ph: 6.8, moisture: 55, unit: '%' },
];

<LineChart
  data={soilHealthData}
  dataKeys={['ph', 'moisture']}
  colors={['#3B82F6', '#10B981']}
  showArea={true}
  height={300}
/>
```

**Props:**
- `data` (required): Array of objects with `name` and data points
- `height`: Chart height in pixels (default: 300)
- `showLegend`: Show/hide legend (default: true)
- `showArea`: Fill area under lines (default: false)
- `dataKeys`: Array of data keys to plot (default: ['value'])
- `colors`: Array of colors for each line (default: ['#3B82F6'])

---

### 3. RadarChart

Multi-dimensional comparison chart for NPK and other nutrients.

**Usage:**
```jsx
import { RadarChart } from '@/components/charts';

const npkData = [
  { subject: 'Nitrogen', current: 75, optimal: 90, unit: 'kg/ha' },
  { subject: 'Phosphorus', current: 60, optimal: 80, unit: 'kg/ha' },
  { subject: 'Potassium', current: 85, optimal: 85, unit: 'kg/ha' },
  { subject: 'Calcium', current: 70, optimal: 75, unit: 'kg/ha' },
  { subject: 'Magnesium', current: 65, optimal: 70, unit: 'kg/ha' },
];

<RadarChart
  data={npkData}
  metrics={['current', 'optimal']}
  colors={['#EF4444', '#10B981']}
  height={400}
/>
```

**Props:**
- `data` (required): Array of objects with `subject` and metric values
- `height`: Chart height in pixels (default: 400)
- `showLegend`: Show/hide legend (default: true)
- `metrics`: Array of metric keys to plot (default: ['current', 'optimal'])
- `colors`: Array of colors for each metric (default: ['#EF4444', '#10B981'])

---

### 4. ProgressBar

Apple-style progress bar with smooth animations.

**Usage:**
```jsx
import { ProgressBar } from '@/components/charts';

<ProgressBar
  value={75}
  max={100}
  label="Soil Health Score"
  showPercentage={true}
  color="emerald"
  size="md"
/>
```

**Props:**
- `value`: Current value (default: 0)
- `max`: Maximum value (default: 100)
- `label`: Label text (default: '')
- `showPercentage`: Show percentage (default: true)
- `color`: Color theme - 'emerald', 'blue', 'red', 'amber', 'purple', 'green' (default: 'emerald')
- `size`: Size - 'sm', 'md', 'lg', 'xl' (default: 'md')
- `className`: Additional CSS classes

---

### 5. StatCard

Metric card displaying key statistics with trends.

**Usage:**
```jsx
import { StatCard } from '@/components/charts';
import { Leaf } from 'lucide-react';

<StatCard
  value={1250}
  label="Total Area"
  unit="hectares"
  icon={Leaf}
  trend={12.5}
  trendLabel="vs last month"
  color="emerald"
  animated={true}
/>
```

**Props:**
- `value` (required): Numeric or string value to display
- `label` (required): Label text
- `unit`: Unit of measurement (default: '')
- `icon`: Lucide icon component
- `trend`: Percentage change (positive/negative)
- `trendLabel`: Label for trend (default: '')
- `color`: Color theme - 'emerald', 'blue', 'red', 'amber', 'purple', 'gray' (default: 'emerald')
- `animated`: Enable animations (default: true)
- `className`: Additional CSS classes

---

### 6. WeatherWidget

Current weather display with conditions and metrics.

**Usage:**
```jsx
import { WeatherWidget } from '@/components/charts';

<WeatherWidget
  temperature={28}
  condition="sunny"
  humidity={65}
  windSpeed={12}
  location="Quezon City, Philippines"
  unit="°C"
  animated={true}
/>
```

**Props:**
- `temperature` (required): Temperature value
- `condition`: Weather condition - 'sunny', 'cloudy', 'rainy', 'drizzle', 'snowy' (default: 'sunny')
- `humidity`: Humidity percentage
- `windSpeed`: Wind speed in km/h
- `location`: Location name (default: '')
- `unit`: Temperature unit - '°C' or '°F' (default: '°C')
- `animated`: Enable animations (default: true)
- `className`: Additional CSS classes

---

### 7. FieldMap

Satellite imagery display with interactive overlay points.

**Usage:**
```jsx
import { FieldMap } from '@/components/charts';

const overlayPoints = [
  { x: 30, y: 40, label: 'Zone A', value: 'pH 6.5', status: 'good' },
  { x: 60, y: 50, label: 'Zone B', value: 'pH 5.8', status: 'warning' },
  { x: 45, y: 70, label: 'Zone C', value: 'pH 5.2', status: 'critical' },
];

<FieldMap
  imageUrl="/path/to/satellite-image.jpg"
  location="Farm Location, Philippines"
  coordinates={{ lat: 14.5995, lng: 120.9842 }}
  overlayData={overlayPoints}
  height={400}
  animated={true}
/>
```

**Props:**
- `imageUrl`: URL to satellite image
- `location`: Location name (default: '')
- `coordinates`: Object with `lat` and `lng` (default: { lat: 0, lng: 0 })
- `overlayData`: Array of overlay points with `x`, `y`, `label`, `value`, `status`
- `height`: Map height in pixels (default: 400)
- `animated`: Enable animations (default: true)
- `className`: Additional CSS classes

**Overlay Point Status:**
- `'good'`: Green marker
- `'warning'`: Amber marker
- `'critical'`: Red marker

---

## Design Features

### Color Palette
- Primary (Emerald): `#10B981`
- Warning (Amber): `#F59E0B`
- Error (Red): `#EF4444`
- Info (Blue): `#3B82F6`
- Text: `#111827` (gray-900)
- Secondary Text: `#6B7280` (gray-500)

### Typography
- Font Family: Inter
- Numbers: Bold weight for emphasis
- Labels: Medium weight (500-600)
- Helper text: Regular weight

### Animations
- Entry animations using GSAP
- Smooth transitions (300-600ms)
- Easing: power3.out, back.out
- Number counters with smooth increment

### Responsive Design
- All charts use `ResponsiveContainer` from Recharts
- Mobile-friendly touch interactions
- Adaptive layouts for different screen sizes

---

## Example Screen Implementation

```jsx
import {
  BarChart,
  LineChart,
  RadarChart,
  ProgressBar,
  StatCard,
  WeatherWidget,
  FieldMap,
} from '@/components/charts';
import { Leaf, TrendingUp, Droplets } from 'lucide-react';

export default function DashboardScreen() {
  const nutrientData = [
    { name: 'N', current: 45, optimal: 60, unit: 'kg/ha' },
    { name: 'P', current: 30, optimal: 40, unit: 'kg/ha' },
    { name: 'K', current: 50, optimal: 55, unit: 'kg/ha' },
  ];

  const soilTrendData = [
    { name: 'Jan', health: 65 },
    { name: 'Feb', health: 70 },
    { name: 'Mar', health: 75 },
    { name: 'Apr', health: 78 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          value={1250}
          label="Total Area"
          unit="hectares"
          icon={Leaf}
          trend={12.5}
          trendLabel="vs last month"
          color="emerald"
        />
        <StatCard
          value={78}
          label="Soil Health"
          unit="%"
          icon={TrendingUp}
          trend={5.2}
          trendLabel="improvement"
          color="blue"
        />
        <StatCard
          value={42}
          label="Moisture Level"
          unit="%"
          icon={Droplets}
          trend={-2.1}
          trendLabel="vs optimal"
          color="amber"
        />
      </div>

      {/* Weather Widget */}
      <WeatherWidget
        temperature={28}
        condition="sunny"
        humidity={65}
        windSpeed={12}
        location="Quezon City, Philippines"
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nutrient Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-inter text-lg font-semibold text-gray-900 mb-4">
            Nutrient Levels
          </h3>
          <BarChart data={nutrientData} height={300} />
        </div>

        {/* Soil Health Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-inter text-lg font-semibold text-gray-900 mb-4">
            Soil Health Trend
          </h3>
          <LineChart
            data={soilTrendData}
            dataKeys={['health']}
            colors={['#10B981']}
            showArea={true}
            height={300}
          />
        </div>
      </div>

      {/* Progress Bars */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-inter text-lg font-semibold text-gray-900 mb-4">
          Nutrient Progress
        </h3>
        <ProgressBar value={75} label="Nitrogen" color="emerald" />
        <ProgressBar value={60} label="Phosphorus" color="blue" />
        <ProgressBar value={90} label="Potassium" color="purple" />
      </div>

      {/* Field Map */}
      <FieldMap
        imageUrl="/satellite-image.jpg"
        location="Farm Location, Philippines"
        coordinates={{ lat: 14.5995, lng: 120.9842 }}
        overlayData={[
          { x: 30, y: 40, label: 'Zone A', value: 'pH 6.5', status: 'good' },
          { x: 60, y: 50, label: 'Zone B', value: 'pH 5.8', status: 'warning' },
        ]}
        height={500}
      />
    </div>
  );
}
```

---

## Notes

- All components support dark mode through Tailwind classes
- Charts automatically format numbers with thousands separators
- Tooltips are consistent across all chart types
- Components are fully accessible with proper ARIA labels
- GSAP animations can be disabled by setting `animated={false}`
