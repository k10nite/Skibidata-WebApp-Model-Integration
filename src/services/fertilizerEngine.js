// Fertilizer Recommendation Engine
// Based on Philippine Rice Research Institute (PhilRice) and Bureau of Soils guidelines
// Optimized for CAR (Cordillera Administrative Region) highland crops

// Real fertilizer products available in the Philippines
export const PH_FERTILIZERS = {
  // Nitrogen sources
  urea: {
    name: 'Urea (46-0-0)',
    brand: 'Various (Atlas, Fertiphil)',
    npk: { n: 46, p: 0, k: 0 },
    pricePerKg: 45, // PHP
    availability: 'High',
    bestFor: ['Rice', 'Corn', 'Vegetables'],
    application: 'Basal and topdress'
  },
  ammoniumSulfate: {
    name: 'Ammonium Sulfate (21-0-0)',
    brand: 'Solinure, Atlas',
    npk: { n: 21, p: 0, k: 0 },
    pricePerKg: 35,
    availability: 'High',
    bestFor: ['Vegetables', 'Cabbage', 'Lettuce'],
    application: 'Acidifying fertilizer, good for alkaline soils',
    sulfur: 24
  },

  // Complete fertilizers
  complete14: {
    name: 'Complete 14-14-14',
    brand: 'Fertiphil, Atlas',
    npk: { n: 14, p: 14, k: 14 },
    pricePerKg: 55,
    availability: 'High',
    bestFor: ['All crops', 'Basal application'],
    application: 'Basal application at planting'
  },
  complete16: {
    name: 'Complete 16-16-16',
    brand: 'Yara, Fertiphil',
    npk: { n: 16, p: 16, k: 16 },
    pricePerKg: 60,
    availability: 'Medium',
    bestFor: ['Vegetables', 'Highland crops'],
    application: 'Basal and side dress'
  },

  // Phosphorus sources
  solophos: {
    name: 'Solophos (0-18-0)',
    brand: 'Atlas, Philphos',
    npk: { n: 0, p: 18, k: 0 },
    pricePerKg: 40,
    availability: 'Medium',
    bestFor: ['Root crops', 'Flowering crops'],
    application: 'Basal application'
  },

  // Potassium sources
  mop: {
    name: 'Muriate of Potash (0-0-60)',
    brand: 'Various',
    npk: { n: 0, p: 0, k: 60 },
    pricePerKg: 50,
    availability: 'High',
    bestFor: ['Root crops', 'Potatoes', 'Fruit crops'],
    application: 'Basal and side dress'
  },

  // Organic options
  vermicast: {
    name: 'Vermicast',
    brand: 'Local producers',
    npk: { n: 2, p: 1, k: 1 },
    pricePerKg: 25,
    availability: 'Medium',
    bestFor: ['All crops', 'Organic farming'],
    application: 'Soil amendment',
    organic: true
  },
  chickenManure: {
    name: 'Processed Chicken Manure',
    brand: 'Various',
    npk: { n: 3, p: 2, k: 2 },
    pricePerKg: 15,
    availability: 'High',
    bestFor: ['Vegetables', 'Highland crops'],
    application: 'Soil amendment, 2 weeks before planting',
    organic: true
  }
};

