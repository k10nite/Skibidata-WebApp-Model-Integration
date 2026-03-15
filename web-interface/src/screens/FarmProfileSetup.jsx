import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Save } from 'lucide-react';
import MapSelector from '../components/MapSelector';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import { cropTypes } from '../data/mockData';

const FarmProfileSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    farmName: '',
    farmSize: '',
    location: null,
    cropType: '',
    soilType: '',
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({ ...prev, location }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save farm profile to localStorage or context
    localStorage.setItem('farmProfile', JSON.stringify(formData));
    navigate('/dashboard');
  };

  const isFormValid = () => {
    return (
      formData.farmName &&
      formData.farmSize &&
      formData.location &&
      formData.cropType &&
      formData.soilType
    );
  };

  return (
    <motion.div
      className="screen farm-profile-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="screen-header">
        <h1 className="screen-title">Set Up Your Farm Profile</h1>
        <p className="screen-subtitle">
          Tell us about your farm to get personalized recommendations
        </p>
      </div>

      <form className="farm-profile-form" onSubmit={handleSubmit}>
        <FormInput
          label="Farm Name"
          placeholder="Enter your farm name"
          value={formData.farmName}
          onChange={(value) => handleInputChange('farmName', value)}
          required
        />

        <FormInput
          label="Farm Size (hectares)"
          type="number"
          placeholder="Enter farm size"
          value={formData.farmSize}
          onChange={(value) => handleInputChange('farmSize', value)}
          required
        />

        <FormSelect
          label="Primary Crop"
          options={cropTypes}
          value={formData.cropType}
          onChange={(value) => handleInputChange('cropType', value)}
          placeholder="Select crop type"
          required
        />

        <FormSelect
          label="Soil Type"
          options={[
            { value: 'clay', label: 'Clay' },
            { value: 'sandy', label: 'Sandy' },
            { value: 'loam', label: 'Loam' },
            { value: 'silt', label: 'Silt' },
            { value: 'peat', label: 'Peat' },
          ]}
          value={formData.soilType}
          onChange={(value) => handleInputChange('soilType', value)}
          placeholder="Select soil type"
          required
        />

        <div className="form-group">
          <label className="form-label">
            <MapPin size={18} />
            Farm Location
          </label>
          <MapSelector
            onLocationSelect={handleLocationSelect}
            selectedLocation={formData.location}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-large"
          disabled={!isFormValid()}
        >
          <Save size={20} />
          Save Profile
        </button>
      </form>
    </motion.div>
  );
};

export default FarmProfileSetup;
