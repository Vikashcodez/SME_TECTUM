import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './Pages/Login';
import Register from './Pages/Register';
import AdminDashboard from './Pages/AdminDashboard';
import UserDashboard from './Pages/UserDashboard';
import BusinessProfile from './Pages/BusinessProfile';
import CompanyReport from './Pages/CompanyReport';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Dashboard - Only for super admin */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* User Dashboard - For all authenticated users */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/data-entry/business-profile"
            element={
              <ProtectedRoute>
                <BusinessProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/final-report/company-report"
            element={
              <ProtectedRoute>
                <CompanyReport />
              </ProtectedRoute>
            }
          />

          {/* Default redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;