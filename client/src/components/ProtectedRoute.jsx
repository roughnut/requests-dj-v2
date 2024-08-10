import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSongContext } from '../utils/GlobalState'; // Correctly import the custom hook

const ProtectedRoute = ({ element }) => {
  const { state } = useSongContext();  // Get the state from the context
  const isAuthenticated = state.isAuthenticated;

  // If the user is authenticated, render the component; otherwise, redirect to the login page.
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;