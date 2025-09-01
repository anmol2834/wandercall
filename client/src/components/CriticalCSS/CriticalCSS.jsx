import { useEffect } from 'react';

// Component to handle critical CSS loading and FOUC prevention
const CriticalCSS = ({ children }) => {
  useEffect(() => {
    // Mark CSS as loaded to prevent FOUC
    const markCSSLoaded = () => {
      document.documentElement.classList.add('css-loaded');
      document.documentElement.classList.remove('css-loading');
    };

    // Check if CSS is already loaded
    if (document.readyState === 'complete') {
      markCSSLoaded();
    } else {
      window.addEventListener('load', markCSSLoaded);
      return () => window.removeEventListener('load', markCSSLoaded);
    }
  }, []);

  return children;
};

export default CriticalCSS;