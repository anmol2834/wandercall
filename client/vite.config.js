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
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          router: ['react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          framer: ['framer-motion'],
          http: ['axios']
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
