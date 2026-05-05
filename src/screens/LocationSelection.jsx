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

  const flyToLocation = (loc) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [loc.lng, loc.lat],
      zoom: 15,
      pitch: 25,
      duration: 1500,
      essential: true
    });
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
                      className={`absolute bottom-6 left-6 z-10 flex items-center gap-2 px-4 py-2.5 transition-all duration-200 ${
                        isMagicMode
                          ? 'bg-[var(--color-rust)] text-[var(--color-paper)]'
                          : 'bg-[var(--color-paper)] text-[var(--color-earth-deep)] hover:bg-[var(--color-earth-deep)] hover:text-[var(--color-paper)]'
                      }`}
                      style={{
                        boxShadow: '0 4px 12px rgba(62,42,31,0.15), 0 1px 0 rgba(62,42,31,0.06)',
                        borderRadius: '2px'
                      }}
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span
                        className="terrace-data text-xs uppercase"
                        style={{ letterSpacing: '0.18em', fontWeight: 600 }}
                      >
                        {isMagicMode ? 'Cancel' : 'Magic Click'}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Editorial Rail — 38% */}
        <motion.div
          variants={itemVariants}
          className="hidden lg:block w-[38%] relative"
          style={{
            background: 'var(--color-paper-card)',
            borderLeft: '1px solid var(--color-contour)'
          }}
        >
          <div className="h-screen px-10 py-10 flex flex-col">

            {/* Step indicator strip */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between pb-6 mb-8"
              style={{ borderBottom: '1px solid var(--color-contour)' }}
            >
              <div
                className="terrace-data text-xs"
                style={{ letterSpacing: '0.22em', color: 'var(--color-moss)', fontWeight: 600 }}
              >
                STEP 01 / 04
              </div>
              <div
                className="terrace-data text-[10px]"
                style={{ letterSpacing: '0.18em', color: 'var(--color-earth-deep)', opacity: 0.5 }}
              >
                FIELD &nbsp;·&nbsp; CROP &nbsp;·&nbsp; SOIL &nbsp;·&nbsp; PRESCRIPTION
              </div>
            </motion.div>

            {/* Editorial intro — Fraunces italic */}
            <motion.div variants={itemVariants} className="mb-10">
              <div
                className="text-2xl leading-snug mb-4"
                style={{
                  fontFamily: '"Fraunces", serif',
                  fontStyle: 'italic',
                  fontVariationSettings: '"opsz" 144, "wght" 400',
                  color: 'var(--color-earth-deep)'
                }}
              >
                The polygon you draw is the exact patch of earth we sample.
              </div>
              <div
                className="text-sm italic"
                style={{
                  fontFamily: '"Fraunces", serif',
                  fontVariationSettings: '"opsz" 14, "wght" 400',
                  color: 'var(--color-earth-deep)',
                  opacity: 0.65
                }}
              >
                Cordillera terraces need precise boundaries — anything blurry shows up as noise downstream.
              </div>
            </motion.div>

            {/* Numbered instruction strip */}
            <motion.div variants={itemVariants} className="mb-10">
              <div className="terrace-eyebrow mb-4">HOW</div>
              <ol className="space-y-2.5">
                {[
                  ['01', 'Search your area in the top-left field.'],
                  ['02', 'Outline your field with the polygon tool.'],
                  ['03', 'Or click', { em: 'Magic Click', tail: ' for a quick demo polygon.' }]
                ].map(([n, body, more]) => (
                  <li
                    key={n}
                    className="flex items-baseline gap-3 text-sm"
                    style={{
                      fontFamily: '"Fraunces", serif',
                      fontVariationSettings: '"opsz" 14, "wght" 400',
                      color: 'var(--color-earth-deep)'
                    }}
                  >
                    <span
                      className="terrace-data text-[10px]"
                      style={{
                        color: 'var(--color-moss)',
                        letterSpacing: '0.15em',
                        fontWeight: 600,
                        flexShrink: 0
                      }}
                    >
                      {n}
                    </span>
                    <span>
                      {body}
                      {more && (
                        <>
                          {' '}
                          <em style={{ color: 'var(--color-moss)' }}>{more.em}</em>
                          {more.tail}
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </motion.div>

            {/* FIELD AREA hero */}
            <motion.div variants={itemVariants} className="mb-10">
              <div className="flex items-baseline justify-between mb-3">
                <div className="terrace-eyebrow">FIELD AREA</div>
                {areaHa > 0 && (
                  <div
                    className="terrace-data text-[10px]"
                    style={{ color: 'var(--color-moss)', letterSpacing: '0.18em', fontWeight: 600 }}
                  >
                    READY
                  </div>
                )}
              </div>
              <div className="flex items-baseline gap-3">
                <div
                  className="terrace-data tabular-nums"
                  style={{
                    fontFamily: '"Fraunces", serif',
                    fontVariationSettings: '"opsz" 144, "wght" 600',
                    fontSize: '4rem',
                    lineHeight: 0.9,
                    color: areaHa > 0 ? 'var(--color-moss)' : 'var(--color-earth-deep)',
                    opacity: areaHa > 0 ? 1 : 0.3,
                    fontVariantNumeric: 'tabular-nums',
                    transition: 'all 400ms ease'
                  }}
                >
                  {areaHa.toFixed(2)}
                </div>
                <div
                  className="terrace-data text-xs"
                  style={{ color: 'var(--color-earth-deep)', opacity: 0.6, letterSpacing: '0.18em' }}
                >
                  ha
                </div>
              </div>
              {centroid ? (
                <div className="mt-4 space-y-1">
                  <div
                    className="terrace-data text-xs"
                    style={{ color: 'var(--color-earth-deep)', opacity: 0.55, letterSpacing: '0.05em' }}
                  >
                    {centroid.lat.toFixed(4)}° N &nbsp;·&nbsp; {centroid.lng.toFixed(4)}° E
                  </div>
                  {municipalityName && (
                    <div
                      className="text-xs italic"
                      style={{
                        fontFamily: '"Fraunces", serif',
                        color: 'var(--color-earth-deep)',
                        opacity: 0.7
                      }}
                    >
                      nearest known: <strong style={{ fontStyle: 'normal', fontWeight: 600 }}>{municipalityName}</strong>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="mt-4 text-xs italic"
                  style={{
                    fontFamily: '"Fraunces", serif',
                    color: 'var(--color-earth-deep)',
                    opacity: 0.5
                  }}
                >
                  draw a polygon to populate
                </div>
              )}
            </motion.div>

            {/* Quick-locations grid — fills the empty space + adds utility */}
            <motion.div variants={itemVariants} className="mb-10">
              <div className="flex items-baseline justify-between mb-4">
                <div className="terrace-eyebrow">QUICK LOCATIONS</div>
                <div
                  className="terrace-data text-[10px]"
                  style={{ color: 'var(--color-earth-deep)', opacity: 0.4, letterSpacing: '0.15em' }}
                >
                  CAR — 8
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {CAR_LOCATIONS.map((loc) => {
                  const isNearest = municipalityName === loc.name;
                  return (
                    <button
                      key={loc.name}
                      onClick={() => flyToLocation(loc)}
                      className="text-left px-3 py-2.5 transition-all duration-200 group"
                      style={{
                        background: isNearest ? 'var(--color-moss)' : 'var(--color-paper)',
                        color: isNearest ? 'var(--color-paper)' : 'var(--color-earth-deep)',
                        border: '1px solid var(--color-contour)',
                        borderRadius: '2px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isNearest) {
                          e.currentTarget.style.background = 'var(--color-paper-deep)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isNearest) {
                          e.currentTarget.style.background = 'var(--color-paper)';
                        }
                      }}
                    >
                      <div
                        style={{
                          fontFamily: '"Fraunces", serif',
                          fontSize: '13px',
                          fontVariationSettings: '"opsz" 14, "wght" 500',
                          lineHeight: 1.2
                        }}
                      >
                        {loc.name}
                      </div>
                      <div
                        className="terrace-data tabular-nums"
                        style={{
                          fontSize: '9px',
                          letterSpacing: '0.05em',
                          opacity: isNearest ? 0.85 : 0.5,
                          marginTop: '2px',
                          fontVariantNumeric: 'tabular-nums'
                        }}
                      >
                        {loc.lat.toFixed(2)}°N · {loc.lng.toFixed(2)}°E
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Spacer pushes Continue to bottom */}
            <div className="flex-1" />

            {/* Continue */}
            <motion.div
              variants={itemVariants}
              className="pt-6"
              style={{ borderTop: '1px solid var(--color-contour)' }}
            >
              <button
                onClick={handleContinue}
                disabled={!canContinue}
                className="terrace-btn w-full group disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                style={{ padding: '1.1rem 2rem' }}
              >
                <span style={{ letterSpacing: '0.18em' }}>
                  {areaHa > 0 ? 'CONTINUE — INFER SOIL' : 'DRAW A FIELD FIRST'}
                </span>
                {canContinue && <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />}
              </button>
              <div
                className="text-[10px] mt-2.5 italic text-center"
                style={{
                  fontFamily: '"Fraunces", serif',
                  color: 'var(--color-earth-deep)',
                  opacity: 0.4
                }}
              >
                next: Sentinel-2 sampling, ~3 seconds
              </div>
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
