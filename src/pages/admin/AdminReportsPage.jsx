'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar';
import { API_URL } from '../../lib/api';

export default function AdminReportsPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchReports();
  }, [navigate]);

  const fetchReports = async () => {
    try {
      const adminToken = localStorage.getItem('admin_token');
      const response = await axios.get(`${API_URL}/admin/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-navy-200 border-t-brand-navy-600 mb-4"></div>
            <p className="text-gray-700 font-bold">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  const reportCards = [
    {
      title: 'Total Tailors',
      value: stats?.totalTailors || 0,
      icon: Users,
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'from-green-600 to-green-700',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'from-orange-600 to-orange-700',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Total Revenue',
      value: `₦${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'from-purple-600 to-purple-700',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-brand-navy">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Platform performance and statistics</p>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {reportCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 border-l-4 border-brand-navy">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${card.bgColor} p-3 rounded-lg`}>
                      <Icon size={24} className="text-gray-700" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm font-semibold mb-2">{card.title}</p>
                  <p className="text-3xl font-extrabold text-gray-900">{card.value}</p>
                </div>
              );
            })}
          </div>

          {/* Detailed Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders Report */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-brand-orange/10 p-3 rounded-lg">
                  <ShoppingBag size={24} className="text-brand-orange" />
                </div>
                <h3 className="text-xl font-bold text-brand-navy">Orders Report</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-semibold">Total Orders</span>
                  <span className="text-2xl font-bold text-brand-navy">{stats?.totalOrders || 0}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-semibold">Pending Orders</span>
                  <span className="text-2xl font-bold text-yellow-600">{stats?.pendingOrders || 0}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-semibold">Completed Orders</span>
                  <span className="text-2xl font-bold text-green-600">{stats?.completedOrders || 0}</span>
                </div>
              </div>
            </div>

            {/* Revenue Report */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <TrendingUp size={24} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-brand-navy">Revenue Report</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <p className="text-gray-600 text-sm font-semibold mb-2">Total Revenue (Subscriptions)</p>
                  <p className="text-3xl font-extrabold text-purple-700">₦{(stats?.totalRevenue || 0).toLocaleString()}</p>
                </div>
                <p className="text-gray-600 text-sm">Revenue from tailor subscription payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
