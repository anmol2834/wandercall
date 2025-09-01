import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // ensures correct relative paths
  plugins: [react()],
  define: {
    'process.env.SENTRY_DSN': '""',
    'window.Sentry': 'undefined'
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for smaller bundles
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          router: ['react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          framer: ['framer-motion']
        }
      },
      external: (id) => {
        // Exclude problematic dependencies
        if (id.includes('@sentry') || id.includes('sentry') || id.includes('websocket')) {
          return true;
        }
        return false;
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
