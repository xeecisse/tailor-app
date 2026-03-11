'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Calendar, DollarSign, X, ShoppingBag, Users } from 'lucide-react';
import { customerAPI } from '../lib/api';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setError('');
      const response = await customerAPI.getMyOrders();
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-navy-200 border-t-brand-navy mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">My Orders</h1>
          <p className="text-gray-600 mt-2">Track all your sewing orders</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={40} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600">Start by placing an order with a tailor!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-brand-navy to-brand-orange p-4">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-xs opacity-90">Order ID</p>
                    <p className="font-bold">{order.orderNumber || order._id.slice(-6)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Tailor */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-orange bg-opacity-10 rounded-full flex items-center justify-center">
                    <Users size={16} className="text-brand-orange" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Tailor</p>
                    <p className="text-sm font-semibold text-gray-900">{order.tailorId?.businessName || 'N/A'}</p>
                  </div>
                </div>

                {/* Attire */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-navy bg-opacity-10 rounded-full flex items-center justify-center">
                    <ShoppingBag size={16} className="text-brand-navy" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Attire Type</p>
                    <p className="text-sm font-semibold text-gray-900">{order.attireType || 'N/A'}</p>
                  </div>
                </div>

                {/* Due Date */}
                {order.expectedDeliveryDate && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Calendar size={16} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Due Date</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Amount */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign size={16} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Amount</p>
                    <p className="text-lg font-bold text-brand-navy">₦{order.price?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-dark transition-colors font-semibold"
                >
                  <Eye size={16} /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Order Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-sm text-gray-600 mt-1">Order #{selectedOrder.orderNumber || selectedOrder._id.slice(-6)}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Tailor Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">Tailor Information</h3>
                <p className="text-sm text-gray-700"><span className="font-semibold">Business:</span> {selectedOrder.tailorId?.businessName}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">Phone:</span> {selectedOrder.tailorId?.phone}</p>
                {selectedOrder.tailorId?.email && (
                  <p className="text-sm text-gray-700"><span className="font-semibold">Email:</span> {selectedOrder.tailorId?.email}</p>
                )}
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Attire Type</p>
                  <p className="text-base font-semibold text-gray-900">{selectedOrder.attireType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Price</p>
                  <p className="text-base font-semibold text-gray-900">₦{selectedOrder.price?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Amount Paid</p>
                  <p className="text-base font-semibold text-green-600">₦{selectedOrder.amountPaid?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Balance</p>
                  <p className="text-base font-semibold text-red-600">₦{selectedOrder.amountRemaining?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Payment Status</p>
                  <p className="text-base font-semibold text-gray-900 capitalize">{selectedOrder.paymentStatus || 'Pending'}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                {selectedOrder.startDate && (
                  <div>
                    <p className="text-xs text-gray-600">Start Date</p>
                    <p className="text-sm text-gray-900">{new Date(selectedOrder.startDate).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedOrder.expectedDeliveryDate && (
                  <div>
                    <p className="text-xs text-gray-600">Expected Delivery</p>
                    <p className="text-sm text-gray-900">{new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedOrder.completedDate && (
                  <div>
                    <p className="text-xs text-gray-600">Completed Date</p>
                    <p className="text-sm text-gray-900">{new Date(selectedOrder.completedDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
