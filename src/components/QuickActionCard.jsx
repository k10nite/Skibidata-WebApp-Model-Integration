import { motion } from 'framer-motion';

const QuickActionCard = ({ icon: Icon, title, description, onClick, color = 'blue' }) => {
  return (
    <motion.div
      className={`action-card action-card-${color}`}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`action-icon-container bg-${color}`}>
        <Icon size={28} className="action-icon" />
      </div>
      <div className="action-content">
        <h3 className="action-title">{title}</h3>
        <p className="action-description">{description}</p>
      </div>
    </motion.div>
  );
};

export default QuickActionCard;
