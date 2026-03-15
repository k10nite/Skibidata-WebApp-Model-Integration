// NutrientCard Component
// Displays a single nutrient with its status, icon, and description

import { motion } from 'framer-motion';
import StatusIndicator from './StatusIndicator';

const NUTRIENT_INFO = {
  nitrogen: {
    name: 'Nitrogen (N)',
    icon: '🌱',
    color: '#10B981',
    description: 'Essential for leaf and stem growth'
  },
  phosphorus: {
    name: 'Phosphorus (P)',
    icon: '🌿',
    color: '#F59E0B',
    description: 'Promotes root development and flowering'
  },
  potassium: {
    name: 'Potassium (K)',
    icon: '🍃',
    color: '#8B5CF6',
    description: 'Improves fruit quality and disease resistance'
  },
  pH: {
    name: 'Soil pH',
    icon: '⚖️',
    color: '#3B82F6',
    description: 'Affects nutrient availability to plants'
  }
};

export default function NutrientCard({
  nutrient,
  status,
  showDescription = true,
  animate = false,
  delay = 0
}) {
  const info = NUTRIENT_INFO[nutrient.toLowerCase()] || {
    name: nutrient,
    icon: '📊',
    color: '#6B7280',
    description: ''
  };

  const CardComponent = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay }
      }
    : {};

  return (
    <CardComponent
      className="bg-white rounded-lg p-4 shadow-md border-2 border-gray-100 hover:shadow-lg transition-shadow"
      {...animationProps}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Icon + Name */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl" role="img" aria-label={info.name}>
              {info.icon}
            </span>
            <h3 className="text-lg font-semibold text-gray-800">{info.name}</h3>
          </div>
          {showDescription && (
            <p className="text-sm text-gray-600">{info.description}</p>
          )}
        </div>

        {/* Right: Status Indicator */}
        <div className="flex-shrink-0">
          <StatusIndicator status={status} size="medium" animate={animate} />
        </div>
      </div>
    </CardComponent>
  );
}
