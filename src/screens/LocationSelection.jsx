import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Crosshair, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

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
  const [draggable] = useState(true);
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
  const mapContainerRef = useRef(null);
  const continueBtnRef = useRef(null);
  const gpsBtnRef = useRef(null);
  const pulseRef = useRef(null);

  // Animation variants for motion
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { y: 16, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

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
    // Navigate to plant selection screen
    console.log('Continue with location:', position);
    navigate('/plant-selection');
  };

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-[var(--color-paper)] relative overflow-hidden"
    >
      {/* Topographic background contours */}
      <svg className="terrace-topo opacity-8" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <path
          d="M0,200 Q300,150 600,200 T1200,200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.6"
        />
        <path
          d="M0,350 Q400,300 800,350 T1200,350"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.4"
        />
        <path
          d="M0,500 Q200,450 500,500 T1200,500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />
      </svg>

      <div className="relative z-10 min-h-screen flex">
        {/* Map Section - 62% Hero */}
        <motion.div
          variants={itemVariants}
          className="w-full lg:w-[62%] relative"
        >
          <div className="h-screen p-6 lg:p-12 flex flex-col">
            {/* Eyebrow and title */}
            <motion.div variants={itemVariants} className="mb-8 lg:mb-12">
              <div className="terrace-eyebrow mb-6">01 — LOCATION</div>
              <h1
                className="terrace-display text-4xl lg:text-6xl mb-4"
                style={{
                  fontFamily: '"Fraunces", serif',
                  fontVariationSettings: '"opsz" 144, "wght" 600'
                }}
              >
                Where is your field?
              </h1>
            </motion.div>

            {/* Map Container - takes remaining space */}
            <motion.div
              variants={itemVariants}
              ref={mapContainerRef}
              className="flex-1 relative"
            >
              <div className="h-full w-full terrace-card-hairline overflow-hidden">
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
            </motion.div>
          </div>
        </motion.div>

        {/* Editorial Rail - 38% */}
        <motion.div
          variants={itemVariants}
          className="hidden lg:block w-[38%] bg-[var(--color-paper-card)] relative"
        >
          <div className="h-screen p-12 flex flex-col justify-between">
            {/* Editorial content */}
            <div className="space-y-8">
              <motion.div variants={itemVariants} className="space-y-4">
                <p className="text-[var(--color-earth-deep)] leading-relaxed">
                  Your selected location determines which Sentinel-2 satellite imagery we&apos;ll use to analyze soil composition and nutrient patterns across your field.
                </p>
                <p className="text-[var(--color-earth-deep)]/80 text-sm">
                  The Cordillera region&apos;s unique terraced landscapes require precise positioning for accurate soil heritage mapping.
                </p>
              </motion.div>

              {/* Current coordinates - data as ornament */}
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="terrace-eyebrow">COORDINATES</div>
                <div className="space-y-3">
                  <div
                    className="terrace-data text-4xl lg:text-5xl text-[var(--color-moss)]"
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontVariantNumeric: 'tabular-nums'
                    }}
                  >
                    {position.lat.toFixed(4)}° N
                  </div>
                  <div
                    className="terrace-data text-4xl lg:text-5xl text-[var(--color-moss)]"
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontVariantNumeric: 'tabular-nums'
                    }}
                  >
                    {position.lng.toFixed(4)}° E
                  </div>
                </div>
              </motion.div>

              {/* GPS Button */}
              <motion.div variants={itemVariants}>
                <button
                  ref={gpsBtnRef}
                  onClick={handleSelectGPS}
                  disabled={isLocating}
                  className="group w-full terrace-btn flex items-center justify-center gap-3 py-4 disabled:opacity-70"
                >
                  <Crosshair className={`w-5 h-5 ${isLocating ? 'animate-pulse' : ''}`} />
                  {isLocating ? 'Locating...' : 'Use GPS Location'}
                </button>
                <p className="text-xs text-[var(--color-earth-deep)]/50 mt-3 text-center">
                  Or click anywhere on the map
                </p>
              </motion.div>
            </div>

            {/* Continue Button */}
            {showContinue && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="pt-8 border-t border-[var(--color-contour)]"
              >
                <button
                  ref={continueBtnRef}
                  onClick={handleContinue}
                  className="terrace-btn w-full group hover:scale-[1.01] transition-all duration-300"
                  style={{ padding: '1.2rem 2rem' }}
                >
                  Continue to Plant Selection
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Mobile-only continue button */}
      {showContinue && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-6 bg-gradient-to-t from-[var(--color-paper)] via-[var(--color-paper)] to-transparent">
          <button
            ref={continueBtnRef}
            onClick={handleContinue}
            className="terrace-btn w-full group flex items-center justify-between px-6 py-4"
          >
            <span>Continue to Plant Selection</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

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
    </motion.div>
  );
}
