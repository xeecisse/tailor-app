'use client';

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import authStore from './stores/authStore';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
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
import MessagesPage from './pages/MessagesPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import NotificationCenter from './components/NotificationCenter';

function App() {
  const { token, initializeAuth } = authStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <NotificationCenter />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute token={token} />
          }
        >
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
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
