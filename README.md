# Fertilizer Recommendation Prototype

An AI-powered fertilizer recommendation system designed for smallholder farmers in the Philippines. This application provides personalized fertilizer suggestions based on soil analysis, crop type, and location data.

## Features

- **Interactive Onboarding**: User-friendly introduction to the application
- **Farm Profile Setup**: Manage farm details including location, size, and crop type
- **Soil Analysis**: Input soil test results (pH, NPK values) for accurate recommendations
- **AI-Powered Recommendations**: Get personalized fertilizer suggestions based on your data
- **Resource Library**: Access educational materials about fertilizer application and farming best practices
- **Interactive Map**: Location-based features using Leaflet maps
- **Smooth Animations**: Enhanced UX with Framer Motion animations

## Tech Stack

- **React 18.3**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **React Router v6**: Client-side routing
- **Framer Motion**: Animation library
- **React Leaflet**: Interactive maps
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **Axios**: HTTP client

## Project Structure

```
thesis/
├── public/               # Static assets
├── src/
│   ├── assets/          # Images, icons
│   │   ├── images/
│   │   └── icons/
│   ├── components/      # Reusable UI components
│   │   ├── FormInput.jsx
│   │   ├── FormSelect.jsx
│   │   ├── MapSelector.jsx
│   │   ├── StatCard.jsx
│   │   ├── QuickActionCard.jsx
│   │   └── RecommendationCard.jsx
│   ├── data/            # Mock data and constants
│   │   └── mockData.js
│   ├── screens/         # Main application screens
│   │   ├── Welcome.jsx
│   │   ├── OnboardingScreen.jsx
│   │   ├── FarmProfileSetup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── SoilAnalysis.jsx
│   │   ├── RecommendationResults.jsx
│   │   └── ResourceLibrary.jsx
│   ├── styles/          # Global styles
│   │   └── index.css
│   ├── utils/           # Helper functions
│   │   ├── helpers.js
│   │   └── recommendationEngine.js
│   ├── App.jsx          # Main app component with routing
│   └── main.jsx         # Application entry point
├── .eslintrc.cjs        # ESLint configuration
├── .prettierrc          # Prettier configuration
├── .gitignore           # Git ignore rules
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.js       # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd thesis
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier

## Application Flow

1. **Welcome Screen** (`/`)
   - Landing page with app introduction
   - Navigate to onboarding

2. **Onboarding** (`/onboarding`)
   - 4-step introduction to features
   - Can be skipped

3. **Farm Profile Setup** (`/farm-setup`)
   - Enter farm details (name, size, location)
   - Select crop type and soil type
   - Interactive map for location selection

4. **Dashboard** (`/dashboard`)
   - Overview of farm statistics
   - Quick actions to main features
   - Recent activity log

5. **Soil Analysis** (`/soil-analysis`)
   - Input soil test results (pH, NPK values)
   - Manual entry or file upload
   - Form validation

6. **Recommendations** (`/recommendations`)
   - View AI-generated fertilizer recommendations
   - Nutrient status assessment
   - Product suggestions with pricing
   - Application instructions

7. **Resource Library** (`/resources`)
   - Educational articles and videos
   - Search and filter functionality
   - Category-based organization

## Mock Data

The application uses mock data for demonstration purposes:

- **Crop Types**: Rice, Corn, Coconut, Sugarcane, Banana, Mango, Vegetables, Cassava
- **Fertilizer Products**: Complete 14-14-14, Urea 46-0-0, Ammophos 16-20-0
- **Philippine Provinces**: Sample coordinates for map features
- **Resources**: Articles and videos about farming practices

## Recommendation Engine

The `recommendationEngine.js` provides a mock AI recommendation system that:

1. Assesses nutrient status (Low, Optimal, High)
2. Compares soil data against crop-specific optimal ranges
3. Generates product recommendations based on deficiencies
4. Calculates application rates and costs
5. Provides detailed instructions

## Styling System

The application uses a hybrid approach:

- **Tailwind CSS**: Utility classes for rapid development
- **Custom CSS**: Design tokens and component-specific styles
- **CSS Variables**: Consistent theming and easy customization

### Design Tokens

Colors, spacing, typography, and other design decisions are centralized in CSS variables (`:root` in `index.css`) and Tailwind config.

## Development Guidelines

### Code Style

- Follow ESLint rules (configuration in `.eslintrc.cjs`)
- Use Prettier for consistent formatting
- Use functional components with hooks
- Keep components small and focused

### Naming Conventions

- Components: PascalCase (`FormInput.jsx`)
- Utilities: camelCase (`helpers.js`)
- CSS classes: kebab-case (`form-input`)

### Adding New Screens

1. Create component in `src/screens/`
2. Add route in `src/App.jsx`
3. Import and configure in router

### Adding New Components

1. Create component in `src/components/`
2. Export from component file
3. Import where needed

## Future Enhancements

- Integration with real AI/ML models
- Backend API connection
- User authentication
- Database for storing farm profiles
- Real-time weather data integration
- Offline support with PWA
- Multi-language support (Tagalog, Cebuano)
- Mobile app version
- SMS/WhatsApp notifications

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of a thesis research.

## Contact

For questions or feedback, please contact the development team.

---

**Note**: This is a prototype application using mock data for demonstration and research purposes.
