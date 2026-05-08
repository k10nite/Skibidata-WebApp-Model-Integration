import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const onboardingSteps = [
  {
    title: 'Welcome to ANES',
    description: 'Get personalized fertilizer recommendations based on your soil conditions and crops.',
    image: '🌾',
  },
  {
    title: 'Soil Analysis',
    description: 'Input your soil test results or use our location-based recommendations.',
    image: '🔬',
  },
  {
    title: 'Smart Recommendations',
    description: 'Receive AI-powered fertilizer suggestions optimized for your farm.',
    image: '🎯',
  },
  {
    title: 'Track Your Progress',
    description: 'Monitor your farm\'s performance and adjust recommendations over time.',
    image: '📈',
  },
];

const OnboardingScreen = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/farm-setup');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate('/farm-setup');
  };

  return (
    <div className="screen onboarding-screen">
      <div className="onboarding-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="onboarding-step"
          >
            <div className="step-image">
              <span className="step-emoji">{onboardingSteps[currentStep].image}</span>
            </div>
            <h2 className="step-title">{onboardingSteps[currentStep].title}</h2>
            <p className="step-description">{onboardingSteps[currentStep].description}</p>
          </motion.div>
        </AnimatePresence>

        <div className="step-indicators">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === currentStep ? 'active' : ''}`}
            />
          ))}
        </div>

        <div className="onboarding-actions">
          <button
            className="btn btn-text"
            onClick={handleSkip}
          >
            Skip
          </button>

          <div className="navigation-buttons">
            {currentStep > 0 && (
              <button
                className="btn btn-secondary"
                onClick={handlePrevious}
              >
                <ChevronLeft size={20} />
                Previous
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={handleNext}
            >
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
