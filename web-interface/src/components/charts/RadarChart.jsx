import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import PropTypes from 'prop-types';

/**
 * Professional Radar Chart for NPK Comparison
 * Displays multi-dimensional nutrient analysis
 */
export default function RadarChart({
  data,
  height = 400,
  showLegend = true,
  metrics = ['current', 'optimal'],
  colors = ['#EF4444', '#10B981'],
}) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-inter font-semibold text-gray-900 text-sm mb-2">
            {payload[0]?.payload?.subject}
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
                {entry.value.toLocaleString()}
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
      <RechartsRadarChart data={data}>
        <PolarGrid stroke="#E5E7EB" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{
            fill: '#6B7280',
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: 500,
          }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 'auto']}
          tick={{
            fill: '#9CA3AF',
            fontFamily: 'Inter',
            fontSize: 10,
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend
            wrapperStyle={{
              fontFamily: 'Inter',
              fontSize: 12,
              paddingTop: '20px',
            }}
            iconType="circle"
          />
        )}
        {metrics.map((metric, index) => (
          <Radar
            key={metric}
            name={metric.charAt(0).toUpperCase() + metric.slice(1)}
            dataKey={metric}
            stroke={colors[index] || '#3B82F6'}
            fill={colors[index] || '#3B82F6'}
            fillOpacity={0.25}
            strokeWidth={2}
          />
        ))}
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}

RadarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      subject: PropTypes.string.isRequired,
      unit: PropTypes.string,
    }),
  ).isRequired,
  height: PropTypes.number,
  showLegend: PropTypes.bool,
  metrics: PropTypes.arrayOf(PropTypes.string),
  colors: PropTypes.arrayOf(PropTypes.string),
};
