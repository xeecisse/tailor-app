'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Edit, 
  Plus, 
  User, 
  Users, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Building2, 
  Map, 
  Home, 
  FileText, 
  MessageSquare, 
  X,
  AlertTriangle
} from 'lucide-react';
import { clientAPI } from '../lib/api';

export default function ClientEditPage() {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const isEditMode = !!clientId && clientId !== 'new';

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsappNumber: '',
    gender: 'male',
    email: '',
    address: {
      street: '',
      city: '',
      state: 'Lagos',
    },
  });

  useEffect(() => {
    if (isEditMode) {
      fetchClient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const fetchClient = async () => {
    if (!clientId || clientId === 'new') return;
    
    try {
      setLoading(true);
      setError('');
      const response = await clientAPI.getById(clientId);
      const client = response.data.client;
      setFormData({
        name: client.name,
        phone: client.phone,
        whatsappNumber: client.whatsappNumber || '',
        gender: client.gender,
        email: client.email || '',
        address: client.address || { street: '', city: '', state: 'Lagos' },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch client');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.phone || !formData.gender) {
      setError('Name, phone, and gender are required');
      return;
    }

    try {
      setSaving(true);
      if (isEditMode) {
        await clientAPI.update(clientId, formData);
      } else {
        await clientAPI.create(formData);
      }
      navigate('/clients');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save client');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading client...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy-50 via-brand-orange-50 to-brand-navy-50">
      {/* Enhanced Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-brand-navy to-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-orange to-brand-navy rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-[550px] h-[550px] bg-gradient-to-br from-brand-navy to-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/clients')}
            className="inline-flex items-center gap-2 text-brand-navy hover:text-brand-navy-dark font-semibold mb-4 transition-all hover:gap-3 text-sm"
          >
            <ArrowLeft size={18} /> Back to Clients
          </button>
          
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-brand-navy to-brand-orange p-2 rounded-xl shadow-lg">
              {isEditMode ? <Edit size={24} className="text-white" /> : <Plus size={24} className="text-white" />}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-brand-navy via-brand-orange to-brand-orange-dark bg-clip-text text-transparent">
                {isEditMode ? 'Edit Client' : 'Add New Client'}
              </h1>
              <p className="text-gray-600 mt-1 text-sm font-medium">
                {isEditMode ? 'Update client information' : 'Create a new client profile'}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-xl text-red-700 flex items-center gap-3 shadow-lg">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle size={20} className="text-red-700" />
            </div>
            <span className="font-semibold text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border-2 border-brand-navy">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Information Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <User size={20} className="text-brand-navy" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Edit size={16} /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter client name"
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-brand-navy focus:ring-4 focus:ring-brand-navy-100 outline-none transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Users size={16} /> Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-brand-navy focus:ring-4 focus:ring-brand-navy-100 outline-none transition-all bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Phone size={20} className="text-brand-orange" /> Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone size={16} /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234..."
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-brand-navy focus:ring-4 focus:ring-brand-navy-100 outline-none transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageCircle size={16} /> WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="+234..."
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-brand-navy focus:ring-4 focus:ring-brand-navy-100 outline-none transition-all bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail size={16} /> Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@example.com"
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-brand-navy focus:ring-4 focus:ring-brand-navy-100 outline-none transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin size={20} className="text-brand-navy" /> Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Building2 size={16} /> City
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value },
                      })
                    }
                    placeholder="Lagos, Abuja, etc."
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-brand-navy focus:ring-4 focus:ring-brand-navy-100 outline-none transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Map size={16} /> State
                  </label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value },
                      })
                    }
                    placeholder="State"
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-brand-navy focus:ring-4 focus:ring-brand-navy-100 outline-none transition-all bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Home size={16} /> Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, street: e.target.value },
                      })
                    }
                    placeholder="Street address"
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-brand-navy focus:ring-4 focus:ring-brand-navy-100 outline-none transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white px-4 py-3 rounded-lg font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {saving ? 'Saving...' : isEditMode ? 'Update Client' : 'Create Client'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/clients')}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 px-4 py-3 rounded-lg font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <X size={16} /> Cancel
              </button>
            </div>
          </form>
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
