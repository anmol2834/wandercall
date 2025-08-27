import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const location = useLocation();
  
  // Mock authentication check - replace with your actual auth logic
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (requireAuth && !isAuthenticated) {
    // Redirect to signin with return url
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  if (!requireAuth && isAuthenticated) {
    // Redirect authenticated users away from auth pages
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;