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
    sourcemap: false,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: (id) => {
          // React core - split further
          if (id.includes('react-dom/client')) {
            return 'react-dom-client';
          }
          if (id.includes('react-dom')) {
            return 'react-dom';
          }
          if (id.includes('react/jsx-runtime')) {
            return 'react-jsx';
          }
          if (id.includes('react') && !id.includes('react-dom') && !id.includes('react-router')) {
            return 'react-core';
          }
          
          // MUI components - split further
          if (id.includes('@mui/material') && (id.includes('Button') || id.includes('TextField') || id.includes('Box'))) {
            return 'mui-basic';
          }
          if (id.includes('@mui/material')) {
            return 'mui-advanced';
          }
          if (id.includes('@mui/icons-material')) {
            return 'mui-icons';
          }
          if (id.includes('@mui/system') || id.includes('@mui/styled-engine')) {
            return 'mui-system';
          }
          
          // Router
          if (id.includes('react-router')) {
            return 'router';
          }
          
          // State management
          if (id.includes('@reduxjs/toolkit')) {
            return 'redux-toolkit';
          }
          if (id.includes('react-redux')) {
            return 'react-redux';
          }
          
          // Animation
          if (id.includes('framer-motion')) {
            return 'framer';
          }
          
          // HTTP
          if (id.includes('axios')) {
            return 'http';
          }
          
          // Large components
          if (id.includes('Profile') && id.includes('components')) {
            return 'profile-components';
          }
          if (id.includes('TicketDownloader')) {
            return 'ticket-downloader';
          }
          
          // Split vendor-small into smaller chunks
          if (id.includes('node_modules')) {
            const packageName = id.split('node_modules/')[1]?.split('/')[0];
            if (packageName) {
              // Group by package size and type
              if (packageName.includes('babel') || packageName.includes('core-js')) {
                return 'vendor-polyfills';
              }
              if (packageName.includes('emotion') || packageName.includes('styled')) {
                return 'vendor-styling';
              }
              if (packageName.length < 6) {
                return 'vendor-tiny';
              }
              if (packageName.length < 12) {
                return 'vendor-small';
              }
              return 'vendor-misc';
            }
            return 'vendor';
          }
        }
      },
      external: (id) => {
        if (id.includes('@sentry') || id.includes('sentry') || id.includes('websocket')) {
          return true;
        }
        return false;
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
