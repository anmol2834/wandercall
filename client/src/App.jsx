import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useEffect } from 'react';
import getTheme from './utils/theme';
import { preventZoom } from './utils/preventZoom';
import { AuthProvider } from './contexts/AuthContext';
import { RewardsProvider } from './contexts/RewardsContext';
import { useWishlistInit } from './hooks/useWishlistInit';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { Suspense, lazy } from 'react';
import { CircularProgress, Box } from '@mui/material';
import Home from './pages/UserDashboard/Home';

// Lazy load non-critical components
const SignIn = lazy(() => import('./pages/SignIn/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp/SignUp'));
const AboutUs = lazy(() => import('./pages/AboutUs/AboutUs'));
const TermsConditions = lazy(() => import('./pages/TermsConditions/TermsConditions'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Privacy = lazy(() => import('./pages/Privacy/Privacy'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const ExperienceDetails = lazy(() => import('./pages/ExperienceDetails/ExperienceDetails'));
const Ticket = lazy(() => import('./pages/Ticket/Ticket'));
const ProviderRegistration = lazy(() => import('./pages/ProviderRegistration/ProviderRegistration'));
const ProviderTerms = lazy(() => import('./pages/ProviderTerms/ProviderTerms'));
const Waitlist = lazy(() => import('./pages/Waitlist/Waitlist'));
const Booking = lazy(() => import('./pages/Booking/Booking'));

// Modern wireframe loading component
const PageLoader = () => {
  const { mode } = useSelector((state) => state.theme);
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: mode === 'dark' 
        ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e3c72 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      p: 3
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', pt: 4 }}>
        {/* Header skeleton */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ 
            width: 120, 
            height: 32, 
            bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
            borderRadius: 2,
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <Box sx={{ 
            width: 80, 
            height: 32, 
            bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
            borderRadius: 2,
            animation: 'pulse 1.5s ease-in-out infinite 0.2s'
          }} />
        </Box>
        
        {/* Main content skeleton */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {[1,2,3,4,5,6].map(i => (
            <Box key={i} sx={{ 
              bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', 
              borderRadius: 3, 
              p: 2,
              animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s`
            }}>
              <Box sx={{ 
                width: '100%', 
                height: 200, 
                bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
                borderRadius: 2, 
                mb: 2 
              }} />
              <Box sx={{ 
                width: '80%', 
                height: 20, 
                bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
                borderRadius: 1, 
                mb: 1 
              }} />
              <Box sx={{ 
                width: '60%', 
                height: 16, 
                bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
                borderRadius: 1 
              }} />
            </Box>
          ))}
        </Box>
        
        {/* CSS Animation */}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.7; }
          }
        `}</style>
      </Box>
    </Box>
  );
};

// Component to initialize wishlist inside AuthProvider
const WishlistInitializer = () => {
  useWishlistInit();
  return null;
};

function App() {
  const { mode } = useSelector((state) => state.theme);
  const theme = getTheme(mode);

  useEffect(() => {
    preventZoom();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <WishlistInitializer />
        <RewardsProvider>
          <Router>
            <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={
                <ProtectedRoute requireAuth={false}>
                  <SignIn />
                </ProtectedRoute>
              } />
              <Route path="/signup" element={
                <ProtectedRoute requireAuth={false}>
                  <SignUp />
                </ProtectedRoute>
              } />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/terms-and-conditions" element={<TermsConditions />} />
              <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/profile/*" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/experience/:id" element={<ExperienceDetails />} />
              <Route path="/booking/:id" element={<Booking />} />
              <Route path="/ticket/:id" element={<Ticket />} />
              <Route path="/become-provider" element={<ProviderRegistration />} />
              <Route path="/provider-terms" element={<ProviderTerms />} />
              <Route path="/waitlist" element={<Waitlist />} />
            </Routes>
          </Suspense>
          </Router>
        </RewardsProvider>
      </AuthProvider>
  </ThemeProvider>
  );
}

export default App;



