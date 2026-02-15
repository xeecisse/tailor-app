'use client';

import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  Users, 
  Ruler, 
  ShoppingBag, 
  Package, 
  ClipboardList, 
  DollarSign, 
  Calendar,
  Settings,
  UserCog,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import authStore from '../stores/authStore';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { logout, tailor } = authStore();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/clients', icon: Users, label: 'Clients' },
    { path: '/measurements', icon: Ruler, label: 'Measurements' },
    { path: '/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/inventory', icon: Package, label: 'Inventory' },
    { path: '/purchase-orders', icon: ClipboardList, label: 'Purchase Orders' },
    { path: '/expenses', icon: DollarSign, label: 'Expenses' },
    { path: '/staff', icon: UserCog, label: 'Staff' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
              ST
            </div>
            {sidebarOpen && <h1 className="font-bold text-lg">SewTrack</h1>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={20} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Menu */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          <Link
            to="/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive('/profile')
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-slate-800'
            }`}
          >
            <Settings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800 transition-all text-left"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 text-gray-400 hover:text-white"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {location.pathname.startsWith('/staff/') && location.pathname !== '/staff' 
              ? 'Staff Details'
              : location.pathname.startsWith('/clients/') && location.pathname !== '/clients'
              ? 'Client Details'
              : menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          {tailor && (
            <div className="text-sm text-gray-600">
              <p className="font-medium">{tailor.businessName}</p>
              <p className="text-xs">{tailor.email}</p>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
