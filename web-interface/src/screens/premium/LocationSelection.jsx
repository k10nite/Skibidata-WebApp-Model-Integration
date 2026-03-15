import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { 
  MapPin, 
  Navigation, 
  Crosshair, 
  Check,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Header, Button, Card } from '../../components/premium';

/**
 * Screen 1: Location Selection
 * Bilingual: Filipino first, English second
 * Premium map interface with GPS functionality
 */
export default function LocationSelection({ onContinue }) {
  const screenRef = useRef(null);
  const mapRef = useRef(null);
  const pinRef = useRef(null);
  const pulseRef = useRef(null);
  
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState({
    lat: 16.4023,
    lng: 120.5960,
    name: 'Benguet State University',
    barangay: 'La Trinidad',
    municipality: 'Benguet'
  });
  const [isMapReady, setIsMapReady] = useState(false);

  // Entrance animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    // Stagger entrance for all elements
    tl.fromTo('.location-title',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 }
    )
    .fromTo('.location-subtitle',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4 },
      '-=0.3'
    )
    .fromTo('.map-container',
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.6 },
      '-=0.2'
    )
    .fromTo('.gps-button',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4 },
      '-=0.3'
    )
    .fromTo('.location-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.2'
    )
    .fromTo('.continue-button',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' },
      '-=0.2'
    );

    setIsMapReady(true);
  }, { scope: screenRef });

  // Pin pulse animation
  useEffect(() => {
    if (isMapReady && pulseRef.current) {
      gsap.to(pulseRef.current, {
        scale: 2,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        ease: 'power1.out'
      });
    }
  }, [isMapReady]);

  // Simulate GPS location
  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    
    // Animate GPS button
    gsap.to('.gps-button', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    // Simulate GPS delay
    setTimeout(() => {
      setIsLocating(false);
      
      // Animate pin drop
      gsap.fromTo(pinRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'bounce.out' }
      );

      // Show success feedback
      gsap.fromTo('.location-card',
        { scale: 1 },
        { scale: 1.02, duration: 0.2, yoyo: true, repeat: 1 }
      );
    }, 1500);
  };

  // Map grid pattern (stylized satellite view)
  const renderMapGrid = () => {
    const grid = [];
    for (let i = 0; i < 100; i++) {
      const isField = Math.random() > 0.3;
      const greenIntensity = Math.random();
      grid.push(
        <div
          key={i}
          className={`w-full h-full ${
            isField 
              ? greenIntensity > 0.7 
                ? 'bg-agri-forest/60' 
                : greenIntensity > 0.4 
                  ? 'bg-agri-rice/50' 
                  : 'bg-agri-forest/40'
              : 'bg-agri-earth/30'
          }`}
        />
      );
    }
    return grid;
  };

  return (
    <div ref={screenRef} className="min-h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <Header 
        title="Pumili ng Lokasyon"
        subtitle="Select Location"
        progress={1}
      />

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 flex flex-col gap-6">
        {/* Title Section */}
        <div className="text-center space-y-2">
          <h2 className="location-title font-display font-bold text-2xl text-gray-900">
            Saan ang iyong bukid?
          </h2>
          <p className="location-subtitle text-gray-500">
            Where is your farm located?
          </p>
        </div>

        {/* GPS Button */}
        <Button
          variant="secondary"
          fullWidth
          onClick={handleUseCurrentLocation}
          loading={isLocating}
          icon={isLocating ? null : Crosshair}
          className="gps-button"
        >
          {isLocating ? 'Kinukuha ang lokasyon...' : 'Gamitin ang Kasalukuyang Lokasyon'}
          {!isLocating && <span className="text-gray-400 font-normal"> / Use Current Location</span>}
        </Button>

        {/* Map Container */}
        <div className="map-container relative aspect-square rounded-3xl overflow-hidden shadow-lg">
          {/* Stylized Map Background */}
          <div 
            ref={mapRef}
            className="absolute inset-0 grid grid-cols-10 grid-rows-10"
          >
            {renderMapGrid()}
          </div>

          {/* Map Overlay - Roads */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Horizontal roads */}
            <div className="absolute top-1/3 left-0 right-0 h-1 bg-agri-sand/60" />
            <div className="absolute top-2/3 left-0 right-0 h-1 bg-agri-sand/60" />
            {/* Vertical roads */}
            <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-agri-sand/60" />
            <div className="absolute top-0 bottom-0 left-2/3 w-1 bg-agri-sand/60" />
          </div>

          {/* Pin Location */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Pulse Effect */}
            <div 
              ref={pulseRef}
              className="absolute w-16 h-16 bg-agri-forest/30 rounded-full"
            />
            
            {/* Pin */}
            <div 
              ref={pinRef}
              className="relative z-10"
            >
              <div className="relative">
                <MapPin className="w-12 h-12 text-agri-forest drop-shadow-lg" fill="#2E7D32" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-black/20 rounded-full blur-sm" />
              </div>
            </div>
          </div>

          {/* Coordinate Display */}
          <div className="absolute bottom-4 left-4 right-4">
            <Card variant="glass" padding="small" className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-agri-forest" />
                <span className="text-xs font-medium text-gray-700">
                  Lat: {location.lat.toFixed(4)}
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <span className="text-xs font-medium text-gray-700">
                Lng: {location.lng.toFixed(4)}
              </span>
            </Card>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all">
              <span className="text-lg font-bold text-gray-600">+</span>
            </button>
            <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all">
              <span className="text-lg font-bold text-gray-600">−</span>
            </button>
          </div>
        </div>

        {/* Location Details Card */}
        <Card className="location-card" elevation="medium">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-agri-forest/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-agri-forest" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-lg text-gray-900 truncate">
                {location.name}
              </h3>
              <p className="text-sm text-gray-500">
                {location.barangay}, {location.municipality}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-status-high bg-status-high/10 px-2 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  Nai-save / Saved
                </span>
              </div>
            </div>
          </div>
        </Card>
      </main>

      {/* Continue Button - Fixed at bottom */}
      <div className="sticky bottom-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 safe-area-bottom">
        <Button
          variant="primary"
          fullWidth
          size="large"
          onClick={() => onContinue?.(location)}
          icon={ChevronRight}
          iconPosition="right"
          className="continue-button"
        >
          Magpatuloy / Continue
        </Button>
      </div>
    </div>
  );
}
