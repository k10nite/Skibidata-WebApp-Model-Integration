import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  CloudDrizzle,
  Wind,
  Droplets,
  Thermometer,
} from 'lucide-react';

/**
 * Professional Weather Widget Component
 * Displays current weather conditions with animated elements
 */
export default function WeatherWidget({
  temperature,
  condition = 'sunny',
  humidity,
  windSpeed,
  location = '',
  unit = '°C',
  className = '',
  animated = true,
}) {
  const widgetRef = useRef(null);

  useEffect(() => {
    if (animated && widgetRef.current) {
      gsap.fromTo(
        widgetRef.current,
        {
          opacity: 0,
          scale: 0.95,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power3.out',
        },
      );
    }
  }, [animated]);

  const weatherIcons = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    drizzle: CloudDrizzle,
    snowy: CloudSnow,
  };

  const weatherColors = {
    sunny: 'text-amber-500 bg-amber-50',
    cloudy: 'text-gray-500 bg-gray-50',
    rainy: 'text-blue-500 bg-blue-50',
    drizzle: 'text-blue-400 bg-blue-50',
    snowy: 'text-cyan-500 bg-cyan-50',
  };

  const WeatherIcon = weatherIcons[condition] || Sun;
  const weatherColor = weatherColors[condition] || weatherColors.sunny;

  return (
    <div
      ref={widgetRef}
      className={`bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-inter text-sm font-medium text-gray-600 mb-1">
            Current Weather
          </h3>
          {location && (
            <p className="font-inter text-xs text-gray-500">{location}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${weatherColor}`}>
          <WeatherIcon className="w-8 h-8" />
        </div>
      </div>

      {/* Temperature */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="font-inter text-5xl font-bold text-gray-900">
            {temperature}
          </span>
          <span className="font-inter text-2xl font-medium text-gray-500">
            {unit}
          </span>
        </div>
        <p className="font-inter text-sm font-medium text-gray-600 mt-2 capitalize">
          {condition}
        </p>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        {/* Humidity */}
        {humidity !== undefined && (
          <div className="flex flex-col items-center">
            <Droplets className="w-5 h-5 text-blue-500 mb-1" />
            <span className="font-inter text-xs text-gray-500 mb-1">
              Humidity
            </span>
            <span className="font-inter text-sm font-semibold text-gray-900">
              {humidity}%
            </span>
          </div>
        )}

        {/* Wind Speed */}
        {windSpeed !== undefined && (
          <div className="flex flex-col items-center">
            <Wind className="w-5 h-5 text-gray-500 mb-1" />
            <span className="font-inter text-xs text-gray-500 mb-1">Wind</span>
            <span className="font-inter text-sm font-semibold text-gray-900">
              {windSpeed} km/h
            </span>
          </div>
        )}

        {/* Feels Like (optional) */}
        <div className="flex flex-col items-center">
          <Thermometer className="w-5 h-5 text-emerald-500 mb-1" />
          <span className="font-inter text-xs text-gray-500 mb-1">
            Feels Like
          </span>
          <span className="font-inter text-sm font-semibold text-gray-900">
            {temperature - 2}
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
}

WeatherWidget.propTypes = {
  temperature: PropTypes.number.isRequired,
  condition: PropTypes.oneOf(['sunny', 'cloudy', 'rainy', 'drizzle', 'snowy']),
  humidity: PropTypes.number,
  windSpeed: PropTypes.number,
  location: PropTypes.string,
  unit: PropTypes.oneOf(['°C', '°F']),
  className: PropTypes.string,
  animated: PropTypes.bool,
};
