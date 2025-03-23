
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute: React.FC = () => {
  const { auth } = useAuth();
  const location = useLocation();
  
  // If the user is not authenticated, redirect to the login page
  // with the current location stored in state for redirect after login
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If the user is authenticated, render the child routes
  return <Outlet />;
};

export default PrivateRoute;
