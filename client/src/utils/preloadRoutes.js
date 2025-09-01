// Preload route components for faster navigation
export const preloadRoutes = () => {
  // Preload critical routes after initial load
  const criticalRoutes = [
    () => import('../pages/SignIn/SignIn'),
    () => import('../pages/SignUp/SignUp'),
    () => import('../pages/ExperienceDetails/ExperienceDetails')
  ];

  // Preload on idle
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      criticalRoutes.forEach(route => route());
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      criticalRoutes.forEach(route => route());
    }, 2000);
  }
};

// Preload on user interaction (hover, focus)
export const preloadOnInteraction = (routeImport) => {
  let preloaded = false;
  
  return () => {
    if (!preloaded) {
      preloaded = true;
      routeImport();
    }
  };
};