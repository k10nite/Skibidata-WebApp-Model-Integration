// CAR Highland Vegetable Database
// Based on thesis research for Atok, La Trinidad, and other CAR municipalities

export const PLANTS_DATABASE = [
  {
    id: 'tomato',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    icon: '🍅',
    color: '#E53935',
    optimalRequirements: {
      nitrogen: 'High',
      phosphorus: 'Medium',
      potassium: 'High',
      pH: 'Slightly Acidic'  // 6.0-6.8
    },
    description: 'High-value crop grown extensively in La Trinidad and Atok',
    growingPeriod: '90-120 days',
    commonVarieties: ['Diamante Max', 'Beetle', 'Apollo']
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    scientificName: 'Brassica oleracea var. capitata',
    icon: '🥬',
    color: '#66BB6A',
    optimalRequirements: {
      nitrogen: 'High',
      phosphorus: 'High',
      potassium: 'Medium',
      pH: 'Neutral'  // 6.5-7.5
    },
    description: 'Staple highland vegetable, thrives in cool temperatures',
    growingPeriod: '70-90 days',
    commonVarieties: ['Scorpio', 'Green Coronet', 'Hybrid']
  },
  {
    id: 'potato',
    name: 'Potato',
    scientificName: 'Solanum tuberosum',
    icon: '🥔',
    color: '#8D6E63',
    optimalRequirements: {
      nitrogen: 'Medium',
      phosphorus: 'High',
      potassium: 'High',
      pH: 'Slightly Acidic'  // 5.5-6.5
    },
    description: 'Important tuber crop in highland areas',
    growingPeriod: '90-120 days',
    commonVarieties: ['Solibao', 'Granola', 'Igorota']
  },
  {
    id: 'carrots',
    name: 'Carrots',
    scientificName: 'Daucus carota',
    icon: '🥕',
    color: '#FF6F00',
    optimalRequirements: {
      nitrogen: 'Medium',
      phosphorus: 'Medium',
      potassium: 'High',
      pH: 'Neutral'  // 6.0-7.0
    },
    description: 'Root vegetable requiring loose, well-drained soil',
    growingPeriod: '70-80 days',
    commonVarieties: ['Kuroda', 'Condor', 'Nantes']
  },
  {
    id: 'lettuce',
    name: 'Lettuce',
    scientificName: 'Lactuca sativa',
    icon: '🥗',
    color: '#7CB342',
    optimalRequirements: {
      nitrogen: 'High',
      phosphorus: 'Low',
      potassium: 'Medium',
      pH: 'Slightly Acidic'  // 6.0-7.0
    },
    description: 'Fast-growing leafy vegetable for highland climate',
    growingPeriod: '45-60 days',
    commonVarieties: ['Grand Rapids', 'Looseleaf', 'Iceberg']
  }
];

// Helper function to get plant by ID
export function getPlantById(plantId) {
  return PLANTS_DATABASE.find(plant => plant.id === plantId);
}

// Helper function to get all plant names for dropdown
export function getPlantOptions() {
  return PLANTS_DATABASE.map(plant => ({
    value: plant.id,
    label: plant.name,
    icon: plant.icon
  }));
}
