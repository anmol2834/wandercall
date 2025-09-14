import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useEffect } from 'react';
import getTheme from './utils/theme';
import { preventZoom } from './utils/preventZoom';
import { AuthProvider } from './contexts/AuthContext';
import { RewardsProvider } from './contexts/RewardsContext';
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
const Waitlist = lazy(() => import('./pages/Waitlist/Waitlist'));
const Booking = lazy(() => import('./pages/Booking/Booking'));

// Loading component with spinner
const PageLoader = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e3c72 100%)'
  }}>
    <CircularProgress size={60} thickness={4} sx={{ color: '#6366f1' }} />
  </Box>
);

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