// Crop nutrient requirements (kg/ha) based on PhilRice and DA-CAR recommendations
export const CROP_REQUIREMENTS = {
  cabbage: {
    name: 'Cabbage (Repolyo)',
    scientificName: 'Brassica oleracea var. capitata',
    npk: { n: 150, p: 60, k: 120 },
    optimalPH: { min: 6.0, max: 7.0 },
    growingDays: 90,
    season: 'Cool season (Nov-Feb)',
    spacing: '45cm x 45cm',
    yieldPotential: '25-40 tons/ha'
  },
  lettuce: {
    name: 'Lettuce (Litsugas)',
    scientificName: 'Lactuca sativa',
    npk: { n: 100, p: 40, k: 80 },
    optimalPH: { min: 6.0, max: 7.0 },
    growingDays: 45,
    season: 'Cool season',
    spacing: '30cm x 30cm',
    yieldPotential: '15-25 tons/ha'
  },
  potato: {
    name: 'Potato (Patatas)',
    scientificName: 'Solanum tuberosum',
    npk: { n: 120, p: 80, k: 150 },
    optimalPH: { min: 5.5, max: 6.5 },
    growingDays: 100,
    season: 'Cool season',
    spacing: '75cm x 30cm',
    yieldPotential: '15-25 tons/ha'
  },
  carrot: {
    name: 'Carrot (Karot)',
    scientificName: 'Daucus carota',
    npk: { n: 100, p: 60, k: 120 },
    optimalPH: { min: 6.0, max: 6.8 },
    growingDays: 75,
    season: 'Cool season',
    spacing: '20cm x 5cm',
    yieldPotential: '20-35 tons/ha'
  },
  tomato: {
    name: 'Tomato (Kamatis)',
    scientificName: 'Solanum lycopersicum',
    npk: { n: 150, p: 80, k: 180 },
    optimalPH: { min: 6.0, max: 7.0 },
    growingDays: 90,
    season: 'Year-round (elevated areas)',
    spacing: '60cm x 45cm',
    yieldPotential: '30-50 tons/ha'
  },
  beans: {
    name: 'Snap Beans (Baguio Beans)',
    scientificName: 'Phaseolus vulgaris',
    npk: { n: 40, p: 60, k: 60 },
    optimalPH: { min: 6.0, max: 7.0 },
    growingDays: 60,
    season: 'Cool season',
    spacing: '60cm x 15cm',
    yieldPotential: '8-15 tons/ha'
  },
  sweetPotato: {
    name: 'Sweet Potato (Kamote)',
    scientificName: 'Ipomoea batatas',
    npk: { n: 60, p: 40, k: 100 },
    optimalPH: { min: 5.5, max: 6.5 },
    growingDays: 120,
    season: 'Year-round',
    spacing: '75cm x 30cm',
    yieldPotential: '15-25 tons/ha'
  },
  chayote: {
    name: 'Chayote (Sayote)',
    scientificName: 'Sechium edule',
    npk: { n: 80, p: 40, k: 80 },
    optimalPH: { min: 6.0, max: 6.8 },
    growingDays: 150,
    season: 'Year-round (highlands)',
    spacing: '3m x 3m',
    yieldPotential: '40-60 tons/ha'
  }
};

// Calculate fertilizer recommendations based on soil analysis
export function calculateFertilizerRecommendation(soilData, crop, areaHectares = 1) {
  const cropReq = CROP_REQUIREMENTS[crop] || CROP_REQUIREMENTS.cabbage;

  // Soil nutrient availability factors (0-1 scale)
  const nAvailability = soilData.nitrogen?.rating === 'Adequate' ? 0.7 : 0.4;
  const pAvailability = soilData.phosphorus?.rating === 'Adequate' ? 0.6 : 0.3;
  const kAvailability = soilData.potassium?.rating === 'Adequate' ? 0.7 : 0.5;

  // Calculate nutrient deficits (kg/ha needed)
  const nNeeded = cropReq.npk.n * (1 - nAvailability);
  const pNeeded = cropReq.npk.p * (1 - pAvailability);
  const kNeeded = cropReq.npk.k * (1 - kAvailability);

  // Generate fertilizer program
  const recommendations = [];

  // Basal application - Complete fertilizer
  const basalComplete = Math.ceil((pNeeded / 0.14) * areaHectares); // Based on P requirement
  recommendations.push({
    stage: 'Basal (At Planting)',
    fertilizer: PH_FERTILIZERS.complete14,
    amountKg: basalComplete,
    timing: '1 day before or at transplanting',
    method: 'Band application, 5-10cm from plant base',
    cost: basalComplete * PH_FERTILIZERS.complete14.pricePerKg
  });

  // First side dress - Urea
  const firstUrea = Math.ceil((nNeeded * 0.4 / 0.46) * areaHectares);
  recommendations.push({
    stage: 'First Side Dress',
    fertilizer: PH_FERTILIZERS.urea,
    amountKg: firstUrea,
    timing: '14-21 days after transplanting',
    method: 'Ring application around plants',
    cost: firstUrea * PH_FERTILIZERS.urea.pricePerKg
  });

  // Second side dress - Urea + MOP
  const secondUrea = Math.ceil((nNeeded * 0.3 / 0.46) * areaHectares);
  const mopAmount = Math.ceil((kNeeded * 0.5 / 0.60) * areaHectares);
  recommendations.push({
    stage: 'Second Side Dress',
    fertilizer: PH_FERTILIZERS.urea,
    amountKg: secondUrea,
    timing: '35-45 days after transplanting',
    method: 'Side band application',
    cost: secondUrea * PH_FERTILIZERS.urea.pricePerKg
  });

  if (mopAmount > 5) {
    recommendations.push({
      stage: 'Second Side Dress',
      fertilizer: PH_FERTILIZERS.mop,
      amountKg: mopAmount,
      timing: '35-45 days after transplanting',
      method: 'Mix with urea application',
      cost: mopAmount * PH_FERTILIZERS.mop.pricePerKg
    });
  }

  // Calculate totals
  const totalCost = recommendations.reduce((sum, r) => sum + r.cost, 0);
  const totalN = recommendations.reduce((sum, r) => sum + (r.amountKg * r.fertilizer.npk.n / 100), 0);
  const totalP = recommendations.reduce((sum, r) => sum + (r.amountKg * r.fertilizer.npk.p / 100), 0);
  const totalK = recommendations.reduce((sum, r) => sum + (r.amountKg * r.fertilizer.npk.k / 100), 0);

  return {
    crop: cropReq,
    soilAnalysis: {
      ph: soilData.ph,
      nitrogen: soilData.nitrogen,
      phosphorus: soilData.phosphorus,
      potassium: soilData.potassium
    },
    recommendations,
    summary: {
      totalCostPHP: totalCost,
      totalNutrients: { n: Math.round(totalN), p: Math.round(totalP), k: Math.round(totalK) },
      areaHectares,
      expectedYield: cropReq.yieldPotential
    },
    phAdjustment: getPHAdjustment(soilData.ph, cropReq.optimalPH),
    organicOption: getOrganicAlternative(cropReq, areaHectares)
  };
}

