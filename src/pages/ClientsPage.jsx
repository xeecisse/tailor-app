'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../lib/api';
import { 
  Users, 
  CheckCircle, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Eye, 
  Edit, 
  Trash2,
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Clients</h1>
            <p className="text-gray-600 mt-1">Manage your client relationships</p>
          </div>
          <button
            onClick={() => navigate('/clients/new')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={20} /> Add Client
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Clients', value: clients.length, icon: Users, color: 'brand-navy' },
            { label: 'Active Clients', value: clients.filter(c => (c.orderCount || 0) > 0).length, icon: CheckCircle, color: 'brand-orange' },
            { label: 'Female', value: clients.filter(c => c.gender === 'female').length, icon: Users, color: 'brand-navy' },
            { label: 'Male', value: clients.filter(c => c.gender === 'male').length, icon: Users, color: 'brand-orange' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-lg shadow p-6 border-l-4 border-brand-navy">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-brand-navy mt-2">{stat.value}</p>
                  </div>
                  <div className="bg-brand-navy-50 p-3 rounded-lg">
                    <Icon size={24} className="text-brand-navy" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700 flex items-center gap-3">
            <AlertTriangle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent outline-none text-sm"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-navy-200 border-t-brand-navy mb-4"></div>
              <p className="text-gray-700 font-medium">Loading clients...</p>
            </div>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <Users size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-800 font-semibold mb-2">No clients yet</p>
            <p className="text-gray-600 text-sm">Add your first client to get started</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-semibold text-gray-900">{client.name}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} className="text-gray-400" />
                          {client.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          {client.email || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 capitalize">{client.gender}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-brand-navy">{client.orderCount || 0}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(client.orderCount || 0) > 0 ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            <CheckCircle size={14} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/clients/${client._id}`)}
                            className="p-2 text-brand-navy hover:bg-brand-navy-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => navigate(`/clients/${client._id}/edit`)}
                            className="p-2 text-brand-orange hover:bg-brand-orange-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
