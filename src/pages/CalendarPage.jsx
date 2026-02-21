'use client';

import React, { useState, useEffect } from 'react';
import { orderAPI, clientAPI, measurementAPI } from '../lib/api';
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Plus,
  Save,
  Package,
} from 'lucide-react';

function EventCard({ order, type, isOverdue, onClick }) {
  const isDeadline = type === 'deadline';
  const baseColor = isDeadline ? 'from-blue-500 to-blue-600' : 'from-red-500 to-red-600';
  const bgColor = isDeadline ? 'bg-blue-50' : 'bg-red-50';
  const textColor = isDeadline ? 'text-blue-700' : 'text-red-700';
  const borderColor = isDeadline ? 'border-blue-300' : 'border-red-300';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-2 rounded-lg border-2 ${borderColor} ${bgColor} hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer group`}
    >
      <div className={`flex items-center gap-1 ${textColor}`}>
        <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${baseColor}`}></div>
        <p className="text-xs font-bold truncate">{isDeadline ? 'Deadline' : 'Delivery'}</p>
        {isOverdue && <AlertTriangle size={12} className="text-red-600" />}
      </div>
      <p className="text-xs font-bold text-gray-900 truncate mt-0.5">{order.clientId?.name || 'Client'}</p>
      <p className="text-xs text-gray-600 truncate">{order.attireType}</p>
    </button>
  );
}

