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
  PhoneOff
} from 'lucide-react';
import { orderAPI, measurementAPI } from '../lib/api';

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
    // If marking as completed or delivered, show confirmation dialog
    if (newStatus === 'completed' || newStatus === 'delivered') {
      setPendingStatus(newStatus);
      setShowNotificationDialog(true);
      setShowStatusForm(false);
      return;
    }

    // For other statuses, update directly
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setMessage(`Order status updated to ${newStatus}`);
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
      case 'completed':
        return { icon: CheckCircle, gradient: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50', text: 'text-green-700', label: 'Completed' };
      case 'delivered':
        return { icon: PartyPopper, gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50', text: 'text-blue-700', label: 'Delivered' };
      case 'in_progress':
        return { icon: Settings, gradient: 'from-orange-500 to-amber-500', bg: 'from-orange-50 to-amber-50', text: 'text-orange-700', label: 'In Progress' };
      case 'pending':
        return { icon: Clock, gradient: 'from-yellow-500 to-amber-500', bg: 'from-yellow-50 to-amber-50', text: 'text-yellow-700', label: 'Pending' };
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-all hover:gap-3"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Enhanced Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-[550px] h-[550px] bg-gradient-to-br from-orange-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4 transition-all hover:gap-3"
          >
            <ArrowLeft size={20} /> Back to Orders
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Order #{order?.orderNumber}
              </h1>
              <p className="text-gray-600 mt-2 text-lg font-medium">
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
          <div className="p-5 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl text-red-700 flex items-center gap-4 shadow-lg">
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertTriangle size={24} className="text-red-700" />
            </div>
            <span className="font-semibold text-lg">{error}</span>
          </div>
        )}
        {message && (
          <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl text-green-700 flex items-center gap-4 shadow-lg">
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle size={24} className="text-green-700" />
            </div>
            <span className="font-semibold text-lg">{message}</span>
          </div>
        )}

        {/* Status and Payment Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Card */}
          <div className={`bg-gradient-to-br ${statusConfig.bg} rounded-3xl p-8 shadow-lg border-2 ${statusConfig.text.replace('text-', 'border-')}-200`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`bg-gradient-to-br ${statusConfig.gradient} p-4 rounded-2xl shadow-md`}>
                  {React.createElement(statusConfig.icon, { size: 32, className: 'text-white' })}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Order Status</p>
                  <p className={`text-3xl font-extrabold ${statusConfig.text}`}>{statusConfig.label}</p>
                </div>
              </div>
              <button
                onClick={() => setShowStatusForm(!showStatusForm)}
                className="bg-white/80 hover:bg-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg"
              >
                Change
              </button>
            </div>
          </div>

          {/* Payment Card */}
          <div className={`bg-gradient-to-br ${paymentConfig.bg} rounded-3xl p-8 shadow-lg border-2 ${paymentConfig.text.replace('text-', 'border-')}-200`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`bg-gradient-to-br ${paymentConfig.gradient} p-4 rounded-2xl shadow-md`}>
                  {React.createElement(paymentConfig.icon, { size: 32, className: 'text-white' })}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Payment Status</p>
                  <p className={`text-3xl font-extrabold ${paymentConfig.text}`}>{paymentConfig.label}</p>
                </div>
              </div>
              {order?.paymentStatus !== 'paid' && (
                <button
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                  className="bg-white/80 hover:bg-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg"
                >
                  Add Payment
                </button>
              )}
            </div>
          </div>
        </div>


        {/* Status Change Form */}
        {showStatusForm && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                <Settings size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Update Order Status</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { status: 'pending', icon: Clock, label: 'Pending', gradient: 'from-yellow-500 to-amber-500' },
                { status: 'in_progress', icon: Settings, label: 'In Progress', gradient: 'from-orange-500 to-amber-500' },
                { status: 'completed', icon: CheckCircle, label: 'Completed', gradient: 'from-green-500 to-emerald-500' },
                { status: 'delivered', icon: PartyPopper, label: 'Delivered', gradient: 'from-blue-500 to-cyan-500' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                <button
                  key={item.status}
                  onClick={() => handleStatusChange(item.status)}
                  disabled={order?.status === item.status}
                  className={`bg-gradient-to-br ${item.gradient} ${
                    order?.status === item.status ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                  } text-white rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl transform`}
                >
                  <Icon size={32} className="mx-auto mb-2 text-white" />
                  <span className="text-sm font-bold">{item.label}</span>
                </button>
              )})}
            </div>
          </div>
        )}

        {/* Payment Form */}
        {showPaymentForm && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                <CreditCard size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Record Payment</h2>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Banknote size={20} /> Amount (₦)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                    placeholder="Enter amount"
                  />
                  {order?.amountRemaining > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Remaining: ₦{order.amountRemaining.toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign size={20} /> Payment Method
                  </label>
                  <select
                    value={paymentData.method}
                    onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                  >
                    <option value="cash">Cash</option>
                    <option value="transfer">Bank Transfer</option>
                    <option value="card">Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare size={20} /> Note (Optional)
                </label>
                <textarea
                  value={paymentData.note}
                  onChange={(e) => setPaymentData({ ...paymentData, note: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none bg-white"
                  placeholder="Add a note..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Save size={20} /> Save Payment
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentForm(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <X size={20} /> Cancel
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
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl">
                  <User size={28} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Client Information</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
                  <div className="flex items-center gap-3">
                    <User size={24} className="text-blue-700" />
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Name</p>
                      <p className="text-lg font-bold text-gray-900">{order?.clientId?.name || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                  <div className="flex items-center gap-3">
                    <Phone size={24} className="text-purple-700" />
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Phone</p>
                      <p className="text-lg font-bold text-gray-900">{order?.clientId?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {order?.clientId?.email && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                    <div className="flex items-center gap-3">
                      <Mail size={24} className="text-green-700" />
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Email</p>
                        <p className="text-lg font-bold text-gray-900">{order.clientId.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                  <ClipboardList size={28} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                  <div className="flex items-center gap-3">
                    <Shirt size={24} className="text-purple-700" />
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Attire Type</p>
                      <p className="text-lg font-bold text-gray-900">{order?.attireType || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {order?.expectedDeliveryDate && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200">
                    <div className="flex items-center gap-3">
                      <Calendar size={24} className="text-orange-700" />
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Expected Delivery</p>
                        <p className="text-lg font-bold text-gray-900">
                          {new Date(order.expectedDeliveryDate).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {order?.notes && (
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200">
                    <div className="flex items-start gap-3">
                      <MessageSquare size={24} className="text-amber-700" />
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">Notes</p>
                        <p className="text-gray-700">{order.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Financial Summary */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl">
                  <DollarSign size={28} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Financial Summary</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
                  <p className="text-sm font-semibold text-gray-600 mb-1">Total Price</p>
                  <p className="text-3xl font-extrabold text-blue-700">₦{order?.price?.toLocaleString()}</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                  <p className="text-sm font-semibold text-gray-600 mb-1">Amount Paid</p>
                  <p className="text-3xl font-extrabold text-green-700">₦{order?.amountPaid?.toLocaleString() || 0}</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border-2 border-red-200">
                  <p className="text-sm font-semibold text-gray-600 mb-1">Amount Remaining</p>
                  <p className="text-3xl font-extrabold text-red-700">₦{order?.amountRemaining?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>


            {/* Payment History */}
            {order?.payments && order.payments.length > 0 && (
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                    <FileText size={28} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
                </div>

                <div className="space-y-3">
                  {order.payments.map((payment, idx) => (
                    <div 
                      key={idx}
                      className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        {payment.method === 'cash' ? (
                          <Banknote size={24} className="text-purple-700" />
                        ) : payment.method === 'transfer' ? (
                          <DollarSign size={24} className="text-purple-700" />
                        ) : (
                          <CreditCard size={24} className="text-purple-700" />
                        )}
                        <span className="text-lg font-bold text-purple-700">
                          ₦{payment.amount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
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
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl">
                    <Ruler size={28} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Measurements</h2>
                </div>
                
                {measurement ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
                      <p className="text-sm font-semibold text-gray-600 mb-1">Attire Type</p>
                      <p className="text-lg font-bold text-blue-700">{measurement.attireName}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                        <Ruler size={20} /> Measurements
                      </p>
                      {Object.entries(measurement.measurements || {}).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-blue-200">
                          <span className="text-sm font-semibold text-gray-700 capitalize">{key}</span>
                          <span className="text-sm font-bold text-blue-600 bg-blue-100 px-4 py-1 rounded-lg">
                            {val.value} {val.unit}
                          </span>
                        </div>
                      ))}
                    </div>

                    {measurement.notes && (
                      <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200">
                        <div className="flex items-start gap-2">
                          <MessageSquare size={20} className="text-amber-700" />
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">Measurement Notes</p>
                            <p className="text-xs text-gray-700">{measurement.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/measurements/client/${order.clientId._id}`)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Eye size={20} /> View All Measurements
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Ruler size={40} className="mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-4">Loading measurements...</p>
                    <button
                      onClick={() => navigate(`/measurements/client/${order.clientId._id}`)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Eye size={20} /> View All Measurements
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
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-lg w-full border-2 border-purple-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl">
                <PartyPopper size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Order {pendingStatus === 'completed' ? 'Completed' : 'Delivered'}!
              </h3>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <Phone size={24} className="text-blue-700" />
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Send Client Notification?</p>
                    <p className="text-xs text-gray-600">
                      We'll send an SMS/WhatsApp message to <span className="font-bold">{order?.clientId?.name}</span> at{' '}
                      <span className="font-bold">{order?.clientId?.phone}</span> letting them know their order is ready.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                <div className="flex items-start gap-3">
                  <MessageSquare size={24} className="text-green-700" />
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-2">Message Preview:</p>
                    <p className="text-xs text-gray-700 italic bg-white/80 p-3 rounded-lg border border-green-300">
                      "Hello {order?.clientId?.name}, great news! Your {order?.attireType} order (#{order?.orderNumber}) is {pendingStatus === 'completed' ? 'completed and ready for pickup' : 'delivered'}. Thank you for your business! 🎉"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleConfirmStatusWithNotification(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Bell size={20} /> Yes, Send Notification
              </button>
              <button
                onClick={() => handleConfirmStatusWithNotification(false)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
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
