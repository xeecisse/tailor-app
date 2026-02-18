'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Calendar, Package, Ruler, DollarSign, Phone, Mail, MapPin, MessageSquare, User } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-navy-200 border-t-brand-navy mb-4"></div>
          <p className="text-gray-700 font-medium">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2 text-brand-navy hover:text-brand-navy-dark font-semibold transition-all"
          >
            <ArrowLeft size={20} /> Back to Clients
          </button>
          <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded text-red-700">
            <span className="font-medium">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2 text-brand-navy hover:text-brand-navy-dark font-semibold transition-all"
          >
            <ArrowLeft size={20} /> Back to Clients
          </button>
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <User size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-800 text-xl font-bold">Client not found</p>
          </div>
        </div>
      </div>
    );
  }

  const totalOrders = client.orders?.length || 0;
  const totalMeasurements = client.measurements?.length || 0;
  const totalSpent = client.orders?.reduce((sum, order) => sum + (order.price || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/clients')}
            className="inline-flex items-center gap-2 text-brand-navy hover:text-brand-navy-dark font-semibold mb-6 transition-all"
          >
            <ArrowLeft size={20} /> Back to Clients
          </button>
        </div>

        {/* Client Profile Card */}
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-brand-navy mb-8">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-brand-navy to-brand-orange p-8 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-lg">
                  <User size={40} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{client.name}</h1>
                  <p className="text-base opacity-90 capitalize font-semibold flex items-center gap-2">
                    {client.gender}
                  </p>
                  {client.createdAt && (
                    <p className="text-sm opacity-75 mt-2 flex items-center gap-2">
                      <Calendar size={14} /> Member since {new Date(client.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/clients/${clientId}/edit`)}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold transition-all text-sm"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-500/80 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition-all text-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50">
            <div className="bg-white rounded-lg p-6 shadow border-l-4 border-brand-navy">
              <div className="flex items-center justify-between mb-3">
                <Package className="text-brand-navy" size={28} />
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-brand-navy">{totalOrders}</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow border-l-4 border-brand-orange">
              <div className="flex items-center justify-between mb-3">
                <Ruler className="text-brand-orange" size={28} />
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Measurements</p>
              <p className="text-3xl font-bold text-brand-orange">{totalMeasurements}</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow border-l-4 border-brand-navy">
              <div className="flex items-center justify-between mb-3">
                <DollarSign className="text-brand-navy" size={28} />
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Spent</p>
              <p className="text-3xl font-bold text-brand-navy">₦{totalSpent.toLocaleString()}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-8 bg-white border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Phone size={24} className="text-brand-navy" /> Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-brand-navy">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-navy-100 p-3 rounded-lg">
                    <Phone size={20} className="text-brand-navy" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-600 uppercase">Phone Number</p>
                    <p className="text-lg font-bold text-gray-900">{client.phone}</p>
                  </div>
                </div>
              </div>

              {client.whatsappNumber && (
                <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <MessageSquare size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase">WhatsApp</p>
                      <p className="text-lg font-bold text-gray-900">{client.whatsappNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {client.email && (
                <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-brand-orange">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-orange-100 p-3 rounded-lg">
                      <Mail size={20} className="text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase">Email Address</p>
                      <p className="text-lg font-bold text-gray-900 break-all">{client.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {client.address?.city && (
                <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-brand-navy">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-navy-100 p-3 rounded-lg">
                      <MapPin size={20} className="text-brand-navy" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase">Location</p>
                      <p className="text-lg font-bold text-gray-900">
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
              <div className="mt-6 bg-gray-50 border-l-4 border-brand-orange p-5 rounded-lg">
                <div className="flex items-start gap-3">
                  <MessageSquare size={20} className="text-brand-orange flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-2">Notes</p>
                    <p className="text-gray-700 font-medium leading-relaxed">{client.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Measurements Section */}
        {client.measurements && client.measurements.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg border-l-4 border-brand-orange p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Ruler size={28} className="text-brand-orange" /> Measurements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {client.measurements.map((m) => (
                <div key={m._id} className="bg-gray-50 p-6 rounded-lg border-l-4 border-brand-orange hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <Ruler size={24} className="text-brand-orange" />
                    <span className="bg-brand-orange text-white px-3 py-1 rounded-full text-xs font-bold">
                      {Object.keys(m.measurements || {}).length} items
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{m.attireName}</h3>
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
          <div className="bg-white rounded-lg shadow-lg border-l-4 border-brand-navy p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Package size={28} className="text-brand-navy" /> Orders History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left font-bold text-gray-800 text-sm">Order #</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-800 text-sm">Attire</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-800 text-sm">Status</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-800 text-sm">Payment</th>
                    <th className="px-6 py-4 text-right font-bold text-gray-800 text-sm">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {client.orders.map((order, idx) => (
                    <tr 
                      key={order._id} 
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-bold text-brand-navy text-sm">{order.orderNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800 text-sm">{order.attireType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-2 ${
                            order.status === 'completed' || order.status === 'delivered'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-2 ${
                            order.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : order.paymentStatus === 'partial'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-gray-900 text-sm">₦{order.price?.toLocaleString() || 0}</span>
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
          <div className="bg-white rounded-lg shadow-lg p-16 text-center border border-gray-200">
            <Package size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Activity Yet</h3>
            <p className="text-gray-600">No measurements or orders have been created for this client</p>
          </div>
        )}
      </div>
    </div>
  );
}
