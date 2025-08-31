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
import Home from './pages/UserDashboard/Home';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import AboutUs from './pages/AboutUs/AboutUs';
import TermsConditions from './pages/TermsConditions/TermsConditions';
import Contact from './pages/Contact/Contact';
import Privacy from './pages/Privacy/Privacy';
import Profile from './pages/Profile/Profile';
import ExperienceDetails from './pages/ExperienceDetails/ExperienceDetails';

import Ticket from './pages/Ticket/Ticket';
import ProviderRegistration from './pages/ProviderRegistration/ProviderRegistration';
import Waitlist from './pages/Waitlist/Waitlist';
import Booking from './pages/Booking/Booking';

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
          <Route path="/booking/:id" element={<Booking/>} />
          <Route path="/ticket/:id" element={<Ticket/>} />
          <Route path="/become-provider" element={<ProviderRegistration />} />
          <Route path="/waitlist" element={<Waitlist />} />
          </Routes>
          </Router>
        </RewardsProvider>
      </AuthProvider>
  </ThemeProvider>
  );
}

export default App;



