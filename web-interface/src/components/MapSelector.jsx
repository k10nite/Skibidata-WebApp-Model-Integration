import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

const MapSelector = ({ onLocationSelect, selectedLocation }) => {
  // Default center: Philippines
  const defaultCenter = [12.8797, 121.774];
  const zoom = 6;

  return (
    <div className="map-selector">
      <MapContainer
        center={selectedLocation || defaultCenter}
        zoom={zoom}
        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
        {selectedLocation && <Marker position={selectedLocation} />}
      </MapContainer>
      {selectedLocation && (
        <div className="map-coordinates">
          Selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
};

export default MapSelector;
