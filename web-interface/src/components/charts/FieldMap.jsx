import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { MapPin, Maximize2, Minimize2 } from 'lucide-react';

/**
 * Professional Field Map Component
 * Displays satellite imagery with interactive overlay
 */
export default function FieldMap({
  imageUrl,
  location = '',
  coordinates = { lat: 0, lng: 0 },
  overlayData = [],
  className = '',
  animated = true,
  height = 400,
}) {
  const mapRef = useRef(null);
  const overlayRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (animated && mapRef.current) {
      gsap.fromTo(
        mapRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
      );
    }
  }, [animated]);

  useEffect(() => {
    if (animated && overlayRef.current) {
      gsap.fromTo(
        overlayRef.current.children,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          delay: 0.3,
        },
      );
    }
  }, [overlayData, animated]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      ref={mapRef}
      className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${
        isFullscreen ? 'fixed inset-4 z-50' : ''
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="font-inter text-sm font-semibold text-gray-900">
              Field Map
            </h3>
            {location && (
              <p className="font-inter text-xs text-gray-500">{location}</p>
            )}
          </div>
        </div>
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-gray-600" />
          ) : (
            <Maximize2 className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Map Container */}
      <div
        className="relative bg-gray-100"
        style={{ height: isFullscreen ? 'calc(100% - 65px)' : `${height}px` }}
      >
        {/* Satellite Image */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Field satellite view"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-emerald-300 mx-auto mb-3" />
              <p className="font-inter text-sm text-gray-500">
                No satellite imagery available
              </p>
              <p className="font-inter text-xs text-gray-400 mt-1">
                {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </p>
            </div>
          </div>
        )}

        {/* Overlay Data Points */}
        {overlayData.length > 0 && (
          <div ref={overlayRef} className="absolute inset-0 pointer-events-none">
            {overlayData.map((point, index) => (
              <div
                key={index}
                className="absolute pointer-events-auto"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="relative group">
                  {/* Marker */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer ${
                      point.status === 'good'
                        ? 'bg-emerald-500'
                        : point.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                    }`}
                  >
                    <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-current" />
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 whitespace-nowrap">
                      <p className="font-inter text-xs font-semibold text-gray-900">
                        {point.label}
                      </p>
                      {point.value && (
                        <p className="font-inter text-xs text-gray-600 mt-1">
                          {point.value}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Coordinates Display */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
          <p className="font-inter text-xs text-gray-600">
            Lat: {coordinates.lat.toFixed(4)}°, Lng: {coordinates.lng.toFixed(4)}°
          </p>
        </div>

        {/* Legend */}
        {overlayData.length > 0 && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
            <p className="font-inter text-xs font-semibold text-gray-900 mb-2">
              Status
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-inter text-xs text-gray-600">Good</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="font-inter text-xs text-gray-600">
                  Warning
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="font-inter text-xs text-gray-600">
                  Critical
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

FieldMap.propTypes = {
  imageUrl: PropTypes.string,
  location: PropTypes.string,
  coordinates: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  overlayData: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string,
      status: PropTypes.oneOf(['good', 'warning', 'critical']),
    }),
  ),
  className: PropTypes.string,
  animated: PropTypes.bool,
  height: PropTypes.number,
};
