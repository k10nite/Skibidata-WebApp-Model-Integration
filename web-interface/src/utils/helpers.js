// Utility helper functions

// Format currency (Philippine Peso)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Intl.DateFormat('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

// Debounce function for search inputs
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Get NPK ratio from composition
export const getNPKRatio = (n, p, k) => {
  return `${n}-${p}-${k}`;
};

// Validate soil data
export const validateSoilData = (data) => {
  const errors = {};

  if (!data.pH || data.pH < 0 || data.pH > 14) {
    errors.pH = 'pH must be between 0 and 14';
  }

  if (!data.nitrogen || data.nitrogen < 0) {
    errors.nitrogen = 'Nitrogen value must be positive';
  }

  if (!data.phosphorus || data.phosphorus < 0) {
    errors.phosphorus = 'Phosphorus value must be positive';
  }

  if (!data.potassium || data.potassium < 0) {
    errors.potassium = 'Potassium value must be positive';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Generate unique ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Local storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
};
