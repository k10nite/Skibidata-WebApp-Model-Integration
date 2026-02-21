// SCREEN 1: LOCATION SELECTION - Filipino Rice Terrace Pin Drop
// Earthy Farm Tech aesthetic with GSAP animations and real Unsplash imagery

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin, Navigation, CheckCircle2 } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import useAppStore from '../store/appStore';
import { getMunicipalityByCoordinates } from '../data/carLocations';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom rice terrace marker icon
const riceTerraceIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzg0OTM0QSIgZmlsbC1vcGFjaXR5PSIwLjkiLz4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxNSIgZmlsbD0iI0ZBRjlGNiIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KICA8cGF0aCBkPSJNMjAgMTBWMzBNMTAgMjBIMzAiIHN0cm9rZT0iI0ZBRjlGNiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Map click handler component
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationSelection() {
  const navigate = useNavigate();
  const { setLocation } = useAppStore();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [coordinates, setCoordinates] = useState('');

  // Refs for GSAP animations
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const gpsButtonRef = useRef(null);
  const mapButtonRef = useRef(null);
  const confirmCardRef = useRef(null);
  const continueButtonRef = useRef(null);
  const coordinatesRef = useRef(null);

  // Central Luzon default position (Nueva Ecija rice terraces)
  const defaultCenter = [16.4023, 120.5960];

  // Create soil particles effect
  useEffect(() => {
    const particles = [];
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'soil-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 8}s`;
      particle.style.animationDuration = `${6 + Math.random() * 4}s`;
      containerRef.current?.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach(p => p.remove());
    };
  }, []);

  // GSAP Animations
  useGSAP(() => {
    // Screen fade-in with soil particle effect
    const tl = gsap.timeline();

    tl.from(containerRef.current, {
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    })
    .from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.5')
    .from([gpsButtonRef.current, mapButtonRef.current], {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: 'back.out(1.7)',
    }, '-=0.4');

    // GPS button pulse animation
    gsap.to(gpsButtonRef.current, {
      scale: 1.05,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);

  // Animate confirmation card
  useGSAP(() => {
    if (showConfirmation && confirmCardRef.current) {
      gsap.fromTo(confirmCardRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );

      // Typewriter effect for coordinates
      if (coordinatesRef.current && coordinates) {
        const coordsText = coordinates;
        let currentText = '';
        let index = 0;

        const typeInterval = setInterval(() => {
          if (index < coordsText.length) {
            currentText += coordsText[index];
            coordinatesRef.current.textContent = currentText;
            index++;
          } else {
            clearInterval(typeInterval);
          }
        }, 50);

        return () => clearInterval(typeInterval);
      }
    }
  }, [showConfirmation, coordinates]);

  // Animate continue button with magnetic attraction
  useGSAP(() => {
    if (continueButtonRef.current && selectedLocation) {
      gsap.from(continueButtonRef.current, {
        scale: 0,
        rotation: 360,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
      });
    }
  }, [selectedLocation]);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    setShowConfirmation(true);
    setCoordinates(`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
  };

  const handleUseGPS = () => {
    setIsGettingLocation(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          handleLocationChange(location);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to Central Luzon default
          handleLocationChange({ lat: defaultCenter[0], lng: defaultCenter[1] });
          setIsGettingLocation(false);
        }
      );
    } else {
      // Fallback to default location
      handleLocationChange({ lat: defaultCenter[0], lng: defaultCenter[1] });
      setIsGettingLocation(false);
    }
  };

  const handleContinue = () => {
    if (selectedLocation) {
      const municipality = getMunicipalityByCoordinates(
        selectedLocation.lat,
        selectedLocation.lng
      );

      setLocation(
        selectedLocation,
        municipality.name,
        municipality.barangays[0]?.name || 'Unknown'
      );

      navigate('/plant-selection');
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(73, 40, 40, 0.3), rgba(73, 40, 40, 0.3)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Glass Morphism Header */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/20 border-b border-white/30 shadow-soil-md"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1
            className="text-[2.5rem] font-display font-bold text-white text-center mb-2"
            style={{ fontFamily: 'var(--font-display)', textShadow: '0 2px 8px rgba(73, 40, 40, 0.5)' }}
          >
            Piliin ang Iyong Bukid
          </h1>
          <p
            className="text-lg font-heading text-white/90 text-center"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Central Luzon Terrace Mapping
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-40 pb-12 px-4 max-w-6xl mx-auto">
        {/* Interactive Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          {/* GPS Location Button */}
          <button
            ref={gpsButtonRef}
            onClick={handleUseGPS}
            disabled={isGettingLocation}
            className="btn-magnetic bg-primary hover:bg-secondary text-white px-8 py-4 rounded-[2rem] shadow-soil-lg flex items-center justify-center gap-3 text-lg font-heading font-semibold transition-all"
            style={{
              fontFamily: 'var(--font-heading)',
              backgroundColor: 'var(--color-primary)',
            }}
          >
            <Navigation className="w-6 h-6" />
            {isGettingLocation ? 'Getting Location...' : 'Use GPS Location'}
          </button>

          {/* Drop Pin Button */}
          <button
            ref={mapButtonRef}
            className="btn-magnetic bg-white/90 hover:bg-white text-earth px-8 py-4 rounded-[2rem] shadow-soil-lg flex items-center justify-center gap-3 text-lg font-heading font-semibold transition-all border-2 border-secondary/30"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-earth)',
              borderColor: 'var(--color-secondary)',
            }}
          >
            <MapPin className="w-6 h-6" />
            Drop Pin on Map
          </button>
        </div>

        {/* Map Container - Clay Card Style */}
        <div className="clay-card overflow-hidden shadow-soil-lg mb-8" style={{ height: '500px' }}>
          <MapContainer
            center={defaultCenter}
            zoom={10}
            style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-lg)' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler onLocationSelect={handleLocationChange} />
            {selectedLocation && (
              <Marker
                position={[selectedLocation.lat, selectedLocation.lng]}
                icon={riceTerraceIcon}
              />
            )}
          </MapContainer>
        </div>

        {/* Location Confirmation Card - Slides up from bottom */}
        {showConfirmation && (
          <div
            ref={confirmCardRef}
            className="clay-card p-6 mb-6 bg-white"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div className="flex-1">
                <h3
                  className="text-xl font-heading font-bold mb-2"
                  style={{ color: 'var(--color-earth)', fontFamily: 'var(--font-heading)' }}
                >
                  Location Selected
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-heading font-semibold mb-1" style={{ color: 'var(--color-secondary)' }}>
                      Coordinates
                    </p>
                    <p
                      ref={coordinatesRef}
                      className="data-text text-earth"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {coordinates}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-heading font-semibold mb-1" style={{ color: 'var(--color-secondary)' }}>
                      Region
                    </p>
                    <p className="font-heading" style={{ color: 'var(--color-earth)' }}>
                      Central Luzon Rice Terraces
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button - Magnetic Attraction */}
        {selectedLocation && (
          <div className="flex justify-center">
            <button
              ref={continueButtonRef}
              onClick={handleContinue}
              className="btn-magnetic bg-primary hover:bg-secondary text-white px-12 py-5 rounded-[2.5rem] shadow-soil-lg text-xl font-display font-bold transition-all flex items-center gap-3"
              style={{
                fontFamily: 'var(--font-display)',
                backgroundColor: 'var(--color-primary)',
              }}
            >
              Continue to Plant Selection
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        )}

        {/* Info Banner */}
        <div
          className="mt-8 clay-card bg-white/95 p-6 border-l-4"
          style={{ borderLeftColor: 'var(--color-primary)' }}
        >
          <p
            className="concept-text text-center"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-earth)',
              fontSize: '1rem',
            }}
          >
            <strong>Pagsasaka sa Lupa</strong> - This system provides precise fertilizer recommendations
            based on your farm's soil composition and location within the Central Luzon agricultural region.
          </p>
        </div>
      </div>
    </div>
  );
}
