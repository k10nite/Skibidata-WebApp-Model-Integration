import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';

/**
 * Apple-style Progress Bar Component
 * Clean, minimalist progress indicator with smooth animations
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  label = '',
  showPercentage = true,
  color = 'emerald',
  size = 'md',
  className = '',
}) {
  const progressRef = useRef(null);
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  useEffect(() => {
    if (progressRef.current) {
      gsap.fromTo(
        progressRef.current,
        { width: '0%' },
        {
          width: `${percentage}%`,
          duration: 1.2,
          ease: 'power3.out',
        },
      );
    }
  }, [percentage]);

  const colorClasses = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
  };

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
    xl: 'h-4',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span
              className={`font-inter font-medium text-gray-700 ${textSizeClasses[size]}`}
            >
              {label}
            </span>
          )}
          {showPercentage && (
            <span
              className={`font-inter font-semibold text-gray-900 ${textSizeClasses[size]}`}
            >
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-gray-100 rounded-full overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          ref={progressRef}
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300 ease-out shadow-sm`}
          style={{ width: '0%' }}
        />
      </div>
    </div>
  );
}

ProgressBar.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  label: PropTypes.string,
  showPercentage: PropTypes.bool,
  color: PropTypes.oneOf([
    'emerald',
    'blue',
    'red',
    'amber',
    'purple',
    'green',
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};
