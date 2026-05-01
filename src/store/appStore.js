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

  // Actions
  setLocation: (location, municipality, barangay) =>
    set({ location, municipality, barangay }),

  setSelectedPlant: (plant, requirements) =>
    set({ selectedPlant: plant, plantRequirements: requirements }),

  setSoilData: (soilData, scenario) =>
    set({ soilData, soilScenario: scenario }),

  setSatelliteData: (satelliteData) =>
    set({
      satelliteData,
      weatherData: satelliteData?.weather || null,
      vegetationIndex: satelliteData?.vegetation || null,
      soilData: satelliteData?.soil || null
    }),

  setRecommendations: (recommendations, summary) =>
    set({ recommendations, recommendationSummary: summary }),

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
      selectedPlant: null,
      plantRequirements: null,
      soilData: null,
      soilScenario: null,
      satelliteData: null,
      weatherData: null,
      vegetationIndex: null,
      recommendations: null,
      recommendationSummary: null
    })
}));

export default useAppStore;
