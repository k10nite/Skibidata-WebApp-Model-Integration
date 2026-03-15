import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import PropTypes from 'prop-types';

/**
 * Professional Bar Chart for Nutrient Comparison
 * Displays current vs optimal nutrient levels
 */
export default function BarChart({ data, height = 300, showLegend = true }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-inter font-semibold text-gray-900 text-sm mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-inter text-xs text-gray-700">
                {entry.name}:
              </span>
              <span className="font-inter font-semibold text-xs text-gray-900">
                {entry.value.toLocaleString()} {entry.payload.unit || 'kg/ha'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="#6B7280"
          style={{ fontFamily: 'Inter', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: '#E5E7EB' }}
        />
        <YAxis
          stroke="#6B7280"
          style={{ fontFamily: 'Inter', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: '#E5E7EB' }}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
        {showLegend && (
          <Legend
            wrapperStyle={{ fontFamily: 'Inter', fontSize: 12 }}
            iconType="circle"
          />
        )}
        <Bar
          dataKey="current"
          fill="#EF4444"
          radius={[6, 6, 0, 0]}
          maxBarSize={60}
          name="Current"
        />
        <Bar
          dataKey="optimal"
          fill="#10B981"
          radius={[6, 6, 0, 0]}
          maxBarSize={60}
          name="Optimal"
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

BarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      current: PropTypes.number.isRequired,
      optimal: PropTypes.number.isRequired,
      unit: PropTypes.string,
    }),
  ).isRequired,
  height: PropTypes.number,
  showLegend: PropTypes.bool,
};
