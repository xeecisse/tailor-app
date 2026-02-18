'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Ruler, MessageSquare, Users, Plus } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CustomerDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalMeasurements: 0,
    assignedTailors: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, measurementsRes, tailorsRes, messagesRes] = await Promise.all([
        axios.get(`${API_URL}/orders/customer/my-orders`).catch(() => ({ data: { orders: [] } })),
        axios.get(`${API_URL}/measurements/customer/my-measurements`).catch(() => ({ data: { measurements: [] } })),
        axios.get(`${API_URL}/customers/my-tailors`).catch(() => ({ data: { tailors: [] } })),
        axios.get(`${API_URL}/messages/unread`).catch(() => ({ data: { count: 0 } })),
      ]);

      setStats({
        totalOrders: ordersRes.data.orders?.length || 0,
        totalMeasurements: measurementsRes.data.measurements?.length || 0,
        assignedTailors: tailorsRes.data.tailors?.length || 0,
        unreadMessages: messagesRes.data.count || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'My Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'from-brand-navy to-brand-orange',
      path: '/my-orders',
    },
    {
      title: 'My Measurements',
      value: stats.totalMeasurements,
      icon: Ruler,
      color: 'from-brand-orange to-brand-orange-dark',
      path: '/my-measurements',
    },
    {
      title: 'My Tailors',
      value: stats.assignedTailors,
      icon: Users,
      color: 'from-brand-navy-dark to-brand-navy',
      path: '/my-tailors',
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: 'from-brand-orange-dark to-brand-orange',
      path: '/messages',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">Here's an overview of your sewing orders and measurements</p>
        </div>
        <Link
          to="/connect-tailor"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-navy to-brand-orange text-white font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          <Plus size={20} />
          Connect to Tailor
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.path}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all overflow-hidden group"
            >
              {/* Gradient Header */}
              <div className={`bg-gradient-to-r ${card.color} p-4 flex items-center justify-center`}>
                <Icon size={32} className="text-white" />
              </div>
              
              {/* Content */}
              <div className="p-6 text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">{card.title}</p>
                <p className="text-4xl font-bold text-brand-navy">{card.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-brand-navy mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/my-orders"
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-brand-orange hover:bg-brand-orange hover:bg-opacity-5 transition-all text-center group"
          >
            <div className="w-12 h-12 bg-brand-navy bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-orange group-hover:bg-opacity-20">
              <ShoppingBag className="text-brand-navy group-hover:text-brand-orange" size={24} />
            </div>
            <p className="font-semibold text-brand-navy mb-1">View My Orders</p>
            <p className="text-xs text-gray-600">Check status of your orders</p>
          </Link>
          <Link
            to="/my-measurements"
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-brand-orange hover:bg-brand-orange hover:bg-opacity-5 transition-all text-center group"
          >
            <div className="w-12 h-12 bg-brand-orange bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-orange group-hover:bg-opacity-20">
              <Ruler className="text-brand-orange group-hover:text-brand-orange" size={24} />
            </div>
            <p className="font-semibold text-brand-navy mb-1">My Measurements</p>
            <p className="text-xs text-gray-600">View your saved measurements</p>
          </Link>
          <Link
            to="/my-tailors"
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-brand-orange hover:bg-brand-orange hover:bg-opacity-5 transition-all text-center group"
          >
            <div className="w-12 h-12 bg-brand-navy bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-orange group-hover:bg-opacity-20">
              <Users className="text-brand-navy group-hover:text-brand-orange" size={24} />
            </div>
            <p className="font-semibold text-brand-navy mb-1">My Tailors</p>
            <p className="text-xs text-gray-600">View assigned tailors</p>
          </Link>
          <Link
            to="/messages"
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-brand-orange hover:bg-brand-orange hover:bg-opacity-5 transition-all text-center group"
          >
            <div className="w-12 h-12 bg-brand-orange bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-orange group-hover:bg-opacity-20">
              <MessageSquare className="text-brand-orange group-hover:text-brand-orange" size={24} />
            </div>
            <p className="font-semibold text-brand-navy mb-1">Messages</p>
            <p className="text-xs text-gray-600">Chat with your tailors</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
