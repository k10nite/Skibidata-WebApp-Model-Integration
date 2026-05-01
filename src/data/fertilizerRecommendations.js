// Fertilizer Recommendation Engine
// Generates categorical recommendations (Low/Medium/High) based on soil status and plant requirements

import { FERTILIZER_DATABASE } from './fertilizerDatabase';

// Nutrient level hierarchy for gap calculation
const NUTRIENT_LEVELS = {
  'Low': 1,
  'Medium': 2,
  'High': 3
};

const PH_LEVELS = {
  'Acidic': 1,           // < 6.0
  'Slightly Acidic': 2,  // 6.0-6.5
  'Neutral': 3,          // 6.5-7.5
  'Slightly Alkaline': 4, // 7.5-8.0
  'Alkaline': 5          // > 8.0
};

// Calculate nutrient gap (positive = need to increase, negative = need to decrease)
function getNutrientGap(currentLevel, targetLevel) {
  return NUTRIENT_LEVELS[targetLevel] - NUTRIENT_LEVELS[currentLevel];
}

function getpHGap(currentpH, targetpH) {
  return PH_LEVELS[targetpH] - PH_LEVELS[currentpH];
}

// Main recommendation function
export function getRecommendationsForScenario(soilStatus, plantRequirements, plantName) {
  const recommendations = [];

  // 1. NITROGEN RECOMMENDATIONS
  const nitrogenGap = getNutrientGap(soilStatus.nitrogen, plantRequirements.nitrogen);

  if (nitrogenGap > 0) {
    let fertilizer, priority, reason;

    if (nitrogenGap === 2) {
      // Low → High: Need major boost
      fertilizer = FERTILIZER_DATABASE.find(f => f.id === 'urea');
      priority = 'High';
      reason = `Soil nitrogen is ${soilStatus.nitrogen.toLowerCase()}, but ${plantName} needs ${plantRequirements.nitrogen.toLowerCase()} nitrogen for optimal growth`;
    } else if (nitrogenGap === 1) {
      // Medium → High or Low → Medium
      fertilizer = FERTILIZER_DATABASE.find(f => f.id === 'complete');
      priority = 'Medium';
      reason = `Slight nitrogen boost needed to reach ${plantRequirements.nitrogen.toLowerCase()} level`;
    }

    if (fertilizer) {
      recommendations.push({
        nutrient: 'Nitrogen',
        currentLevel: soilStatus.nitrogen,
        targetLevel: plantRequirements.nitrogen,
        gap: nitrogenGap,
        priority: priority,
        fertilizer: fertilizer,
        reason: reason,
        visualIndicator: {
          color: priority === 'High' ? '#EF4444' : '#F59E0B',
          icon: '🌱'
        }
      });
    }
  }

  // 2. PHOSPHORUS RECOMMENDATIONS
  const phosphorusGap = getNutrientGap(soilStatus.phosphorus, plantRequirements.phosphorus);

  if (phosphorusGap > 0) {
    let fertilizer, priority, reason;

    if (phosphorusGap === 2) {
      fertilizer = FERTILIZER_DATABASE.find(f => f.id === 'dap');
      priority = 'High';
      reason = `${plantName} requires ${plantRequirements.phosphorus.toLowerCase()} phosphorus for root development and flowering`;
    } else if (phosphorusGap === 1) {
      fertilizer = FERTILIZER_DATABASE.find(f => f.id === 'ammophos');
      priority = 'Medium';
      reason = `Moderate phosphorus increase needed for optimal plant growth`;
    }

    if (fertilizer) {
      recommendations.push({
        nutrient: 'Phosphorus',
        currentLevel: soilStatus.phosphorus,
        targetLevel: plantRequirements.phosphorus,
        gap: phosphorusGap,
        priority: priority,
        fertilizer: fertilizer,
        reason: reason,
        visualIndicator: {
          color: priority === 'High' ? '#EF4444' : '#F59E0B',
          icon: '🌿'
        }
      });
    }
  }

  // 3. POTASSIUM RECOMMENDATIONS
  const potassiumGap = getNutrientGap(soilStatus.potassium, plantRequirements.potassium);

  if (potassiumGap > 0) {
    let fertilizer, priority, reason;

    if (potassiumGap === 2) {
      fertilizer = FERTILIZER_DATABASE.find(f => f.id === 'muriate');
      priority = 'High';
      reason = `${plantName} needs ${plantRequirements.potassium.toLowerCase()} potassium for fruit quality and disease resistance`;
    } else if (potassiumGap === 1) {
      fertilizer = FERTILIZER_DATABASE.find(f => f.id === 'solokan');
      priority = 'Medium';
      reason = `Potassium boost recommended for better crop performance`;
    }

    if (fertilizer) {
      recommendations.push({
        nutrient: 'Potassium',
        currentLevel: soilStatus.potassium,
        targetLevel: plantRequirements.potassium,
        gap: potassiumGap,
        priority: priority,
        fertilizer: fertilizer,
        reason: reason,
        visualIndicator: {
          color: priority === 'High' ? '#EF4444' : '#F59E0B',
          icon: '🍃'
        }
      });
    }
  }

  // 4. pH RECOMMENDATIONS
  const pHGap = getpHGap(soilStatus.pH, plantRequirements.pH);

  if (pHGap !== 0) {
    let fertilizer, priority, reason;

    if (pHGap > 0) {
      // Need to raise pH (soil too acidic)
      fertilizer = FERTILIZER_DATABASE.find(f => f.id === 'agrilime');
      priority = Math.abs(pHGap) >= 2 ? 'High' : 'Medium';
      reason = `Soil is ${soilStatus.pH.toLowerCase()}, needs adjustment to ${plantRequirements.pH.toLowerCase()} for optimal nutrient availability`;
    } else {
      // Need to lower pH (soil too alkaline)
      fertilizer = FERTILIZER_DATABASE.find(f => f.id === 'sulfur');
      priority = Math.abs(pHGap) >= 2 ? 'High' : 'Medium';
      reason = `pH adjustment needed to create ideal growing conditions for ${plantName}`;
    }

    if (fertilizer) {
      recommendations.push({
        nutrient: 'pH',
        currentLevel: soilStatus.pH,
        targetLevel: plantRequirements.pH,
        gap: pHGap,
        priority: priority,
        fertilizer: fertilizer,
        reason: reason,
        visualIndicator: {
          color: priority === 'High' ? '#EF4444' : '#F59E0B',
          icon: '⚖️'
        }
      });
    }
  }

  // Sort by priority (High first, then Medium)
  recommendations.sort((a, b) => {
    if (a.priority === 'High' && b.priority !== 'High') return -1;
    if (a.priority !== 'High' && b.priority === 'High') return 1;
    return 0;
  });

  return recommendations;
}

