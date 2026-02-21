'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar';
import { API_URL } from '../../lib/api';

export default function AdminApplicationDetailPage() {
  const navigate = useNavigate();
  const { tailorId } = useParams();
  const [tailor, setTailor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchTailorDetails();
  }, [navigate, tailorId]);

  const fetchTailorDetails = async () => {
    try {
      const adminToken = localStorage.getItem('admin_token');
      const response = await axios.get(`${API_URL}/admin/tailors`, {
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      const tailor = response.data.tailors.find((t) => t._id === tailorId);
      setTailor(tailor);
    } catch (error) {
      console.error('Failed to fetch tailor details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const adminToken = localStorage.getItem('admin_token');
      await axios.patch(
        `${API_URL}/admin/tailors/${tailorId}/approve`,
        {},
        { headers: { 'Authorization': `Bearer ${adminToken}` } }
      );
      setTailor({ ...tailor, isVerified: true });
      alert('Tailor approved successfully');
    } catch (error) {
      console.error('Failed to approve tailor:', error);
      alert('Failed to approve tailor');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      const adminToken = localStorage.getItem('admin_token');
      await axios.patch(
        `${API_URL}/admin/tailors/${tailorId}/reject`,
        {},
        { headers: { 'Authorization': `Bearer ${adminToken}` } }
      );
      setTailor({ ...tailor, isVerified: false });
      alert('Tailor rejected');
    } catch (error) {
      console.error('Failed to reject tailor:', error);
      alert('Failed to reject tailor');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-navy-200 border-t-brand-navy-600 mb-4"></div>
            <p className="text-gray-700 font-bold">Loading application...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tailor) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <p className="text-gray-700 font-bold">Application not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/applications')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-brand-navy">Application Details</h1>
              <p className="text-gray-600 mt-1">{tailor.businessName}</p>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-brand-navy">Status</h2>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      tailor.isVerified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {tailor.isVerified ? (
                      <>
                        <CheckCircle size={18} /> Verified
                      </>
                    ) : (
                      <>
                        <Clock size={18} /> Pending
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Business Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-brand-navy mb-4">Business Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Business Name</label>
                    <p className="text-gray-900 font-medium">{tailor.businessName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Owner Name</label>
                    <p className="text-gray-900 font-medium">{tailor.ownerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Business Code</label>
                    <p className="text-gray-900 font-medium">{tailor.businessCode || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Registration Number</label>
                    <p className="text-gray-900 font-medium">{tailor.businessRegistration?.number || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-brand-navy mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Email</label>
                    <p className="text-gray-900 font-medium">{tailor.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Phone</label>
                    <p className="text-gray-900 font-medium">{tailor.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">WhatsApp Number</label>
                    <p className="text-gray-900 font-medium">{tailor.whatsappNumber}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-brand-navy mb-4">Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Street</label>
                    <p className="text-gray-900 font-medium">{tailor.address?.street || 'N/A'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">City</label>
                      <p className="text-gray-900 font-medium">{tailor.address?.city || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">State</label>
                      <p className="text-gray-900 font-medium">{tailor.address?.state || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Postal Code</label>
                    <p className="text-gray-900 font-medium">{tailor.address?.postalCode || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-bold text-brand-navy mb-4">Actions</h2>
                <div className="space-y-3">
                  {!tailor.isVerified && (
                    <>
                      <button
                        onClick={handleApprove}
                        disabled={actionLoading}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
                      >
                        <CheckCircle size={20} />
                        {actionLoading ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={actionLoading}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
                      >
                        <XCircle size={20} />
                        {actionLoading ? 'Processing...' : 'Reject'}
                      </button>
                    </>
                  )}
                  {tailor.isVerified && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 font-semibold text-center">Application Approved</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