export default function CalendarPage() {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(new Date()));
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderPanel, setShowOrderPanel] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDayView, setShowDayView] = useState(false);
  const [selectedDayOrders, setSelectedDayOrders] = useState([]);
  const [formData, setFormData] = useState({
    clientId: '',
    measurementId: '',
    attireType: '',
    expectedDeliveryDate: '',
    expectedDeliveryTime: '',
    price: '',
    notes: '',
  });

  useEffect(() => {
    fetchOrders();
    fetchClients();
  }, [currentWeekStart]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await orderAPI.getAll();
      setOrders(response.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await clientAPI.getAll('active');
      setClients(response.data.clients || []);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    }
  };

  const fetchMeasurements = async (clientId) => {
    try {
      const response = await measurementAPI.getByClient(clientId);
      setMeasurements(response.data.measurements || []);
    } catch (err) {
      console.error('Failed to fetch measurements:', err);
      setMeasurements([]);
    }
  };

  const handleClientChange = (clientId) => {
    setFormData({ ...formData, clientId, measurementId: '', attireType: '' });
    if (clientId) {
      fetchMeasurements(clientId);
    } else {
      setMeasurements([]);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!formData.clientId || !formData.measurementId || !formData.attireType || !formData.expectedDeliveryDate || !formData.expectedDeliveryTime || !formData.price) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Combine date and time into a datetime string
      const deliveryDateTime = `${formData.expectedDeliveryDate}T${formData.expectedDeliveryTime}:00`;
      
      await orderAPI.create({
        clientId: formData.clientId,
        measurementId: formData.measurementId,
        attireType: formData.attireType,
        expectedDeliveryDate: deliveryDateTime,
        price: parseFloat(formData.price),
        notes: formData.notes,
      });
      setMessage('Order created successfully');
      setShowCreateModal(false);
      setFormData({
        clientId: '',
        measurementId: '',
        attireType: '',
        expectedDeliveryDate: '',
        expectedDeliveryTime: '',
        price: '',
        notes: '',
      });
      fetchOrders();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    }
  };

  const handleTimeSlotClick = (date) => {
    setSelectedDate(date);
    // Get all orders for this date
    const dayOrders = orders.filter(order => {
      const orderDate = new Date(order.expectedDeliveryDate);
      return orderDate.toDateString() === date.toDateString();
    });
    setSelectedDayOrders(dayOrders);
    setShowDayView(true);
  };

  const handleCreateNewOrder = () => {
    setFormData({
      ...formData,
      expectedDeliveryDate: selectedDate.toISOString().split('T')[0],
      expectedDeliveryTime: '10:00',
    });
    setShowDayView(false);
    setShowCreateModal(true);
  };

  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isOverdue = (date) => {
    return new Date(date) < new Date() && new Date(date).toDateString() !== new Date().toDateString();
  };

  const getEventsForDay = (date, eventType) => {
    return orders.filter((order) => {
      const eventDate = eventType === 'deadline' ? order.expectedDeliveryDate : order.expectedDeliveryDate;
      if (!eventDate) return false;
      const eventDateObj = new Date(eventDate);
      return eventDateObj.toDateString() === date.toDateString() &&
        (eventType === 'deadline' ? order.status !== 'delivered' : order.status !== 'delivered');
    });
  };

  const getEventsForTimeSlot = (date, timeSlot) => {
    const [slotHour] = timeSlot.split(':');
    return orders.filter((order) => {
      if (!order.expectedDeliveryDate) return false;
      const orderDate = new Date(order.expectedDeliveryDate);
      const orderHour = orderDate.getHours().toString().padStart(2, '0');
      return orderDate.toDateString() === date.toDateString() && 
             orderHour === slotHour &&
             order.status !== 'delivered';
    });
  };

  const stats = {
    deadlinesThisWeek: getWeekDays().reduce((sum, day) => sum + getEventsForDay(day, 'deadline').length, 0),
    deliveriesThisWeek: getWeekDays().reduce((sum, day) => sum + getEventsForDay(day, 'delivery').length, 0),
    overdueOrders: orders.filter(o => isOverdue(o.expectedDeliveryDate) && o.status !== 'delivered').length,
  };

  const weekDays = getWeekDays();
  const timeSlots = getTimeSlots();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-navy-50 via-brand-orange-50 to-brand-navy-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-navy-200 border-t-brand-navy mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy-50 via-brand-orange-50 to-brand-navy-50">
      {/* Enhanced Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-brand-navy to-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-orange to-brand-navy rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-[550px] h-[550px] bg-gradient-to-br from-brand-navy to-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-brand-navy via-brand-orange to-brand-orange-dark bg-clip-text text-transparent mb-2">
            Weekly Order Tracking
          </h1>
          <p className="text-gray-600 text-base md:text-lg font-medium">
            Track deadlines and deliveries at a glance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Deadlines This Week</p>
                <p className="text-3xl font-bold text-brand-navy mt-2">{stats.deadlinesThisWeek}</p>
              </div>
              <Clock size={32} className="text-brand-navy opacity-20" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Deliveries This Week</p>
                <p className="text-3xl font-bold text-brand-orange mt-2">{stats.deliveriesThisWeek}</p>
              </div>
              <CheckCircle size={32} className="text-brand-orange opacity-20" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-red-300 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-700 text-sm font-semibold">Overdue Orders</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.overdueOrders}</p>
              </div>
              <AlertTriangle size={32} className="text-red-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 border-2 border-gray-100 shadow-lg mb-8 flex items-center justify-between">
          <button
            onClick={() => setCurrentWeekStart(new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000))}
            className="px-4 py-2 bg-gradient-to-br from-brand-navy to-brand-navy-dark hover:from-brand-navy-dark hover:to-brand-navy text-white rounded-lg font-bold transition-all"
          >
            ← Previous Week
          </button>

          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <button
            onClick={() => {
              const today = new Date();
              setCurrentWeekStart(getMonday(today));
            }}
            className="px-4 py-2 bg-gradient-to-br from-brand-orange to-brand-orange-dark hover:from-brand-orange-dark hover:to-brand-orange text-white rounded-lg font-bold transition-all"
          >
            Today
          </button>

          <button
            onClick={() => setCurrentWeekStart(new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000))}
            className="px-4 py-2 bg-gradient-to-br from-brand-navy to-brand-navy-dark hover:from-brand-navy-dark hover:to-brand-navy text-white rounded-lg font-bold transition-all"
          >
            Next Week →
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl border-2 border-gray-100 shadow-lg overflow-hidden">
          {/* Mobile: Card View */}
          <div className="md:hidden space-y-3 p-4">
            {weekDays.map((day, idx) => {
              const dayOrders = orders.filter(order => {
                const orderDate = new Date(order.expectedDeliveryDate);
                return orderDate.toDateString() === day.toDateString();
              });
              
              return (
                <div
                  key={idx}
                  onClick={() => handleTimeSlotClick(day)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isToday(day)
                      ? 'bg-brand-navy-50 border-brand-navy'
                      : 'bg-white border-gray-200 hover:border-brand-orange'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase">
                        {day.toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                      <p className={`text-lg font-bold ${isToday(day) ? 'text-brand-navy' : 'text-gray-900'}`}>
                        {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    {dayOrders.length > 0 && (
                      <span className="bg-gradient-to-r from-brand-navy to-brand-orange text-white px-3 py-1 rounded-full text-xs font-bold">
                        {dayOrders.length}
                      </span>
                    )}
                  </div>
                  {dayOrders.length > 0 && (
                    <div className="space-y-1">
                      {dayOrders.slice(0, 2).map((order) => (
                        <div key={order._id} className="text-xs bg-gray-50 p-2 rounded border border-gray-200">
                          <p className="font-bold text-gray-900 truncate">{order.clientId?.name || 'Unknown'}</p>
                          <p className="text-gray-600 truncate">{order.attireType}</p>
                        </div>
                      ))}
                      {dayOrders.length > 2 && (
                        <p className="text-xs text-gray-500 italic">+{dayOrders.length - 2} more</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop: Grid View */}
          <div className="hidden md:block">
            {/* Day Headers */}
            <div className="grid grid-cols-8 border-b-2 border-gray-100">
              <div className="p-4 bg-gray-50 border-r border-gray-100"></div>
              {weekDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`p-4 text-center border-r border-gray-100 ${
                    isToday(day) ? 'bg-brand-navy-50' : 'bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-gray-600 uppercase">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className={`text-lg font-bold mt-1 ${isToday(day) ? 'text-brand-navy' : 'text-gray-900'}`}>
                    {day.getDate()}
                  </p>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="grid grid-cols-8 gap-0">
              {/* Time Column */}
              <div className="bg-gray-50 border-r border-gray-100">
                {timeSlots.map((time, idx) => (
                  <div key={idx} className="h-20 p-2 border-b border-gray-100 text-xs font-semibold text-gray-600 flex items-start justify-center">
                    {time}
                  </div>
                ))}
              </div>

              {/* Day Columns */}
              {weekDays.map((day, dayIdx) => (
                <div key={dayIdx} className={`border-r border-gray-100 ${isToday(day) ? 'bg-brand-navy-50 bg-opacity-30' : ''}`}>
                  {timeSlots.map((time, timeIdx) => (
                    <div
                      key={timeIdx}
                      onClick={() => handleTimeSlotClick(day)}
                      className="h-20 border-b border-gray-100 p-1 relative cursor-pointer hover:bg-brand-navy-100 hover:bg-opacity-10 transition-colors group"
                    >
                      {/* Events for this specific time slot */}
                      <div className="space-y-1">
                        {getEventsForTimeSlot(day, time).map((order) => (
                          <EventCard
                            key={`order-${order._id}`}
                            order={order}
                            type="deadline"
                            isOverdue={isOverdue(order.expectedDeliveryDate)}
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderPanel(true);
                            }}
                          />
                        ))}
                      </div>
                      {/* Add button on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-brand-navy text-white p-1 rounded-lg shadow-lg hover:bg-brand-navy-dark">
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl md:rounded-3xl w-full md:w-96 max-h-[90vh] overflow-y-auto border-2 border-gray-100 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-brand-navy to-brand-orange p-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold">Create New Order</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {error && (
              <div className="m-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 text-sm font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Client *
                </label>
                <select
                  required
                  value={formData.clientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 outline-none transition-all"
                >
                  <option value="">Select a client...</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Garment Type *
                </label>
                {formData.clientId ? (
                  measurements.length > 0 ? (
                    <select
                      required
                      value={formData.measurementId}
                      onChange={(e) => {
                        const measurement = measurements.find(m => m._id === e.target.value);
                        setFormData({ 
                          ...formData, 
                          measurementId: e.target.value,
                          attireType: measurement?.attireTypeId?.name || measurement?.attireType || ''
                        });
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 outline-none transition-all"
                    >
                      <option value="">Select a measurement...</option>
                      {measurements.map((measurement) => (
                        <option key={measurement._id} value={measurement._id}>
                          {measurement.attireTypeId?.name || measurement.attireType}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 text-sm">
                      No measurements found for this client
                    </div>
                  )
                ) : (
                  <input
                    type="text"
                    required
                    value={formData.attireType}
                    onChange={(e) => setFormData({ ...formData, attireType: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 outline-none transition-all"
                    placeholder="Select a client first"
                    disabled
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Delivery Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Delivery Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.expectedDeliveryTime}
                  onChange={(e) => setFormData({ ...formData, expectedDeliveryTime: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Amount (₦) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 outline-none transition-all"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 outline-none transition-all resize-none"
                  rows="3"
                  placeholder="Order details..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-100 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-br from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Day View Modal */}
      {showDayView && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center md:justify-center p-4">
          <div className="bg-white/90 backdrop-blur-lg rounded-t-3xl md:rounded-2xl w-full md:w-xl max-h-[80vh] overflow-y-auto border-2 border-gray-100 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-brand-navy to-brand-orange p-4 md:p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg md:text-xl font-bold">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </h3>
                <p className="text-xs md:text-sm opacity-90 mt-1">{selectedDayOrders.length} order(s)</p>
              </div>
              <button
                onClick={() => setShowDayView(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-3">
              {selectedDayOrders.length > 0 ? (
                <>
                  {selectedDayOrders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-gradient-to-br from-brand-navy-50 to-brand-orange-50 rounded-lg p-3 border-2 border-gray-200 hover:border-brand-orange/50 transition-all cursor-pointer hover:shadow-lg"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderPanel(true);
                        setShowDayView(false);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-xs font-bold text-gray-600 uppercase">#{order.orderNumber?.slice(-6)}</p>
                          <p className="text-sm md:text-base font-bold text-gray-900 mt-0.5">
                            {order.clientId?.name || 'Unknown'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status === 'delivered' ? 'Done' : order.status === 'in_progress' ? 'In Progress' : 'Pending'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                        <div>
                          <p className="text-gray-600 font-semibold">Garment</p>
                          <p className="font-bold text-gray-900">{order.attireType || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Amount</p>
                          <p className="font-bold text-green-700">₦{order.price?.toLocaleString() || '0'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-6">
                  <Package size={40} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600 font-semibold text-sm">No orders for this day</p>
                </div>
              )}

              <button
                onClick={handleCreateNewOrder}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-br from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white px-4 py-2 md:py-3 rounded-lg md:rounded-xl font-bold text-sm md:text-base transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus size={18} />
                New Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Side Panel */}
      {showOrderPanel && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center md:justify-end">
          <div className="bg-white/90 backdrop-blur-lg rounded-t-3xl md:rounded-2xl w-full md:w-96 max-h-[90vh] overflow-y-auto border-2 border-gray-100 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-brand-navy to-brand-orange p-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold">Order Details</h3>
              <button
                onClick={() => setShowOrderPanel(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase">Order ID</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{selectedOrder.orderNumber}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-600 uppercase">Client</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{selectedOrder.clientId?.name || 'Unknown'}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-600 uppercase">Garment Type</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{selectedOrder.attireType || 'N/A'}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-600 uppercase">Status</p>
                <p className={`text-lg font-bold mt-1 ${
                  selectedOrder.status === 'delivered' ? 'text-green-600' :
                  selectedOrder.status === 'in_progress' ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>
                  {selectedOrder.status.replace('_', ' ').toUpperCase()}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-600 uppercase">Deadline</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-600 uppercase">Amount</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  ₦{selectedOrder.totalAmount?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

