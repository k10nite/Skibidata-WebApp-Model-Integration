import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, Calendar, DollarSign, Download, Share2 } from 'lucide-react';
import RecommendationCard from '../components/RecommendationCard';
import { generateRecommendations } from '../utils/recommendationEngine';

const RecommendationResults = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Get soil analysis and farm profile
    const soilData = JSON.parse(localStorage.getItem('soilAnalysis') || '{}');
    const farmProfile = JSON.parse(localStorage.getItem('farmProfile') || '{}');

    // Generate recommendations
    const recs = generateRecommendations(soilData, farmProfile);
    setRecommendations(recs);
    setSelectedProduct(recs?.products?.[0] || null);
  }, []);

  if (!recommendations) {
    return (
      <div className="screen loading-screen">
        <div className="loading-spinner">Generating recommendations...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="screen recommendations-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="screen-header">
        <h1 className="screen-title">
          <CheckCircle size={32} className="text-success" />
          Your Fertilizer Recommendations
        </h1>
        <p className="screen-subtitle">
          Based on your soil analysis and crop type
        </p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <TrendingUp size={24} className="summary-icon" />
          <div className="summary-content">
            <span className="summary-label">Expected Yield Increase</span>
            <span className="summary-value">{recommendations.yieldIncrease}%</span>
          </div>
        </div>
        <div className="summary-card">
          <DollarSign size={24} className="summary-icon" />
          <div className="summary-content">
            <span className="summary-label">Estimated Cost</span>
            <span className="summary-value">₱{recommendations.estimatedCost}</span>
          </div>
        </div>
        <div className="summary-card">
          <Calendar size={24} className="summary-icon" />
          <div className="summary-content">
            <span className="summary-label">Application Period</span>
            <span className="summary-value">{recommendations.applicationPeriod}</span>
          </div>
        </div>
      </div>

      {/* Soil Status */}
      <section className="recommendation-section">
        <h2 className="section-title">Soil Nutrient Status</h2>
        <div className="nutrient-status-grid">
          {recommendations.nutrientStatus.map((nutrient, index) => (
            <div key={index} className={`nutrient-card status-${nutrient.status}`}>
              <h4>{nutrient.name}</h4>
              <div className="nutrient-value">{nutrient.value}</div>
              <div className="nutrient-status-badge">{nutrient.status}</div>
              <p className="nutrient-note">{nutrient.recommendation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Recommendations */}
      <section className="recommendation-section">
        <h2 className="section-title">Recommended Products</h2>
        <div className="products-grid">
          {recommendations.products.map((product, index) => (
            <RecommendationCard
              key={index}
              product={product}
              isSelected={selectedProduct?.name === product.name}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </section>

      {/* Selected Product Details */}
      {selectedProduct && (
        <section className="recommendation-section">
          <h2 className="section-title">Application Instructions</h2>
          <div className="application-details">
            <div className="detail-card">
              <h4>Application Rate</h4>
              <p>{selectedProduct.applicationRate}</p>
            </div>
            <div className="detail-card">
              <h4>Timing</h4>
              <p>{selectedProduct.timing}</p>
            </div>
            <div className="detail-card">
              <h4>Method</h4>
              <p>{selectedProduct.method}</p>
            </div>
          </div>

          <div className="application-notes">
            <h4>Important Notes:</h4>
            <ul>
              {selectedProduct.notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="recommendation-actions">
        <button className="btn btn-secondary">
          <Download size={20} />
          Download PDF
        </button>
        <button className="btn btn-secondary">
          <Share2 size={20} />
          Share
        </button>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    </motion.div>
  );
};

export default RecommendationResults;
