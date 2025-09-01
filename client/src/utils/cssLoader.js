// Utility for loading CSS asynchronously
export const loadCSS = (href, media = 'all') => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = media === 'all' ? 'print' : media;
    
    link.onload = () => {
      if (media === 'all') {
        link.media = 'all';
      }
      resolve();
    };
    
    link.onerror = reject;
    document.head.appendChild(link);
  });
};

// Load route-specific CSS
export const loadRouteCSS = async (routeName) => {
  const cssMap = {
    profile: () => import('../pages/Profile/Profile.css'),
    signin: () => import('../pages/SignIn/SignIn.css'),
    signup: () => import('../pages/SignUp/SignUp.css'),
    home: () => import('../pages/Home/Home.css'),
    about: () => import('../pages/About/About.css'),
    contact: () => import('../pages/Contact/Contact.css')
  };
  
  if (cssMap[routeName]) {
    try {
      await cssMap[routeName]();
    } catch (error) {
      console.warn(`Failed to load CSS for route: ${routeName}`, error);
    }
  }
};

// Preload critical route CSS
export const preloadCriticalCSS = () => {
  const criticalRoutes = ['home', 'signin', 'signup'];
  
  criticalRoutes.forEach(route => {
    requestIdleCallback(() => {
      loadRouteCSS(route);
    });
  });
};