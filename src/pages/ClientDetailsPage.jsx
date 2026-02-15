'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Calendar, TrendingUp, DollarSign, Package, Ruler } from 'lucide-react';
import { clientAPI } from '../lib/api';

export default function ClientDetailsPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClientDetails();
  }, [clientId]);

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await clientAPI.getById(clientId);
      setClient(response.data.client);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load client details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this client? This will delete all related measurements and orders.')) {
      try {
        await clientAPI.delete(clientId);
        navigate('/clients');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete client');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-all hover:gap-3"
          >
            <ArrowLeft size={20} /> Back to Clients
          </button>
          <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl text-red-700 shadow-lg">
            <div className="flex items-center gap-4">
              <span className="text-4xl">⚠️</span>
              <span className="font-semibold text-lg">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-all hover:gap-3"
          >
            <ArrowLeft size={20} /> Back to Clients
          </button>
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-purple-300 shadow-xl">
            <div className="text-8xl mb-6">🔍</div>
            <p className="text-gray-800 text-2xl font-bold">Client not found</p>
          </div>
        </div>
      </div>
    );
  }

  const genderConfig = {
    male: {
      gradient: 'from-blue-500 via-cyan-500 to-sky-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      icon: '👨',
      borderColor: 'border-blue-200'
    },
    female: {
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      bgGradient: 'from-pink-50 to-rose-50',
      icon: '👩',
      borderColor: 'border-pink-200'
    },
    other: {
      gradient: 'from-purple-500 via-violet-500 to-indigo-500',
      bgGradient: 'from-purple-50 to-violet-50',
      icon: '👤',
      borderColor: 'border-purple-200'
    }
  };

  const config = genderConfig[client.gender] || genderConfig.other;
  const totalOrders = client.orders?.length || 0;
  const totalMeasurements = client.measurements?.length || 0;
  const totalSpent = client.orders?.reduce((sum, order) => sum + (order.price || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Enhanced Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-[550px] h-[550px] bg-gradient-to-br from-orange-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/clients')}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4 transition-all hover:gap-3"
          >
            <ArrowLeft size={20} /> Back to Clients
          </button>
        </div>

        {/* Client Profile Card */}
        <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 ${config.borderColor} mb-8`}>
          {/* Header with Gradient */}
          <div className={`bg-gradient-to-r ${config.gradient} p-8 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl">
                  <span className="text-6xl">{config.icon}</span>
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold mb-2">{client.name}</h1>
                  <p className="text-lg opacity-90 capitalize font-semibold flex items-center gap-2">
                    <span>⚧</span> {client.gender}
                  </p>
                  {client.createdAt && (
                    <p className="text-sm opacity-75 mt-2 flex items-center gap-2">
                      <Calendar size={16} /> Member since {new Date(client.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/clients/${clientId}/edit`)}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                >
                  <Edit2 size={20} /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-500/80 hover:bg-red-600 backdrop-blur-sm px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                >
                  <Trash2 size={20} /> Delete
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={`bg-gradient-to-br ${config.bgGradient} p-8 grid grid-cols-1 md:grid-cols-3 gap-6`}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">📦</span>
                <Package className="text-orange-500" size={24} />
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Orders</p>
              <p className="text-4xl font-extrabold text-orange-600">{totalOrders}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">📏</span>
                <Ruler className="text-blue-500" size={24} />
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Measurements</p>
              <p className="text-4xl font-extrabold text-blue-600">{totalMeasurements}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">💰</span>
                <DollarSign className="text-green-500" size={24} />
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Spent</p>
              <p className="text-4xl font-extrabold text-green-600">₦{totalSpent.toLocaleString()}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-8 bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">📞</span> Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase">Phone Number</p>
                    <p className="text-lg font-bold text-gray-800">{client.phone}</p>
                  </div>
                </div>
              </div>

              {client.whatsappNumber && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <span className="text-2xl">💬</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-600 uppercase">WhatsApp</p>
                      <p className="text-lg font-bold text-gray-800">{client.whatsappNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {client.email && (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 p-5 rounded-2xl border-2 border-red-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-red-100 p-3 rounded-xl">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-red-600 uppercase">Email Address</p>
                      <p className="text-lg font-bold text-gray-800 break-all">{client.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {client.address?.city && (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-2xl border-2 border-orange-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-orange-100 p-3 rounded-xl">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-orange-600 uppercase">Location</p>
                      <p className="text-lg font-bold text-gray-800">
                        {client.address.city}
                        {client.address.state && `, ${client.address.state}`}
                      </p>
                      {client.address.street && (
                        <p className="text-sm text-gray-600 mt-1">{client.address.street}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            {client.notes && (
              <div className="mt-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 p-5 rounded-2xl">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-3 rounded-xl">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-amber-600 uppercase mb-2">Notes</p>
                    <p className="text-gray-700 font-medium leading-relaxed">{client.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Measurements Section */}
        {client.measurements && client.measurements.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-blue-200 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-4xl">📏</span> Measurements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {client.measurements.map((m) => (
                <div key={m._id} className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-200 hover:shadow-xl transition-all hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <span className="text-3xl">👔</span>
                    </div>
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {Object.keys(m.measurements || {}).length} items
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{m.attireName}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Section */}
        {client.orders && client.orders.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-4xl">📦</span> Orders History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-200">
                    <th className="px-6 py-4 text-left font-bold text-gray-800">Order #</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-800">Attire</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-800">Status</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-800">Payment</th>
                    <th className="px-6 py-4 text-right font-bold text-gray-800">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {client.orders.map((order, idx) => (
                    <tr 
                      key={order._id} 
                      className={`border-b border-gray-200 hover:bg-purple-50 transition-colors cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-bold text-purple-600">{order.orderNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">{order.attireType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 ${
                            order.status === 'completed' || order.status === 'delivered'
                              ? 'bg-green-100 text-green-700 border-2 border-green-300'
                              : order.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                                : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                          }`}
                        >
                          {order.status === 'completed' || order.status === 'delivered' ? '✅' : order.status === 'in_progress' ? '⏳' : '📋'}
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 ${
                            order.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-700 border-2 border-green-300'
                              : order.paymentStatus === 'partial'
                                ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                                : 'bg-red-100 text-red-700 border-2 border-red-300'
                          }`}
                        >
                          {order.paymentStatus === 'paid' ? '💰' : order.paymentStatus === 'partial' ? '⚠️' : '❌'}
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-xl text-gray-800">₦{order.price?.toLocaleString() || 0}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!client.measurements || client.measurements.length === 0) && (!client.orders || client.orders.length === 0) && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-16 text-center border-2 border-dashed border-purple-300">
            <div className="text-8xl mb-6">📋</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Activity Yet</h3>
            <p className="text-gray-600 text-lg">No measurements or orders have been created for this client</p>
          </div>
        )}
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
