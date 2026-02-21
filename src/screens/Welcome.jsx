import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, ArrowRight } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="screen welcome-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
    >
      <div className="welcome-content">
        <motion.div variants={itemVariants} className="logo-container">
          <Sprout size={64} className="logo-icon" />
          <h1 className="app-title">FertilizerAI</h1>
        </motion.div>

        <motion.p variants={itemVariants} className="welcome-subtitle">
          Smart Fertilizer Recommendations for Philippine Farmers
        </motion.p>

        <motion.div variants={itemVariants} className="welcome-features">
          <div className="feature-item">
            <span className="feature-icon">🌱</span>
            <p>AI-Powered Analysis</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🗺️</span>
            <p>Location-Based Insights</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <p>Data-Driven Recommendations</p>
          </div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          className="btn btn-primary btn-large"
          onClick={() => navigate('/onboarding')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
          <ArrowRight size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Welcome;
