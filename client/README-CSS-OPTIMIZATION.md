# CSS Performance Optimization

This project implements comprehensive CSS optimization to eliminate render-blocking resources and improve LCP (Largest Contentful Paint).

## Features Implemented

### 1. Critical CSS Inlining
- **Critical styles** are inlined in `index.html` for above-the-fold content
- **Minified critical CSS** reduces initial payload
- **FOUC prevention** with `.css-loading` and `.css-loaded` classes

### 2. Async CSS Loading
- Non-critical CSS loads asynchronously using `media="print"` technique
- **Route-specific CSS** loading with `cssLoader.js` utility
- **Intelligent preloading** of critical routes

### 3. CSS Code Splitting
- **Per-route CSS chunks** with Vite's `cssCodeSplit: true`
- **Vendor CSS separation** for better caching
- **Manual chunk optimization** for MUI, Router, Redux libraries

### 4. CSS Purging & Minification
- **PurgeCSS** removes unused styles in production
- **PostCSS** pipeline with autoprefixer and cssnano
- **MUI safelist** preserves dynamic classes

### 5. Build Process Automation
- **Post-build optimization** script inlines critical CSS
- **Automatic async loading** script injection
- **Production environment** variables for optimization flags

## Build Commands

```bash
# Development (no optimization)
npm run dev

# Production build with CSS optimization
npm run build

# Production build without post-processing
npm run build:css

# Build with bundle analysis
npm run build:analyze
```

## Performance Impact

### Before Optimization
- **Render-blocking CSS**: Main CSS bundle blocks initial render
- **LCP delay**: CSS loading delays Largest Contentful Paint
- **FOUC risk**: Flash of unstyled content during CSS loading

### After Optimization
- **Immediate render**: Critical CSS inlined for instant above-the-fold rendering
- **Improved LCP**: Non-blocking CSS loading reduces LCP time
- **Better caching**: Route-specific CSS chunks improve cache efficiency
- **Smaller bundles**: PurgeCSS removes unused styles

## File Structure

```
src/
├── styles/
│   └── critical.css          # Critical above-the-fold styles
├── utils/
│   └── cssLoader.js          # Async CSS loading utilities
├── components/
│   └── CriticalCSS/          # FOUC prevention component
└── build-scripts/
    └── optimize-css.js       # Post-build CSS optimization

postcss.config.js             # PostCSS configuration
.env.production               # Production environment variables
```

## Configuration Files

- **postcss.config.js**: PurgeCSS and minification setup
- **vite.config.js**: CSS code splitting and chunk optimization
- **build-scripts/optimize-css.js**: Critical CSS inlining automation

## Best Practices Implemented

1. **Critical CSS < 14KB** for optimal performance
2. **Async loading** for non-critical styles
3. **Route-based splitting** reduces initial bundle size
4. **Intelligent preloading** improves perceived performance
5. **FOUC prevention** ensures visual stability