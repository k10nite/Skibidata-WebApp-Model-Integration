// Mock AI recommendation engine
export const generateRecommendations = (soilData, farmProfile) => {
  const { pH, nitrogen, phosphorus, potassium } = soilData;
  const { cropType, farmSize } = farmProfile;

  // Nutrient status assessment
  const assessNutrientStatus = (value, optimal) => {
    if (value < optimal * 0.7) return 'low';
    if (value > optimal * 1.3) return 'high';
    return 'optimal';
  };

  // Optimal ranges based on crop type (simplified)
  const optimalRanges = {
    rice: { N: 60, P: 30, K: 40, pH: 6.0 },
    corn: { N: 80, P: 40, K: 50, pH: 6.5 },
    vegetables: { N: 50, P: 35, K: 45, pH: 6.5 },
    default: { N: 60, P: 30, K: 40, pH: 6.5 },
  };

  const optimal = optimalRanges[cropType] || optimalRanges.default;

  // Assess nutrient status
  const nutrientStatus = [
    {
      name: 'Nitrogen (N)',
      value: `${nitrogen} kg/ha`,
      status: assessNutrientStatus(nitrogen, optimal.N),
      recommendation: getNutrientRecommendation('nitrogen', nitrogen, optimal.N),
    },
    {
      name: 'Phosphorus (P)',
      value: `${phosphorus} kg/ha`,
      status: assessNutrientStatus(phosphorus, optimal.P),
      recommendation: getNutrientRecommendation('phosphorus', phosphorus, optimal.P),
    },
    {
      name: 'Potassium (K)',
      value: `${potassium} kg/ha`,
      status: assessNutrientStatus(potassium, optimal.K),
      recommendation: getNutrientRecommendation('potassium', potassium, optimal.K),
    },
    {
      name: 'pH Level',
      value: pH,
      status: assessNutrientStatus(pH, optimal.pH),
      recommendation: getpHRecommendation(pH, optimal.pH),
    },
  ];

  // Generate product recommendations
  const products = generateProductRecommendations(
    nitrogen,
    phosphorus,
    potassium,
    optimal,
    farmSize
  );

  // Calculate totals
  const estimatedCost = products.reduce((sum, p) => sum + p.totalCost, 0);
  const yieldIncrease = calculateYieldIncrease(nutrientStatus);

  return {
    nutrientStatus,
    products,
    estimatedCost: estimatedCost.toLocaleString(),
    yieldIncrease,
    applicationPeriod: '3-4 months',
  };
};

function getNutrientRecommendation(nutrient, current, optimal) {
  const ratio = current / optimal;
  if (ratio < 0.7) return `Significant ${nutrient} deficiency detected. Apply nitrogen-rich fertilizer.`;
  if (ratio > 1.3) return `${nutrient} levels are high. Reduce application to avoid toxicity.`;
  return `${nutrient} levels are optimal. Maintain current practices.`;
}

function getpHRecommendation(current, optimal) {
  if (current < optimal - 0.5) return 'Soil is acidic. Consider applying lime to raise pH.';
  if (current > optimal + 0.5) return 'Soil is alkaline. Apply sulfur to lower pH.';
  return 'Soil pH is optimal for crop growth.';
}

function generateProductRecommendations(N, P, K, optimal, farmSize) {
  const hectares = parseFloat(farmSize) || 1;

  const products = [];

  // Primary recommendation: Complete fertilizer
  const completeNPK = '14-14-14';
  const bagsNeeded = Math.ceil(hectares * 3); // 3 bags per hectare
  products.push({
    name: 'Complete 14-14-14',
    npkRatio: completeNPK,
    amount: `${bagsNeeded} bags (50kg each)`,
    costPerBag: 1200,
    totalCost: bagsNeeded * 1200,
    priority: 'recommended',
    description: 'Balanced all-purpose fertilizer providing essential nutrients',
    benefits: [
      'Balanced NPK ratio for overall plant health',
      'Suitable for most growth stages',
      'Cost-effective solution',
    ],
    applicationRate: `${bagsNeeded} bags per ${hectares} hectare(s)`,
    timing: 'Apply 30% at planting, 30% at tillering, 40% at panicle initiation',
    method: 'Broadcast and incorporate into soil',
    notes: [
      'Apply during dry weather for best results',
      'Water immediately after application',
      'Store in cool, dry place away from moisture',
    ],
  });

  // If nitrogen is low, suggest urea
  if (N < optimal.N * 0.7) {
    const ureaNeeded = Math.ceil(hectares * 2);
    products.push({
      name: 'Urea 46-0-0',
      npkRatio: '46-0-0',
      amount: `${ureaNeeded} bags (50kg each)`,
      costPerBag: 1400,
      totalCost: ureaNeeded * 1400,
      priority: 'high',
      description: 'High nitrogen fertilizer for rapid vegetative growth',
      benefits: [
        'Rapidly increases nitrogen levels',
        'Promotes leaf and stem development',
        'High nitrogen concentration',
      ],
      applicationRate: `${ureaNeeded} bags per ${hectares} hectare(s)`,
      timing: 'Apply 50% at 20-25 days after planting, 50% at 40-45 days',
      method: 'Side-dress application or top-dress',
      notes: [
        'Do not apply directly to plant foliage',
        'Best applied before rainfall or irrigation',
        'Can be mixed with other fertilizers',
      ],
    });
  }

  // If phosphorus is low, suggest Ammophos
  if (P < optimal.P * 0.7) {
    const ammophosNeeded = Math.ceil(hectares * 1.5);
    products.push({
      name: 'Ammophos 16-20-0',
      npkRatio: '16-20-0',
      amount: `${ammophosNeeded} bags (50kg each)`,
      costPerBag: 1350,
      totalCost: ammophosNeeded * 1350,
      priority: 'medium',
      description: 'Nitrogen-phosphorus fertilizer for root development',
      benefits: [
        'Promotes strong root system',
        'Enhances early plant establishment',
        'Improves flowering and fruiting',
      ],
      applicationRate: `${ammophosNeeded} bags per ${hectares} hectare(s)`,
      timing: 'Apply at planting or early growth stage',
      method: 'Incorporate into soil before planting',
      notes: [
        'Best applied as basal fertilizer',
        'Mix thoroughly with soil',
        'Effective for phosphorus-deficient soils',
      ],
    });
  }

  return products;
}

function calculateYieldIncrease(nutrientStatus) {
  const lowNutrients = nutrientStatus.filter((n) => n.status === 'low').length;
  const optimalNutrients = nutrientStatus.filter((n) => n.status === 'optimal').length;

  if (lowNutrients >= 2) return 25;
  if (lowNutrients === 1) return 15;
  if (optimalNutrients >= 3) return 10;
  return 5;
}
