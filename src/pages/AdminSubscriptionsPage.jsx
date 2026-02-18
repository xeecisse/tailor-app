'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, AlertCircle, CheckCircle, Clock, Edit2 } from 'lucide-react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminSubscriptionsPage() {
  const navigate = useNavigate();
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedTailor, setSelectedTailor] = useState(null);
  const [formData, setFormData] = useState({
    plan: 'monthly',
    months: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  const planPrices = {
    monthly: { price: 10000, months: 1 },
    quarterly: { price: 27000, months: 3 },
    annual: { price: 96000, months: 12 },
  };

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchTailors();
  }, [navigate]);

  const fetchTailors = async () => {
    try {
      const adminToken = localStorage.getItem('admin_token');
      const response = await axios.get(`${API_URL}/admin/tailors`, {
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      setTailors(response.data.tailors || []);
    } catch (error) {
      console.error('Failed to fetch tailors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionStatus = (tailor) => {
    if (!tailor.subscriptionEndDate) return 'inactive';
    const endDate = new Date(tailor.subscriptionEndDate);
    const today = new Date();
    if (endDate < today) return 'expired';
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 7) return 'expiring';
    return 'active';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysLeft = (endDate) => {
    if (!endDate) return 'N/A';
    const today = new Date();
    const end = new Date(endDate);
    const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} days` : 'Expired';
  };

  const handleResubscribe = (tailor) => {
    setSelectedTailor(tailor);
    setFormData({ plan: tailor.subscriptionPlan || 'monthly', months: planPrices[tailor.subscriptionPlan || 'monthly']?.months || 1 });
    setShowModal(true);
  };

  const handleSubmitResubscribe = async () => {
    setSubmitting(true);
    try {
      const adminToken = localStorage.getItem('admin_token');
      await axios.patch(
        `${API_URL}/admin/tailors/${selectedTailor._id}/resubscribe`,
        {
          plan: formData.plan,
          months: planPrices[formData.plan]?.months || 1,
        },
        { headers: { 'Authorization': `Bearer ${adminToken}` } }
      );
      
      // Update local state
      setTailors(
        tailors.map((t) =>
          t._id === selectedTailor._id
            ? {
                ...t,
                subscriptionPlan: formData.plan,
                subscriptionEndDate: new Date(
                  Date.now() + (planPrices[formData.plan]?.months || 1) * 30 * 24 * 60 * 60 * 1000
                ),
              }
            : t
        )
      );
      
      setShowModal(false);
      alert('Subscription updated successfully');
    } catch (error) {
      console.error('Failed to resubscribe:', error);
      alert('Failed to update subscription');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTailors = tailors.filter((tailor) => {
    if (filter === 'active') return getSubscriptionStatus(tailor) === 'active';
    if (filter === 'expiring') return getSubscriptionStatus(tailor) === 'expiring';
    if (filter === 'expired') return getSubscriptionStatus(tailor) === 'expired';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-navy-200 border-t-brand-navy-600 mb-4"></div>
            <p className="text-gray-700 font-bold">Loading subscriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-brand-navy">Subscriptions</h1>
            <p className="text-gray-600 mt-1">Manage tailor subscriptions and expiry dates</p>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Filter Tabs */}
          <div className="flex gap-4 mb-6 flex-wrap">
            {['all', 'active', 'expiring', 'expired'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === tab
                    ? 'bg-brand-navy text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Subscriptions Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Business Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Owner</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Plan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Expiry Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Days Left</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTailors.map((tailor) => {
                  const status = getSubscriptionStatus(tailor);
                  return (
                    <tr key={tailor._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{tailor.businessName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{tailor.ownerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          {tailor.subscriptionPlan?.charAt(0).toUpperCase() + tailor.subscriptionPlan?.slice(1) || 'Free'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-500" />
                          {formatDate(tailor.subscriptionEndDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{getDaysLeft(tailor.subscriptionEndDate)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                            status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : status === 'expiring'
                              ? 'bg-yellow-100 text-yellow-700'
                              : status === 'expired'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {status === 'active' && <CheckCircle size={16} />}
                          {status === 'expiring' && <AlertCircle size={16} />}
                          {status === 'expired' && <AlertCircle size={16} />}
                          {status === 'inactive' && <Clock size={16} />}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleResubscribe(tailor)}
                          className="inline-flex items-center gap-2 text-brand-navy hover:text-brand-orange transition-all font-semibold"
                        >
                          <Edit2 size={18} /> Renew
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredTailors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 font-semibold">No subscriptions found</p>
              </div>
            )}
          </div>

          {/* Resubscribe Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-2xl font-bold text-brand-navy mb-4">Renew Subscription</h2>
                <p className="text-gray-600 mb-6">{selectedTailor?.businessName}</p>

                <div className="space-y-4">
                  {/* Plan Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subscription Plan
                    </label>
                    <select
                      value={formData.plan}
                      onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    >
                      <option value="monthly">Monthly - ₦10,000</option>
                      <option value="quarterly">Quarterly - ₦27,000</option>
                      <option value="annual">Annual - ₦96,000</option>
                    </select>
                  </div>

                  {/* Duration Display */}
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">Duration: <span className="font-bold">{planPrices[formData.plan]?.months || 1} months</span></p>
                    <p className="text-sm text-gray-600">Price: <span className="font-bold">₦{(planPrices[formData.plan]?.price || 10000).toLocaleString()}</span></p>
                  </div>

                  {/* New Expiry Date Preview */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">New Expiry Date:</p>
                    <p className="text-lg font-bold text-brand-navy">
                      {new Date(
                        Date.now() + (planPrices[formData.plan]?.months || 1) * 30 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitResubscribe}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-brand-navy text-white font-semibold rounded-lg hover:bg-brand-navy-dark transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Processing...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
