'use client';

import React, { useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden lg:flex bg-white border-b border-gray-200 px-8 py-4 items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {location.pathname === '/admin/dashboard' && 'Dashboard'}
            {location.pathname === '/admin/applications' && 'Applications'}
            {location.pathname.startsWith('/admin/applications/') && 'Application Details'}
            {location.pathname === '/admin/reports' && 'Reports'}
            {location.pathname === '/admin/subscriptions' && 'Subscriptions'}
            {location.pathname === '/admin/users' && 'Users Management'}
            {location.pathname === '/admin/settings' && 'System Settings'}
          </h2>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
