'use client';

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import authStore from './stores/authStore';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminForgotPasswordPage from './pages/admin/AdminForgotPasswordPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import AdminApplicationDetailPage from './pages/admin/AdminApplicationDetailPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminSubscriptionsPage from './pages/admin/AdminSubscriptionsPage';
import DashboardPage from './pages/DashboardPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import CustomerMeasurementsPage from './pages/CustomerMeasurementsPage';
import CustomerTailorsPage from './pages/CustomerTailorsPage';
import ConnectTailorPage from './pages/ConnectTailorPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailsPage from './pages/ClientDetailsPage';
import ClientEditPage from './pages/ClientEditPage';
import MeasurementsPage from './pages/MeasurementsPage';
import ClientMeasurementsPage from './pages/ClientMeasurementsPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import InventoryPage from './pages/InventoryPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import ProfilePage from './pages/ProfilePage';
import ExpensesPage from './pages/ExpensesPage';
import CalendarPage from './pages/CalendarPage';
import StaffPage from './pages/StaffPage';
import StaffDetailsPage from './pages/StaffDetailsPage';
import ReportsPage from './pages/ReportsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import MessagesPage from './pages/MessagesPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import NotificationCenter from './components/NotificationCenter';

function App() {
  const { token, initializeAuth, role, user, fetchProfile } = authStore();
  const [isInitializing, setIsInitializing] = React.useState(true);

  useEffect(() => {
    const initialize = async () => {
      initializeAuth();
      
      // If token exists, fetch user profile
      const savedToken = localStorage.getItem('sewtrack_token');
      if (savedToken) {
        await fetchProfile();
      }
      
      setIsInitializing(false);
    };
    
    initialize();
  }, []);

  // Show loading screen while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-navy-200 border-t-brand-navy mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <NotificationCenter />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/applications" element={<AdminApplicationsPage />} />
        <Route path="/admin/applications/:tailorId" element={<AdminApplicationDetailPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/subscriptions" element={<AdminSubscriptionsPage />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute token={token} />
          }
        >
          <Route element={<Layout />}>
            {/* Conditional Dashboard */}
            <Route path="/dashboard" element={role === 'customer' ? <CustomerDashboardPage /> : <DashboardPage />} />

            {/* Customer Routes */}
            {role === 'customer' && (
              <>
                <Route path="/my-orders" element={<CustomerOrdersPage />} />
                <Route path="/my-measurements" element={<CustomerMeasurementsPage />} />
                <Route path="/my-tailors" element={<CustomerTailorsPage />} />
                <Route path="/connect-tailor" element={<ConnectTailorPage />} />
              </>
            )}

            {/* Tailor Routes */}
            {role === 'tailor' && (
              <>
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/clients/new" element={<ClientEditPage />} />
                <Route path="/clients/:clientId/edit" element={<ClientEditPage />} />
                <Route path="/clients/:clientId" element={<ClientDetailsPage />} />
                <Route path="/measurements" element={<MeasurementsPage />} />
                <Route path="/measurements/client/:clientId" element={<ClientMeasurementsPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/staff" element={<StaffPage />} />
                <Route path="/staff/:id" element={<StaffDetailsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
              </>
            )}

            {/* Shared Routes */}
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
