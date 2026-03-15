// MapPicker Component
// Interactive map for location selection using Leaflet
// Allows GPS location or manual map clicking

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import { CAR_BOUNDS } from '../data/carLocations';

// Fix for default marker icon in react-leaflet
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Component to handle map clicks
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    },
  });

  return position ? (
    <Marker position={[position.lat, position.lng]}>
      <Popup>
        Selected Location<br />
        Lat: {position.lat.toFixed(4)}<br />
        Lng: {position.lng.toFixed(4)}
      </Popup>
    </Marker>
  ) : null;
}

export default function MapPicker({ onLocationSelect, initialPosition = null }) {
  const [position, setPosition] = useState(initialPosition);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  // Handle GPS location request
  const handleGetGPS = () => {
    setGpsLoading(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('GPS not supported by your browser');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setPosition(newPos);
        setGpsLoading(false);
        if (onLocationSelect) {
          onLocationSelect(newPos);
        }
      },
      (error) => {
        setGpsError(`GPS Error: ${error.message}`);
        setGpsLoading(false);
        // Fallback to CAR center for demo
        const fallbackPos = {
          lat: CAR_BOUNDS.center.lat,
          lng: CAR_BOUNDS.center.lng
        };
        setPosition(fallbackPos);
        if (onLocationSelect) {
          onLocationSelect(fallbackPos);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Update parent when position changes
  useEffect(() => {
    if (position && onLocationSelect) {
      onLocationSelect(position);
    }
  }, [position, onLocationSelect]);

  return (
    <div className="space-y-4">
      {/* GPS Button */}
      <motion.button
        onClick={handleGetGPS}
        disabled={gpsLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        whileTap={{ scale: 0.98 }}
      >
        {gpsLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Getting GPS Location...</span>
          </>
        ) : (
          <>
            <span>📍</span>
            <span>Use My GPS Location</span>
          </>
        )}
      </motion.button>

      {/* GPS Error Message */}
      {gpsError && (
        <div className="bg-yellow-50 border-2 border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg text-sm">
          {gpsError}
          <br />
          <span className="text-xs">Using default CAR location. Click on the map to select your location.</span>
        </div>
      )}

      {/* Map Instructions */}
      <div className="bg-gray-50 border-2 border-gray-200 px-4 py-3 rounded-lg text-sm text-gray-700">
        <strong>Tip:</strong> Click anywhere on the map to select your farm location
      </div>

      {/* Map Container */}
      <div className="rounded-lg overflow-hidden shadow-lg border-4 border-gray-200">
        <MapContainer
          center={[CAR_BOUNDS.center.lat, CAR_BOUNDS.center.lng]}
          zoom={CAR_BOUNDS.zoom}
          style={{ height: '400px', width: '100%' }}
          minZoom={CAR_BOUNDS.minZoom}
          maxZoom={CAR_BOUNDS.maxZoom}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      {/* Selected Location Display */}
      {position && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border-2 border-green-300 px-4 py-3 rounded-lg"
        >
          <div className="flex items-center gap-2 text-green-800">
            <span className="text-xl">✅</span>
            <div>
              <p className="font-semibold">Location Selected</p>
              <p className="text-sm">
                Latitude: {position.lat.toFixed(4)}, Longitude: {position.lng.toFixed(4)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
