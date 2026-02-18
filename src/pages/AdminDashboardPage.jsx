'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  LogOut,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
} from 'lucide-react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);
  const [stats, setStats] = useState({
    totalTailors: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    const adminData = localStorage.getItem('admin_info');

    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    if (adminData) {
      setAdminInfo(JSON.parse(adminData));
    }

    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('admin_token');
      
      if (!adminToken) {
        navigate('/admin/login');
        return;
      }

      const response = await axios.get(`${API_URL}/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      setStats(response.data.stats || {
        totalTailors: 0,
        totalCustomers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      }
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_info');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-navy-200 border-t-brand-navy-600 mb-4"></div>
          <p className="text-gray-700 font-bold text-base">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Tailors',
      value: stats.totalTailors,
      icon: Users,
      color: 'from-brand-navy to-brand-navy-light',
      bgColor: 'bg-brand-navy/10',
    },
    {
      label: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'from-brand-orange to-brand-orange-light',
      bgColor: 'bg-brand-orange/10',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'from-green-600 to-green-700',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Total Revenue',
      value: `₦${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-purple-600 to-purple-700',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-navy">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome, {adminInfo?.name || 'Administrator'}</p>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 flex items-center gap-3">
            <AlertTriangle size={20} className="flex-shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 border-brand-navy p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon size={24} className="text-gray-700" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-semibold mb-2">{stat.label}</p>
                <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Orders Overview */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-brand-orange">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-orange/10 p-3 rounded-lg">
                <ShoppingBag size={24} className="text-brand-orange" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy">Orders Overview</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-yellow-600" />
                  <span className="font-semibold text-gray-700">Pending Orders</span>
                </div>
                <span className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-600" />
                  <span className="font-semibold text-gray-700">Completed Orders</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{stats.completedOrders}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-brand-navy">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-navy/10 p-3 rounded-lg">
                <Settings size={24} className="text-brand-navy" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/tailors')}
                className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all text-left font-semibold text-gray-700"
              >
                <Users size={20} className="text-brand-navy" />
                Manage Tailors
              </button>
              <button
                onClick={() => navigate('/admin/customers')}
                className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all text-left font-semibold text-gray-700"
              >
                <Users size={20} className="text-brand-orange" />
                Manage Customers
              </button>
              <button
                onClick={() => navigate('/admin/orders')}
                className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all text-left font-semibold text-gray-700"
              >
                <ShoppingBag size={20} className="text-green-600" />
                View All Orders
              </button>
              <button
                onClick={() => navigate('/admin/reports')}
                className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all text-left font-semibold text-gray-700"
              >
                <BarChart3 size={20} className="text-purple-600" />
                View Reports
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-brand-navy to-brand-navy-dark text-white rounded-lg shadow-md p-6">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <BarChart3 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Platform Overview</h3>
              <p className="text-gray-200">
                Monitor all platform activities, manage users, view analytics, and ensure smooth operations of the SewTrack platform.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
