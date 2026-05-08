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
import BusinessProfileForm from './Pages/forms/BusinessProfileForm';
import ComplianceForm from './Pages/forms/ComplianceForm';
import CustomerForm from './Pages/forms/CustomerForm';
import DeliveryForm from './Pages/forms/DeliveryForm';
import FinancialForm from './Pages/forms/FinancialForm';
import GovernanceForm from './Pages/forms/GovernanceForm';
import GSTDataForm from './Pages/forms/GSTDataForm';
import IndustrySpecificForm from './Pages/forms/IndustrySpecificForm';
import InventoryForm from './Pages/forms/InventoryForm';
import OEMReadinessForm from './Pages/forms/OEMReadinessForm';
import ProductionForm from './Pages/forms/ProductionForm';
import QualityForm from './Pages/forms/QualityForm';
import SupplierForm from './Pages/forms/SupplierForm';

const dataEntryPages = [
  { path: '/data-entry/business-profile', element: <BusinessProfile /> },
  { path: '/data-entry/business-profile-form', element: <BusinessProfileForm /> },
  { path: '/data-entry/compliance', element: <ComplianceForm /> },
  { path: '/data-entry/customer', element: <CustomerForm /> },
  { path: '/data-entry/delivery', element: <DeliveryForm /> },
  { path: '/data-entry/financial', element: <FinancialForm /> },
  { path: '/data-entry/governance', element: <GovernanceForm /> },
  { path: '/data-entry/gst-data', element: <GSTDataForm /> },
  { path: '/data-entry/industry-specific', element: <IndustrySpecificForm /> },
  { path: '/data-entry/inventory', element: <InventoryForm /> },
  { path: '/data-entry/oem-readiness', element: <OEMReadinessForm /> },
  { path: '/data-entry/production', element: <ProductionForm /> },
  { path: '/data-entry/quality', element: <QualityForm /> },
  { path: '/data-entry/supplier', element: <SupplierForm /> },
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