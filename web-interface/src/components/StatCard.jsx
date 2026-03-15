import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color = 'blue' }) => {
  return (
    <motion.div
      className={`stat-card stat-card-${color}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="stat-icon-container">
        <Icon size={24} className="stat-icon" />
      </div>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    </motion.div>
  );
};

export default StatCard;
