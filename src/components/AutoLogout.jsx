import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AutoLogout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run inactivity timer if a user is logged in
    if (!user) return;

    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      // Set timeout for 2 minutes (120,000 milliseconds)
      timeoutId = setTimeout(() => {
        logout();
        navigate('/login');
      }, 120000);
    };

    // Initialize timer
    resetTimer();

    // Listen for activity events
    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user, logout, navigate]);

  return <>{children}</>;
};

export default AutoLogout;
