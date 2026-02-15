'use client';

import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../lib/api';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { 
  DollarSign, 
  BarChart3, 
  Clock, 
  Package, 
  TrendingUp, 
  Scissors, 
  Calendar, 
  ShoppingBag, 
  ClipboardList, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Zap,
  Bell,
  Box,
  Ruler
} from 'lucide-react';

export default function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getOverview();
        setOverview(response.data.overview);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl text-red-700 shadow-lg">
            <div className="flex items-center gap-4">
              <AlertTriangle size={32} className="text-red-700" />
              <span className="font-semibold text-lg">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = overview?.totalRevenue || 0;
  const expectedRevenue = overview?.expectedRevenue || 0;
  const outstandingPayments = overview?.outstandingPayments || 0;
  const tailoringRevenue = overview?.thisMonth?.tailoringRevenue || 0;
  const inventoryRevenue = overview?.thisMonth?.inventorySalesRevenue || 0;
  const ordersCreated = overview?.thisMonth?.ordersCreated || 0;
  const posCreated = overview?.thisMonth?.posCreated || 0;

  // Calculate percentages for visual bars
  const revenuePercentage = expectedRevenue > 0 ? (totalRevenue / expectedRevenue) * 100 : 0;
  const tailoringPercentage = (tailoringRevenue + inventoryRevenue) > 0 
    ? (tailoringRevenue / (tailoringRevenue + inventoryRevenue)) * 100 
    : 50;
  const inventoryPercentage = 100 - tailoringPercentage;

  // Sample data for charts - In production, this would come from the API
  const monthlyRevenueData = [
    { month: 'Jan', tailoring: 45000, inventory: 28000, total: 73000 },
    { month: 'Feb', tailoring: 52000, inventory: 31000, total: 83000 },
    { month: 'Mar', tailoring: 48000, inventory: 35000, total: 83000 },
    { month: 'Apr', tailoring: 61000, inventory: 42000, total: 103000 },
    { month: 'May', tailoring: 55000, inventory: 38000, total: 93000 },
    { month: 'Jun', tailoring: 67000, inventory: 45000, total: 112000 },
  ];

  const weeklyOrdersData = [
    { week: 'Week 1', orders: 12, completed: 10 },
    { week: 'Week 2', orders: 15, completed: 13 },
    { week: 'Week 3', orders: 18, completed: 15 },
    { week: 'Week 4', orders: 14, completed: 12 },
  ];

  const categoryRevenueData = [
    { category: 'Kaftan', revenue: 45000, orders: 15 },
    { category: 'Agbada', revenue: 38000, orders: 12 },
    { category: 'Senator', revenue: 32000, orders: 18 },
    { category: 'Iro & Buba', revenue: 28000, orders: 10 },
    { category: 'Boubou', revenue: 25000, orders: 9 },
    { category: 'Others', revenue: 42000, orders: 20 },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border-2 border-purple-300 rounded-xl p-4 shadow-xl">
          <p className="font-bold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ₦{entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: `₦${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      bgGradient: 'from-green-50 to-emerald-50',
      iconBg: 'bg-green-100',
      change: '+12.5%',
      changePositive: true,
    },
    {
      title: 'Expected Revenue',
      value: `₦${expectedRevenue.toLocaleString()}`,
      icon: BarChart3,
      gradient: 'from-blue-500 via-cyan-500 to-sky-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      iconBg: 'bg-blue-100',
      change: '+8.2%',
      changePositive: true,
    },
    {
      title: 'Outstanding Payments',
      value: `₦${outstandingPayments.toLocaleString()}`,
      icon: Clock,
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      bgGradient: 'from-orange-50 to-amber-50',
      iconBg: 'bg-orange-100',
      change: '-5.3%',
      changePositive: true,
    },
    {
      title: 'Orders This Month',
      value: ordersCreated,
      icon: Package,
      gradient: 'from-purple-500 via-violet-500 to-indigo-500',
      bgGradient: 'from-purple-50 to-violet-50',
      iconBg: 'bg-purple-100',
      change: '+15.7%',
      changePositive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Enhanced Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-[550px] h-[550px] bg-gradient-to-br from-orange-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
            <div 
              key={idx} 
              className={`bg-gradient-to-br ${stat.bgGradient} rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transform border border-white/50 backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.iconBg} p-4 rounded-2xl shadow-md`}>
                  <Icon size={32} className="text-gray-700" />
                </div>
                {stat.change && (
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    stat.changePositive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.change}
                  </div>
                )}
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">{stat.title}</p>
                <p className={`text-3xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </div>
            </div>
          )})}
        </div>

        {/* Revenue Progress Chart */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl">
              <TrendingUp size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Revenue Progress</h2>
              <p className="text-gray-600 text-sm">Current vs Expected Revenue</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-semibold">₦{totalRevenue.toLocaleString()}</span>
              <span className="text-gray-500 text-sm">of ₦{expectedRevenue.toLocaleString()}</span>
            </div>
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                style={{ width: `${Math.min(revenuePercentage, 100)}%` }}
              >
                {revenuePercentage > 10 && (
                  <span className="text-white font-bold text-sm">{revenuePercentage.toFixed(1)}%</span>
                )}
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <DollarSign size={16} /> Total Revenue
              </span>
              <span className="text-gray-600 flex items-center gap-1">
                <TrendingUp size={16} /> Expected Revenue
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown & This Month Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Breakdown */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl">
                <DollarSign size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Revenue Breakdown</h2>
                <p className="text-gray-600 text-sm">This Month's Income Sources</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Tailoring Revenue */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Scissors size={20} className="text-gray-700" />
                    <span className="text-gray-700 font-semibold">Tailoring</span>
                  </div>
                  <span className="text-gray-900 font-bold">₦{tailoringRevenue.toLocaleString()}</span>
                </div>
                <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                    style={{ width: `${tailoringPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{tailoringPercentage.toFixed(1)}% of total</p>
              </div>

              {/* Inventory Revenue */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Package size={20} className="text-gray-700" />
                    <span className="text-gray-700 font-semibold">Inventory Sales</span>
                  </div>
                  <span className="text-gray-900 font-bold">₦{inventoryRevenue.toLocaleString()}</span>
                </div>
                <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000"
                    style={{ width: `${inventoryPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{inventoryPercentage.toFixed(1)}% of total</p>
              </div>

              {/* Total */}
              <div className="pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-bold text-lg">Total This Month</span>
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    ₦{(tailoringRevenue + inventoryRevenue).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* This Month Activity */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                <Calendar size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">This Month's Activity</h2>
                <p className="text-gray-600 text-sm">Orders & Purchase Orders</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-3 rounded-xl">
                      <ShoppingBag size={28} className="text-purple-700" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Orders Created</p>
                      <p className="text-3xl font-extrabold text-purple-700">{ordersCreated}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      +15.7%
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <ClipboardList size={28} className="text-blue-700" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Purchase Orders</p>
                      <p className="text-3xl font-extrabold text-blue-700">{posCreated}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      +8.3%
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border-2 border-orange-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-3 rounded-xl">
                      <CreditCard size={28} className="text-orange-700" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Outstanding</p>
                      <p className="text-2xl font-extrabold text-orange-700">₦{outstandingPayments.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Trend - Line Chart */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl">
              <TrendingUp size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Revenue Trend</h2>
              <p className="text-gray-600 text-sm">Monthly revenue over the last 6 months</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={monthlyRevenueData}>
              <defs>
                <linearGradient id="colorTailoring" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorInventory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                style={{ fontSize: '14px', fontWeight: '600' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '14px', fontWeight: '600' }}
                tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '14px', fontWeight: '600' }}
                iconType="circle"
              />
              <Area 
                type="monotone" 
                dataKey="tailoring" 
                stackId="1"
                stroke="#a855f7" 
                fill="url(#colorTailoring)"
                name="Tailoring Revenue"
              />
              <Area 
                type="monotone" 
                dataKey="inventory" 
                stackId="1"
                stroke="#3b82f6" 
                fill="url(#colorInventory)"
                name="Inventory Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Charts Grid - Bar Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Revenue Bar Chart */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl">
                <BarChart3 size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Revenue by Category</h2>
                <p className="text-gray-600 text-sm">Top performing attire types</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="category" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px', fontWeight: '600' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px', fontWeight: '600' }}
                  tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="revenue" 
                  fill="url(#barGradient)"
                  radius={[10, 10, 0, 0]}
                  name="Revenue"
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Orders Bar Chart */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                <Package size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Weekly Orders</h2>
                <p className="text-gray-600 text-sm">Orders created vs completed</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="week" 
                  stroke="#6b7280"
                  style={{ fontSize: '14px', fontWeight: '600' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '14px', fontWeight: '600' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid #a855f7',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '14px', fontWeight: '600' }}
                />
                <Bar 
                  dataKey="orders" 
                  fill="#a855f7"
                  radius={[10, 10, 0, 0]}
                  name="Orders Created"
                />
                <Bar 
                  dataKey="completed" 
                  fill="#10b981"
                  radius={[10, 10, 0, 0]}
                  name="Completed"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-yellow-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-yellow-500 to-amber-500 p-3 rounded-xl">
              <Bell size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Alerts & Notifications</h2>
              <p className="text-gray-600 text-sm">Important items requiring attention</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Low Stock Alert */}
            {overview?.alerts?.lowStockCount > 0 ? (
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-100 p-3 rounded-xl">
                    <Package size={28} className="text-yellow-700" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-yellow-900 mb-1">Low Stock Alert</p>
                    <p className="text-2xl font-extrabold text-yellow-700 mb-1">
                      {overview.alerts.lowStockCount}
                    </p>
                    <p className="text-xs text-yellow-600">items need restocking</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <span className="text-3xl">✅</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-900 mb-1">Stock Levels</p>
                    <p className="text-xs text-green-600">All items well stocked</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pending Order Payments */}
            {overview?.alerts?.pendingOrderPayments > 0 ? (
              <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-3 rounded-xl">
                    <DollarSign size={28} className="text-red-700" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-red-900 mb-1">Pending Payments</p>
                    <p className="text-2xl font-extrabold text-red-700 mb-1">
                      {overview.alerts.pendingOrderPayments}
                    </p>
                    <p className="text-xs text-red-600">orders awaiting payment</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <span className="text-3xl">✅</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-900 mb-1">Order Payments</p>
                    <p className="text-xs text-green-600">All payments up to date</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pending PO Payments */}
            {overview?.alerts?.pendingPOPayments > 0 ? (
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-300 rounded-2xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <ClipboardList size={28} className="text-orange-700" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-orange-900 mb-1">PO Payments Due</p>
                    <p className="text-2xl font-extrabold text-orange-700 mb-1">
                      {overview.alerts.pendingPOPayments}
                    </p>
                    <p className="text-xs text-orange-600">purchase orders need payment</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <span className="text-3xl">✅</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-900 mb-1">PO Payments</p>
                    <p className="text-xs text-green-600">All payments settled</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-indigo-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-xl">
              <Zap size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              <p className="text-gray-600 text-sm">Common tasks at your fingertips</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl p-6 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl">
              <Users size={36} className="mb-2 mx-auto" />
              <span className="text-sm font-bold">Add Client</span>
            </button>
            <button className="bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl p-6 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl">
              <ShoppingBag size={36} className="mb-2 mx-auto" />
              <span className="text-sm font-bold">New Order</span>
            </button>
            <button className="bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl p-6 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl">
              <Ruler size={36} className="mb-2 mx-auto" />
              <span className="text-sm font-bold">Take Measurement</span>
            </button>
            <button className="bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl p-6 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl">
              <Package size={36} className="mb-2 mx-auto" />
              <span className="text-sm font-bold">Manage Inventory</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
