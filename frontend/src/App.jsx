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
import FinacleReport from './Pages/FinacleReport';
import FinancialFormPage from './Pages/FinancialFormPage';
import FinancialDetailsPage from './Pages/FinancialDetailsPage';

const dataEntryPages = [
  { path: '/data-entry/business-profile', element: <BusinessProfile /> },
];

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
            path="/FinacleReport"
            element={
              <ProtectedRoute>
                <FinacleReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/financial/new"
            element={
              <ProtectedRoute>
                <FinancialFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/financial/:id/edit"
            element={
              <ProtectedRoute>
                <FinancialFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/financial/:id"
            element={
              <ProtectedRoute>
                <FinancialDetailsPage />
              </ProtectedRoute>
            }
          />

          {dataEntryPages.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute>
                  {element}
                </ProtectedRoute>
              }
            />
          ))}

          {/* <Route
            path="/final-report/company-report"
            element={
              <ProtectedRoute>
                <CompanyReport />
              </ProtectedRoute>
            }
          /> */}

          {/* Default redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;