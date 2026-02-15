'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  DollarSign, 
  Clock, 
  Truck, 
  CheckCircle, 
  Package, 
  User, 
  Calendar, 
  MessageSquare, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  ShoppingCart,
  Save,
  X,
  Sparkles,
  FileText
} from 'lucide-react';
import { purchaseOrderAPI, clientAPI, inventoryAPI } from '../lib/api';

export default function PurchaseOrdersPage() {
  const navigate = useNavigate();
  const [pos, setPos] = useState([]);
  const [clients, setClients] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  
  const [formData, setFormData] = useState({
    clientId: '',
    items: [],
    expectedDeliveryDate: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchPOs();
  }, [filterStatus]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [posRes, clientsRes, itemsRes] = await Promise.all([
        purchaseOrderAPI.getAll(),
        clientAPI.getAll('active'),
        inventoryAPI.getItems(),
      ]);

      setPos(posRes.data.purchaseOrders || []);
      setClients(clientsRes.data.clients);
      setItems(itemsRes.data.items);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPOs = async () => {
    try {
      const res = await purchaseOrderAPI.getAll(filterStatus || undefined);
      setPos(res.data.purchaseOrders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch purchase orders');
    }
  };

  const handleAddItem = (itemId) => {
    const item = items.find(i => i.id === itemId);
    if (item && !selectedItems.find(si => si.itemId === itemId)) {
      setSelectedItems([...selectedItems, {
        itemId: item.id,
        name: item.name,
        quantity: 1,
        unitPrice: item.sellingPrice,
      }]);
    }
  };

  const handleUpdateItemQuantity = (itemId, quantity) => {
    setSelectedItems(selectedItems.map(item => 
      item.itemId === itemId ? { ...item, quantity: parseInt(quantity) || 1 } : item
    ));
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item.itemId !== itemId));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleCreatePO = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.clientId || selectedItems.length === 0) {
      setError('Please select a client and add at least one item');
      return;
    }

    try {
      await purchaseOrderAPI.create({
        clientId: formData.clientId,
        items: selectedItems,
        expectedDeliveryDate: formData.expectedDeliveryDate,
        notes: formData.notes,
      });

      setMessage('Purchase order created successfully');
      setShowForm(false);
      setFormData({
        clientId: '',
        items: [],
        expectedDeliveryDate: '',
        notes: '',
      });
      setSelectedItems([]);
      fetchPOs();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create purchase order');
    }
  };

  const handleStatusChange = async (poId, newStatus) => {
    try {
      await purchaseOrderAPI.updateStatus(poId, newStatus);
      setMessage(`Purchase order status updated to ${newStatus}`);
      fetchPOs();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeletePO = async (poId) => {
    if (window.confirm('Delete this purchase order?')) {
      try {
        await purchaseOrderAPI.delete(poId);
        setMessage('Purchase order deleted successfully');
        fetchPOs();
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete purchase order');
      }
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'delivered':
        return { icon: CheckCircle, gradient: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50', text: 'text-green-700', label: 'Delivered' };
      case 'in_transit':
        return { icon: Truck, gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50', text: 'text-blue-700', label: 'In Transit' };
      case 'pending':
        return { icon: Clock, gradient: 'from-yellow-500 to-amber-500', bg: 'from-yellow-50 to-amber-50', text: 'text-yellow-700', label: 'Pending' };
      default:
        return { icon: FileText, gradient: 'from-gray-500 to-gray-600', bg: 'from-gray-50 to-gray-100', text: 'text-gray-700', label: status };
    }
  };

  const getPaymentConfig = (status) => {
    switch (status) {
      case 'paid':
        return { icon: CheckCircle2, gradient: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50', text: 'text-green-700', label: 'Paid' };
      case 'partial':
        return { icon: AlertTriangle, gradient: 'from-yellow-500 to-amber-500', bg: 'from-yellow-50 to-amber-50', text: 'text-yellow-700', label: 'Partial' };
      default:
        return { icon: X, gradient: 'from-red-500 to-pink-500', bg: 'from-red-50 to-pink-50', text: 'text-red-700', label: 'Unpaid' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading purchase orders...</p>
        </div>
      </div>
    );
  }

  const totalPOs = pos.length;
  const pendingPOs = pos.filter(p => p.status === 'pending').length;
  const inTransitPOs = pos.filter(p => p.status === 'in_transit').length;
  const deliveredPOs = pos.filter(p => p.status === 'delivered').length;
  const totalRevenue = pos.reduce((sum, p) => sum + (p.totalAmount || 0), 0);


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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Purchase Orders
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">{totalPOs} total purchase orders</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform"
          >
            <Plus size={24} /> New Purchase Order
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              label: 'Total Revenue', 
              value: `₦${totalRevenue.toLocaleString()}`, 
              icon: DollarSign,
              gradient: 'from-green-500 via-emerald-500 to-teal-500',
              bgGradient: 'from-green-50 to-emerald-50',
              iconBg: 'bg-green-100',
            },
            { 
              label: 'Pending', 
              value: pendingPOs, 
              icon: Clock,
              gradient: 'from-yellow-500 via-amber-500 to-orange-500',
              bgGradient: 'from-yellow-50 to-amber-50',
              iconBg: 'bg-yellow-100',
            },
            { 
              label: 'In Transit', 
              value: inTransitPOs, 
              icon: Truck,
              gradient: 'from-blue-500 via-cyan-500 to-sky-500',
              bgGradient: 'from-blue-50 to-cyan-50',
              iconBg: 'bg-blue-100',
            },
            { 
              label: 'Delivered', 
              value: deliveredPOs, 
              icon: CheckCircle,
              gradient: 'from-purple-500 via-violet-500 to-indigo-500',
              bgGradient: 'from-purple-50 to-violet-50',
              iconBg: 'bg-purple-100',
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className={`bg-gradient-to-br ${stat.bgGradient} rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transform border border-white/50 backdrop-blur-sm`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.iconBg} p-4 rounded-2xl shadow-md`}>
                    <Icon size={32} className="text-gray-700" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
                  <p className={`text-3xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Messages */}
        {error && (
          <div className="p-5 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl text-red-700 flex items-center gap-4 shadow-lg">
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertTriangle size={24} />
            </div>
            <span className="font-semibold text-lg">{error}</span>
          </div>
        )}
        {message && (
          <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl text-green-700 flex items-center gap-4 shadow-lg">
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
            <span className="font-semibold text-lg">{message}</span>
          </div>
        )}


        {/* Create PO Form */}
        {showForm && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                <Sparkles size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create Purchase Order
              </h2>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <User size={20} /> Select Client *
                  </label>
                  <select
                    required
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                  >
                    <option value="">Choose a client...</option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={20} /> Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    value={formData.expectedDeliveryDate}
                    onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                  />
                </div>
              </div>

              {/* Add Items */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Package size={20} /> Add Items
                </label>
                <select
                  onChange={(e) => {
                    handleAddItem(e.target.value);
                    e.target.value = '';
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                >
                  <option value="">Select item to add...</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} - ₦{item.sellingPrice?.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Items */}
              {selectedItems.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
                  <p className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <ShoppingCart size={24} /> Selected Items
                  </p>
                  <div className="space-y-3">
                    {selectedItems.map((item) => (
                      <div key={item.itemId} className="bg-white rounded-xl p-4 flex items-center gap-4">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">₦{item.unitPrice.toLocaleString()} each</p>
                        </div>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItemQuantity(item.itemId, e.target.value)}
                          className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                        />
                        <p className="font-bold text-purple-700 w-32 text-right">
                          ₦{(item.quantity * item.unitPrice).toLocaleString()}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.itemId)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t-2 border-purple-200 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                    <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ₦{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare size={20} /> Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none bg-white"
                  placeholder="Add any special notes..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Save size={20} /> Create Purchase Order
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <X size={20} /> Cancel
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
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>


        {/* Purchase Orders Grid */}
        {pos.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-purple-300 shadow-xl">
            <FileText size={80} className="mx-auto mb-6 text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No purchase orders yet</h3>
            <p className="text-gray-600 text-lg">Create your first purchase order to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {pos.map((po) => {
              const statusConfig = getStatusConfig(po.status);
              const paymentConfig = getPaymentConfig(po.paymentStatus);
              const StatusIcon = statusConfig.icon;
              const PaymentIcon = paymentConfig.icon;
              
              return (
                <div
                  key={po._id}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-purple-200 hover:border-purple-300 group transform hover:scale-105"
                >
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${statusConfig.gradient} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <StatusIcon size={28} className="text-white" />
                          <span className="text-sm font-bold opacity-90">#{po.poNumber}</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-xs font-bold capitalize">{statusConfig.label}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-1">{po.clientId?.name || 'N/A'}</h3>
                      <p className="text-sm opacity-90">{po.items?.length || 0} items</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Total Amount */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign size={24} className="text-green-600" />
                          <span className="text-sm font-semibold text-gray-600">Total Amount</span>
                        </div>
                        <span className="text-2xl font-extrabold text-green-700">
                          ₦{po.totalAmount?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className={`bg-gradient-to-br ${paymentConfig.bg} rounded-2xl p-4 border-2 ${paymentConfig.text.replace('text-', 'border-')}-200`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PaymentIcon size={24} className={paymentConfig.text} />
                          <span className={`text-sm font-bold ${paymentConfig.text} capitalize`}>
                            {paymentConfig.label}
                          </span>
                        </div>
                      </div>
                      {po.amountRemaining > 0 && (
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                          <span className="text-xs text-gray-600 font-semibold">Amount Due:</span>
                          <span className={`text-lg font-bold ${paymentConfig.text}`}>
                            ₦{po.amountRemaining?.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Items List */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border-2 border-blue-200">
                      <p className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Package size={20} /> Items
                      </p>
                      <div className="space-y-1">
                        {po.items?.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="text-xs text-gray-700 flex justify-between">
                            <span>{item.name}</span>
                            <span className="font-bold">x{item.quantity}</span>
                          </div>
                        ))}
                        {po.items?.length > 3 && (
                          <p className="text-xs text-gray-500 italic">+{po.items.length - 3} more items</p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Date */}
                    {po.expectedDeliveryDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={20} />
                        <span className="font-semibold">
                          Delivery: {new Date(po.expectedDeliveryDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    )}

                    {/* Notes */}
                    {po.notes && (
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 p-3 rounded-xl">
                        <div className="flex items-start gap-2">
                          <MessageSquare size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-700 font-medium">{po.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="bg-gray-50 p-4 border-t-2 border-gray-100 flex gap-2">
                    {po.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(po._id, 'in_transit')}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-3 py-2.5 rounded-xl transition-all text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <Truck size={18} /> Ship
                      </button>
                    )}
                    
                    {po.status === 'in_transit' && (
                      <button
                        onClick={() => handleStatusChange(po._id, 'delivered')}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-2.5 rounded-xl transition-all text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <CheckCircle size={18} /> Deliver
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeletePO(po._id)}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2.5 rounded-xl transition-all text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
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
