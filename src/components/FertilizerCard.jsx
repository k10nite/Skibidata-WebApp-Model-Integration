// FertilizerCard Component
// Displays a single fertilizer recommendation with all details

import { motion } from 'framer-motion';
import StatusIndicator from './StatusIndicator';

const PRIORITY_CONFIG = {
  High: {
    borderColor: '#EF4444',
    bgColor: '#FEE2E2',
    badgeColor: '#DC2626',
    icon: '⚠️'
  },
  Medium: {
    borderColor: '#F59E0B',
    bgColor: '#FEF3C7',
    badgeColor: '#D97706',
    icon: 'ℹ️'
  },
  Low: {
    borderColor: '#10B981',
    bgColor: '#D1FAE5',
    badgeColor: '#059669',
    icon: '✓'
  }
};

export default function FertilizerCard({ recommendation, animate = false, delay = 0 }) {
  const { nutrient, currentLevel, targetLevel, priority, fertilizer, reason } = recommendation;
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium;

  const CardComponent = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        initial: { opacity: 0, scale: 0.95, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { duration: 0.4, delay }
      }
    : {};

  return (
    <CardComponent
      className="bg-white rounded-xl p-5 shadow-lg"
      style={{
        border: `3px solid ${config.borderColor}`,
        backgroundColor: config.bgColor
      }}
      {...animationProps}
    >
      {/* Header: Nutrient + Priority Badge */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>{recommendation.visualIndicator?.icon || '🌾'}</span>
            {nutrient}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <StatusIndicator status={currentLevel} size="small" />
            <span className="text-gray-600 font-medium">→</span>
            <StatusIndicator status={targetLevel} size="small" />
          </div>
        </div>

        {/* Priority Badge */}
        <div
          className="px-3 py-1 rounded-full text-sm font-bold text-white flex items-center gap-1"
          style={{ backgroundColor: config.badgeColor }}
        >
          <span>{config.icon}</span>
          <span>{priority} Priority</span>
        </div>
      </div>

      {/* Reason */}
      <p className="text-sm text-gray-700 mb-4 italic">"{reason}"</p>

      {/* Fertilizer Product Details */}
      <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="text-lg font-bold text-gray-800">{fertilizer.name}</h4>
            <p className="text-sm text-gray-600">{fertilizer.manufacturer}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">₱{fertilizer.pricePerBag}</p>
            <p className="text-xs text-gray-500">{fertilizer.bagSize}</p>
          </div>
        </div>

        {/* NPK Formula */}
        <div className="bg-gray-100 px-3 py-2 rounded-lg mb-3">
          <p className="text-sm font-mono font-bold text-center text-gray-800">
            NPK: {fertilizer.formula}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-3">{fertilizer.description}</p>

        {/* Application Details */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-green-600 font-bold">📊</span>
            <div>
              <p className="text-xs font-semibold text-gray-600">Application Rate:</p>
              <p className="text-sm text-gray-800">{fertilizer.applicationRate}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">⏰</span>
            <div>
              <p className="text-xs font-semibold text-gray-600">Timing:</p>
              <p className="text-sm text-gray-800">{fertilizer.applicationTiming}</p>
            </div>
          </div>

          {fertilizer.precautions && (
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 font-bold">⚠️</span>
              <div>
                <p className="text-xs font-semibold text-gray-600">Precautions:</p>
                <p className="text-sm text-gray-800">{fertilizer.precautions}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </CardComponent>
  );
}