// pH adjustment recommendations
function getPHAdjustment(currentPH, optimalRange) {
  if (currentPH < optimalRange.min) {
    const limeNeeded = (optimalRange.min - currentPH) * 2000; // kg/ha agricultural lime
    return {
      needed: true,
      action: 'Apply agricultural lime',
      amount: `${limeNeeded} kg/ha`,
      timing: '2-4 weeks before planting',
      reason: `Soil pH (${currentPH.toFixed(1)}) is below optimal range (${optimalRange.min}-${optimalRange.max})`
    };
  } else if (currentPH > optimalRange.max) {
    return {
      needed: true,
      action: 'Apply elemental sulfur or ammonium sulfate',
      amount: 'Consult local agriculturist',
      timing: 'Before planting',
      reason: `Soil pH (${currentPH.toFixed(1)}) is above optimal range`
    };
  }
  return { needed: false, reason: 'Soil pH is within optimal range' };
}

// Organic farming alternative
function getOrganicAlternative(cropReq, areaHectares) {
  const vermicastNeeded = Math.ceil((cropReq.npk.n / 0.02) * areaHectares * 0.5);
  const chickenManureNeeded = Math.ceil((cropReq.npk.n / 0.03) * areaHectares * 0.5);

  return {
    option: 'Organic Alternative',
    materials: [
      {
        fertilizer: PH_FERTILIZERS.vermicast,
        amountKg: vermicastNeeded,
        cost: vermicastNeeded * PH_FERTILIZERS.vermicast.pricePerKg
      },
      {
        fertilizer: PH_FERTILIZERS.chickenManure,
        amountKg: chickenManureNeeded,
        cost: chickenManureNeeded * PH_FERTILIZERS.chickenManure.pricePerKg
      }
    ],
    totalCost: (vermicastNeeded * 25) + (chickenManureNeeded * 15),
    note: 'Apply 2-3 weeks before planting. Supplement with foliar organic fertilizers during growth.'
  };
}

// Get recommendations based on weather conditions
export function adjustForWeather(recommendations, weatherData) {
  const adjusted = { ...recommendations };

  if (weatherData?.current?.precipitation > 10) {
    adjusted.weatherWarning = 'Heavy rain expected. Delay fertilizer application to prevent leaching.';
    adjusted.recommendations = adjusted.recommendations.map(r => ({
      ...r,
      weatherNote: 'Apply after rain stops and soil drains'
    }));
  }

  if (weatherData?.current?.temperature > 30) {
    adjusted.weatherWarning = 'High temperature. Apply fertilizer early morning or late afternoon.';
  }

  return adjusted;
}

// Local supplier information for CAR region
export const LOCAL_SUPPLIERS = {
  'La Trinidad': [
    { name: 'Benguet Agri-Supply', location: 'La Trinidad Trading Post', contact: '0917-XXX-XXXX' },
    { name: 'CAR Farmers Coop', location: 'Km 5, La Trinidad', contact: '074-XXX-XXXX' }
  ],
  'Atok': [
    { name: 'Atok Highland Farms', location: 'Poblacion, Atok', contact: '0918-XXX-XXXX' }
  ],
  'Baguio': [
    { name: 'Baguio Agri Center', location: 'Magsaysay Avenue', contact: '074-XXX-XXXX' },
    { name: 'Highland Agri Supply', location: 'Session Road', contact: '074-XXX-XXXX' }
  ]
};

export default {
  PH_FERTILIZERS,
  CROP_REQUIREMENTS,
  calculateFertilizerRecommendation,
  adjustForWeather,
  LOCAL_SUPPLIERS
};
