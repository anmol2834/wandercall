import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useEffect, Component } from 'react';
import getTheme from './utils/theme';
import { preventZoom } from './utils/preventZoom';
import { AuthProvider } from './contexts/AuthContext';
import { RewardsProvider } from './contexts/RewardsContext';
import { useWishlistInit } from './hooks/useWishlistInit';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { Suspense, lazy } from 'react';
import { CircularProgress, Box, Typography, Button } from '@mui/material';

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          p: 3,
          textAlign: 'center'
        }}>
          <Typography variant="h4" sx={{ mb: 2 }}>Something went wrong</Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            We're sorry, but something unexpected happened.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mb: 2 }}
          >
            Reload Page
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
// Lazy load all components including Home
const Home = lazy(() => import('./pages/UserDashboard/Home'));
const SignIn = lazy(() => import('./pages/SignIn/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp/SignUp'));
const AboutUs = lazy(() => import('./pages/AboutUs/AboutUs'));
const TermsConditions = lazy(() => import('./pages/TermsConditions/TermsConditions'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Privacy = lazy(() => import('./pages/Privacy/Privacy'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const ExperienceDetails = lazy(() => import('./pages/ExperienceDetails/ExperienceDetails'));
const Ticket = lazy(() => import('./pages/Ticket/Ticket'));
const ProviderRegistration = lazy(() => import('./pages/ProviderDashboard/ProviderRegistration/ProviderRegistration'));
const ProviderLogin = lazy(() => import('./pages/ProviderDashboard/ProviderLogin/ProviderLogin'));
const ProviderDashboard = lazy(() => import('./pages/ProviderDashboard/index'));
const ProviderTerms = lazy(() => import('./pages/ProviderDashboard/ProviderTerms/ProviderTerms'));
const Waitlist = lazy(() => import('./pages/Waitlist/Waitlist'));
const Booking = lazy(() => import('./pages/Booking/Booking'));
const Search = lazy(() => import('./pages/Search/Search'));

// Modern wireframe loading component
const PageLoader = () => {
  const { mode } = useSelector((state) => state.theme);
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: mode === 'dark' 
        ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e3c72 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)',
      p: { xs: 2, sm: 3 },
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        background: mode === 'dark' 
          ? 'radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 40% 80%, #ec4899 0%, transparent 50%)'
          : 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 40% 80%, #06b6d4 0%, transparent 50%)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <Box sx={{ maxWidth: 1200, mx: 'auto', pt: { xs: 2, sm: 4 }, position: 'relative', zIndex: 1 }}>
        {/* Header skeleton */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: { xs: 3, sm: 4 },
          px: { xs: 1, sm: 0 }
        }}>
          <Box sx={{ 
            width: { xs: 100, sm: 140 }, 
            height: { xs: 28, sm: 36 }, 
            background: mode === 'dark' 
              ? 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 100%)'
              : 'linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.06) 100%)',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              animation: 'shimmer 2s infinite'
            }
          }} />
          <Box sx={{ 
            width: { xs: 70, sm: 90 }, 
            height: { xs: 28, sm: 36 }, 
            background: mode === 'dark' 
              ? 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 100%)'
              : 'linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.06) 100%)',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              animation: 'shimmer 2s infinite 0.3s'
            }
          }} />
        </Box>
        
        {/* Cards grid skeleton */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
          }, 
          gap: { xs: 2, sm: 3 },
          px: { xs: 1, sm: 0 }
        }}>
          {[1,2,3,4,5,6].map(i => (
            <Box key={i} sx={{ 
              background: mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 100%)'
                : 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.06) 100%)',
              borderRadius: 4, 
              p: { xs: 2, sm: 3 },
              border: mode === 'dark' 
                ? '1px solid rgba(255,255,255,0.05)'
                : '1px solid rgba(0,0,0,0.05)',
              backdropFilter: 'blur(10px)',
              animation: `slideUp 0.6s ease-out ${i * 0.1}s both`
            }}>
              <Box sx={{ 
                width: '100%', 
                height: { xs: 160, sm: 200 }, 
                background: mode === 'dark' 
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.06) 100%)',
                borderRadius: 3, 
                mb: { xs: 2, sm: 3 },
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: `shimmer 2s infinite ${i * 0.2}s`
                }
              }} />
              <Box sx={{ 
                width: `${85 - i * 5}%`, 
                height: { xs: 18, sm: 22 }, 
                background: mode === 'dark' 
                  ? 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 100%)'
                  : 'linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.06) 100%)',
                borderRadius: 2, 
                mb: { xs: 1, sm: 1.5 },
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  animation: `shimmer 2s infinite ${i * 0.2 + 0.3}s`
                }
              }} />
              <Box sx={{ 
                width: `${65 - i * 3}%`, 
                height: { xs: 14, sm: 16 }, 
                background: mode === 'dark' 
                  ? 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 100%)'
                  : 'linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 100%)',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  animation: `shimmer 2s infinite ${i * 0.2 + 0.6}s`
                }
              }} />
            </Box>
          ))}
        </Box>
        
        {/* Enhanced CSS Animations */}
        <style>{`
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          
          @keyframes slideUp {
            0% { 
              opacity: 0;
              transform: translateY(30px);
            }
            100% { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(1deg); }
            66% { transform: translateY(5px) rotate(-1deg); }
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
    try {
      preventZoom();
    } catch (error) {
      console.error('Error in preventZoom:', error);
    }
  }, []);

  return (
    <ErrorBoundary>
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
                <Route path="/provider-login" element={<ProviderLogin />} />
                <Route path="/provider/*" element={<ProviderDashboard />} />
                <Route path="/provider-terms" element={<ProviderTerms />} />
                <Route path="/waitlist" element={<Waitlist />} />
                <Route path="/search" element={<Search />} />
              </Routes>
            </Suspense>
            </Router>
          </RewardsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;



