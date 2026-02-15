'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../lib/api';
import { 
  Users, 
  CheckCircle, 
  UserCircle, 
  User, 
  Package, 
  Plus, 
  Search, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Eye, 
  Edit, 
  Trash2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchClients();
  }, [search]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await clientAPI.getAll('active', search, 1, 20);
      setClients(response.data.clients);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Are you sure? This will delete all related measurements and orders.')) {
      try {
        await clientAPI.delete(clientId);
        setMessage('Client deleted successfully');
        fetchClients();
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete client');
      }
    }
  };

  const totalOrders = clients.reduce((sum, client) => sum + (client.orderCount || 0), 0);
  const maleClients = clients.filter(c => c.gender === 'male').length;
  const femaleClients = clients.filter(c => c.gender === 'female').length;
  const activeClients = clients.filter(c => (c.orderCount || 0) > 0).length;
  const avgOrdersPerClient = clients.length > 0 ? (totalOrders / clients.length).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Enhanced Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-[550px] h-[550px] bg-gradient-to-br from-orange-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-green-300 to-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
                  <Users size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    Clients
                  </h1>
                  <p className="text-gray-600 mt-1 text-lg font-medium">Manage your client relationships with ease</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/clients/new')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform"
            >
              <Plus size={24} /> Add New Client
            </button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[
            { 
              label: 'Total Clients', 
              value: clients.length, 
              icon: Users,
              gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
              bgGradient: 'from-violet-50 to-purple-50',
              iconBg: 'bg-violet-100',
              textColor: 'text-violet-700',
              change: '+12%',
              changeColor: 'text-green-600'
            },
            { 
              label: 'Active Clients', 
              value: activeClients, 
              icon: CheckCircle,
              gradient: 'from-emerald-500 via-green-500 to-teal-500',
              bgGradient: 'from-emerald-50 to-green-50',
              iconBg: 'bg-emerald-100',
              textColor: 'text-emerald-700',
              change: '+8%',
              changeColor: 'text-green-600'
            },
            { 
              label: 'Female Clients', 
              value: femaleClients, 
              icon: UserCircle,
              gradient: 'from-pink-500 via-rose-500 to-red-500',
              bgGradient: 'from-pink-50 to-rose-50',
              iconBg: 'bg-pink-100',
              textColor: 'text-pink-700',
              percentage: clients.length > 0 ? `${Math.round((femaleClients/clients.length)*100)}%` : '0%'
            },
            { 
              label: 'Male Clients', 
              value: maleClients, 
              icon: User,
              gradient: 'from-blue-500 via-cyan-500 to-sky-500',
              bgGradient: 'from-blue-50 to-cyan-50',
              iconBg: 'bg-blue-100',
              textColor: 'text-blue-700',
              percentage: clients.length > 0 ? `${Math.round((maleClients/clients.length)*100)}%` : '0%'
            },
            { 
              label: 'Total Orders', 
              value: totalOrders, 
              icon: Package,
              gradient: 'from-orange-500 via-amber-500 to-yellow-500',
              bgGradient: 'from-orange-50 to-amber-50',
              iconBg: 'bg-orange-100',
              textColor: 'text-orange-700',
              subValue: `${avgOrdersPerClient} avg/client`
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className={`bg-gradient-to-br ${stat.bgGradient} rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transform border border-white/50 backdrop-blur-sm`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.iconBg} p-3 rounded-2xl shadow-md`}>
                    <Icon size={28} className={stat.textColor} />
                  </div>
                  {stat.change && (
                    <span className={`${stat.changeColor} text-sm font-bold flex items-center gap-1 bg-white/70 px-2 py-1 rounded-lg`}>
                      ↗ {stat.change}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
                  <p className={`text-4xl font-extrabold ${stat.textColor} mb-1`}>{stat.value}</p>
                  {stat.percentage && (
                    <p className="text-xs text-gray-500 font-medium">{stat.percentage} of total</p>
                  )}
                  {stat.subValue && (
                    <p className="text-xs text-gray-500 font-medium">{stat.subValue}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl text-red-700 flex items-center gap-4 shadow-lg">
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertTriangle size={24} className="text-red-700" />
            </div>
            <span className="font-semibold text-lg">{error}</span>
          </div>
        )}
        {message && (
          <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl text-green-700 flex items-center gap-4 shadow-lg">
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle size={24} className="text-green-700" />
            </div>
            <span className="font-semibold text-lg">{message}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8 relative">
          <div className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
            <Search size={20} className="text-white" />
          </div>
          <input
            type="text"
            placeholder="Search clients by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-6 py-4 border-2 border-purple-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white/80 backdrop-blur-sm text-lg font-medium shadow-lg"
          />
        </div>

        {/* Clients Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
              <p className="text-gray-700 font-bold text-lg">Loading clients...</p>
            </div>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-purple-300 shadow-xl">
            <Users size={80} className="mx-auto mb-6 text-gray-400" />
            <p className="text-gray-800 text-2xl font-bold mb-2">No clients yet</p>
            <p className="text-gray-600 text-lg">Start by adding your first client to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => {
              const orderCount = client.orderCount || 0;
              const isActive = orderCount > 0;
              const genderConfig = {
                male: {
                  gradient: 'from-blue-500 via-cyan-500 to-sky-500',
                  bgGradient: 'from-blue-50 to-cyan-50',
                  icon: User,
                  borderColor: 'border-blue-200'
                },
                female: {
                  gradient: 'from-pink-500 via-rose-500 to-red-500',
                  bgGradient: 'from-pink-50 to-rose-50',
                  icon: UserCircle,
                  borderColor: 'border-pink-200'
                },
                other: {
                  gradient: 'from-purple-500 via-violet-500 to-indigo-500',
                  bgGradient: 'from-purple-50 to-violet-50',
                  icon: User,
                  borderColor: 'border-purple-200'
                }
              };
              const config = genderConfig[client.gender] || genderConfig.other;
              const GenderIcon = config.icon;

              return (
                <div
                  key={client._id}
                  className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${config.borderColor} hover:border-purple-300 group transform hover:scale-105`}
                >
                  {/* Header with Gradient */}
                  <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    
                    <div className="relative z-10 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <GenderIcon size={28} className="text-white" />
                          <h3 className="text-xl font-bold">{client.name}</h3>
                        </div>
                        <p className="text-sm opacity-90 capitalize font-semibold">
                          {client.gender}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Package size={14} /> {orderCount} {orderCount === 1 ? 'order' : 'orders'}
                        </span>
                        {isActive && (
                          <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <CheckCircle size={14} /> Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Body with Enhanced Info */}
                  <div className={`bg-gradient-to-br ${config.bgGradient} p-6 space-y-3`}>
                    {/* Phone */}
                    <div className="flex items-center gap-3 text-gray-700 bg-white/60 backdrop-blur-sm p-3 rounded-xl">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Phone size={20} className="text-blue-700" />
                      </div>
                      <span className="text-sm font-semibold">{client.phone}</span>
                    </div>

                    {/* WhatsApp */}
                    {client.whatsappNumber && (
                      <div className="flex items-center gap-3 text-gray-700 bg-white/60 backdrop-blur-sm p-3 rounded-xl">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <MessageCircle size={20} className="text-green-700" />
                        </div>
                        <span className="text-sm font-semibold">{client.whatsappNumber}</span>
                      </div>
                    )}

                    {/* Email */}
                    {client.email && (
                      <div className="flex items-center gap-3 text-gray-700 bg-white/60 backdrop-blur-sm p-3 rounded-xl">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <Mail size={20} className="text-red-700" />
                        </div>
                        <span className="text-sm font-semibold truncate">{client.email}</span>
                      </div>
                    )}

                    {/* Location */}
                    {client.address?.city && (
                      <div className="flex items-center gap-3 text-gray-700 bg-white/60 backdrop-blur-sm p-3 rounded-xl">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <MapPin size={20} className="text-orange-700" />
                        </div>
                        <span className="text-sm font-semibold">{client.address.city}</span>
                      </div>
                    )}

                    {/* Notes */}
                    {client.notes && (
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 p-3 rounded-xl mt-3">
                        <div className="flex items-start gap-2">
                          <MessageSquare size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-700 font-medium line-clamp-2">{client.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer with Action Buttons */}
                  <div className="bg-white p-4 flex items-center gap-2 border-t-2 border-gray-100">
                    <button
                      onClick={() => navigate(`/clients/${client._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-3 py-2.5 rounded-xl transition-all text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <Eye size={18} /> View
                    </button>
                    <button
                      onClick={() => navigate(`/clients/${client._id}/edit`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-2.5 rounded-xl transition-all text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <Edit size={18} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2.5 rounded-xl transition-all text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <Trash2 size={18} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
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
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>
    </div>
  );
}
