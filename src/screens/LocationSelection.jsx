// Screen 1: Location Selection
// User selects farm location via GPS or map click

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MapPicker from '../components/MapPicker';
import Button from '../components/Button';
import useAppStore from '../store/appStore';
import { getMunicipalityByCoordinates } from '../data/carLocations';

export default function LocationSelection() {
  const navigate = useNavigate();
  const { setLocation } = useAppStore();
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  const handleContinue = () => {
    if (selectedLocation) {
      // Determine municipality and barangay based on coordinates
      const municipality = getMunicipalityByCoordinates(
        selectedLocation.lat,
        selectedLocation.lng
      );

      setLocation(
        selectedLocation,
        municipality.name,
        municipality.barangays[0]?.name || 'Unknown'
      );

      navigate('/plant-selection');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="inline-block mb-4"
          >
            <span className="text-6xl">🌍</span>
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Select Farm Location
          </h1>
          <p className="text-lg text-gray-600">
            Choose your farm location to get accurate soil analysis and fertilizer recommendations
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="text-sm text-gray-600 ml-2">Location</div>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="text-sm text-gray-400 ml-2">Plant</div>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="text-sm text-gray-400 ml-2">Analysis</div>
            </div>
          </div>
        </div>

        {/* Map Picker Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <MapPicker
            onLocationSelect={handleLocationChange}
            initialPosition={null}
          />
        </motion.div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedLocation}
            size="large"
            icon="➡️"
          >
            Continue to Plant Selection
          </Button>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center"
        >
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This system analyzes soil conditions specific to CAR highland areas
            (La Trinidad, Atok, Tublay, Buguias) for optimal vegetable farming.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
