import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
} from 'recharts';
import PropTypes from 'prop-types';

/**
 * Professional Line Chart for Soil Health Trends
 * Displays soil health metrics over time
 */
export default function LineChart({
  data,
  height = 300,
  showLegend = true,
  showArea = false,
  dataKeys = ['value'],
  colors = ['#3B82F6'],
}) {
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
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-inter text-xs text-gray-700">
                {entry.name}:
              </span>
              <span className="font-inter font-semibold text-xs text-gray-900">
                {typeof entry.value === 'number'
                  ? entry.value.toLocaleString()
                  : entry.value}
                {entry.payload.unit && ` ${entry.payload.unit}`}
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
      <RechartsLineChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          {colors.map((color, index) => (
            <linearGradient
              key={index}
              id={`gradient-${index}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
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
          tickFormatter={(value) =>
            typeof value === 'number' ? value.toLocaleString() : value
          }
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#CBD5E1' }} />
        {showLegend && (
          <Legend
            wrapperStyle={{ fontFamily: 'Inter', fontSize: 12 }}
            iconType="circle"
          />
        )}
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index] || '#3B82F6'}
            strokeWidth={3}
            dot={{
              fill: colors[index] || '#3B82F6',
              strokeWidth: 2,
              r: 4,
            }}
            activeDot={{
              r: 6,
              strokeWidth: 2,
            }}
            name={key.charAt(0).toUpperCase() + key.slice(1)}
          />
        ))}
        {showArea &&
          dataKeys.map((key, index) => (
            <Area
              key={`area-${key}`}
              type="monotone"
              dataKey={key}
              stroke="none"
              fill={`url(#gradient-${index})`}
            />
          ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

LineChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      unit: PropTypes.string,
    }),
  ).isRequired,
  height: PropTypes.number,
  showLegend: PropTypes.bool,
  showArea: PropTypes.bool,
  dataKeys: PropTypes.arrayOf(PropTypes.string),
  colors: PropTypes.arrayOf(PropTypes.string),
};
