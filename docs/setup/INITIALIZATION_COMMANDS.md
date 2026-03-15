# Initialization Commands

Quick reference for getting your fertilizer recommendation prototype up and running.

## Step 1: Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This will install all required packages:
- React and ReactDOM
- React Router
- Framer Motion (animations)
- Leaflet (maps)
- Tailwind CSS
- Vite (build tool)
- ESLint and Prettier (code quality)
- And all other dependencies

**Expected time**: 1-3 minutes (depending on internet speed)

## Step 2: Start Development Server

```bash
npm run dev
```

This will:
- Start the Vite development server
- Automatically open your browser to `http://localhost:3000`
- Enable hot module replacement (HMR) for instant updates
- Watch for file changes

**Expected output**:
```
  VITE v5.1.4  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

## Step 3: Verify Installation

Once the browser opens, you should see:
1. **Welcome Screen** with "FertilizerAI" title
2. Three feature cards (AI-Powered Analysis, Location-Based Insights, Data-Driven Recommendations)
3. Green "Get Started" button
4. Smooth animations on page load

## Additional Commands

### Code Quality

```bash
# Check for linting errors
npm run lint

# Automatically fix linting errors
npm run lint:fix

# Format code with Prettier
npm run format
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## Troubleshooting

### Problem: "npm: command not found"
**Solution**: Install Node.js from https://nodejs.org/ (version 18 or higher)

### Problem: Port 3000 already in use
**Solution 1**: Kill the process using port 3000
**Solution 2**: Change port in `vite.config.js`:
```javascript
server: {
  port: 3001, // Change to any available port
  open: true,
}
```

### Problem: Module not found errors
**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Problem: Tailwind styles not loading
**Solution**:
1. Ensure `src/styles/index.css` is imported in `src/main.jsx`
2. Restart dev server: `Ctrl+C`, then `npm run dev`

### Problem: Map not displaying
**Solution**:
1. Check internet connection (map tiles load from CDN)
2. Ensure Leaflet CSS is imported in `MapSelector.jsx`
3. Check browser console for errors

### Problem: ESLint errors on startup
**Solution**: Run `npm run lint:fix` to auto-fix common issues

## Development Workflow

### 1. Daily Startup
```bash
cd thesis
npm run dev
```

### 2. Before Committing Code
```bash
npm run lint:fix
npm run format
npm run build  # Ensure production build works
```

### 3. Testing Changes
- Save file → Browser auto-reloads
- Check browser console for errors
- Test navigation between screens
- Verify form submissions

## File Watching

Vite watches these files for changes:
- `src/**/*.jsx`
- `src/**/*.js`
- `src/**/*.css`
- `index.html`
- Config files (requires restart)

**Note**: Changes to config files (`vite.config.js`, `tailwind.config.js`, etc.) require restarting the dev server.

## Environment Setup (Optional)

Create a `.env` file for environment variables:

```bash
# .env
VITE_API_URL=http://localhost:8000
VITE_MAP_API_KEY=your_api_key_here
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## IDE Setup Recommendations

### VS Code Extensions
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Quick Test Checklist

After installation, verify these features work:

- [ ] Welcome screen loads with animations
- [ ] "Get Started" button navigates to onboarding
- [ ] Onboarding pagination works (Previous/Next)
- [ ] Farm profile form accepts input
- [ ] Map selector allows location clicking
- [ ] Dashboard displays after form submission
- [ ] Soil analysis form validates input
- [ ] Recommendations generate successfully
- [ ] Resource library search/filter works
- [ ] Navigation between all screens works

## Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Test all screens
4. 📝 Customize mock data in `src/data/mockData.js`
5. 🎨 Adjust styling in `tailwind.config.js` and `src/styles/index.css`
6. 🧠 Enhance recommendation logic in `src/utils/recommendationEngine.js`
7. 🌐 Integrate with backend API (when ready)

## Support Resources

- **Vite**: https://vitejs.dev/
- **React**: https://react.dev/
- **React Router**: https://reactrouter.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Framer Motion**: https://www.framer.com/motion/
- **Leaflet**: https://leafletjs.com/
- **Lucide Icons**: https://lucide.dev/

Happy developing! 🚀
