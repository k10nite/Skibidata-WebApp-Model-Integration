import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Wand2, AlertTriangle } from 'lucide-react';

import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as turf from '@turf/turf';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import useAppStore from '../store/appStore';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// 8 webapp locations — mirrors src/services/satelliteService.js:CAR_COORDINATES.
// Used to snap a freely-drawn polygon back to the nearest known municipality
// so the existing downstream flow (Processing → predictForLocation(name)) keeps working.
const CAR_LOCATIONS = [
  { name: 'La Trinidad', lat: 16.4619, lng: 120.5874 },
  { name: 'Atok',        lat: 16.5847, lng: 120.7078 },
  { name: 'Benguet',     lat: 16.4023, lng: 120.5960 },
  { name: 'Baguio',      lat: 16.4023, lng: 120.5960 },
  { name: 'Tublay',      lat: 16.4833, lng: 120.6167 },
  { name: 'Kapangan',    lat: 16.5667, lng: 120.5833 },
  { name: 'Bokod',       lat: 16.4833, lng: 120.8333 },
  { name: 'Kabayan',     lat: 16.6167, lng: 120.8167 }
];

function nearestMunicipality(lat, lng) {
  let best = null;
  let bestDist = Infinity;
  for (const loc of CAR_LOCATIONS) {
    const dlat = loc.lat - lat;
    const dlng = loc.lng - lng;
    const d = Math.sqrt(dlat * dlat + dlng * dlng);
    if (d < bestDist) { bestDist = d; best = loc; }
  }
  return best;
}