// Generate summary statistics
export function getRecommendationSummary(recommendations) {
  const totalProducts = recommendations.length;
  const highPriority = recommendations.filter(r => r.priority === 'High').length;
  const mediumPriority = recommendations.filter(r => r.priority === 'Medium').length;

  // Calculate estimated total cost (assuming 1 hectare)
  const totalCost = recommendations.reduce((sum, rec) => {
    // Extract average bags needed from application rate
    const rateMatch = rec.fertilizer.applicationRate.match(/(\d+)-(\d+)/);
    let bags = 2; // default

    if (rateMatch) {
      bags = (parseInt(rateMatch[1]) + parseInt(rateMatch[2])) / 2;
    }

    return sum + (bags * rec.fertilizer.pricePerBag);
  }, 0);

  return {
    totalProducts: totalProducts,
    highPriority: highPriority,
    mediumPriority: mediumPriority,
    estimatedCost: Math.round(totalCost),
    message: totalProducts === 0
      ? 'Soil conditions are optimal for this crop!'
      : `${totalProducts} fertilizer product${totalProducts > 1 ? 's' : ''} recommended`
  };
}

// Check if soil is optimal (no gaps)
export function isSoilOptimal(soilStatus, plantRequirements) {
  const nGap = getNutrientGap(soilStatus.nitrogen, plantRequirements.nitrogen);
  const pGap = getNutrientGap(soilStatus.phosphorus, plantRequirements.phosphorus);
  const kGap = getNutrientGap(soilStatus.potassium, plantRequirements.potassium);
  const phGap = getpHGap(soilStatus.pH, plantRequirements.pH);

  return nGap === 0 && pGap === 0 && kGap === 0 && phGap === 0;
}
