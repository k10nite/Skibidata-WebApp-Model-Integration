/**
 * Premium Design System Showcase
 * Demonstrates all premium components in action
 * Apple/Airbnb-inspired Filipino Fertilizer App
 */

import { useState } from 'react'
import {
  Leaf,
  TrendingUp,
  MapPin,
  Droplets,
  Wind,
  Cloud,
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  ArrowRight,
  Download,
  Share2,
  Settings,
  ChevronRight,
} from 'lucide-react'

export default function PremiumShowcase() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Navigation */}
      <nav className="nav-premium sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container-premium flex-between">
          <div className="flex items-center gap-lg">
            <div className="flex items-center gap-sm">
              <Leaf className="text-emerald-500" size={28} />
              <span className="text-xl font-bold">AgriTech</span>
            </div>
            <div className="flex gap-md">
              <button
                className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`nav-item ${activeTab === 'components' ? 'active' : ''}`}
                onClick={() => setActiveTab('components')}
              >
                Components
              </button>
              <button
                className={`nav-item ${activeTab === 'typography' ? 'active' : ''}`}
                onClick={() => setActiveTab('typography')}
              >
                Typography
              </button>
            </div>
          </div>
          <button className="btn-premium btn-primary btn-sm">
            <Download size={16} />
            Export Guide
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-5xl">
        <div className="container-premium container-narrow text-center">
          <h1 className="text-6xl font-bold tracking-tighter text-premium-black mb-lg">
            Premium Design System
          </h1>
          <p className="text-body-lg mb-2xl max-w-2xl mx-auto">
            Apple/Airbnb-inspired design system para sa Filipino fertilizer
            recommendation app. Professional, clean, at modern.
          </p>
          <div className="flex gap-md justify-center">
            <button className="btn-premium btn-primary btn-lg">
              Simulan ang Pagsusuri
              <ArrowRight size={20} />
            </button>
            <button className="btn-premium btn-secondary btn-lg">
              <Share2 size={20} />
              Share
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-premium py-3xl">
        {/* Color Palette */}
        <section className="mb-5xl">
          <h2 className="text-4xl font-bold tracking-tight mb-lg">Color Palette</h2>
          <p className="text-body-lg mb-2xl text-gray-500">
            Professional color system inspired by Apple's minimalism
          </p>

          <div className="grid-premium grid-4">
            <div className="premium-card text-center">
              <div className="w-full h-32 bg-premium-black rounded-lg mb-md" />
              <h4 className="font-semibold">Pure Black</h4>
              <code className="text-caption text-gray-500">#000000</code>
            </div>

            <div className="premium-card text-center">
              <div className="w-full h-32 bg-gray-500 rounded-lg mb-md" />
              <h4 className="font-semibold">Gray 500</h4>
              <code className="text-caption text-gray-500">#6B7280</code>
            </div>

            <div className="premium-card text-center">
              <div className="w-full h-32 bg-emerald-500 rounded-lg mb-md" />
              <h4 className="font-semibold">Emerald 500</h4>
              <code className="text-caption text-gray-500">#10B981</code>
            </div>

            <div className="premium-card text-center">
              <div className="w-full h-32 bg-gray-50 border border-gray-200 rounded-lg mb-md" />
              <h4 className="font-semibold">Gray 50</h4>
              <code className="text-caption text-gray-500">#F9FAFB</code>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-5xl">
          <h2 className="text-4xl font-bold tracking-tight mb-lg">Typography</h2>
          <p className="text-body-lg mb-2xl text-gray-500">
            Inter font family with professional hierarchy
          </p>

          <div className="premium-card-surface space-y-lg">
            <div>
              <h1 className="text-5xl font-bold tracking-tighter">Heading 1 - 5xl Bold</h1>
              <code className="text-caption text-gray-500">
                text-5xl font-bold tracking-tighter
              </code>
            </div>
            <hr className="divider-premium" />
            <div>
              <h2 className="text-4xl font-bold tracking-tight">Heading 2 - 4xl Bold</h2>
              <code className="text-caption text-gray-500">
                text-4xl font-bold tracking-tight
              </code>
            </div>
            <hr className="divider-premium" />
            <div>
              <h3 className="text-2xl font-semibold">Heading 3 - 2xl Semibold</h3>
              <code className="text-caption text-gray-500">text-2xl font-semibold</code>
            </div>
            <hr className="divider-premium" />
            <div>
              <p className="text-body-lg">
                Body Large - Para sa importante text at introductions
              </p>
              <code className="text-caption text-gray-500">text-body-lg</code>
            </div>
            <hr className="divider-premium" />
            <div>
              <p className="text-body">Body Regular - Para sa karaniwang text content</p>
              <code className="text-caption text-gray-500">text-body</code>
            </div>
            <hr className="divider-premium" />
            <div>
              <p className="text-caption">Caption - Para sa metadata at timestamps</p>
              <code className="text-caption text-gray-500">text-caption</code>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-5xl">
          <h2 className="text-4xl font-bold tracking-tight mb-lg">Buttons</h2>
          <p className="text-body-lg mb-2xl text-gray-500">
            Premium button styles with smooth interactions
          </p>

          <div className="premium-card space-y-lg">
            <div>
              <h4 className="font-semibold mb-md">Primary Buttons</h4>
              <div className="flex gap-md flex-wrap">
                <button className="btn-premium btn-primary btn-lg">Large Primary</button>
                <button className="btn-premium btn-primary">Regular Primary</button>
                <button className="btn-premium btn-primary btn-sm">Small Primary</button>
                <button className="btn-premium btn-primary">
                  With Icon
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            <hr className="divider-premium" />

            <div>
              <h4 className="font-semibold mb-md">Success Buttons</h4>
              <div className="flex gap-md flex-wrap">
                <button className="btn-premium btn-success">I-save ang Resulta</button>
                <button className="btn-premium btn-success">
                  <CheckCircle size={20} />
                  Approve
                </button>
              </div>
            </div>

            <hr className="divider-premium" />

            <div>
              <h4 className="font-semibold mb-md">Secondary & Ghost</h4>
              <div className="flex gap-md flex-wrap">
                <button className="btn-premium btn-secondary">Secondary</button>
                <button className="btn-premium btn-ghost">Ghost Button</button>
                <button className="btn-premium btn-ghost">
                  <Settings size={20} />
                  Settings
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-5xl">
          <h2 className="text-4xl font-bold tracking-tight mb-lg">Cards</h2>
          <p className="text-body-lg mb-2xl text-gray-500">
            Premium card styles for different use cases
          </p>

          <div className="grid-premium grid-2">
            <div className="premium-card">
              <h3 className="text-xl font-semibold mb-md">Premium Card</h3>
              <p className="text-gray-500">
                Basic white card with subtle shadow and border. Perfect for content
                sections.
              </p>
              <code className="text-caption text-gray-500 mt-md block">
                premium-card
              </code>
            </div>

            <div className="premium-card-surface">
              <h3 className="text-xl font-semibold mb-md">Surface Card</h3>
              <p className="text-gray-500">
                Gray background card for secondary information and grouped content.
              </p>
              <code className="text-caption text-gray-500 mt-md block">
                premium-card-surface
              </code>
            </div>

            <div className="premium-card-elevated">
              <h3 className="text-xl font-semibold mb-md">Elevated Card</h3>
              <p className="text-gray-500">
                Enhanced shadow for important cards that need more visual weight.
              </p>
              <code className="text-caption text-gray-500 mt-md block">
                premium-card-elevated
              </code>
            </div>

            <div className="premium-card-glass">
              <h3 className="text-xl font-semibold mb-md">Glass Card</h3>
              <p className="text-gray-500">
                Modern glass morphism effect with backdrop blur. Perfect for overlays.
              </p>
              <code className="text-caption text-gray-500 mt-md block">
                premium-card-glass
              </code>
            </div>
          </div>
        </section>

        {/* Metric Cards */}
        <section className="mb-5xl">
          <h2 className="text-4xl font-bold tracking-tight mb-lg">Metric Cards</h2>
          <p className="text-body-lg mb-2xl text-gray-500">
            Professional data display for dashboards
          </p>

          <div className="grid-premium grid-3">
            <div className="metric-card hover-lift">
              <div className="flex-between mb-md">
                <div className="metric-label">Nitrogen Level</div>
                <Leaf className="text-emerald-500" size={24} />
              </div>
              <div className="metric-value text-chart-blue">45.2</div>
              <div className="metric-label">ppm - Optimal</div>
              <div className="metric-change positive">+5.2% this month</div>
            </div>

            <div className="metric-card hover-lift">
              <div className="flex-between mb-md">
                <div className="metric-label">Total Sakahan</div>
                <MapPin className="text-gray-400" size={24} />
              </div>
              <div className="metric-value">2.5</div>
              <div className="metric-label">Hectares</div>
              <span className="badge-premium badge-success mt-md">Active</span>
            </div>

            <div className="metric-card hover-lift">
              <div className="flex-between mb-md">
                <div className="metric-label">Monthly Gastos</div>
                <Package className="text-gray-400" size={24} />
              </div>
              <div className="metric-value">₱12,450</div>
              <div className="metric-label">This Quarter</div>
              <div className="metric-change negative">-8.3% vs last quarter</div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="mb-5xl">
          <h2 className="text-4xl font-bold tracking-tight mb-lg">Badges</h2>
          <p className="text-body-lg mb-2xl text-gray-500">Status indicators and tags</p>

          <div className="premium-card">
            <div className="flex gap-md flex-wrap">
              <span className="badge-premium badge-success">
                <CheckCircle size={14} />
                Optimal
              </span>
              <span className="badge-premium badge-warning">
                <AlertTriangle size={14} />
                Moderate
              </span>
              <span className="badge-premium badge-error">
                <XCircle size={14} />
                Low Level
              </span>
              <span className="badge-premium badge-neutral">
                <Info size={14} />
                Pending
              </span>
            </div>
          </div>
        </section>

        {/* Alerts */}
        <section className="mb-5xl">
          <h2 className="text-4xl font-bold tracking-tight mb-lg">Alerts</h2>
          <p className="text-body-lg mb-2xl text-gray-500">
            Contextual feedback messages
          </p>

          <div className="space-y-lg">
            <div className="alert-premium alert-success">
              <strong>Tagumpay!</strong> Ang iyong pagsusuri ng lupa ay natapos na. Mga
              resulta ay available na.
            </div>

            <div className="alert-premium alert-warning">
              <strong>Babala:</strong> Mababa ang nitrogen level sa iyong sakahan.
              Inirerekemenda ang fertilizer application.
            </div>

            <div className="alert-premium alert-error">
              <strong>Error:</strong> Hindi makonekta sa server. Subukan ulit mamaya.
            </div>

            <div className="alert-premium alert-info">
              <strong>Paalala:</strong> Best time para mag-apply ng fertilizer ay bago
              umulan.
            </div>
          </div>
        </section>

        {/* Form Elements */}
        <section className="mb-5xl">
          <h2 className="text-4xl font-bold tracking-tight mb-lg">Form Elements</h2>
          <p className="text-body-lg mb-2xl text-gray-500">
            Professional input components
          </p>

          <div className="premium-card-elevated max-w-2xl">
            <h3 className="text-xl font-semibold mb-lg">Sample Form</h3>

            <div className="space-y-lg">
              <div>
                <label className="block text-sm font-semibold mb-sm">
                  Pangalan ng Sakahan
                </label>
                <input
                  type="text"
                  className="input-premium"
                  placeholder="Halimbawa: Rice Field A"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-sm">Probinsya</label>
                <select className="select-premium">
                  <option>Piliin ang probinsya...</option>
                  <option>Benguet</option>
                  <option>Ifugao</option>
                  <option>Kalinga</option>
                  <option>Apayao</option>
                  <option>Abra</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-sm">Laki ng Lupa</label>
                <input
                  type="number"
                  className="input-premium"
                  placeholder="Hectares"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-sm">
                  Karagdagang Impormasyon
                </label>
                <textarea
                  className="input-premium"
                  rows={4}
                  placeholder="Optional details about your farm..."
                />
              </div>

              <div className="flex gap-md">
                <button className="btn-premium btn-primary flex-1">I-save</button>
                <button className="btn-premium btn-ghost">Kanselahin</button>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Bars */}
        <section className="mb-5xl">
          <h2 className="text-4xl font-bold tracking-tight mb-lg">Progress Bars</h2>
          <p className="text-body-lg mb-2xl text-gray-500">Visual progress indicators</p>

          <div className="premium-card space-y-lg">
            <div>
              <div className="flex-between mb-sm">
                <span className="text-sm font-medium">Nitrogen (N)</span>
                <span className="text-sm text-gray-500">85%</span>
              </div>
              <div className="progress-premium">
                <div className="progress-bar-premium" style={{ width: '85%' }} />
              </div>
            </div>

            <div>
              <div className="flex-between mb-sm">
                <span className="text-sm font-medium">Phosphorus (P)</span>
                <span className="text-sm text-gray-500">45%</span>
              </div>
              <div className="progress-premium">
                <div
                  className="progress-bar-premium"
                  style={{ width: '45%', background: '#F59E0B' }}
                />
              </div>
            </div>

            <div>
              <div className="flex-between mb-sm">
                <span className="text-sm font-medium">Potassium (K)</span>
                <span className="text-sm text-gray-500">92%</span>
              </div>
              <div className="progress-premium">
                <div
                  className="progress-bar-premium"
                  style={{ width: '92%', background: '#3B82F6' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Loading States */}
        <section className="mb-5xl">
          <h2 className="text-4xl font-bold tracking-tight mb-lg">Loading States</h2>
          <p className="text-body-lg mb-2xl text-gray-500">
            Skeleton loaders and spinners
          </p>

          <div className="grid-premium grid-2">
            <div className="premium-card">
              <h4 className="font-semibold mb-lg">Spinner</h4>
              <div className="flex-center h-32">
                <div className="spinner-premium" />
              </div>
            </div>

            <div className="premium-card">
              <h4 className="font-semibold mb-lg">Skeleton</h4>
              <div className="space-y-md">
                <div className="skeleton h-8 w-3/4 rounded-md" />
                <div className="skeleton h-4 w-full rounded-md" />
                <div className="skeleton h-4 w-5/6 rounded-md" />
                <div className="skeleton h-24 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Weather Widget Example */}
        <section className="mb-5xl">
          <h2 className="text-4xl font-bold tracking-tight mb-lg">
            Component Example: Weather Widget
          </h2>
          <p className="text-body-lg mb-2xl text-gray-500">
            Real-world component using the design system
          </p>

          <div className="max-w-md">
            <div className="premium-card-glass">
              <h3 className="text-lg font-semibold mb-lg">Panahon Ngayon</h3>

              <div className="flex items-center gap-lg mb-2xl">
                <div className="text-6xl">☁️</div>
                <div>
                  <div className="text-5xl font-bold">24°C</div>
                  <div className="text-gray-500">Partly Cloudy</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-md">
                <div className="text-center p-md bg-white/50 rounded-lg">
                  <Droplets className="mx-auto mb-sm text-chart-blue" size={24} />
                  <div className="text-caption text-gray-500">Humidity</div>
                  <div className="font-semibold">75%</div>
                </div>
                <div className="text-center p-md bg-white/50 rounded-lg">
                  <Wind className="mx-auto mb-sm text-gray-400" size={24} />
                  <div className="text-caption text-gray-500">Wind</div>
                  <div className="font-semibold">12 km/h</div>
                </div>
                <div className="text-center p-md bg-white/50 rounded-lg">
                  <Cloud className="mx-auto mb-sm text-gray-400" size={24} />
                  <div className="text-caption text-gray-500">Rain</div>
                  <div className="font-semibold">40%</div>
                </div>
              </div>

              <div className="mt-lg">
                <div className="text-caption text-gray-500 mb-sm">Location</div>
                <div className="flex items-center gap-sm">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-sm">Benguet, CAR Region</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="mb-5xl">
          <h2 className="text-4xl font-bold tracking-tight mb-lg">Tables</h2>
          <p className="text-body-lg mb-2xl text-gray-500">
            Data tables with professional styling
          </p>

          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Nutrient</th>
                  <th>Current Level</th>
                  <th>Optimal Range</th>
                  <th>Status</th>
                  <th>Action</th>
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
                  <td>
                    <button className="text-sm text-gray-500 hover:text-premium-black flex items-center gap-xs">
                      View
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold">Phosphorus (P)</td>
                  <td className="font-feature-tabular">12.8 ppm</td>
                  <td className="text-gray-500">20-40 ppm</td>
                  <td>
                    <span className="badge-premium badge-warning">Low</span>
                  </td>
                  <td>
                    <button className="text-sm text-gray-500 hover:text-premium-black flex items-center gap-xs">
                      View
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold">Potassium (K)</td>
                  <td className="font-feature-tabular">98.5 ppm</td>
                  <td className="text-gray-500">80-120 ppm</td>
                  <td>
                    <span className="badge-premium badge-success">Optimal</span>
                  </td>
                  <td>
                    <button className="text-sm text-gray-500 hover:text-premium-black flex items-center gap-xs">
                      View
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-3xl">
        <div className="container-premium text-center">
          <p className="text-gray-500 mb-md">
            Premium Design System for Filipino Fertilizer Recommendation App
          </p>
          <p className="text-caption text-gray-400">
            Built with React, Tailwind CSS, and premium design principles
          </p>
        </div>
      </footer>
    </div>
  )
}