// Generate a fake field polygon for demo when the user hits "Magic Click".
// Mirrors Junsel's mapbox/index.html prototype: turf.circle with light noise.
function makeSimulatedField(center) {
  const radius = 0.02 + Math.random() * 0.05; // 20-70m
  const circle = turf.circle(center, radius, { steps: 10, units: 'kilometers' });
  circle.geometry.coordinates[0].forEach((c, i) => {
    if (i % 2 === 0) {
      c[0] += (Math.random() - 0.5) * 0.0005;
      c[1] += (Math.random() - 0.5) * 0.0005;
    }
  });
  return circle;
}

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};
const itemVariants = {
  initial: { y: 16, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

export default function LocationSelection() {
  const navigate = useNavigate();
  const setField = useAppStore((s) => s.setField);
  const setLocation = useAppStore((s) => s.setLocation);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const drawRef = useRef(null);

  const [areaHa, setAreaHa] = useState(0);
  const [centroid, setCentroid] = useState(null);
  const [municipalityName, setMunicipalityName] = useState(null);
  const [isMagicMode, setIsMagicMode] = useState(false);
  const isMagicModeRef = useRef(false);
  useEffect(() => { isMagicModeRef.current = isMagicMode; }, [isMagicMode]);

  // Initialize map once.
  useEffect(() => {
    if (!MAPBOX_TOKEN || mapRef.current || !mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [120.5878, 16.4550], // La Trinidad
      zoom: 13,
      pitch: 0
    });
    mapRef.current = map;

    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN,
      mapboxgl,
      marker: false,
      placeholder: 'Search address or municipality…'
    });
    map.addControl(geocoder, 'top-left');
    geocoder.on('result', (e) => {
      const coords = e.result.geometry.coordinates;
      map.flyTo({ center: coords, zoom: 15, pitch: 25, essential: true });
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true }
    });
    map.addControl(draw, 'top-right');
    drawRef.current = draw;

    const onChange = () => {
      const data = draw.getAll();
      if (!data.features.length) {
        setAreaHa(0);
        setCentroid(null);
        setMunicipalityName(null);
        useAppStore.getState().clearField();
        return;
      }
      const feature = data.features[0];
      const areaSqm = turf.area(data);
      const ha = Math.round((areaSqm / 10000) * 100) / 100;
      const c = turf.centroid(feature).geometry.coordinates; // [lng, lat]
      const center = { lat: c[1], lng: c[0] };
      const muni = nearestMunicipality(center.lat, center.lng);

      setAreaHa(ha);
      setCentroid(center);
      setMunicipalityName(muni?.name ?? null);

      setField(feature.geometry, ha, center);
      if (muni) {
        setLocation({ lat: center.lat, lng: center.lng }, muni.name, null);
      }
    };

    map.on('draw.create', onChange);
    map.on('draw.update', onChange);
    map.on('draw.delete', onChange);

    map.on('click', (e) => {
      if (!isMagicModeRef.current) return;
      if (draw.getMode() === 'draw_polygon') return;
      const fake = makeSimulatedField([e.lngLat.lng, e.lngLat.lat]);
      draw.add(fake);
      const bbox = turf.bbox(fake);
      map.fitBounds(bbox, { padding: 60, pitch: 20, duration: 1500 });
      onChange();
      setIsMagicMode(false);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      drawRef.current = null;
    };
  }, [setField, setLocation]);

  const handleContinue = () => {
    if (!centroid) {
      // Fallback: La Trinidad default for the rest of the flow.
      setLocation({ lat: 16.4619, lng: 120.5874 }, 'La Trinidad', null);
    }
    navigate('/processing');
  };

  const tokenMissing = !MAPBOX_TOKEN;
  const canContinue = !tokenMissing && areaHa > 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-[var(--color-paper)] relative overflow-hidden"
    >
      <svg className="terrace-topo opacity-8" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <path d="M0,200 Q300,150 600,200 T1200,200" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <path d="M0,350 Q400,300 800,350 T1200,350" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <path d="M0,500 Q200,450 500,500 T1200,500" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>

      <div className="relative z-10 min-h-screen flex">
        {/* Map Section — 62% Hero */}
        <motion.div variants={itemVariants} className="w-full lg:w-[62%] relative">
          <div className="h-screen p-6 lg:p-12 flex flex-col">
            <motion.div variants={itemVariants} className="mb-6">
              <div className="terrace-eyebrow mb-4">01 — LOCATION</div>
              <h1
                className="terrace-display text-4xl lg:text-6xl mb-2"
                style={{ fontFamily: '"Fraunces", serif', fontVariationSettings: '"opsz" 144, "wght" 600' }}
              >
                Where is your field?
              </h1>
              <p className="text-sm text-[var(--color-earth-deep)]/60">
                Search for your area, then draw the polygon — or click <em>Magic Click</em> for a quick demo field.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex-1 relative">
              <div className="h-full w-full terrace-card-hairline overflow-hidden relative">
                {tokenMissing ? (
                  <div className="h-full w-full flex items-center justify-center bg-[var(--color-paper-card)]">
                    <div className="max-w-md p-8 text-center">
                      <AlertTriangle className="w-10 h-10 mx-auto mb-4 text-[var(--color-rust)]" />
                      <h3 className="terrace-display text-2xl mb-3">Mapbox token missing</h3>
                      <p className="text-sm text-[var(--color-earth-deep)]/70 leading-relaxed">
                        Set <code className="terrace-data text-xs">VITE_MAPBOX_TOKEN</code> in <code className="terrace-data text-xs">.env</code> and rebuild.
                        Use a public <code className="terrace-data text-xs">pk....</code> token from the Mapbox dashboard.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div ref={mapContainerRef} className="absolute inset-0" />
                    <button
                      onClick={() => setIsMagicMode((v) => !v)}
                      className={`absolute bottom-6 left-6 z-10 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-colors ${
                        isMagicMode
                          ? 'bg-[var(--color-rust)] text-white'
                          : 'bg-[var(--color-moss)] text-white hover:bg-[var(--color-earth-deep)]'
                      }`}
                    >
                      <Wand2 className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {isMagicMode ? 'Cancel Magic Click' : 'Magic Click'}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Editorial Rail — 38% */}
        <motion.div variants={itemVariants} className="hidden lg:block w-[38%] bg-[var(--color-paper-card)] relative">
          <div className="h-screen p-12 flex flex-col justify-between">
            <div className="space-y-8">
              <motion.div variants={itemVariants} className="space-y-4">
                <p className="text-[var(--color-earth-deep)] leading-relaxed">
                  Your selected polygon defines exactly which Sentinel-2 pixels we sample for soil composition.
                </p>
                <p className="text-[var(--color-earth-deep)]/80 text-sm">
                  The Cordillera region&apos;s terraced landscapes need precise field boundaries for accurate soil heritage mapping.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-6">
                <div className="terrace-eyebrow">FIELD AREA</div>
                <div className="space-y-1">
                  <div
                    className="terrace-data text-5xl lg:text-6xl text-[var(--color-moss)]"
                    style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {areaHa.toFixed(2)}
                  </div>
                  <div className="terrace-data text-sm text-[var(--color-earth-deep)]/60">hectares</div>
                </div>
              </motion.div>

              {centroid && (
                <motion.div variants={itemVariants} className="space-y-3">
                  <div className="terrace-eyebrow">CENTROID</div>
                  <div
                    className="terrace-data text-lg text-[var(--color-earth-deep)]"
                    style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {centroid.lat.toFixed(4)}° N, {centroid.lng.toFixed(4)}° E
                  </div>
                  {municipalityName && (
                    <div className="text-sm text-[var(--color-earth-deep)]/70">
                      Nearest known location: <strong>{municipalityName}</strong>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            <motion.div variants={itemVariants} className="pt-8 border-t border-[var(--color-contour)]">
              <button
                onClick={handleContinue}
                disabled={!canContinue}
                className="terrace-btn w-full group disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] transition-all duration-300"
                style={{ padding: '1.2rem 2rem' }}
              >
                {areaHa > 0 ? 'Continue to Plant Selection' : 'Draw or Magic-Click a field first'}
                {canContinue && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {canContinue && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-6 bg-gradient-to-t from-[var(--color-paper)] via-[var(--color-paper)] to-transparent">
          <button
            onClick={handleContinue}
            className="terrace-btn w-full group flex items-center justify-between px-6 py-4"
          >
            <span>Continue to Plant Selection</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
