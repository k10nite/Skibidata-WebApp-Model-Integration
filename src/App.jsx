// Main App Component
// Routes for 7-screen fertilizer recommendation flow

import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import all 7 screens
import LocationSelection from './screens/LocationSelection';
import PlantSelection from './screens/PlantSelection';
import Processing from './screens/Processing';
import SoilStatus from './screens/SoilStatus';
import PlantRequirements from './screens/PlantRequirements';
import FertilizerRecommendations from './screens/FertilizerRecommendations';
import Complete from './screens/Complete';
import CompleteScreen from './screens/CompleteScreen';

// Kimi-generated premium screens
import PlantSelectionKimi from './screens/PlantSelection_Kimi';
import ProcessingScreen from './screens/ProcessingScreen';
import SoilStatusScreen from './screens/SoilStatusScreen';
import FertilizerRecommendationsPremium from './screens/premium/FertilizerRecommendations';

// Comparison page
import ScreenComparison from './screens/ScreenComparison';
import TestPage from './screens/TestPage';

function App() {
  return (
    <div className="app-container min-h-screen">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Default redirect to test page */}
          <Route path="/" element={<Navigate to="/test" replace />} />

          {/* TEST PAGE */}
          <Route path="/test" element={<TestPage />} />

          {/* COMPARISON PAGE */}
          <Route path="/compare" element={<ScreenComparison />} />

          {/* ORIGINAL SCREENS (Earthy Farm Tech) */}
          <Route path="/location-selection" element={<LocationSelection />} />
          <Route path="/plant-selection" element={<PlantSelection />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/soil-status" element={<SoilStatus />} />
          <Route path="/plant-requirements" element={<PlantRequirements />} />
          <Route path="/fertilizer-recommendations" element={<FertilizerRecommendations />} />
          <Route path="/complete" element={<Complete />} />

          {/* KIMI PREMIUM SCREENS (Airbnb/Apple Style) */}
          <Route path="/plant-selection-kimi" element={<PlantSelectionKimi />} />
          <Route path="/processing-screen" element={<ProcessingScreen />} />
          <Route path="/soil-status-screen" element={<SoilStatusScreen />} />
          <Route path="/fertilizer-recommendations-premium" element={<FertilizerRecommendationsPremium />} />
          <Route path="/complete-screen" element={<CompleteScreen />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/compare" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
