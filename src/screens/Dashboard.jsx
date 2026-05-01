import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, FileText, TestTube, BookOpen, Settings } from 'lucide-react';
import StatCard from '../components/StatCard';
import QuickActionCard from '../components/QuickActionCard';

const Dashboard = () => {
  const navigate = useNavigate();

  const farmProfile = JSON.parse(localStorage.getItem('farmProfile') || '{}');

  const stats = [
    {
      icon: Sprout,
      label: 'Active Crops',
      value: farmProfile.cropType || 'Not set',
      color: 'green',
    },
    {
      icon: FileText,
      label: 'Recommendations',
      value: '3 Active',
      color: 'blue',
    },
    {
      icon: TestTube,
      label: 'Soil Tests',
      value: '2 Completed',
      color: 'purple',
    },
  ];

  const quickActions = [
    {
      icon: TestTube,
      title: 'New Soil Analysis',
      description: 'Input soil test results',
      onClick: () => navigate('/soil-analysis'),
      color: 'purple',
    },
    {
      icon: FileText,
      title: 'View Recommendations',
      description: 'See fertilizer suggestions',
      onClick: () => navigate('/recommendations'),
      color: 'blue',
    },
    {
      icon: BookOpen,
      title: 'Resource Library',
      description: 'Learn best practices',
      onClick: () => navigate('/resources'),
      color: 'orange',
    },
    {
      icon: Settings,
      title: 'Farm Settings',
      description: 'Update farm profile',
      onClick: () => navigate('/farm-setup'),
      color: 'gray',
    },
  ];

  return (
    <motion.div
      className="screen dashboard-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="screen-header">
        <div>
          <h1 className="screen-title">
            Welcome back, {farmProfile.farmName || 'Farmer'}!
          </h1>
          <p className="screen-subtitle">
            Here's an overview of your farm
          </p>
        </div>
      </div>

      <section className="dashboard-section">
        <h2 className="section-title">Farm Overview</h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">📊</div>
            <div className="activity-content">
              <p className="activity-title">Soil test completed</p>
              <p className="activity-date">2 days ago</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🌱</div>
            <div className="activity-content">
              <p className="activity-title">New recommendation generated</p>
              <p className="activity-date">5 days ago</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-content">
              <p className="activity-title">Farm profile updated</p>
              <p className="activity-date">1 week ago</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Dashboard;
