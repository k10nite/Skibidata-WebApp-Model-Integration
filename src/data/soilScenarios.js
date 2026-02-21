// Realistic Soil Scenarios for CAR Municipalities
// Based on field data collection from thesis research

export const SOIL_SCENARIOS = [
  {
    id: 'scenario_1',
    location: {
      lat: 16.4601,
      lng: 120.5948,
      municipality: 'La Trinidad',
      barangay: 'Bahong'
    },
    status: {
      nitrogen: 'Medium',      // ~80 ppm (converted from satellite data)
      phosphorus: 'Low',       // ~8 ppm
      potassium: 'Medium',     // ~150 ppm
      pH: 'Slightly Acidic'    // ~6.2
    },
    actualValues: {
      nitrogen_ppm: 80,
      phosphorus_ppm: 8,
      potassium_ppm: 150,
      pH_value: 6.2
    },
    elevation: 1400,
    soilType: 'Clay Loam',
    terrain: 'Moderate slope',
    description: 'Typical highland vegetable farm in Bahong, requires phosphorus boost'
  },
  {
    id: 'scenario_2',
    location: {
      lat: 16.5532,
      lng: 120.6989,
      municipality: 'Atok',
      barangay: 'Paoay'
    },
    status: {
      nitrogen: 'High',
      phosphorus: 'Medium',
      potassium: 'Low',
      pH: 'Acidic'             // ~5.8
    },
    actualValues: {
      nitrogen_ppm: 120,
      phosphorus_ppm: 15,
      potassium_ppm: 90,
      pH_value: 5.8
    },
    elevation: 1850,
    soilType: 'Sandy Loam',
    terrain: 'Steep slope',
    description: 'High elevation area in Atok, needs potassium and pH adjustment'
  },
  {
    id: 'scenario_3',
    location: {
      lat: 16.4523,
      lng: 120.5812,
      municipality: 'La Trinidad',
      barangay: 'Wangal'
    },
    status: {
      nitrogen: 'Low',
      phosphorus: 'High',
      potassium: 'High',
      pH: 'Neutral'            // ~6.8
    },
    actualValues: {
      nitrogen_ppm: 50,
      phosphorus_ppm: 25,
      potassium_ppm: 180,
      pH_value: 6.8
    },
    elevation: 1320,
    soilType: 'Loam',
    terrain: 'Gentle slope',
    description: 'Well-managed farm in Wangal, primarily needs nitrogen replenishment'
  },
  {
    id: 'scenario_4',
    location: {
      lat: 16.5489,
      lng: 120.6745,
      municipality: 'Atok',
      barangay: 'Cattubo'
    },
    status: {
      nitrogen: 'Medium',
      phosphorus: 'Low',
      potassium: 'Low',
      pH: 'Acidic'             // ~5.5
    },
    actualValues: {
      nitrogen_ppm: 75,
      phosphorus_ppm: 6,
      potassium_ppm: 85,
      pH_value: 5.5
    },
    elevation: 1920,
    soilType: 'Clay',
    terrain: 'Moderate slope',
    description: 'Acidic soil common in Atok highlands, requires comprehensive fertilization'
  },
  {
    id: 'scenario_5',
    location: {
      lat: 16.4456,
      lng: 120.5956,
      municipality: 'La Trinidad',
      barangay: 'Alapang'
    },
    status: {
      nitrogen: 'High',
      phosphorus: 'High',
      potassium: 'Medium',
      pH: 'Slightly Acidic'    // ~6.4
    },
    actualValues: {
      nitrogen_ppm: 110,
      phosphorus_ppm: 22,
      potassium_ppm: 140,
      pH_value: 6.4
    },
    elevation: 1280,
    soilType: 'Loam',
    terrain: 'Gentle slope',
    description: 'Fertile area near Alapang, minimal fertilizer needs'
  }
];

// Get scenario by location proximity (simplified - picks nearest scenario)
export function getScenarioByLocation(lat, lng) {
  // For demo purposes, calculate simple distance and return nearest scenario
  let nearest = SOIL_SCENARIOS[0];
  let minDist = Infinity;

  SOIL_SCENARIOS.forEach(scenario => {
    const dist = Math.sqrt(
      Math.pow(scenario.location.lat - lat, 2) +
      Math.pow(scenario.location.lng - lng, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = scenario;
    }
  });

  return nearest;
}

// Get random scenario for testing
export function getRandomScenario() {
  const randomIndex = Math.floor(Math.random() * SOIL_SCENARIOS.length);
  return SOIL_SCENARIOS[randomIndex];
}
