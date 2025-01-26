/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import apiServices from 'services/api';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [isAuthenticated, setIsAuthenticated] = React.useState(true); // State to track authentication

  const checkMe = async () => {
    try {
      const response = await apiServices.checkMe();
      console.log(response);

      // Check if the response indicates an error
      if (response.data.error === 1) {
        setIsAuthenticated(false); // Update authentication state
        navigate('/login'); // Navigate to the login page
      } else {
        setIsAuthenticated(true); // User is authenticated
      }
    } catch (err) {
      console.log(err);
      setIsAuthenticated(false); // If there's an error, consider the user as not authenticated
      navigate('/login'); // Navigate to the login page
    }
  };

  useEffect(() => {
    checkMe();
  }, []);

  // If authenticated, display children
  if (isAuthenticated) {
    return children;
  }

  // Optionally, you can return null or a loading spinner while checking authentication
  return null; // Or a loading spinner
};

export default AuthGuard;
