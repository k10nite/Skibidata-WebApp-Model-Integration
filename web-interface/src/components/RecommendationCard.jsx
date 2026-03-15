import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const RecommendationCard = ({ product, isSelected, onClick }) => {
  return (
    <motion.div
      className={`recommendation-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {isSelected && (
        <div className="selected-indicator">
          <CheckCircle size={20} />
        </div>
      )}

      <div className="product-header">
        <h3 className="product-name">{product.name}</h3>
        <span className={`product-priority priority-${product.priority}`}>
          {product.priority}
        </span>
      </div>

      <div className="product-composition">
        <span className="npk-label">NPK Ratio:</span>
        <span className="npk-value">{product.npkRatio}</span>
      </div>

      <div className="product-details">
        <div className="detail-item">
          <span className="detail-label">Amount</span>
          <span className="detail-value">{product.amount}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Cost/bag</span>
          <span className="detail-value">₱{product.costPerBag}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Total Cost</span>
          <span className="detail-value">₱{product.totalCost}</span>
        </div>
      </div>

      <p className="product-description">{product.description}</p>

      <div className="product-benefits">
        <strong>Benefits:</strong>
        <ul>
          {product.benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
