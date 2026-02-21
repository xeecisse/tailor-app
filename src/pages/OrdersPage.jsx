'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, clientAPI, measurementAPI, uploadAPI } from '../lib/api';
import {
  DollarSign,
  Clock,
  Settings,
  CheckCircle,
  PartyPopper,
  ClipboardList,
  Heart,
  HeartCrack,
  Plus,
  User,
  Ruler,
  Calendar,
  MessageSquare,
  Camera,
  X,
  Save,
  Search,
  Package,
  AlertTriangle,
  Eye,
  CreditCard,
  Trash2,
  Sparkles,
  Play
} from 'lucide-react';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [filteredMeasurements, setFilteredMeasurements] = useState([]);
  const [paymentForm, setPaymentForm] = useState(null);

  const [formData, setFormData] = useState({
    clientId: '',
    measurementId: '',
    attireType: '',
    price: '',
    expectedDeliveryDate: '',
    fabricImages: [],
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadConfigured, setUploadConfigured] = useState(true);
  const [useCloudinary, setUseCloudinary] = useState(false);

  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'cash',
    note: '',
  });

  useEffect(() => {
    fetchInitialData();
    checkUploadStatus();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError('');
      const [ordersRes, clientsRes] = await Promise.all([
        orderAPI.getAll(),
        clientAPI.getAll('active'),
      ]);

      setOrders(ordersRes.data.orders);
      setClients(clientsRes.data.clients);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const checkUploadStatus = async () => {
    try {
      const res = await uploadAPI.getStatus();
      setUploadConfigured(res.data.configured);
      setUseCloudinary(res.data.useCloudinary);
    } catch (err) {
      console.error('Failed to check upload status:', err);
      setUploadConfigured(true); // Local storage is always available
      setUseCloudinary(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getAll(filterStatus || undefined);
      setOrders(res.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    }
  };

  const handleClientSelect = async (clientId) => {
    setSelectedClient(clientId);
    setFormData({ ...formData, clientId });

    if (clientId) {
      try {
        const res = await measurementAPI.getByClient(clientId);
        setFilteredMeasurements(res.data.measurements);
      } catch (err) {
        console.error('Failed to fetch measurements:', err);
      }
    }
  };

  const handleMeasurementSelect = (measurementId) => {
    const measurement = filteredMeasurements.find((m) => m._id === measurementId);
    if (measurement) {
      setFormData({
        ...formData,
        measurementId,
        attireType: measurement.attireName,
      });
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.clientId || !formData.measurementId || !formData.price) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setUploadingImages(true);
      
      // Upload images first if any selected
      let fabricImageUrls = [];
      if (selectedImages.length > 0) {
        try {
          const uploadRes = await uploadAPI.uploadMultiple(selectedImages);
          fabricImageUrls = uploadRes.data.files.map(file => file.url);
        } catch (uploadErr) {
          console.error('Image upload failed:', uploadErr);
          console.error('Upload error response:', uploadErr.response?.data);
          
          // Check if it's a configuration error
          if (uploadErr.response?.data?.configured === false) {
            setError('⚠️ Image upload not configured. Order will be created without images. To enable image uploads, add Cloudinary credentials to backend/.env file.');
          } else {
            setError('Failed to upload images. Creating order without images.');
          }
          
          // Continue without images
          fabricImageUrls = [];
        }
      }

      // Create order with or without image URLs
      await orderAPI.create({
        clientId: formData.clientId,
        measurementId: formData.measurementId,
        attireType: formData.attireType,
        price: parseFloat(formData.price),
        expectedDeliveryDate: formData.expectedDeliveryDate,
        fabricImages: fabricImageUrls,
      });

      setMessage('Order created successfully' + (selectedImages.length > 0 && fabricImageUrls.length === 0 ? ' (without images)' : ''));
      setShowForm(false);
      setFormData({
        clientId: '',
        measurementId: '',
        attireType: '',
        price: '',
        expectedDeliveryDate: '',
        fabricImages: [],
      });
      setSelectedImages([]);
      fetchOrders();
      setTimeout(() => {
        setMessage('');
        setError('');
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    setSelectedImages([...selectedImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setMessage(`Order status updated to ${newStatus}`);
      fetchOrders();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAddPayment = async (orderId) => {
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
      setPaymentForm(null);
      setPaymentData({ amount: '', method: 'cash', note: '' });
      fetchOrders();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Delete this order?')) {
      try {
        await orderAPI.delete(orderId);
        setMessage('Order deleted successfully');
        fetchOrders();
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete order');
      }
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return { icon: CheckCircle, gradient: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50', text: 'text-green-700' };
      case 'delivered':
        return { icon: PartyPopper, gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50', text: 'text-blue-700' };
      case 'in_progress':
        return { icon: Settings, gradient: 'from-orange-500 to-amber-500', bg: 'from-orange-50 to-amber-50', text: 'text-orange-700' };
      case 'pending':
        return { icon: Clock, gradient: 'from-yellow-500 to-amber-500', bg: 'from-yellow-50 to-amber-50', text: 'text-yellow-700' };
      default:
        return { icon: ClipboardList, gradient: 'from-gray-500 to-gray-600', bg: 'from-gray-50 to-gray-100', text: 'text-gray-700' };
    }
  };

  const getPaymentConfig = (status) => {
    switch (status) {
      case 'paid':
        return { icon: Heart, gradient: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50', text: 'text-green-700' };
      case 'partial':
        return { icon: Heart, gradient: 'from-yellow-500 to-amber-500', bg: 'from-yellow-50 to-amber-50', text: 'text-yellow-700' };
      default:
        return { icon: HeartCrack, gradient: 'from-red-500 to-pink-500', bg: 'from-red-50 to-pink-50', text: 'text-red-700' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-navy-200 border-t-brand-navy-600 mb-4"></div>
          <p className="text-gray-700 font-bold text-base">Loading orders...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const inProgressOrders = orders.filter(o => o.status === 'in_progress').length;
  const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.price || 0), 0);
  const paidAmount = orders.reduce((sum, o) => sum + (o.amountPaid || 0), 0);
  const outstandingAmount = orders.reduce((sum, o) => sum + (o.amountRemaining || 0), 0);


  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy-50 via-brand-orange-50 to-brand-navy-50">
      {/* Enhanced Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-brand-navy to-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-orange to-brand-navy rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-[550px] h-[550px] bg-gradient-to-br from-brand-navy to-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-brand-navy via-brand-orange to-brand-orange-dark bg-clip-text text-transparent mb-2">
              Orders Management
            </h1>
            <p className="text-gray-600 text-lg font-medium">{totalOrders} total orders</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-gradient-to-br from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform text-sm md:text-base whitespace-nowrap"
          >
            <Plus size={20} /> New Order
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { 
              label: 'Total Revenue', 
              value: `₦${totalRevenue.toLocaleString()}`, 
              icon: DollarSign,
              gradient: 'from-brand-navy via-brand-orange to-brand-orange-dark',
              bgGradient: 'from-brand-navy-50 to-brand-orange-50',
              iconBg: 'bg-brand-navy-100',
            },
            { 
              label: 'Pending', 
              value: pendingOrders, 
              icon: Clock,
              gradient: 'from-brand-orange via-brand-orange-dark to-brand-navy',
              bgGradient: 'from-brand-orange-50 to-brand-navy-50',
              iconBg: 'bg-brand-orange-100',
            },
            { 
              label: 'In Progress', 
              value: inProgressOrders, 
              icon: Settings,
              gradient: 'from-brand-navy via-brand-orange to-brand-navy-dark',
              bgGradient: 'from-brand-navy-50 to-brand-orange-50',
              iconBg: 'bg-brand-navy-100',
            },
            { 
              label: 'Completed', 
              value: completedOrders, 
              icon: CheckCircle,
              gradient: 'from-brand-orange via-brand-navy to-brand-orange-dark',
              bgGradient: 'from-brand-orange-50 to-brand-navy-50',
              iconBg: 'bg-brand-orange-100',
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
            <div 
              key={stat.label} 
              className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transform border border-white/50 backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.iconBg} p-3 md:p-4 rounded-xl md:rounded-2xl shadow-md`}>
                  <Icon size={24} className="md:w-8 md:h-8 text-gray-700" />
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-xs md:text-sm font-semibold mb-1">{stat.label}</p>
                <p className={`text-2xl md:text-3xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </div>
            </div>
          )})}
        </div>

        {/* Messages */}
        {error && (
          <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl text-red-700 flex items-center gap-4 shadow-lg">
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertTriangle size={24} className="text-red-700" />
            </div>
            <span className="font-semibold text-base flex-1">{error}</span>
            <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
              <X size={20} />
            </button>
          </div>
        )}
        {message && (
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl text-green-700 flex items-center gap-4 shadow-lg">
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle size={24} className="text-green-700" />
            </div>
            <span className="font-semibold text-base flex-1">{message}</span>
            <button onClick={() => setMessage('')} className="text-green-700 hover:text-green-900">
              <X size={20} />
            </button>
          </div>
        )}


        {/* Create Order Form */}
        {showForm && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-8 border-2 border-brand-navy">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="bg-gradient-to-br from-brand-navy to-brand-orange p-2 md:p-3 rounded-lg md:rounded-xl">
                <Sparkles size={20} className="md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-lg md:text-2xl font-bold text-gray-900">Create New Order</h2>
                <p className="text-gray-600 text-xs md:text-sm">Add a new order for your client</p>
              </div>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <User size={16} /> Select Client *
                  </label>
                  <select
                    required
                    value={selectedClient}
                    onChange={(e) => handleClientSelect(e.target.value)}
                    className="w-full px-4 py-2 md:py-3 border-2 border-gray-300 rounded-xl focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 outline-none transition-all bg-white text-sm"
                  >
                    <option value="">Choose a client...</option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedClient && (
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <Ruler size={16} /> Select Measurement *
                    </label>
                    <select
                      required
                      value={formData.measurementId}
                      onChange={(e) => handleMeasurementSelect(e.target.value)}
                      className="w-full px-4 py-2 md:py-3 border-2 border-gray-300 rounded-xl focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 outline-none transition-all bg-white text-sm"
                    >
                      <option value="">Choose measurement...</option>
                      {filteredMeasurements.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.attireName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign size={16} /> Price (₦) *
                  </label>
                  <input
                    type="number"
                    step="100"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 md:py-3 border-2 border-gray-300 rounded-xl focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 outline-none transition-all bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} /> Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    value={formData.expectedDeliveryDate}
                    onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                    className="w-full px-4 py-2 md:py-3 border-2 border-gray-300 rounded-xl focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 outline-none transition-all bg-white text-sm"
                  />
                </div>
              </div>

              {/* Fabric Images Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Camera size={20} /> Fabric/Material Images (Max 5)
                  {!useCloudinary && (
                    <span className="text-xs text-blue-600 font-normal">
                      (Using local server storage)
                    </span>
                  )}
                </label>
                
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    id="fabric-images"
                  />
                  <label
                    htmlFor="fabric-images"
                    className="flex items-center justify-center gap-2 bg-brand-navy hover:bg-brand-navy-dark cursor-pointer text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Camera size={20} /> Select Images
                  </label>

                  {/* Image Preview */}
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                          <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uploadingImages}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-navy hover:bg-brand-navy-dark text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {uploadingImages ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save size={18} /> Create Order
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedImages([]);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                >
                  <X size={18} /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-4 border-2 border-purple-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search size={24} />
              <span className="font-bold text-gray-700">Filter by Status:</span>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white font-semibold"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>


        {/* Orders Grid */}
        {orders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-8 md:p-12 text-center border-2 border-gray-100">
            <div className="bg-gradient-to-br from-brand-navy-50 to-brand-orange-50 rounded-2xl p-8 mb-6 inline-block">
              <Package size={64} className="text-gray-400 mx-auto" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 text-base md:text-lg mb-8">Create your first order to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-br from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Create Order
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const paymentConfig = getPaymentConfig(order.paymentStatus);
              const StatusIcon = statusConfig.icon;
              const PaymentIcon = paymentConfig.icon;
              
              return (
                <div
                  key={order._id}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transform border-2 border-gray-100 hover:border-brand-orange/50 overflow-hidden"
                >
                  {/* Card Header with Gradient */}
                  <div className={`bg-gradient-to-r ${statusConfig.gradient} p-4 md:p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <StatusIcon size={24} className="text-white" />
                          <span className="text-sm md:text-base font-bold">#{order.orderNumber}</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-xs font-bold capitalize">{order.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold mb-1">{order.clientId?.name || 'N/A'}</h3>
                      <p className="text-sm opacity-90">{order.attireType}</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 md:p-6 space-y-4">
                    {/* Price */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl md:rounded-2xl p-3 md:p-4 border-2 border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign size={20} className="text-green-600" />
                          <span className="text-xs md:text-sm font-semibold text-gray-600">Total Price</span>
                        </div>
                        <span className="text-xl md:text-2xl font-extrabold text-green-700">
                          ₦{order.price?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className={`bg-gradient-to-br ${paymentConfig.bg} rounded-xl md:rounded-2xl p-3 md:p-4 border-2 ${paymentConfig.text.replace('text-', 'border-')}-200`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PaymentIcon size={20} className={paymentConfig.text} />
                          <span className={`text-xs md:text-sm font-bold ${paymentConfig.text} capitalize`}>
                            {paymentConfig.label}
                          </span>
                        </div>
                      </div>
                      {order.amountRemaining > 0 && (
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                          <span className="text-xs text-gray-600 font-semibold">Amount Due:</span>
                          <span className="text-base font-bold text-red-600">
                            ₦{order.amountRemaining?.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {order.amountPaid > 0 && (
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-600 font-semibold">Paid:</span>
                          <span className="text-sm font-bold text-green-600">
                            ₦{order.amountPaid?.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Delivery Date */}
                    {order.expectedDeliveryDate && (
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <Calendar size={18} className="text-brand-navy flex-shrink-0" />
                        <span className="font-semibold">
                          Delivery: {new Date(order.expectedDeliveryDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="bg-gray-50 p-3 md:p-4 border-t-2 border-gray-100 flex gap-2 flex-wrap">
                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-navy to-brand-navy-dark hover:from-brand-navy-dark hover:to-brand-navy text-white px-3 py-2 md:py-2.5 rounded-lg md:rounded-xl transition-all text-xs md:text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <Eye size={16} /> View
                    </button>
                    
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(order._id, 'in_progress')}
                        className="flex-1 min-w-[100px] flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-2 md:py-2.5 rounded-lg md:rounded-xl transition-all text-xs md:text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <Play size={16} /> Start
                      </button>
                    )}
                    
                    {order.paymentStatus !== 'paid' && (
                      <button
                        onClick={() => setPaymentForm(order._id)}
                        className="flex-1 min-w-[100px] flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark hover:from-brand-orange-dark hover:to-brand-orange text-white px-3 py-2 md:py-2.5 rounded-lg md:rounded-xl transition-all text-xs md:text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <CreditCard size={16} /> Pay
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 md:py-2.5 rounded-lg md:rounded-xl transition-all text-xs md:text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}


        {/* Payment Modal */}
        {paymentForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full border-2 border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-brand-navy to-brand-orange p-3 rounded-xl">
                  <CreditCard size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    Record Payment
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">Enter payment details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign size={16} /> Amount (₦)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    className="w-full px-4 py-2 md:py-3 border-2 border-gray-300 rounded-xl focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 outline-none transition-all bg-white text-sm"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <CreditCard size={16} /> Payment Method
                  </label>
                  <select
                    value={paymentData.method}
                    onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
                    className="w-full px-4 py-2 md:py-3 border-2 border-gray-300 rounded-xl focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 outline-none transition-all bg-white text-sm"
                  >
                    <option value="cash">Cash</option>
                    <option value="transfer">Bank Transfer</option>
                    <option value="card">Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare size={20} /> Note (Optional)
                  </label>
                  <textarea
                    value={paymentData.note}
                    onChange={(e) => setPaymentData({ ...paymentData, note: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-brand-navy focus:ring-2 focus:ring-brand-navy focus:ring-opacity-20 outline-none transition-all resize-none bg-white"
                    placeholder="Add a note..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleAddPayment(paymentForm)}
                    className="flex-1 flex items-center justify-center gap-2 bg-brand-navy hover:bg-brand-navy-dark text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Save size={20} /> Save Payment
                  </button>
                  <button
                    onClick={() => {
                      setPaymentForm(null);
                      setPaymentData({ amount: '', method: 'cash', note: '' });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <X size={20} /> Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
