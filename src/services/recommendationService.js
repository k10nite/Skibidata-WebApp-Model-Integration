import { calculateFertilizerRecommendation } from './fertilizerEngine';

export function getRecommendationForCrop(soilData, cropKey, areaHectares = 1, availableFertilizers = '') {
  return calculateFertilizerRecommendation(soilData, cropKey, areaHectares);
}
