import React from 'react';
import { Navigate } from 'react-router-dom';
import Auth from '../utils/auth';

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = Auth.loggedIn();
  
  // Redirect to login if not authenticated, otherwise render the element
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;