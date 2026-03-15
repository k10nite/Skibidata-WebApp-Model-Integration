// Philippine Fertilizer Products Database
// Commonly available in CAR agricultural supply stores

export const FERTILIZER_DATABASE = [
  {
    id: 'urea',
    name: 'Urea',
    formula: '46-0-0',
    composition: { N: 46, P: 0, K: 0 },
    primaryNutrient: 'Nitrogen',
    manufacturer: 'Atlas Fertilizer Corporation',
    pricePerBag: 1450,
    bagSize: '50kg',
    applicationRate: '2-3 bags per hectare',
    description: 'High nitrogen content for rapid vegetative growth and leaf development',
    bestFor: ['tomato', 'cabbage', 'lettuce'],
    applicationTiming: 'Apply 2 weeks before planting and during vegetative stage',
    precautions: 'Avoid over-application which can burn plants',
    color: '#E3F2FD'
  },
  {
    id: 'complete',
    name: 'Complete 14-14-14',
    formula: '14-14-14',
    composition: { N: 14, P: 14, K: 14 },
    primaryNutrient: 'Balanced',
    manufacturer: 'Planters Products Inc.',
    pricePerBag: 1350,
    bagSize: '50kg',
    applicationRate: '3-4 bags per hectare',
    description: 'Balanced all-purpose fertilizer suitable for most highland vegetables',
    bestFor: ['tomato', 'cabbage', 'potato', 'carrots', 'lettuce'],
    applicationTiming: 'Apply during land preparation and as maintenance fertilizer',
    precautions: 'Store in dry place away from moisture',
    color: '#E8F5E9'
  },
  {
    id: 'dap',
    name: 'Diammonium Phosphate (DAP)',
    formula: '18-46-0',
    composition: { N: 18, P: 46, K: 0 },
    primaryNutrient: 'Phosphorus',
    manufacturer: 'Atlas Fertilizer Corporation',
    pricePerBag: 1680,
    bagSize: '50kg',
    applicationRate: '1-2 bags per hectare',
    description: 'High phosphorus for root development and flowering',
    bestFor: ['potato', 'cabbage', 'tomato'],
    applicationTiming: 'Apply at planting or transplanting stage',
    precautions: 'Do not place in direct contact with seeds',
    color: '#FFF3E0'
  },
  {
    id: 'muriate',
    name: 'Muriate of Potash',
    formula: '0-0-60',
    composition: { N: 0, P: 0, K: 60 },
    primaryNutrient: 'Potassium',
    manufacturer: 'Planters Products Inc.',
    pricePerBag: 1580,
    bagSize: '50kg',
    applicationRate: '1-2 bags per hectare',
    description: 'High potassium for fruit quality, disease resistance, and water regulation',
    bestFor: ['tomato', 'potato', 'carrots'],
    applicationTiming: 'Apply during fruiting or tuber development stage',
    precautions: 'May increase soil salinity if over-applied',
    color: '#FCE4EC'
  },
  {
    id: 'ammophos',
    name: 'Ammophos',
    formula: '16-20-0',
    composition: { N: 16, P: 20, K: 0 },
    primaryNutrient: 'Phosphorus',
    manufacturer: 'Planters Products Inc.',
    pricePerBag: 1420,
    bagSize: '50kg',
    applicationRate: '2-3 bags per hectare',
    description: 'Good starter fertilizer with balanced N and P',
    bestFor: ['cabbage', 'potato', 'carrots'],
    applicationTiming: 'Apply at planting or early growth stage',
    precautions: 'Best results when mixed with organic matter',
    color: '#F3E5F5'
  },
  {
    id: 'solokan',
    name: 'Solokan 15-15-15',
    formula: '15-15-15',
    composition: { N: 15, P: 15, K: 15 },
    primaryNutrient: 'Balanced',
    manufacturer: 'Manila Cordage Company',
    pricePerBag: 1380,
    bagSize: '50kg',
    applicationRate: '3-4 bags per hectare',
    description: 'Complete fertilizer with balanced nutrients and microelements',
    bestFor: ['tomato', 'cabbage', 'lettuce', 'carrots'],
    applicationTiming: 'Apply throughout growing season',
    precautions: 'Dissolves quickly, apply before rain or irrigation',
    color: '#E0F2F1'
  },
  {
    id: 'agrilime',
    name: 'Agricultural Lime',
    formula: 'CaCO₃',
    composition: { N: 0, P: 0, K: 0, Ca: 40 },
    primaryNutrient: 'pH Adjustment',
    manufacturer: 'Various suppliers',
    pricePerBag: 180,
    bagSize: '50kg',
    applicationRate: '5-10 bags per hectare (depending on pH)',
    description: 'Raises soil pH and provides calcium',
    bestFor: ['cabbage', 'lettuce', 'carrots'],
    applicationTiming: 'Apply 2-4 weeks before planting',
    precautions: 'Takes time to react with soil, plan ahead',
    color: '#FAFAFA'
  },
  {
    id: 'sulfur',
    name: 'Elemental Sulfur',
    formula: 'S',
    composition: { N: 0, P: 0, K: 0, S: 90 },
    primaryNutrient: 'pH Adjustment',
    manufacturer: 'Various suppliers',
    pricePerBag: 420,
    bagSize: '25kg',
    applicationRate: '2-4 bags per hectare (depending on pH)',
    description: 'Lowers soil pH for acid-loving crops',
    bestFor: ['potato', 'tomato'],
    applicationTiming: 'Apply 3-6 months before planting (slow acting)',
    precautions: 'Works slowly, monitor pH regularly',
    color: '#FFF9C4'
  }
];

// Helper functions
export function getFertilizerById(id) {
  return FERTILIZER_DATABASE.find(f => f.id === id);
}

export function getFertilizersByNutrient(nutrient) {
  return FERTILIZER_DATABASE.filter(f => f.primaryNutrient === nutrient);
}

export function calculateFertilizerCost(fertilizerId, hectares = 1) {
  const fertilizer = getFertilizerById(fertilizerId);
  if (!fertilizer) return null;

  // Extract numeric value from application rate (e.g., "2-3 bags" → average 2.5)
  const rateMatch = fertilizer.applicationRate.match(/(\d+)-(\d+)/);
  let bagsNeeded;

  if (rateMatch) {
    const minBags = parseInt(rateMatch[1]);
    const maxBags = parseInt(rateMatch[2]);
    bagsNeeded = ((minBags + maxBags) / 2) * hectares;
  } else {
    const singleMatch = fertilizer.applicationRate.match(/(\d+)/);
    bagsNeeded = singleMatch ? parseInt(singleMatch[1]) * hectares : 0;
  }

  return {
    bagsNeeded: Math.ceil(bagsNeeded),
    totalCost: Math.ceil(bagsNeeded) * fertilizer.pricePerBag,
    costPerBag: fertilizer.pricePerBag,
    fertilizer: fertilizer
  };
}
