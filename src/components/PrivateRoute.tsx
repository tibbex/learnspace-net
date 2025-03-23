
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute: React.FC = () => {
  const { auth } = useAuth();
  
  // If the user is not authenticated, redirect to the login page
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If the user is authenticated, render the child routes
  return <Outlet />;
};

export default PrivateRoute;
