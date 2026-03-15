import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 8080,
    strictPort: true,
    allowedHosts: [
      'icreateprototypedemo-production.up.railway.app',
      '.railway.app',
      'localhost',
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
