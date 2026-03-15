# Project Structure

Complete overview of the fertilizer recommendation prototype file structure.

## Directory Tree

```
thesis/
│
├── public/                          # Static assets served directly
│   └── (empty - ready for images/icons)
│
├── src/                             # Source code
│   │
│   ├── assets/                      # Application assets
│   │   ├── images/                  # Image files
│   │   └── icons/                   # Icon files
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── FormInput.jsx            # Text/number input with validation
│   │   ├── FormSelect.jsx           # Dropdown select component
│   │   ├── MapSelector.jsx          # Interactive Leaflet map
│   │   ├── QuickActionCard.jsx      # Dashboard action cards
│   │   ├── RecommendationCard.jsx   # Fertilizer product cards
│   │   └── StatCard.jsx             # Statistics display cards
│   │
│   ├── data/                        # Mock data and constants
│   │   └── mockData.js              # Crop types, soil types, resources, products
│   │
│   ├── screens/                     # Main application screens (7 total)
│   │   ├── Welcome.jsx              # Landing page
│   │   ├── OnboardingScreen.jsx     # 4-step onboarding flow
│   │   ├── FarmProfileSetup.jsx     # Farm information form
│   │   ├── Dashboard.jsx            # Main dashboard with overview
│   │   ├── SoilAnalysis.jsx         # Soil test input form
│   │   ├── RecommendationResults.jsx # AI recommendations display
│   │   └── ResourceLibrary.jsx      # Educational resources
│   │
│   ├── styles/                      # Global styles
│   │   └── index.css                # Tailwind + custom CSS with design tokens
│   │
│   ├── utils/                       # Helper functions
│   │   ├── helpers.js               # Utility functions (formatting, validation)
│   │   └── recommendationEngine.js  # Mock AI recommendation logic
│   │
│   ├── App.jsx                      # Main app component with React Router
│   └── main.jsx                     # Application entry point
│
├── .eslintignore                    # ESLint ignore patterns
├── .eslintrc.cjs                    # ESLint configuration
├── .gitignore                       # Git ignore patterns
├── .prettierignore                  # Prettier ignore patterns
├── .prettierrc                      # Prettier configuration
├── index.html                       # HTML template
├── package.json                     # Dependencies and scripts
├── postcss.config.js                # PostCSS configuration
├── README.md                        # Main documentation
├── SETUP_GUIDE.md                   # Quick setup instructions
├── tailwind.config.js               # Tailwind CSS configuration
└── vite.config.js                   # Vite build configuration
```

## File Count Summary

- **Screens**: 7 files
- **Components**: 6 files
- **Utilities**: 2 files
- **Data**: 1 file
- **Styles**: 1 file
- **Config**: 9 files
- **Documentation**: 3 files

**Total**: 29 project files

## File Descriptions

### Root Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Project metadata, dependencies, scripts |
| `vite.config.js` | Vite build tool configuration |
| `tailwind.config.js` | Tailwind CSS theme customization |
| `postcss.config.js` | PostCSS plugins configuration |
| `.eslintrc.cjs` | ESLint rules for code quality |
| `.prettierrc` | Prettier rules for code formatting |
| `.gitignore` | Files to exclude from Git |
| `index.html` | HTML template with root div |

### Source Files

#### Entry Points
- **`main.jsx`**: ReactDOM root, BrowserRouter wrapper
- **`App.jsx`**: Route definitions, screen imports

#### Screens (7)
1. **`Welcome.jsx`**: Animated landing with feature highlights
2. **`OnboardingScreen.jsx`**: Multi-step tutorial with indicators
3. **`FarmProfileSetup.jsx`**: Form with map selector
4. **`Dashboard.jsx`**: Stats, quick actions, activity feed
5. **`SoilAnalysis.jsx`**: Soil test input (manual/upload)
6. **`RecommendationResults.jsx`**: AI recommendations with details
7. **`ResourceLibrary.jsx`**: Search/filter educational content

#### Components (6)
1. **`FormInput.jsx`**: Input field with label, validation, help text
2. **`FormSelect.jsx`**: Dropdown with label and validation
3. **`MapSelector.jsx`**: Leaflet map with click-to-select location
4. **`StatCard.jsx`**: Icon + label + value display
5. **`QuickActionCard.jsx`**: Clickable card with icon and description
6. **`RecommendationCard.jsx`**: Product display with selection state

#### Data & Logic
- **`mockData.js`**: Crops, soil types, products, resources, provinces
- **`recommendationEngine.js`**: Mock AI algorithm for fertilizer suggestions
- **`helpers.js`**: Currency format, validation, localStorage wrapper

#### Styles
- **`index.css`**: CSS variables, Tailwind directives, custom classes

## Dependencies Overview

### Production Dependencies
- **react**: UI library
- **react-dom**: React rendering
- **react-router-dom**: Client-side routing
- **framer-motion**: Animations
- **leaflet**: Mapping library
- **react-leaflet**: React wrapper for Leaflet
- **axios**: HTTP requests
- **clsx**: Conditional class names
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool
- **@vitejs/plugin-react**: React plugin for Vite
- **eslint**: Code linting
- **prettier**: Code formatting
- **tailwindcss**: Utility-first CSS
- **autoprefixer**: CSS vendor prefixes
- **postcss**: CSS transformations

## Key Features by File

### Navigation & Routing
- `App.jsx`: All routes defined
- `main.jsx`: BrowserRouter setup

### User Input
- `FormInput.jsx` + `FormSelect.jsx`: Form controls
- `MapSelector.jsx`: Location selection

### Data Display
- `StatCard.jsx`: Metrics
- `QuickActionCard.jsx`: Actions
- `RecommendationCard.jsx`: Product suggestions

### Business Logic
- `recommendationEngine.js`: Recommendation algorithm
- `helpers.js`: Data processing utilities

### Mock Data
- `mockData.js`: All sample data centralized

## Customization Guide

| To Change... | Edit File... |
|--------------|--------------|
| Colors, fonts | `tailwind.config.js`, `src/styles/index.css` |
| Sample data | `src/data/mockData.js` |
| Recommendation logic | `src/utils/recommendationEngine.js` |
| Add new screen | Create in `src/screens/`, add route in `App.jsx` |
| Add new component | Create in `src/components/` |
| Change port | `vite.config.js` |
| Modify linting rules | `.eslintrc.cjs` |
| Update formatting | `.prettierrc` |

## Build Output

After running `npm run build`:
```
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── vendor-[hash].js
└── index.html
```

All files are optimized, minified, and hashed for production deployment.
