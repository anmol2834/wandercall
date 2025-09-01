import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Extract critical CSS and inline it
const optimizeCSS = () => {
  const distPath = path.join(__dirname, '../dist');
  const indexPath = path.join(distPath, 'index.html');
  const criticalCSSPath = path.join(__dirname, '../src/styles/critical.css');
  
  if (!fs.existsSync(indexPath) || !fs.existsSync(criticalCSSPath)) {
    console.log('Build files not found, skipping CSS optimization');
    return;
  }
  
  // Read files
  let indexHTML = fs.readFileSync(indexPath, 'utf8');
  const criticalCSS = fs.readFileSync(criticalCSSPath, 'utf8');
  
  // Find CSS files in dist
  const cssFiles = fs.readdirSync(path.join(distPath, 'assets'))
    .filter(file => file.endsWith('.css'))
    .map(file => `/assets/${file}`);
  
  // Replace CSS links with preload + async loading
  cssFiles.forEach(cssFile => {
    const linkRegex = new RegExp(`<link[^>]*href="${cssFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`, 'g');
    indexHTML = indexHTML.replace(linkRegex, '');
  });
  
  // Add critical CSS inline and async loading script
  const criticalStylesTag = `<style>${criticalCSS}</style>`;
  const asyncLoadScript = `
    <script>
      (function(){
        const cssFiles = ${JSON.stringify(cssFiles)};
        const loadCSS = (href) => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = href;
          link.media = 'print';
          link.onload = () => link.media = 'all';
          document.head.appendChild(link);
        };
        
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            cssFiles.forEach(loadCSS);
          });
        } else {
          cssFiles.forEach(loadCSS);
        }
      })();
    </script>`;
  
  // Insert critical CSS and async script before closing head tag
  indexHTML = indexHTML.replace('</head>', `${criticalStylesTag}${asyncLoadScript}</head>`);
  
  // Write optimized HTML
  fs.writeFileSync(indexPath, indexHTML);
  console.log('✅ CSS optimization complete');
  console.log(`📦 Critical CSS inlined: ${(criticalCSS.length / 1024).toFixed(2)}KB`);
  console.log(`🚀 Non-critical CSS files: ${cssFiles.length}`);
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeCSS();
}

export default optimizeCSS;