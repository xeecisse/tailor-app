'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../lib/api';
import authStore from '../stores/authStore';
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
  const navigate = useNavigate();
  const { tailor } = authStore();
  const [overview, setOverview] = useState(null);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [weeklyOrdersData, setWeeklyOrdersData] = useState([]);
  const [categoryRevenueData, setCategoryRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [overviewRes, topAttireRes, monthlyTrendRes, weeklyOrdersRes] = await Promise.all([
          dashboardAPI.getOverview(),
          dashboardAPI.getTopAttires(),
          dashboardAPI.getMonthlyTrend(),
          dashboardAPI.getWeeklyOrders(),
        ]);
        
        setOverview(overviewRes.data.overview);
        
        // Transform top attires data for category revenue chart
        if (topAttireRes.data.topAttires && topAttireRes.data.topAttires.length > 0) {
          const categoryData = topAttireRes.data.topAttires.map(attire => ({
            category: attire.name,
            revenue: attire.revenue,
            orders: attire.count,
          }));
          setCategoryRevenueData(categoryData);
        }
        
        // Set monthly revenue data from API
        if (monthlyTrendRes.data.monthlyData) {
          setMonthlyRevenueData(monthlyTrendRes.data.monthlyData);
        }

        // Set weekly orders data from API
        if (weeklyOrdersRes.data.weeklyData) {
          setWeeklyOrdersData(weeklyOrdersRes.data.weeklyData);
        }
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
      <div className="min-h-screen bg-gradient-to-br from-brand-navy-50 via-brand-orange-50 to-brand-navy-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-navy-200 border-t-brand-navy mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-navy-50 via-brand-orange-50 to-brand-navy-50 p-8">
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

  // Weekly orders data is now fetched from API

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
      gradient: 'from-brand-navy via-brand-orange to-brand-orange-dark',
      bgGradient: 'from-brand-navy-50 to-brand-orange-50',
      iconBg: 'bg-brand-navy-100',
      change: '+12.5%',
      changePositive: true,
    },
    {
      title: 'Expected Revenue',
      value: `₦${expectedRevenue.toLocaleString()}`,
      icon: BarChart3,
      gradient: 'from-brand-orange via-brand-orange-dark to-brand-navy',
      bgGradient: 'from-brand-orange-50 to-brand-navy-50',
      iconBg: 'bg-brand-orange-100',
      change: '+8.2%',
      changePositive: true,
    },
    {
      title: 'Outstanding Payments',
      value: `₦${outstandingPayments.toLocaleString()}`,
      icon: Clock,
      gradient: 'from-brand-orange via-brand-navy to-brand-orange-dark',
      bgGradient: 'from-brand-orange-50 to-brand-navy-50',
      iconBg: 'bg-brand-orange-100',
      change: '-5.3%',
      changePositive: true,
    },
    {
      title: 'Orders This Month',
      value: ordersCreated,
      icon: Package,
      gradient: 'from-brand-navy via-brand-orange to-brand-navy-dark',
      bgGradient: 'from-brand-navy-50 to-brand-orange-50',
      iconBg: 'bg-brand-navy-100',
      change: '+15.7%',
      changePositive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy-50 via-brand-orange-50 to-brand-navy-50">
      {/* Enhanced Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-brand-navy to-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-orange to-brand-navy rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-[550px] h-[550px] bg-gradient-to-br from-brand-navy to-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Brand Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 border-gray-100 shadow-lg mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-brand-navy to-brand-orange rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-lg md:text-xl font-bold text-white">
                {tailor?.businessName?.charAt(0).toUpperCase() || 'S'}
              </span>
            </div>
            <div>
              <p className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">Welcome to</p>
              <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-brand-navy via-brand-orange to-brand-orange-dark bg-clip-text text-transparent">
                {tailor?.businessName || 'SewTrack'}
              </h2>
              <p className="text-gray-600 text-xs md:text-sm mt-0.5 font-medium">
                {tailor?.ownerName ? `Managed by ${tailor.ownerName}` : 'Your Tailoring Business Management System'}
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-brand-navy via-brand-orange to-brand-orange-dark bg-clip-text text-transparent mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
            <div 
              key={idx} 
              className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transform border border-white/50 backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.iconBg} p-3 md:p-4 rounded-xl md:rounded-2xl shadow-md`}>
                  <Icon size={24} className="md:w-8 md:h-8 text-gray-700" />
                </div>
                {stat.change && (
                  <div className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold ${
                    stat.changePositive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.change}
                  </div>
                )}
              </div>
              <div>
                <p className="text-gray-600 text-xs md:text-sm font-semibold mb-1">{stat.title}</p>
                <p className={`text-2xl md:text-3xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </div>
            </div>
          )})}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-8 border-2 border-brand-navy">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="bg-gradient-to-br from-brand-navy to-brand-orange p-2 md:p-3 rounded-lg md:rounded-xl">
              <Zap size={20} className="md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-900">Quick Actions</h2>
              <p className="text-gray-600 text-xs md:text-sm">Common tasks at your fingertips</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <button onClick={() => navigate('/clients')} className="bg-gradient-to-br from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white rounded-lg md:rounded-2xl p-3 md:p-6 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl cursor-pointer">
              <Users size={24} className="md:w-9 md:h-9 mb-1 md:mb-2 mx-auto" />
              <span className="text-xs md:text-sm font-bold">Add Client</span>
            </button>
            <button onClick={() => navigate('/orders')} className="bg-gradient-to-br from-brand-orange to-brand-navy hover:from-brand-orange-dark hover:to-brand-navy-dark text-white rounded-lg md:rounded-2xl p-3 md:p-6 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl cursor-pointer">
              <ShoppingBag size={24} className="md:w-9 md:h-9 mb-1 md:mb-2 mx-auto" />
              <span className="text-xs md:text-sm font-bold">New Order</span>
            </button>
            <button onClick={() => navigate('/measurements')} className="bg-gradient-to-br from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white rounded-lg md:rounded-2xl p-3 md:p-6 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl cursor-pointer">
              <Ruler size={24} className="md:w-9 md:h-9 mb-1 md:mb-2 mx-auto" />
              <span className="text-xs md:text-sm font-bold">Take Measurement</span>
            </button>
            <button onClick={() => navigate('/orders')} className="bg-gradient-to-br from-brand-orange to-brand-navy hover:from-brand-orange-dark hover:to-brand-navy-dark text-white rounded-lg md:rounded-2xl p-3 md:p-6 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl cursor-pointer">
              <Package size={24} className="md:w-9 md:h-9 mb-1 md:mb-2 mx-auto" />
              <span className="text-xs md:text-sm font-bold">Manage Inventory</span>
            </button>
          </div>
        </div>

        {/* Business Code Card */}
        <div className="bg-gradient-to-br from-brand-orange to-brand-navy rounded-3xl shadow-2xl p-8 border-2 border-brand-orange">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Users size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Your Business Code</h2>
              <p className="text-white/80 text-sm">Share this code with customers to connect</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="text-white/70 text-sm mb-3">Unique Business Code</p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-4xl font-bold text-white tracking-widest">{overview?.businessCode || 'N/A'}</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(overview?.businessCode || '');
                  alert('Code copied to clipboard!');
                }}
                className="bg-white text-brand-orange hover:bg-gray-100 font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Copy
              </button>
            </div>
            <p className="text-white/60 text-xs mt-4">
              Customers can use this code to connect to your business and place orders
            </p>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-brand-orange">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-brand-orange to-brand-navy p-3 rounded-xl">
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
              <div
                onClick={() => navigate('/inventory')}
                className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl p-5 hover:shadow-lg hover:scale-105 transition-all text-left cursor-pointer"
              >
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
              <div
                onClick={() => navigate('/reports')}
                className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl p-5 hover:shadow-lg hover:scale-105 transition-all text-left cursor-pointer"
              >
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

        {/* Revenue Progress Chart */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-8 border-2 border-brand-navy">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="bg-gradient-to-br from-brand-navy to-brand-orange p-2 md:p-3 rounded-lg md:rounded-xl">
              <TrendingUp size={20} className="md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-900">Revenue Progress</h2>
              <p className="text-gray-600 text-xs md:text-sm">Current vs Expected Revenue</p>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            <div className="flex justify-between items-center mb-2 text-xs md:text-base">
              <span className="text-gray-700 font-semibold">₦{totalRevenue.toLocaleString()}</span>
              <span className="text-gray-500 text-xs md:text-sm">of ₦{expectedRevenue.toLocaleString()}</span>
            </div>
            <div className="relative h-6 md:h-8 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-navy via-brand-orange to-brand-orange-dark rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2 md:pr-3"
                style={{ width: `${Math.min(revenuePercentage, 100)}%` }}
              >
                {revenuePercentage > 10 && (
                  <span className="text-white font-bold text-xs md:text-sm">{revenuePercentage.toFixed(1)}%</span>
                )}
              </div>
            </div>
            <div className="flex justify-between text-xs md:text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <DollarSign size={14} className="md:w-4 md:h-4" /> Total Revenue
              </span>
              <span className="text-gray-600 flex items-center gap-1">
                <TrendingUp size={14} className="md:w-4 md:h-4" /> Expected Revenue
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown & This Month Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Revenue Breakdown */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-8 border-2 border-brand-orange">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="bg-gradient-to-br from-brand-orange to-brand-navy p-2 md:p-3 rounded-lg md:rounded-xl">
                <DollarSign size={20} className="md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-lg md:text-2xl font-bold text-gray-900">Revenue Breakdown</h2>
                <p className="text-gray-600 text-xs md:text-sm">This Month's Income Sources</p>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              {/* Tailoring Revenue */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Scissors size={16} className="md:w-5 md:h-5 text-gray-700" />
                    <span className="text-gray-700 font-semibold text-sm md:text-base">Tailoring</span>
                  </div>
                  <span className="text-gray-900 font-bold text-sm md:text-base">₦{tailoringRevenue.toLocaleString()}</span>
                </div>
                <div className="relative h-4 md:h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-navy to-brand-orange rounded-full transition-all duration-1000"
                    style={{ width: `${tailoringPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{tailoringPercentage.toFixed(1)}% of total</p>
              </div>

              {/* Inventory Revenue */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="md:w-5 md:h-5 text-gray-700" />
                    <span className="text-gray-700 font-semibold text-sm md:text-base">Inventory Sales</span>
                  </div>
                  <span className="text-gray-900 font-bold text-sm md:text-base">₦{inventoryRevenue.toLocaleString()}</span>
                </div>
                <div className="relative h-4 md:h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-orange to-brand-navy rounded-full transition-all duration-1000"
                    style={{ width: `${inventoryPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{inventoryPercentage.toFixed(1)}% of total</p>
              </div>

              {/* Total */}
              <div className="pt-3 md:pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-bold text-sm md:text-lg">Total This Month</span>
                  <span className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-brand-navy to-brand-orange bg-clip-text text-transparent">
                    ₦{(tailoringRevenue + inventoryRevenue).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* This Month Activity */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-brand-navy">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-brand-navy to-brand-orange p-3 rounded-xl">
                <Calendar size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">This Month's Activity</h2>
                <p className="text-gray-600 text-sm">Orders & Purchase Orders</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-brand-navy-50 to-brand-orange-50 rounded-2xl p-5 border-2 border-brand-navy">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-navy-100 p-3 rounded-xl">
                      <ShoppingBag size={28} className="text-brand-navy" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Orders Created</p>
                      <p className="text-3xl font-extrabold text-brand-navy">{ordersCreated}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      +15.7%
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-brand-orange-50 to-brand-navy-50 rounded-2xl p-5 border-2 border-brand-orange">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-orange-100 p-3 rounded-xl">
                      <ClipboardList size={28} className="text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Purchase Orders</p>
                      <p className="text-3xl font-extrabold text-brand-orange">{posCreated}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      +8.3%
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-brand-orange-50 to-brand-navy-50 rounded-2xl p-5 border-2 border-brand-orange">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-orange-100 p-3 rounded-xl">
                      <CreditCard size={28} className="text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Outstanding</p>
                      <p className="text-2xl font-extrabold text-brand-orange">₦{outstandingPayments.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Trend - Line Chart */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-brand-navy">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-brand-navy to-brand-orange p-3 rounded-xl">
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
                  <stop offset="5%" stopColor="#001f3f" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#001f3f" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorInventory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ff6b35" stopOpacity={0.1}/>
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
                stroke="#001f3f" 
                fill="url(#colorTailoring)"
                name="Tailoring Revenue"
              />
              <Area 
                type="monotone" 
                dataKey="inventory" 
                stackId="1"
                stroke="#ff6b35" 
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
