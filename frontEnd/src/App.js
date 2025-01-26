import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Sheet, Typography, Button } from '@mui/joy';
import '@fontsource/inter';
import { useNavigate } from 'react-router-dom';
import TopBar from './components/TopBar/TopBar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import authController from './app/api/auth/authController';
import Register from './pages/Register';
const App = () => {
  const [totalCartItems, setTotalCartItems] = useState(2);
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                totalCartItems={totalCartItems}
                setTotalCartItems={setTotalCartItems}
              />
            }
          />{' '}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />{' '}
          <Route path="/register" element={<Register />} />{' '}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
      {/* </Router>  */}
    </div>
  );
};

export default App;
