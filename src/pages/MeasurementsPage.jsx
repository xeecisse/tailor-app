'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  User, 
  UserCircle, 
  Search, 
  Ruler, 
  Phone, 
  AlertTriangle 
} from 'lucide-react';
import { clientAPI } from '../lib/api';

export default function MeasurementsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchClients();
  }, [search]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await clientAPI.getAll('active', search, 1, 50);
      setClients(response.data.clients);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (clientId) => {
    navigate(`/measurements/client/${clientId}`);
  };

  const maleClients = clients.filter(c => c.gender === 'male').length;
  const femaleClients = clients.filter(c => c.gender === 'female').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading clients...</p>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
              <Ruler size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Measurements
              </h1>
              <p className="text-gray-600 mt-1 text-lg font-medium">Select a client to view and manage their measurements</p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { 
              label: 'Total Clients', 
              value: clients.length, 
              icon: Users,
              gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
              bgGradient: 'from-violet-50 to-purple-50',
              iconBg: 'bg-violet-100',
              textColor: 'text-violet-700',
            },
            { 
              label: 'Female Clients', 
              value: femaleClients, 
              icon: UserCircle,
              gradient: 'from-pink-500 via-rose-500 to-red-500',
              bgGradient: 'from-pink-50 to-rose-50',
              iconBg: 'bg-pink-100',
              textColor: 'text-pink-700',
            },
            { 
              label: 'Male Clients', 
              value: maleClients, 
              icon: User,
              gradient: 'from-blue-500 via-cyan-500 to-sky-500',
              bgGradient: 'from-blue-50 to-cyan-50',
              iconBg: 'bg-blue-100',
              textColor: 'text-blue-700',
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
                    <Icon size={28} className="text-gray-700" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
                  <p className={`text-4xl font-extrabold ${stat.textColor} mb-1`}>{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl text-red-700 flex items-center gap-4 shadow-lg">
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertTriangle size={24} className="text-red-700" />
            </div>
            <span className="font-semibold text-lg">{error}</span>
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

        {/* Client Selection */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users size={28} className="text-gray-700" /> Select a Client
          </h3>
          
          {clients.length === 0 ? (
            <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-purple-300 shadow-xl">
              <Users size={80} className="mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No clients found</h3>
              <p className="text-gray-600 text-lg">Add clients first to manage their measurements</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {clients.map((c) => {
                const genderConfig = {
                  male: { icon: User, gradient: 'from-blue-100 to-cyan-100', iconBg: 'bg-blue-100', borderColor: 'border-blue-200' },
                  female: { icon: UserCircle, gradient: 'from-pink-100 to-rose-100', iconBg: 'bg-pink-100', borderColor: 'border-pink-200' },
                  other: { icon: User, gradient: 'from-purple-100 to-violet-100', iconBg: 'bg-purple-100', borderColor: 'border-purple-200' }
                };
                const config = genderConfig[c.gender] || genderConfig.other;
                const Icon = config.icon;

                return (
                  <button
                    key={c._id}
                    onClick={() => handleClientSelect(c._id)}
                    className={`p-6 rounded-3xl border-2 ${config.borderColor} transition-all duration-300 text-left transform hover:scale-105 bg-white/80 backdrop-blur-sm hover:border-purple-400 hover:shadow-xl`}
                  >
                    <div className={`${config.iconBg} p-3 rounded-2xl inline-block mb-3`}>
                      <Icon size={32} className="text-gray-700" />
                    </div>
                    <p className="font-bold text-xl text-gray-900 truncate mb-1">{c.name}</p>
                    <p className="text-sm text-gray-600 capitalize mb-2">{c.gender}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Phone size={16} />
                      <span className="truncate">{c.phone}</span>
                    </div>
                    {c.measurementCount > 0 && (
                      <div className="mt-3 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                        <Ruler size={14} /> {c.measurementCount} measurements
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
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
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>
    </div>
  );
}
