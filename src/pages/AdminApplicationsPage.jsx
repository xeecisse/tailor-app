'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import { API_URL } from '../lib/api';


export default function AdminApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      const adminToken = localStorage.getItem('admin_token');
      const response = await axios.get(`${API_URL}/admin/tailors`, {
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      setApplications(response.data.tailors || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === 'verified') return app.isVerified;
    if (filter === 'pending') return !app.isVerified;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-navy-200 border-t-brand-navy-600 mb-4"></div>
            <p className="text-gray-700 font-bold">Loading applications...</p>
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
            <h1 className="text-3xl font-bold text-brand-navy">Tailor Applications</h1>
            <p className="text-gray-600 mt-1">Manage and review tailor registrations</p>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Filter Tabs */}
          <div className="flex gap-4 mb-6">
            {['all', 'pending', 'verified'].map((tab) => (
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

          {/* Applications Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Business Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Owner</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{app.businessName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{app.ownerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          app.isVerified
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {app.isVerified ? (
                          <>
                            <CheckCircle size={16} /> Verified
                          </>
                        ) : (
                          <>
                            <Clock size={16} /> Pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/applications/${app._id}`}
                        className="inline-flex items-center gap-2 text-brand-navy hover:text-brand-orange transition-all font-semibold"
                      >
                        <Eye size={18} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
