// ProtectedRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import authController from '../../app/api/auth/authController';

const ProtectedRoute = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authController.checkMe();
        console.log(response);
        if (response.data.error === 1) {
          setIsLogin(false);
        } else {
          setIsLogin(true);
        }
      } catch (err) {
        setError(err);
        setIsLogin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Tampilkan loader atau komponen loading saat memuat
  if (loading) {
    return <div>Loading...</div>; // Anda bisa mengganti ini dengan komponen loading yang lebih baik
  }

  // Jika tidak terautentikasi, arahkan ke halaman login
  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  // Kembalikan children jika terautentikasi
  return children;
};

export default ProtectedRoute;
