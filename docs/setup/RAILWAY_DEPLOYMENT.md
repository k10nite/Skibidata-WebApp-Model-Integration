# Railway Deployment Guide

## ⚠️ SECURITY NOTE
**Your Railway API token has been shared publicly. Please regenerate it after deployment!**

Go to: https://railway.app/account/tokens → Revoke old token → Create new one

---

## 🚀 Deployment Method 1: Railway Dashboard (Recommended)

### Steps:

1. **Go to Railway Dashboard**
   - Visit: https://railway.app/dashboard
   - Login with your account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"

3. **Connect GitHub**
   - You'll need to push your code to GitHub first
   - Create a new GitHub repository
   - Push this code to GitHub (instructions below)

4. **Configure Project**
   - Select the repository
   - Railway will auto-detect Vite
   - Click "Deploy"

---

## 📦 Deployment Method 2: GitHub + Railway (Best)

### Step 1: Push to GitHub

```bash
# Create a new repository on GitHub first, then:
cd C:\Users\Neil\Documents\thesis

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/fertilizer-recommendation.git

# Push code
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Railway

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically:
   - Detect Vite/React
   - Install dependencies
   - Build the project
   - Deploy

---

## 🛠️ Deployment Method 3: Railway CLI (Alternative)

Since token authentication had issues, try this:

```bash
# Login interactively
railway login

# Link to a new project
railway init

# Deploy
railway up
```

---

## ⚙️ Railway Configuration Files

I've already created these for you:

### `railway.json`
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run preview -- --host 0.0.0.0 --port $PORT"
  }
}
```

### `Procfile`
```
web: npm run preview -- --host 0.0.0.0 --port $PORT
```

---

## ✅ What's Ready for Deployment

- ✅ Git repository initialized
- ✅ Code committed (46 files, 11,050 lines)
- ✅ Railway configuration files created
- ✅ .gitignore configured (excludes images, Python files)
- ✅ All dependencies listed in package.json
- ✅ Build process configured

---

## 🌐 After Deployment

Once deployed, Railway will provide you with a URL like:
`https://fertilizer-recommendation-production.up.railway.app`

The app will be **live and accessible** from anywhere!

---

## 🔍 Verify Deployment

1. Click on your Railway project
2. Go to "Deployments" tab
3. Watch the build logs
4. Once complete, click the generated URL
5. Test the 7-screen flow

---

## 🐛 Troubleshooting

### Build fails?
- Check the build logs in Railway dashboard
- Common issue: Missing dependencies (all should be in package.json)

### Map not loading?
- Leaflet requires CSS imports (already configured)
- Check browser console for errors

### Blank screen?
- Check if the base URL is correct in vite.config.js
- Ensure all routes work with Railway's routing

---

## 📊 Deployment Stats

**Files to Deploy**: 46 files
**Total Lines of Code**: 11,050+
**Bundle Size**: ~400KB (estimated)
**Build Time**: ~30-60 seconds
**Cold Start**: ~3-5 seconds

---

## 🎯 Quick Start (Recommended Path)

1. **Create GitHub Repository**:
   - Go to github.com → New Repository
   - Name it: `fertilizer-recommendation`
   - Don't initialize with README

2. **Push Code**:
   ```bash
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. **Deploy on Railway**:
   - Visit: https://railway.app/new
   - Click "Deploy from GitHub repo"
   - Select your repo
   - Click "Deploy"
   - Wait 1-2 minutes
   - Get your live URL!

---

## 🔐 Security Reminder

**IMMEDIATELY after deployment:**
1. Go to https://railway.app/account/tokens
2. Delete the token: `35392f4b-fe7d-49db-9e1e-4af673f51b1b`
3. Generate a new token
4. Never share tokens publicly again!

---

**Status**: Ready for deployment! 🚀
