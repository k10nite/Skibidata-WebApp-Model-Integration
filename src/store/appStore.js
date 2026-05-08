// Zustand Store for Fertilizer Recommendation App
// Manages state across all 7 screens

import { create } from 'zustand';

const useAppStore = create((set) => ({
  // Current screen tracking (1-7)
  currentScreen: 1,

  // Location data (Screen 1)
  location: null,
  municipality: null,
  barangay: null,
  field: null,           // GeoJSON Polygon (mapbox-draw output) — sent to inference POST /predict
  fieldAreaHa: 0,        // hectares (turf.area / 10000)
  fieldCenter: null,     // { lat, lng } — centroid of polygon, for fallback name lookup

  // Selected plant (Screen 2)
  selectedPlant: null,
  plantRequirements: null,

  // Soil data (from scenario matching - Screen 3 processing)
  soilData: null,
  soilScenario: null,

  // Satellite analysis data (real-time from APIs)
  satelliteData: null,
  weatherData: null,
  vegetationIndex: null,

  // Recommendations (Screen 6)
  recommendations: null,
  recommendationSummary: null,

  // Farm inputs
  areaHectares: 1,
  availableFertilizers: '',

  // Actions
  setLocation: (location, municipality, barangay) =>
    set({ location, municipality, barangay }),

  setField: (field, areaHa, center) =>
    set({
      field,
      fieldAreaHa: areaHa,
      fieldCenter: center,
      selectedPlant: null,
      plantRequirements: null,
      soilData: null,
      soilScenario: null,
      satelliteData: null,
      weatherData: null,
      vegetationIndex: null,
      recommendations: null,
      recommendationSummary: null,
      areaHectares: areaHa > 0 ? areaHa : 1,
      availableFertilizers: ''
    }),

  clearField: () =>
    set({
      field: null,
      fieldAreaHa: 0,
      fieldCenter: null,
      selectedPlant: null,
      plantRequirements: null,
      soilData: null,
      soilScenario: null,
      satelliteData: null,
      weatherData: null,
      vegetationIndex: null,
      recommendations: null,
      recommendationSummary: null,
      areaHectares: 1,
      availableFertilizers: ''
    }),

  setSelectedPlant: (plant, requirements) =>
    set((state) => {
      const previousKey = state.selectedPlant?.id || state.selectedPlant?.name || null;
      const nextKey = plant?.id || plant?.name || null;
      const changed = previousKey !== nextKey;
      return {
        selectedPlant: plant,
        plantRequirements: requirements,
        recommendations: changed ? null : state.recommendations,
        recommendationSummary: changed ? null : state.recommendationSummary
      };
    }),

  setSoilData: (soilData, scenario) =>
    set({
      soilData,
      soilScenario: scenario,
      recommendations: null,
      recommendationSummary: null
    }),

  setMLPrediction: (prediction) =>
    set({
      soilData: prediction,
      soilScenario: { status: prediction, source: prediction?.source ?? 'ml' },
      recommendations: null,
      recommendationSummary: null
    }),

  setSatelliteData: (satelliteData) =>
    set({
      satelliteData,
      weatherData: satelliteData?.weather || null,
      vegetationIndex: satelliteData?.vegetation || null,
      soilData: satelliteData?.soil || null,
      recommendations: null,
      recommendationSummary: null
    }),

  setRecommendations: (recommendations, summary) =>
    set({ recommendations, recommendationSummary: summary }),

  setAreaHectares: (areaHectares) =>
    set((state) => ({
      areaHectares,
      recommendations: Number(state.areaHectares) !== Number(areaHectares) ? null : state.recommendations,
      recommendationSummary: Number(state.areaHectares) !== Number(areaHectares) ? null : state.recommendationSummary
    })),

  setAvailableFertilizers: (availableFertilizers) =>
    set((state) => ({
      availableFertilizers,
      recommendations: state.availableFertilizers !== availableFertilizers ? null : state.recommendations,
      recommendationSummary: state.availableFertilizers !== availableFertilizers ? null : state.recommendationSummary
    })),

  nextScreen: () =>
    set((state) => ({
      currentScreen: Math.min(state.currentScreen + 1, 7)
    })),

  goToScreen: (screenNumber) =>
    set({ currentScreen: Math.max(1, Math.min(screenNumber, 7)) }),

  resetApp: () =>
    set({
      currentScreen: 1,
      location: null,
      municipality: null,
      barangay: null,
      field: null,
      fieldAreaHa: 0,
      fieldCenter: null,
      selectedPlant: null,
      plantRequirements: null,
      soilData: null,
      soilScenario: null,
      satelliteData: null,
      weatherData: null,
      vegetationIndex: null,
      recommendations: null,
      recommendationSummary: null,
      areaHectares: 1,
      availableFertilizers: ''
    })
}));

export default useAppStore;
