import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';

/**
 * Professional Stat Card Component
 * Displays key metrics with animated numbers and optional trends
 */
export default function StatCard({
  value,
  label,
  unit = '',
  icon: Icon,
  trend,
  trendLabel = '',
  color = 'emerald',
  className = '',
  animated = true,
}) {
  const numberRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (animated && numberRef.current) {
      const numericValue = parseFloat(value) || 0;
      const obj = { value: 0 };

      gsap.to(obj, {
        value: numericValue,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.textContent =
              Math.round(obj.value).toLocaleString();
          }
        },
      });
    }
  }, [value, animated]);

  useEffect(() => {
    if (animated && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
      );
    }
  }, [animated]);

  const colorClasses = {
    emerald: {
      icon: 'text-emerald-600 bg-emerald-50',
      trend: 'text-emerald-600',
    },
    blue: {
      icon: 'text-blue-600 bg-blue-50',
      trend: 'text-blue-600',
    },
    red: {
      icon: 'text-red-600 bg-red-50',
      trend: 'text-red-600',
    },
    amber: {
      icon: 'text-amber-600 bg-amber-50',
      trend: 'text-amber-600',
    },
    purple: {
      icon: 'text-purple-600 bg-purple-50',
      trend: 'text-purple-600',
    },
    gray: {
      icon: 'text-gray-600 bg-gray-50',
      trend: 'text-gray-600',
    },
  };

  const getTrendIcon = () => {
    if (trend > 0) return '↑';
    if (trend < 0) return '↓';
    return '→';
  };

  const getTrendColor = () => {
    if (trend > 0) return 'text-emerald-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-inter text-sm font-medium text-gray-600 mb-2">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span
              ref={numberRef}
              className="font-inter text-3xl font-bold text-gray-900"
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && (
              <span className="font-inter text-lg font-medium text-gray-500">
                {unit}
              </span>
            )}
          </div>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`font-inter text-sm font-semibold ${getTrendColor()}`}>
                {getTrendIcon()} {Math.abs(trend)}%
              </span>
              {trendLabel && (
                <span className="font-inter text-xs text-gray-500">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={`p-3 rounded-lg ${colorClasses[color]?.icon || colorClasses.gray.icon}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
  unit: PropTypes.string,
  icon: PropTypes.elementType,
  trend: PropTypes.number,
  trendLabel: PropTypes.string,
  color: PropTypes.oneOf(['emerald', 'blue', 'red', 'amber', 'purple', 'gray']),
  className: PropTypes.string,
  animated: PropTypes.bool,
};
