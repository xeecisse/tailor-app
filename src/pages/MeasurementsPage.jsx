'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  User, 
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-navy-200 border-t-brand-navy mb-4"></div>
          <p className="text-gray-700 font-medium">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-brand-navy to-brand-orange p-3 rounded-lg shadow">
              <Ruler size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-brand-navy">Measurements</h1>
              <p className="text-gray-600 mt-1 text-sm">Select a client to view and manage their measurements</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { 
              label: 'Total Clients', 
              value: clients.length, 
              icon: Users,
              borderColor: 'border-brand-navy'
            },
            { 
              label: 'Female Clients', 
              value: femaleClients, 
              icon: User,
              borderColor: 'border-brand-orange'
            },
            { 
              label: 'Male Clients', 
              value: maleClients, 
              icon: User,
              borderColor: 'border-brand-navy'
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className={`bg-white rounded-lg p-6 shadow border-l-4 ${stat.borderColor}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon size={28} className={stat.borderColor === 'border-brand-navy' ? 'text-brand-navy' : 'text-brand-orange'} />
                </div>
                <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.borderColor === 'border-brand-navy' ? 'text-brand-navy' : 'text-brand-orange'}`}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700 flex items-center gap-3">
            <AlertTriangle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8 relative">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent outline-none text-sm"
          />
        </div>

        {/* Client Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={24} className="text-brand-navy" /> Select a Client
          </h3>
          
          {clients.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
              <Users size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No clients found</h3>
              <p className="text-gray-600">Add clients first to manage their measurements</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {clients.map((c) => {
                const isFemale = c.gender === 'female';
                const borderColor = isFemale ? 'border-brand-orange' : 'border-brand-navy';
                const bgColor = isFemale ? 'bg-brand-orange-50' : 'bg-brand-navy-50';
                const textColor = isFemale ? 'text-brand-orange' : 'text-brand-navy';

                return (
                  <button
                    key={c._id}
                    onClick={() => handleClientSelect(c._id)}
                    className={`p-4 rounded-lg border-l-4 ${borderColor} transition-all duration-300 text-left transform hover:shadow-lg bg-white hover:${bgColor}`}
                  >
                    <div className={`${textColor} mb-2`}>
                      <User size={24} />
                    </div>
                    <p className="font-bold text-base text-gray-900 truncate mb-1">{c.name}</p>
                    <p className="text-xs text-gray-600 capitalize mb-2">{c.gender}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Phone size={12} />
                      <span className="truncate">{c.phone}</span>
                    </div>
                    {c.measurementCount > 0 && (
                      <div className={`${bgColor} ${textColor} px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1`}>
                        <Ruler size={12} /> {c.measurementCount}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
