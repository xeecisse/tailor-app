'use client';

import React, { useState, useEffect } from 'react';
import { appointmentAPI, clientAPI } from '../lib/api';
import {
  Ruler,
  Shirt,
  MessageSquare,
  Package,
  Truck,
  DollarSign,
  FileText,
  Plus,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X,
  AlertTriangle,
  User,
  Clock,
  MapPin,
  Edit,
  MessageCircle,
  Save,
} from 'lucide-react';

export default function CalendarPage() {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('day'); // day, week, month

  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    type: 'measurement',
    location: 'Shop',
    notes: '',
  });

  const appointmentTypes = [
    { value: 'measurement', label: 'Measurement', icon: Ruler, color: 'purple' },
    { value: 'fitting', label: 'Fitting', icon: Shirt, color: 'blue' },
    { value: 'consultation', label: 'Consultation', icon: MessageSquare, color: 'green' },
    { value: 'pickup', label: 'Pickup', icon: Package, color: 'orange' },
    { value: 'delivery', label: 'Delivery', icon: Truck, color: 'cyan' },
    { value: 'payment', label: 'Payment', icon: DollarSign, color: 'yellow' },
    { value: 'other', label: 'Other', icon: FileText, color: 'gray' },
  ];

  useEffect(() => {
    fetchClients();
    fetchAppointments();
  }, [selectedDate]);

  const fetchClients = async () => {
    try {
      const res = await clientAPI.getAll('active');
      setClients(res.data.clients);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await appointmentAPI.getByDate(selectedDate);
      setAppointments(res.data.appointments);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await appointmentAPI.create(formData);
      setMessage('Appointment created successfully');
      setShowForm(false);
      setFormData({
        clientId: '',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        type: 'measurement',
        location: 'Shop',
        notes: '',
      });
      fetchAppointments();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create appointment');
    }
  };

  const handleCancel = async (id) => {
    const reason = prompt('Reason for cancellation:');
    if (!reason) return;

    try {
      await appointmentAPI.cancel(id, reason);
      setMessage('Appointment cancelled');
      fetchAppointments();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleComplete = async (id) => {
    try {
      await appointmentAPI.complete(id);
      setMessage('Appointment marked as completed');
      fetchAppointments();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete appointment');
    }
  };

  const getTypeConfig = (type) => {
    return appointmentTypes.find((t) => t.value === type) || appointmentTypes[0];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'confirmed':
        return 'from-blue-500 to-cyan-500';
      case 'cancelled':
        return 'from-red-500 to-pink-500';
      case 'no-show':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-yellow-500 to-amber-500';
    }
  };

  const changeDate = (days) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Calendar & Appointments
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform"
          >
            <Plus size={24} /> New Appointment
          </button>
        </div>

        {/* Date Navigation */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => changeDate(-1)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
            >
              ← Previous Day
            </button>
            
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white font-semibold"
              />
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
              >
                📅 Today
              </button>
            </div>

            <button
              onClick={() => changeDate(1)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
            >
              Next Day →
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="p-5 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl text-red-700 flex items-center gap-4 shadow-lg">
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <span className="font-semibold text-lg">{error}</span>
          </div>
        )}
        {message && (
          <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl text-green-700 flex items-center gap-4 shadow-lg">
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <span className="font-semibold text-lg">{message}</span>
          </div>
        )}

        {/* Create Appointment Form */}
        {showForm && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                <CalendarIcon size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                New Appointment
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <User size={18} /> Client *
                  </label>
                  <select
                    required
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                  >
                    <option value="">Select client...</option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText size={18} /> Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                  >
                    {appointmentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <CalendarIcon size={18} /> Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Clock size={18} /> Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Clock size={18} /> End Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={18} /> Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                    placeholder="Shop, Client's place, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Edit size={18} /> Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                  placeholder="e.g., Measurement for wedding dress"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MessageCircle size={18} /> Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none bg-white"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Save size={20} /> Create Appointment
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

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-purple-300 shadow-xl">
            <CalendarIcon size={80} className="mx-auto mb-6 text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No appointments for this day</h3>
            <p className="text-gray-600 text-lg">Schedule your first appointment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => {
              const typeConfig = getTypeConfig(apt.type);
              const statusGradient = getStatusColor(apt.status);
              const TypeIcon = typeConfig.icon;

              return (
                <div
                  key={apt._id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-purple-200"
                >
                  <div className={`bg-gradient-to-r ${statusGradient} p-4 text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                          <TypeIcon size={28} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{apt.title}</h3>
                          <p className="text-sm opacity-90">{apt.clientId?.name || 'Unknown Client'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{apt.startTime} - {apt.endTime}</p>
                        <p className="text-sm opacity-90 capitalize">{apt.status}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-600">Type:</span>
                        <div className="flex items-center gap-2 text-gray-800 capitalize mt-1">
                          <TypeIcon size={16} />
                          <span>{apt.type}</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">Location:</span>
                        <p className="text-gray-800">{apt.location}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">Duration:</span>
                        <p className="text-gray-800">{apt.duration} minutes</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">Phone:</span>
                        <p className="text-gray-800">{apt.clientId?.phone || 'N/A'}</p>
                      </div>
                    </div>

                    {apt.notes && (
                      <div className="mb-4 p-3 bg-amber-50 border-2 border-amber-200 rounded-xl">
                        <p className="text-sm text-gray-700"><strong>Notes:</strong> {apt.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {apt.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => handleComplete(apt._id)}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-sm"
                          >
                            ✅ Complete
                          </button>
                          <button
                            onClick={() => handleCancel(apt._id)}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-sm"
                          >
                            ❌ Cancel
                          </button>
                        </>
                      )}
                      {apt.status === 'cancelled' && apt.cancellationReason && (
                        <div className="flex-1 p-3 bg-red-50 border-2 border-red-200 rounded-xl text-sm">
                          <strong>Cancelled:</strong> {apt.cancellationReason}
                        </div>
                      )}
                    </div>
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
      `}</style>
    </div>
  );
}
