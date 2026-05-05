// Screen 3: Processing - Cinematic ML Inference Journey
// PEAK MOMENT 2: Dark hero with morphing headlines and sophisticated progress
// Editorial-cartographic aesthetic with technical telemetry

import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../store/appStore';
import { getSatelliteAnalysis } from '../services/satelliteService';
import { predictForLocation } from '../services/mlPredictionService';

// Cinematic inference stages - each shown for ~700-900ms
const INFERENCE_STAGES = [
  'Locating field',
  'Reading satellite signals',
  'Extracting spectral signatures',
  'Predicting nutrient profile',
  'Ready'
];

// Technical telemetry data for atmospheric authenticity
const TELEMETRY_DATA = [
  { label: 'TILE', value: 'S2A_MSIL2A_BENGUET' },
  { label: 'BANDS', value: 'B02 B03 B04 B08 B11 B12' },
  { label: 'CLOUDS', value: '< 10%' },
  { label: 'CRS', value: 'EPSG:32651' }
];

export default function Processing() {
  const navigate = useNavigate();
  const { municipality, setMLPrediction, setSatelliteData } = useAppStore();

  // State for cinematic staging
  const [currentStage, setCurrentStage] = useState(0);
  const [stagesComplete, setStagesComplete] = useState(false);
  const [mlComplete, setMLComplete] = useState(false);

  // Satellite data refs (preserve existing logic)
  const [satelliteDataFetched, setSatelliteDataFetched] = useState(false);
  const satelliteDataRef = useRef(null);
  const fetchStartedRef = useRef(false);

  // Fetch satellite data in the background (preserve existing logic)
  const fetchSatelliteData = useCallback(async () => {
    if (fetchStartedRef.current) return;
    fetchStartedRef.current = true;

    try {
      // Use municipality name for satellite analysis
      const locationName = municipality || 'La Trinidad';
      console.log('[PROCESSING] Fetching satellite data for:', locationName);

      const data = await getSatelliteAnalysis(locationName);
      console.log('[PROCESSING] Satellite data received:', data);

      satelliteDataRef.current = data;
      setSatelliteDataFetched(true);
    } catch (error) {
      console.error('[PROCESSING] Satellite fetch error:', error);
      satelliteDataRef.current = null;
      setSatelliteDataFetched(true);
    }
  }, [municipality]);

  // Start fetching satellite data immediately
  useEffect(() => {
    fetchSatelliteData();
  }, [fetchSatelliteData]);

  // Cinematic staging effect - morphs through inference stages
  useEffect(() => {
    const stageInterval = setInterval(() => {
      setCurrentStage(prev => {
        if (prev < INFERENCE_STAGES.length - 1) {
          return prev + 1;
        } else {
          setStagesComplete(true);
          clearInterval(stageInterval);
          return prev;
        }
      });
    }, 800); // 800ms per stage

    return () => clearInterval(stageInterval);
  }, []);

  // ML prediction and navigation logic (preserve exactly)
  const executeMLPrediction = useCallback(async () => {
    // Store satellite data in app state
    if (satelliteDataRef.current) {
      setSatelliteData(satelliteDataRef.current);
    }

    // Get soil prediction from ML service (Liam's SoilScan-Sentinel2 model output)
    const prediction = await predictForLocation(municipality || 'La Trinidad');

    // Store in app state — ML prediction wins over satellite-derived soil estimates
    setMLPrediction(prediction);
    setMLComplete(true);

    // Navigate after brief fade
    setTimeout(() => navigate('/plant-selection'), 400);
  }, [municipality, setMLPrediction, setSatelliteData, navigate]);

  // Trigger ML prediction when stages complete or after timeout
  useEffect(() => {
    let timeoutId;

    if (stagesComplete) {
      // If stages complete, wait for satellite data or proceed immediately
      if (satelliteDataFetched) {
        executeMLPrediction();
      } else {
        // Wait for satellite data with a timeout
        const checkInterval = setInterval(() => {
          if (satelliteDataFetched || satelliteDataRef.current) {
            clearInterval(checkInterval);
            executeMLPrediction();
          }
        }, 100);

        // Timeout after 2 seconds - proceed anyway with fallback
        timeoutId = setTimeout(() => {
          clearInterval(checkInterval);
          executeMLPrediction();
        }, 2000);
      }
    } else {
      // Ensure total processing time doesn't exceed 3.5 seconds
      timeoutId = setTimeout(() => {
        executeMLPrediction();
      }, 3500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [stagesComplete, satelliteDataFetched, executeMLPrediction]);

  return (
    <div className="min-h-screen bg-[var(--color-loam)] text-[var(--color-paper)] relative overflow-hidden flex items-center justify-center">
      {/* Topographic contour background */}
      <motion.svg
        className="terrace-topo opacity-[0.06]"
        viewBox="0 0 800 600"
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "loop" }}
      >
        <g fill="none" stroke="currentColor" strokeWidth="0.5">
          <path d="M0,100 Q200,80 400,100 T800,100" />
          <path d="M0,180 Q200,160 400,180 T800,180" />
          <path d="M0,260 Q200,240 400,260 T800,260" />
          <path d="M0,340 Q200,320 400,340 T800,340" />
          <path d="M0,420 Q200,400 400,420 T800,420" />
          <path d="M0,500 Q200,480 400,500 T800,500" />
        </g>
      </motion.svg>

      {/* Main content container */}
      <div className="relative z-10 text-center max-w-4xl px-8">

        {/* Eyebrow */}
        <motion.div
          className="terrace-eyebrow mb-8 justify-center text-[var(--color-moss-soft)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          02 — INFERENCE
        </motion.div>

        {/* Morphing headline */}
        <div className="mb-12 h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentStage}
              className="terrace-display text-5xl md:text-7xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {INFERENCE_STAGES[currentStage] || 'Processing'}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Spectral band progress indicator */}
        <motion.div
          className="mb-16 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-16 bg-[var(--color-contour)] rounded-full overflow-hidden"
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: currentStage > index ? 1 : 0.3
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="w-full bg-[var(--color-moss)] rounded-full"
                initial={{ height: '0%' }}
                animate={{
                  height: currentStage > index ? '100%' : '0%'
                }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1]
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Technical telemetry */}
        <motion.div
          className="space-y-3 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {TELEMETRY_DATA.map((item, index) => (
            <motion.div
              key={item.label}
              className="flex justify-between items-center terrace-data text-sm text-[var(--color-moss-soft)]"
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: currentStage >= 1 ? 0.8 : 0.4,
                x: 0
              }}
              transition={{
                delay: 0.8 + (index * 0.1),
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <span className="tracking-wider">{item.label}</span>
              <span className="font-mono">{item.value}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Completion fade out */}
        {mlComplete && (
          <motion.div
            className="absolute inset-0 bg-[var(--color-loam)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </div>
    </div>
  );
}
