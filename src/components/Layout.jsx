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
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import authStore from '../stores/authStore';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout, user, role } = authStore();

  const tailorMenuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard', requiresApproval: false },
    { path: '/clients', icon: Users, label: 'Clients', requiresApproval: true },
    { path: '/measurements', icon: Ruler, label: 'Measurements', requiresApproval: true },
    { path: '/orders', icon: ShoppingBag, label: 'Tailoring Orders', requiresApproval: true },
    { path: '/purchase-orders', icon: ClipboardList, label: 'POS', requiresApproval: true },
    { path: '/inventory', icon: Package, label: 'Inventory', requiresApproval: true },
    { path: '/expenses', icon: DollarSign, label: 'Expenses', requiresApproval: true },
    { path: '/staff', icon: UserCog, label: 'Staff', requiresApproval: true },
    { path: '/reports', icon: BarChart3, label: 'Reports', requiresApproval: true },
    { path: '/messages', icon: MessageSquare, label: 'Messages', requiresApproval: false },
    { path: '/calendar', icon: Calendar, label: 'Calendar', requiresApproval: true },
  ];

  const customerMenuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard', requiresApproval: false },
    { path: '/my-orders', icon: ShoppingBag, label: 'My Orders', requiresApproval: false },
    { path: '/my-measurements', icon: Ruler, label: 'My Measurements', requiresApproval: false },
    { path: '/messages', icon: MessageSquare, label: 'Messages', requiresApproval: false },
  ];

  const menuItems = role === 'customer' ? customerMenuItems : tailorMenuItems;

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Check if tailor is approved
  const isApproved = user?.approvalStatus === 'approved';
  const isTailor = role === 'tailor';

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="SewTrack" className="w-8 h-8 object-contain" />
          <span className="font-bold text-brand-navy">SewTrack</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 hover:text-gray-900 p-1"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative w-64 h-screen lg:h-auto bg-brand-navy-dark text-white transition-transform duration-300 flex flex-col z-30 lg:z-auto`}
      >
        {/* Logo - Desktop Only */}
        <div className="hidden lg:flex p-6 border-b border-brand-navy items-center gap-3">
          <img src="/logo.png" alt="SewTrack" className="w-10 h-10 object-contain" />
          <h1 className="font-bold text-lg text-brand-orange">SewTrack</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              // Disable menu item if tailor is not approved and item requires approval
              const isDisabled = isTailor && !isApproved && item.requiresApproval;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
                      isDisabled
                        ? 'text-gray-500 cursor-not-allowed opacity-50'
                        : isActive(item.path)
                        ? 'bg-brand-orange text-white'
                        : 'text-gray-300 hover:bg-brand-navy'
                    }`}
                    style={{ pointerEvents: isDisabled ? 'none' : 'auto' }}
                    title={isDisabled ? 'Disabled until approval' : ''}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                    {isDisabled && <span className="ml-auto text-xs">🔒</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Menu */}
        <div className="p-4 border-t border-brand-navy space-y-2">
          <Link
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
              isActive('/profile')
                ? 'bg-brand-orange text-white'
                : 'text-gray-300 hover:bg-brand-navy'
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>

          <button
            onClick={() => {
              logout();
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-brand-navy transition-all text-left text-sm"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden lg:flex bg-white border-b border-gray-200 px-8 py-4 items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {location.pathname.startsWith('/staff/') && location.pathname !== '/staff' 
              ? 'Staff Details'
              : location.pathname.startsWith('/clients/') && location.pathname !== '/clients'
              ? 'Client Details'
              : menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          {user && (
            <div className="text-sm text-gray-600 text-right">
              <p className="font-medium">{role === 'customer' ? user.name : user.businessName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          )}
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
