import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Crosshair, MapPin, Navigation, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom pin icon for rice field theme
const customPinIcon = L.divIcon({
  className: 'custom-pin',
  html: `
    <div style="
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #2E7D32 0%, #84934A 100%);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 12px rgba(46, 125, 50, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" style="transform: rotate(45deg);">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

// Draggable marker component
function DraggableMarker({ position, setPosition }) {
  const [draggable, setDraggable] = useState(true);
  const markerRef = useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        setPosition(marker.getLatLng());
      }
    },
  };

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={customPinIcon}>
    </Marker>
  );
}

// Map click handler component
function MapClickHandler({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

export default function LocationSelection() {
  const navigate = useNavigate();
  // Default position (Philippines center - roughly Manila area)
  const [position, setPosition] = useState({ lat: 14.5995, lng: 120.9842 });
  const [isLocating, setIsLocating] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const mapContainerRef = useRef(null);
  const locationCardRef = useRef(null);
  const continueBtnRef = useRef(null);
  const gpsBtnRef = useRef(null);
  const pulseRef = useRef(null);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      // Map container animation
      gsap.fromTo(
        mapContainerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' }
      );

      // Location card animation
      gsap.fromTo(
        locationCardRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.4, ease: 'power3.out' }
      );

      // GPS button animation
      gsap.fromTo(
        gpsBtnRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, delay: 0.6, ease: 'back.out(1.7)' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Continue button slide-up animation
  useEffect(() => {
    if (showContinue && continueBtnRef.current) {
      gsap.fromTo(
        continueBtnRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [showContinue]);

  // GPS pulse animation
  useEffect(() => {
    if (isLocating && pulseRef.current) {
      gsap.to(pulseRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 1,
        repeat: -1,
        ease: 'power1.out',
      });
    } else if (pulseRef.current) {
      gsap.killTweensOf(pulseRef.current);
      gsap.set(pulseRef.current, { scale: 1, opacity: 0.3 });
    }
  }, [isLocating]);

  const handleSelectGPS = () => {
    setIsLocating(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPosition = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setPosition(newPosition);
          setIsLocating(false);
          setShowContinue(true);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLocating(false);
          setShowContinue(true);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
      setShowContinue(true);
    }
  };

  // Show continue button when position changes (from dragging/clicking)
  useEffect(() => {
    // Don't show on initial load, only when user interacts
    const hasChanged = position.lat !== 14.5995 || position.lng !== 120.9842;
    if (hasChanged) {
      setShowContinue(true);
    }
  }, [position]);

  const handleContinue = () => {
    // Button click animation
    gsap.to(continueBtnRef.current, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        // Navigate to plant selection screen
        console.log('Continue with location:', position);
        navigate('/plant-selection-kimi');
      },
    });
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-[#FAFAF8] via-[#F5F7F2] to-[#E8EDE3] relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-[#2E7D32]/5 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#84934A]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-60 h-60 rounded-full bg-[#2E7D32]/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 pt-6 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2E7D32] to-[#84934A] flex items-center justify-center shadow-lg shadow-[#2E7D32]/20">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold tracking-widest text-[#84934A] uppercase">
              Step 1 of 4
            </span>
          </div>
        </div>
      </header>

      {/* Title Section */}
      <div ref={titleRef} className="relative z-10 px-4 sm:px-6 lg:px-8 mb-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#492828] leading-tight mb-2">
            Select Farm Location
          </h1>
          <p className="mt-3 text-sm text-[#492828]/60 max-w-md mx-auto">
            Drag the pin on the map or use GPS to set your farm location
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div
        ref={mapContainerRef}
        className="relative z-10 px-4 sm:px-6 lg:px-8 mb-6"
      >
        <div className="max-w-lg mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#2E7D32]/15 border-4 border-white">
            <div className="h-80 sm:h-96 w-full">
              <MapContainer
                center={[position.lat, position.lng]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DraggableMarker position={position} setPosition={setPosition} />
                <MapClickHandler setPosition={setPosition} />
              </MapContainer>
            </div>

            {/* Map overlay gradient */}
            <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-inner"
                 style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.1)' }} />
          </div>
        </div>
      </div>

      {/* GPS Button */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 mb-6">
        <div className="max-w-lg mx-auto">
          <button
            ref={gpsBtnRef}
            onClick={handleSelectGPS}
            disabled={isLocating}
            className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#2E7D32] to-[#84934A] rounded-2xl shadow-xl shadow-[#2E7D32]/20 hover:shadow-2xl hover:shadow-[#2E7D32]/30 transition-all duration-300 disabled:opacity-70"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isLocating ? 'bg-white/30' : 'bg-white/20 group-hover:bg-white/30'
            }`}>
              <Crosshair className={`w-5 h-5 text-white ${isLocating ? 'animate-pulse' : ''}`} />
            </div>

            <div className="text-left flex-1">
              <span className="block text-base font-semibold text-white">
                {isLocating ? 'Getting Your Location...' : 'Use My Current Location'}
              </span>
              <span className="block text-xs text-white/70">
                {isLocating ? 'Please wait...' : 'Automatically set pin to GPS location'}
              </span>
            </div>
          </button>

          <p className="text-center text-xs text-[#492828]/40 mt-2">
            You can also click or drag the pin on the map
          </p>
        </div>
      </div>

      {/* Location Info Card */}
      <div
        ref={locationCardRef}
        className="relative z-10 px-4 sm:px-6 lg:px-8 mb-6"
      >
        <div className="max-w-lg mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-xl shadow-[#2E7D32]/10 border border-[#2E7D32]/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2E7D32]/10 to-[#84934A]/10 flex items-center justify-center flex-shrink-0">
                <Navigation className="w-6 h-6 text-[#2E7D32]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[#492828] mb-1">
                  Current Location
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#492828]/50 w-8">Lat:</span>
                    <span className="font-mono text-[#2E7D32] font-medium">
                      {position.lat.toFixed(6)}° N
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#492828]/50 w-8">Lng:</span>
                    <span className="font-mono text-[#2E7D32] font-medium">
                      {position.lng.toFixed(6)}° E
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button - Floating */}
      {showContinue && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-4 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8] to-transparent">
          <div className="max-w-lg mx-auto">
            <button
              ref={continueBtnRef}
              onClick={handleContinue}
              className="group w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#2E7D32] to-[#84934A] rounded-2xl shadow-2xl shadow-[#2E7D32]/30 hover:shadow-[#2E7D32]/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="text-left">
                <span className="block text-base font-semibold text-white">
                  Continue to Plant Selection
                </span>
                <span className="block text-xs text-white/70">
                  Next Step
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white/80 hidden sm:block">
                  Step 2
                </span>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                  <ChevronRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Spacer for floating button */}
      {showContinue && <div className="h-24" />}

      {/* Custom CSS for Leaflet */}
      <style>{`
        .leaflet-container {
          font-family: inherit;
        }
        .leaflet-control-attribution {
          font-size: 8px !important;
          opacity: 0.6;
        }
        .custom-pin {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}
