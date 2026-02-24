'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  CheckCircle,
  PartyPopper,
  Settings,
  Clock,
  ClipboardList,
  Heart,
  HeartCrack,
  User,
  Phone,
  Mail,
  Shirt,
  Calendar,
  MessageSquare,
  DollarSign,
  CreditCard,
  Banknote,
  FileText,
  Ruler,
  Eye,
  Save,
  X,
  AlertTriangle,
  Bell,
  PhoneOff,
  Image as ImageIcon,
  Download,
  ZoomIn
} from 'lucide-react';
import { orderAPI, measurementAPI, getImageUrl } from '../lib/api';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [measurement, setMeasurement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'cash',
    note: '',
  });

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await orderAPI.getById(orderId);
      setOrder(res.data.order);
      
      // Fetch measurement if measurementId exists
      const measurementId = res.data.order.measurementId?._id || res.data.order.measurementId;
      if (measurementId) {
        try {
          const measurementRes = await measurementAPI.getById(measurementId);
          setMeasurement(measurementRes.data.measurement);
        } catch (measurementErr) {
          console.error('Failed to fetch measurement:', measurementErr);
          // Don't set error, just log it - measurement is optional
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    // If marking as ready for pickup or delivered, show confirmation dialog
    if (newStatus === 'ready_for_pickup' || newStatus === 'delivered') {
      setPendingStatus(newStatus);
      setShowNotificationDialog(true);
      setShowStatusForm(false);
      return;
    }

    // For other statuses, update directly
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setMessage(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
      setShowStatusForm(false);
      fetchOrder();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleConfirmStatusWithNotification = async (sendNotification) => {
    try {
      await orderAPI.updateStatus(orderId, pendingStatus);
      
      if (sendNotification) {
        setMessage(`Order marked as ${pendingStatus}! 📱 Client notification sent via SMS/WhatsApp to ${order?.clientId?.phone}`);
      } else {
        setMessage(`Order marked as ${pendingStatus} (notification not sent)`);
      }
      
      setShowNotificationDialog(false);
      setPendingStatus(null);
      fetchOrder();
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
      setShowNotificationDialog(false);
      setPendingStatus(null);
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();

    if (!paymentData.amount) {
      setError('Please enter payment amount');
      return;
    }

    try {
      await orderAPI.recordPayment(orderId, {
        amount: parseFloat(paymentData.amount),
        method: paymentData.method,
        note: paymentData.note,
      });

      setMessage('Payment recorded successfully');
      setShowPaymentForm(false);
      setPaymentData({ amount: '', method: 'cash', note: '' });
      fetchOrder();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment');
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'measurement_taken':
        return { icon: Ruler, gradient: 'from-blue-500 to-blue-600', bg: 'from-blue-50 to-blue-100', text: 'text-blue-700', label: 'Measurement Taken' };
      case 'fabric_received':
        return { icon: Shirt, gradient: 'from-purple-500 to-purple-600', bg: 'from-purple-50 to-purple-100', text: 'text-purple-700', label: 'Fabric Received' };
      case 'sewing':
        return { icon: Settings, gradient: 'from-orange-500 to-orange-600', bg: 'from-orange-50 to-orange-100', text: 'text-orange-700', label: 'Sewing' };
      case 'ready_for_pickup':
        return { icon: CheckCircle, gradient: 'from-green-500 to-green-600', bg: 'from-green-50 to-green-100', text: 'text-green-700', label: 'Ready for Pickup' };
      case 'delivered':
        return { icon: PartyPopper, gradient: 'from-blue-900 to-blue-700', bg: 'from-blue-50 to-blue-100', text: 'text-blue-900', label: 'Delivered' };
      default:
        return { icon: ClipboardList, gradient: 'from-gray-500 to-gray-600', bg: 'from-gray-50 to-gray-100', text: 'text-gray-700', label: status };
    }
  };

  const getPaymentConfig = (status) => {
    switch (status) {
      case 'paid':
        return { icon: Heart, gradient: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50', text: 'text-green-700', label: 'Fully Paid' };
      case 'partial':
        return { icon: Heart, gradient: 'from-yellow-500 to-amber-500', bg: 'from-yellow-50 to-amber-50', text: 'text-yellow-700', label: 'Partially Paid' };
      default:
        return { icon: HeartCrack, gradient: 'from-red-500 to-pink-500', bg: 'from-red-50 to-pink-50', text: 'text-red-700', label: 'Unpaid' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-900 mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-blue-900 hover:text-blue-950 font-semibold transition-all hover:gap-3"
          >
            <ArrowLeft size={20} /> Back to Orders
          </button>
          <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl text-red-700 shadow-lg">
            <div className="flex items-center gap-4">
              <AlertTriangle size={32} className="text-red-700" />
              <span className="font-semibold text-lg">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order?.status);
  const paymentConfig = getPaymentConfig(order?.paymentStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Enhanced Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-200 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-200 to-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-[550px] h-[550px] bg-gradient-to-br from-blue-200 to-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-950 font-semibold mb-4 transition-all hover:gap-3"
          >
            <ArrowLeft size={20} /> Back to Orders
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-900 via-blue-800 to-orange-600 bg-clip-text text-transparent">
                Order #{order?.orderNumber}
              </h1>
              <p className="text-gray-600 mt-1 text-sm font-medium">
                Created on {new Date(order?.createdAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="p-5 bg-gradient-to-r from-brand-navy/10 to-brand-orange/10 border-2 border-brand-navy rounded-2xl text-brand-navy flex items-center gap-4 shadow-lg">
            <div className="bg-brand-navy/20 p-3 rounded-xl">
              <AlertTriangle size={24} className="text-brand-navy" />
            </div>
            <span className="font-semibold text-lg">{error}</span>
          </div>
        )}
        {message && (
          <div className="p-5 bg-gradient-to-r from-brand-orange/10 to-brand-navy/10 border-2 border-brand-orange rounded-2xl text-brand-navy flex items-center gap-4 shadow-lg">
            <div className="bg-brand-orange/20 p-3 rounded-xl">
              <CheckCircle size={24} className="text-brand-orange" />
            </div>
            <span className="font-semibold text-lg">{message}</span>
          </div>
        )}

        {/* Status and Payment Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Card */}
          <div className={`bg-gradient-to-br from-brand-navy/10 to-brand-orange/10 rounded-2xl p-6 shadow-lg border-2 border-brand-navy`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`bg-gradient-to-br from-brand-navy to-brand-orange p-2 rounded-lg shadow-md`}>
                  {React.createElement(statusConfig.icon, { size: 24, className: 'text-white' })}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600">Order Status</p>
                  <p className={`text-xl font-extrabold text-brand-navy`}>{statusConfig.label}</p>
                </div>
              </div>
              <button
                onClick={() => setShowStatusForm(!showStatusForm)}
                className="bg-white/80 hover:bg-white px-3 py-1 rounded-lg font-bold text-xs transition-all shadow-md hover:shadow-lg text-brand-navy"
              >
                Change
              </button>
            </div>
          </div>

          {/* Payment Card */}
          <div className={`bg-gradient-to-br from-brand-orange/10 to-brand-navy/10 rounded-2xl p-6 shadow-lg border-2 border-brand-orange`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`bg-gradient-to-br from-brand-orange to-brand-navy p-2 rounded-lg shadow-md`}>
                  {React.createElement(paymentConfig.icon, { size: 24, className: 'text-white' })}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600">Payment Status</p>
                  <p className={`text-xl font-extrabold text-brand-orange`}>{paymentConfig.label}</p>
                </div>
              </div>
              {order?.paymentStatus !== 'paid' && (
                <button
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                  className="bg-white/80 hover:bg-white px-3 py-1 rounded-lg font-bold text-xs transition-all shadow-md hover:shadow-lg text-brand-navy"
                >
                  Add Payment
                </button>
              )}
            </div>
          </div>
        </div>


        {/* Status Change Form */}
        {showStatusForm && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border-2 border-blue-900">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-blue-900 to-orange-600 p-2 rounded-lg">
                <Settings size={20} className="text-white" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Update Order Status</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { status: 'measurement_taken', icon: Ruler, label: 'Measurement Taken', gradient: 'from-blue-500 to-blue-600' },
                { status: 'fabric_received', icon: Shirt, label: 'Fabric Received', gradient: 'from-purple-500 to-purple-600' },
                { status: 'sewing', icon: Settings, label: 'Sewing', gradient: 'from-orange-500 to-orange-600' },
                { status: 'ready_for_pickup', icon: CheckCircle, label: 'Ready for Pickup', gradient: 'from-green-500 to-green-600' },
                { status: 'delivered', icon: PartyPopper, label: 'Delivered', gradient: 'from-blue-900 to-blue-700' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                <button
                  key={item.status}
                  onClick={() => handleStatusChange(item.status)}
                  disabled={order?.status === item.status}
                  className={`bg-gradient-to-br ${item.gradient} ${
                    order?.status === item.status ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                  } text-white rounded-lg p-4 transition-all duration-300 shadow-lg hover:shadow-xl transform`}
                >
                  <Icon size={24} className="mx-auto mb-1 text-white" />
                  <span className="text-xs font-bold">{item.label}</span>
                </button>
              )})}
            </div>
          </div>
        )}

        {/* Payment Form */}
        {showPaymentForm && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border-2 border-blue-900">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-blue-900 to-orange-600 p-2 rounded-lg">
                <CreditCard size={20} className="text-white" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Record Payment</h2>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-2">
                    <Banknote size={16} /> Amount (₦)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white text-sm"
                    placeholder="Enter amount"
                  />
                  {order?.amountRemaining > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      Remaining: ₦{order.amountRemaining.toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-2">
                    <DollarSign size={16} /> Payment Method
                  </label>
                  <select
                    value={paymentData.method}
                    onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white text-sm"
                  >
                    <option value="cash">Cash</option>
                    <option value="transfer">Bank Transfer</option>
                    <option value="card">Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-2">
                  <MessageSquare size={16} /> Note (Optional)
                </label>
                <textarea
                  value={paymentData.note}
                  onChange={(e) => setPaymentData({ ...paymentData, note: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none bg-white text-sm"
                  placeholder="Add a note..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 to-orange-600 hover:from-blue-950 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                >
                  <Save size={16} /> Save Payment
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentForm(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 px-4 py-2 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Information */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border-2 border-blue-900">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-2 rounded-lg">
                  <User size={20} className="text-white" />
                </div>
                <h2 className="text-base font-bold text-gray-900">Client Information</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-br from-brand-navy/10 to-brand-orange/10 rounded-lg border-2 border-brand-navy">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-brand-navy" />
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Name</p>
                      <p className="text-sm font-bold text-gray-900">{order?.clientId?.name || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-br from-brand-orange/10 to-brand-navy/10 rounded-lg border-2 border-brand-orange">
                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-brand-orange" />
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Phone</p>
                      <p className="text-sm font-bold text-gray-900">{order?.clientId?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {order?.clientId?.email && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-br from-brand-navy/10 to-brand-orange/10 rounded-lg border-2 border-brand-navy">
                    <div className="flex items-center gap-2">
                      <Mail size={18} className="text-brand-navy" />
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Email</p>
                        <p className="text-sm font-bold text-gray-900">{order.clientId.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border-2 border-blue-900">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-blue-900 to-orange-600 p-2 rounded-lg">
                  <ClipboardList size={20} className="text-white" />
                </div>
                <h2 className="text-base font-bold text-gray-900">Order Details</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-br from-brand-navy/10 to-brand-orange/10 rounded-lg border-2 border-brand-navy">
                  <div className="flex items-center gap-2">
                    <Shirt size={18} className="text-brand-navy" />
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Attire Type</p>
                      <p className="text-sm font-bold text-gray-900">{order?.attireType || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {order?.expectedDeliveryDate && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-br from-brand-orange/10 to-brand-navy/10 rounded-lg border-2 border-brand-orange">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-brand-orange" />
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Expected Delivery</p>
                        <p className="text-sm font-bold text-gray-900">
                          {new Date(order.expectedDeliveryDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {order?.notes && (
                  <div className="p-3 bg-gradient-to-br from-brand-navy/10 to-brand-orange/10 rounded-lg border-2 border-brand-navy">
                    <div className="flex items-start gap-2">
                      <MessageSquare size={18} className="text-brand-navy" />
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Notes</p>
                        <p className="text-xs text-gray-700">{order.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fabric Images Section */}
            {order?.fabricImages && order.fabricImages.length > 0 && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border-2 border-brand-orange">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-br from-brand-orange to-brand-navy p-2 rounded-lg">
                    <ImageIcon size={20} className="text-white" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">Fabric Images</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {order.fabricImages.map((imageUrl, idx) => (
                    <div
                      key={idx}
                      className="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-brand-orange hover:border-brand-navy transition-all duration-300 shadow-lg hover:shadow-xl"
                      onClick={() => setSelectedImage(getImageUrl(imageUrl))}
                    >
                      <img
                        src={getImageUrl(imageUrl)}
                        alt={`Fabric ${idx + 1}`}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          console.error(`Failed to load image: ${imageUrl}`);
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EImage not found%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  ))}
                </div>

                {order.fabricImages.length > 0 && (
                  <div className="mt-4 p-3 bg-gradient-to-br from-brand-orange/10 to-brand-navy/10 rounded-lg border-2 border-brand-orange">
                    <p className="text-xs text-gray-700">
                      <span className="font-bold text-brand-orange">{order.fabricImages.length}</span> fabric image{order.fabricImages.length !== 1 ? 's' : ''} uploaded. Click any image to view in full size.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Financial Summary */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border-2 border-blue-900">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-blue-900 to-orange-600 p-2 rounded-lg">
                  <DollarSign size={20} className="text-white" />
                </div>
                <h2 className="text-base font-bold text-gray-900">Financial Summary</h2>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-br from-brand-navy/10 to-brand-orange/10 rounded-lg border-2 border-brand-navy">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Total Price</p>
                  <p className="text-2xl font-extrabold text-brand-navy">₦{order?.price?.toLocaleString()}</p>
                </div>

                <div className="p-3 bg-gradient-to-br from-brand-orange/10 to-brand-navy/10 rounded-lg border-2 border-brand-orange">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Amount Paid</p>
                  <p className="text-2xl font-extrabold text-brand-orange">₦{order?.amountPaid?.toLocaleString() || 0}</p>
                </div>

                <div className="p-3 bg-gradient-to-br from-brand-navy/10 to-brand-orange/10 rounded-lg border-2 border-brand-navy">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Amount Remaining</p>
                  <p className="text-2xl font-extrabold text-brand-navy">₦{order?.amountRemaining?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>


            {/* Payment History */}
            {order?.payments && order.payments.length > 0 && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border-2 border-blue-900">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-br from-blue-900 to-orange-600 p-2 rounded-lg">
                    <FileText size={20} className="text-white" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">Payment History</h2>
                </div>

                <div className="space-y-2">
                  {order.payments.map((payment, idx) => (
                    <div 
                      key={idx}
                      className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200"
                    >
                      <div className="flex items-center justify-between mb-1">
                        {payment.method === 'cash' ? (
                          <Banknote size={18} className="text-blue-900" />
                        ) : payment.method === 'transfer' ? (
                          <DollarSign size={18} className="text-blue-900" />
                        ) : (
                          <CreditCard size={18} className="text-blue-900" />
                        )}
                        <span className="text-sm font-bold text-blue-900">
                          ₦{payment.amount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-0.5">
                        <p className="font-semibold capitalize">{payment.method}</p>
                        <p>{new Date(payment.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                        {payment.note && <p className="italic">"{payment.note}"</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Measurements Reference */}
            {order?.measurementId && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border-2 border-blue-900">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-2 rounded-lg">
                    <Ruler size={20} className="text-white" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">Measurements</h2>
                </div>
                
                {measurement ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Attire Type</p>
                      <p className="text-sm font-bold text-blue-900">{measurement.attireName}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                        <Ruler size={16} /> Measurements
                      </p>
                      {Object.entries(measurement.measurements || {}).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-blue-200">
                          <span className="text-xs font-semibold text-gray-700 capitalize">{key}</span>
                          <span className="text-xs font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                            {val.value} {val.unit}
                          </span>
                        </div>
                      ))}
                    </div>

                    {measurement.notes && (
                      <div className="p-3 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg border-2 border-amber-200">
                        <div className="flex items-start gap-2">
                          <MessageSquare size={16} className="text-amber-700" />
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-0.5">Measurement Notes</p>
                            <p className="text-xs text-gray-700">{measurement.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/measurements/client/${order.clientId._id}`)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-950 hover:to-blue-800 text-white px-3 py-2 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                    >
                      <Eye size={16} /> View All Measurements
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Ruler size={32} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-600 mb-3">Loading measurements...</p>
                    <button
                      onClick={() => navigate(`/measurements/client/${order.clientId._id}`)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-950 hover:to-blue-800 text-white px-3 py-2 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                    >
                      <Eye size={16} /> View All Measurements
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Confirmation Dialog */}
      {showNotificationDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-lg w-full border-2 border-brand-navy">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-brand-navy to-brand-orange p-3 rounded-xl">
                <PartyPopper size={32} className="text-white" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-brand-navy to-brand-orange bg-clip-text text-transparent">
                Order {pendingStatus === 'ready_for_pickup' ? 'Ready for Pickup' : 'Delivered'}!
              </h3>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-brand-navy/10 to-brand-orange/10 rounded-2xl border-2 border-brand-navy">
                <div className="flex items-start gap-3">
                  <Phone size={24} className="text-brand-navy" />
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Send Client Notification?</p>
                    <p className="text-xs text-gray-600">
                      We'll send an SMS/WhatsApp message to <span className="font-bold">{order?.clientId?.name}</span> at{' '}
                      <span className="font-bold">{order?.clientId?.phone}</span> letting them know their order is {pendingStatus === 'ready_for_pickup' ? 'ready for pickup' : 'delivered'}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-brand-orange/10 to-brand-navy/10 rounded-2xl border-2 border-brand-orange">
                <div className="flex items-start gap-3">
                  <MessageSquare size={24} className="text-brand-orange" />
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-2">Message Preview:</p>
                    <p className="text-xs text-gray-700 italic bg-white/80 p-3 rounded-lg border border-brand-orange">
                      "Hello {order?.clientId?.name}, great news! Your {order?.attireType} order (#{order?.orderNumber}) is {pendingStatus === 'ready_for_pickup' ? 'ready for pickup' : 'delivered'}. Thank you for your business! 🎉"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleConfirmStatusWithNotification(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Bell size={20} /> Yes, Send Notification
              </button>
              <button
                onClick={() => handleConfirmStatusWithNotification(false)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-navy/60 to-brand-navy/40 hover:from-brand-navy/80 hover:to-brand-navy/60 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <PhoneOff size={20} /> Skip Notification
              </button>
            </div>

            <button
              onClick={() => {
                setShowNotificationDialog(false);
                setPendingStatus(null);
              }}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 px-6 py-3 rounded-xl font-bold transition-all duration-300"
            >
              <X size={20} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Fabric preview"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            >
              <X size={28} />
            </button>
            <a
              href={selectedImage}
              download
              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              title="Download image"
            >
              <Download size={28} />
            </a>
          </div>
        </div>
      )}

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
