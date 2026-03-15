# Quick Setup Guide

## Installation Commands

Run these commands in sequence to get your project up and running:

```bash
# 1. Navigate to project directory
cd C:\Users\Neil\Documents\thesis

# 2. Install all dependencies
npm install

# 3. Start the development server
npm run dev
```

The application will automatically open in your browser at `http://localhost:3000`

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can:
- Kill the process using port 3000
- Or modify `vite.config.js` to use a different port

### Module Not Found Errors

If you encounter module errors:
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Leaflet Map Not Showing

If the map doesn't render properly:
1. Check browser console for errors
2. Ensure internet connection (map tiles load from CDN)
3. Clear browser cache

## Development Workflow

### 1. Start Development
```bash
npm run dev
```

### 2. Check Code Quality
```bash
# Run ESLint
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format
```

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## Project Architecture

### Navigation Flow
```
Welcome (/)
  → Onboarding (/onboarding)
    → Farm Setup (/farm-setup)
      → Dashboard (/dashboard)
        ├─→ Soil Analysis (/soil-analysis) → Recommendations (/recommendations)
        └─→ Resources (/resources)
```

### Data Flow
1. **Farm Profile Setup**: Data saved to localStorage
2. **Soil Analysis**: Results saved to localStorage
3. **Recommendations**: Generated from stored data using mock AI engine
4. **Dashboard**: Displays aggregated information from localStorage

### Key Files to Modify

**Add new screen:**
- Create component in `src/screens/`
- Add route in `src/App.jsx`

**Add new component:**
- Create component in `src/components/`
- Import and use in screens

**Modify mock data:**
- Edit `src/data/mockData.js`

**Update recommendation logic:**
- Edit `src/utils/recommendationEngine.js`

**Change styling:**
- Global styles: `src/styles/index.css`
- Tailwind config: `tailwind.config.js`
- Component-specific: Inline or CSS modules

## Testing the Application

### 1. Welcome Screen
- Click "Get Started" button
- Should navigate to onboarding

### 2. Onboarding
- Navigate through 4 steps
- Test "Previous", "Next", and "Skip" buttons

### 3. Farm Profile Setup
- Fill in all required fields
- Click map to select location
- Submit form
- Should navigate to dashboard

### 4. Dashboard
- Check if farm name appears
- Click quick action cards
- Verify navigation

### 5. Soil Analysis
- Switch between manual entry and upload
- Fill in soil values
- Submit to generate recommendations

### 6. Recommendations
- View nutrient status
- Check product recommendations
- Review application instructions

### 7. Resource Library
- Test search functionality
- Filter by category
- Click resource cards

## Next Steps

1. **Run the application** using `npm run dev`
2. **Test all screens** to ensure proper functionality
3. **Customize mock data** in `src/data/mockData.js`
4. **Modify recommendation logic** in `src/utils/recommendationEngine.js`
5. **Update styling** to match your design preferences
6. **Add real API integration** when backend is ready

## Common Development Tasks

### Adding a New Route
```javascript
// In src/App.jsx
import NewScreen from './screens/NewScreen';

// Add to Routes
<Route path="/new-screen" element={<NewScreen />} />
```

### Creating a New Component
```javascript
// src/components/NewComponent.jsx
import { motion } from 'framer-motion';

const NewComponent = ({ prop1, prop2 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Component content */}
    </motion.div>
  );
};

export default NewComponent;
```

### Updating Mock Data
```javascript
// src/data/mockData.js
export const newDataSet = [
  {
    id: 1,
    name: 'Item 1',
    // ... more properties
  },
  // ... more items
];
```

## Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review code comments in source files
3. Consult React, Vite, and Tailwind documentation

Happy coding!
