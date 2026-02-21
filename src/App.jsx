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

function App() {
  return (
    <div className="app-container min-h-screen">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Default redirect to location selection */}
          <Route path="/" element={<Navigate to="/location-selection" replace />} />

          {/* Screen 1: Location Selection */}
          <Route path="/location-selection" element={<LocationSelection />} />

          {/* Screen 2: Plant Selection */}
          <Route path="/plant-selection" element={<PlantSelection />} />

          {/* Screen 3: Processing */}
          <Route path="/processing" element={<Processing />} />

          {/* Screen 4: Soil Status */}
          <Route path="/soil-status" element={<SoilStatus />} />

          {/* Screen 5: Plant Requirements */}
          <Route path="/plant-requirements" element={<PlantRequirements />} />

          {/* Screen 6: Fertilizer Recommendations */}
          <Route path="/recommendations" element={<FertilizerRecommendations />} />

          {/* Screen 7: Complete / End Actions */}
          <Route path="/complete" element={<Complete />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/location-selection" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
