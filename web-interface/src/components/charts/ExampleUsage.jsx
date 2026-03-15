import {
  BarChart,
  LineChart,
  RadarChart,
  ProgressBar,
  StatCard,
  WeatherWidget,
  FieldMap,
} from './index';
import { Leaf, TrendingUp, Droplets, Activity } from 'lucide-react';

/**
 * Example Usage of All Chart Components
 * This file demonstrates how to use each chart component
 */
export default function ExampleUsage() {
  // Sample data for BarChart
  const nutrientData = [
    { name: 'Nitrogen', current: 45, optimal: 60, unit: 'kg/ha' },
    { name: 'Phosphorus', current: 30, optimal: 40, unit: 'kg/ha' },
    { name: 'Potassium', current: 50, optimal: 55, unit: 'kg/ha' },
    { name: 'Calcium', current: 35, optimal: 45, unit: 'kg/ha' },
  ];

  // Sample data for LineChart
  const soilHealthData = [
    { name: 'Jan', health: 65, moisture: 42 },
    { name: 'Feb', health: 70, moisture: 45 },
    { name: 'Mar', health: 75, moisture: 48 },
    { name: 'Apr', health: 78, moisture: 52 },
    { name: 'May', health: 82, moisture: 55 },
    { name: 'Jun', health: 85, moisture: 58 },
  ];

  // Sample data for RadarChart
  const npkRadarData = [
    { subject: 'Nitrogen', current: 75, optimal: 90, unit: 'kg/ha' },
    { subject: 'Phosphorus', current: 60, optimal: 80, unit: 'kg/ha' },
    { subject: 'Potassium', current: 85, optimal: 85, unit: 'kg/ha' },
    { subject: 'Calcium', current: 70, optimal: 75, unit: 'kg/ha' },
    { subject: 'Magnesium', current: 65, optimal: 70, unit: 'kg/ha' },
    { subject: 'Sulfur', current: 55, optimal: 65, unit: 'kg/ha' },
  ];

  // Sample data for FieldMap overlay
  const fieldOverlayData = [
    { x: 25, y: 30, label: 'Zone A', value: 'pH 6.5', status: 'good' },
    { x: 60, y: 40, label: 'Zone B', value: 'pH 5.8', status: 'warning' },
    { x: 35, y: 70, label: 'Zone C', value: 'pH 5.2', status: 'critical' },
    { x: 75, y: 65, label: 'Zone D', value: 'pH 6.8', status: 'good' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-inter text-3xl font-bold text-gray-900 mb-2">
            Chart Components Showcase
          </h1>
          <p className="font-inter text-gray-600">
            Professional data visualization components using Recharts
          </p>
        </div>

        {/* StatCards Row */}
        <div>
          <h2 className="font-inter text-xl font-semibold text-gray-900 mb-4">
            Stat Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              value={85}
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
            <StatCard
              value={324}
              label="Active Sensors"
              icon={Activity}
              color="purple"
            />
          </div>
        </div>

        {/* Weather Widget */}
        <div>
          <h2 className="font-inter text-xl font-semibold text-gray-900 mb-4">
            Weather Widget
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WeatherWidget
              temperature={28}
              condition="sunny"
              humidity={65}
              windSpeed={12}
              location="Quezon City, Philippines"
            />
            <WeatherWidget
              temperature={24}
              condition="rainy"
              humidity={85}
              windSpeed={18}
              location="Manila, Philippines"
            />
          </div>
        </div>

        {/* Progress Bars */}
        <div>
          <h2 className="font-inter text-xl font-semibold text-gray-900 mb-4">
            Progress Bars
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <ProgressBar
              value={75}
              label="Nitrogen Level"
              color="emerald"
              size="md"
            />
            <ProgressBar
              value={60}
              label="Phosphorus Level"
              color="blue"
              size="md"
            />
            <ProgressBar
              value={90}
              label="Potassium Level"
              color="purple"
              size="md"
            />
            <ProgressBar
              value={45}
              label="Soil Moisture"
              color="amber"
              size="md"
            />
          </div>
        </div>

        {/* Charts Grid */}
        <div>
          <h2 className="font-inter text-xl font-semibold text-gray-900 mb-4">
            Charts
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-inter text-lg font-semibold text-gray-900 mb-4">
                Nutrient Levels (Bar Chart)
              </h3>
              <BarChart data={nutrientData} height={300} />
            </div>

            {/* Line Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-inter text-lg font-semibold text-gray-900 mb-4">
                Soil Health Trend (Line Chart)
              </h3>
              <LineChart
                data={soilHealthData}
                dataKeys={['health', 'moisture']}
                colors={['#10B981', '#3B82F6']}
                showArea={true}
                height={300}
              />
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div>
          <h2 className="font-inter text-xl font-semibold text-gray-900 mb-4">
            Radar Chart
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-inter text-lg font-semibold text-gray-900 mb-4">
              NPK Nutrient Analysis
            </h3>
            <RadarChart
              data={npkRadarData}
              metrics={['current', 'optimal']}
              colors={['#EF4444', '#10B981']}
              height={450}
            />
          </div>
        </div>

        {/* Field Map */}
        <div>
          <h2 className="font-inter text-xl font-semibold text-gray-900 mb-4">
            Field Map
          </h2>
          <FieldMap
            location="Farm Location, Quezon City, Philippines"
            coordinates={{ lat: 14.5995, lng: 120.9842 }}
            overlayData={fieldOverlayData}
            height={500}
          />
        </div>

        {/* Different Sizes and Colors */}
        <div>
          <h2 className="font-inter text-xl font-semibold text-gray-900 mb-4">
            Progress Bar Variants
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <div className="space-y-3">
              <p className="font-inter text-sm font-medium text-gray-700">
                Small Size
              </p>
              <ProgressBar value={75} label="Progress" size="sm" color="blue" />
            </div>
            <div className="space-y-3">
              <p className="font-inter text-sm font-medium text-gray-700">
                Medium Size (Default)
              </p>
              <ProgressBar
                value={60}
                label="Progress"
                size="md"
                color="emerald"
              />
            </div>
            <div className="space-y-3">
              <p className="font-inter text-sm font-medium text-gray-700">
                Large Size
              </p>
              <ProgressBar value={90} label="Progress" size="lg" color="red" />
            </div>
            <div className="space-y-3">
              <p className="font-inter text-sm font-medium text-gray-700">
                Extra Large Size
              </p>
              <ProgressBar
                value={45}
                label="Progress"
                size="xl"
                color="purple"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
