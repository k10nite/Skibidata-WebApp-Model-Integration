import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TestTube, ArrowRight, Upload } from 'lucide-react';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';

const SoilAnalysis = () => {
  const navigate = useNavigate();
  const [analysisMethod, setAnalysisMethod] = useState('manual');
  const [soilData, setSoilData] = useState({
    pH: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organicMatter: '',
  });

  const handleInputChange = (field, value) => {
    setSoilData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save soil analysis data
    localStorage.setItem('soilAnalysis', JSON.stringify(soilData));
    // Navigate to recommendations
    navigate('/recommendations');
  };

  const isFormValid = () => {
    return (
      soilData.pH &&
      soilData.nitrogen &&
      soilData.phosphorus &&
      soilData.potassium
    );
  };

  return (
    <motion.div
      className="screen soil-analysis-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="screen-header">
        <h1 className="screen-title">
          <TestTube size={32} />
          Soil Analysis
        </h1>
        <p className="screen-subtitle">
          Enter your soil test results to get personalized recommendations
        </p>
      </div>

      <div className="analysis-method-selector">
        <button
          className={`method-btn ${analysisMethod === 'manual' ? 'active' : ''}`}
          onClick={() => setAnalysisMethod('manual')}
        >
          Manual Entry
        </button>
        <button
          className={`method-btn ${analysisMethod === 'upload' ? 'active' : ''}`}
          onClick={() => setAnalysisMethod('upload')}
        >
          <Upload size={18} />
          Upload Test Results
        </button>
      </div>

      {analysisMethod === 'manual' ? (
        <form className="soil-analysis-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="form-section-title">Soil Properties</h3>

            <FormInput
              label="pH Level"
              type="number"
              step="0.1"
              min="0"
              max="14"
              placeholder="e.g., 6.5"
              value={soilData.pH}
              onChange={(value) => handleInputChange('pH', value)}
              required
              helpText="Typical range: 5.5 - 7.5"
            />

            <FormInput
              label="Nitrogen (N) - kg/ha"
              type="number"
              step="0.1"
              placeholder="e.g., 45"
              value={soilData.nitrogen}
              onChange={(value) => handleInputChange('nitrogen', value)}
              required
            />

            <FormInput
              label="Phosphorus (P) - kg/ha"
              type="number"
              step="0.1"
              placeholder="e.g., 25"
              value={soilData.phosphorus}
              onChange={(value) => handleInputChange('phosphorus', value)}
              required
            />

            <FormInput
              label="Potassium (K) - kg/ha"
              type="number"
              step="0.1"
              placeholder="e.g., 30"
              value={soilData.potassium}
              onChange={(value) => handleInputChange('potassium', value)}
              required
            />

            <FormInput
              label="Organic Matter (%)"
              type="number"
              step="0.1"
              placeholder="e.g., 3.5"
              value={soilData.organicMatter}
              onChange={(value) => handleInputChange('organicMatter', value)}
              helpText="Optional"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={!isFormValid()}
          >
            Generate Recommendations
            <ArrowRight size={20} />
          </button>
        </form>
      ) : (
        <div className="upload-area">
          <Upload size={48} />
          <h3>Upload Soil Test Results</h3>
          <p>Drag and drop your PDF or image file here, or click to browse</p>
          <button className="btn btn-secondary">Choose File</button>
          <p className="upload-note">Supported formats: PDF, JPG, PNG</p>
        </div>
      )}
    </motion.div>
  );
};

export default SoilAnalysis;
