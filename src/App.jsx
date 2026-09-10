import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import InflowPage from './pages/InflowPage';
import OutflowPage from './pages/OutflowPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AutoLogout from './components/AutoLogout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AutoLogout>
          <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <LandingPage />
            </ProtectedRoute>
          } />
          <Route path="/inflow" element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <InflowPage />
            </ProtectedRoute>
          } />
          <Route path="/outflow" element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <OutflowPage />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        </AutoLogout>
      </Router>
    </AuthProvider>
  );
}

export default App;
