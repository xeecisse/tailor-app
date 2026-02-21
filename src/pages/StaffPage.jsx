import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { staffAPI } from '../lib/api';
import {
  Users,
  Plus,
  Phone,
  Briefcase,
  CheckCircle,
  Clock,
  Search,
  X,
  Save,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

export default function StaffPage() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialization: '',
    role: 'tailor',
    notes: '',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await staffAPI.getAll();
      setStaff(response.data.staff);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.phone) {
      setError('Name and phone are required');
      return;
    }

    try {
      await staffAPI.create(formData);
      setMessage('Staff member added successfully!');
      setFormData({
        name: '',
        phone: '',
        specialization: '',
        role: 'tailor',
        notes: '',
      });
      setShowAddModal(false);
      fetchStaff();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add staff member');
    }
  };

  const handleDeleteStaff = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        await staffAPI.delete(id);
        setMessage('Staff member deleted successfully');
        fetchStaff();
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete staff member');
      }
    }
  };

  const filteredStaff = staff.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm) ||
    member.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-navy-50 via-brand-orange-50 to-brand-navy-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-brand-navy-200 border-t-brand-navy mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading staff...</p>
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-brand-navy via-brand-orange to-brand-orange-dark bg-clip-text text-transparent mb-2">
                Staff Management
              </h1>
              <p className="text-gray-600 text-sm md:text-base font-medium">
                Manage your team members
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-br from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform text-sm md:text-base whitespace-nowrap"
            >
              <Plus size={20} /> Add Staff Member
            </button>
          </div>
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

        {/* Search Bar */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-6 border-2 border-gray-100">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, phone, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border-0 focus:outline-none text-gray-700 bg-transparent text-sm"
            />
          </div>
        </div>

        {/* Staff Grid */}
        {filteredStaff.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-8 md:p-12 text-center border-2 border-gray-100">
            <div className="bg-gradient-to-br from-brand-navy-50 to-brand-orange-50 rounded-2xl p-8 mb-6 inline-block">
              <Users size={64} className="text-gray-400 mx-auto" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'No staff found' : 'No staff members yet'}
            </h3>
            <p className="text-gray-600 text-base md:text-lg mb-8">
              {searchTerm
                ? 'Try adjusting your search'
                : 'Add your first staff member to get started'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-br from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <Plus size={20} /> Add First Staff Member
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((member) => (
              <div
                key={member._id}
                className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-brand-orange/50 cursor-pointer group transform hover:scale-105"
                onClick={() => navigate(`/staff/${member._id}`)}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-brand-navy to-brand-orange p-4 md:p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl font-bold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        member.status === 'active'
                          ? 'bg-green-500/20 text-white'
                          : 'bg-gray-500/20 text-white'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                    <p className="text-sm opacity-90 capitalize">{member.role}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 md:p-6 space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone size={18} className="text-brand-navy flex-shrink-0" />
                    <span className="text-sm">{member.phone}</span>
                  </div>

                  {member.specialization && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Briefcase size={18} className="text-brand-orange flex-shrink-0" />
                      <span className="text-sm">{member.specialization}</span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-brand-orange mb-1">
                        <Clock size={16} />
                      </div>
                      <p className="text-xl font-bold text-gray-900">{member.activeOrders || 0}</p>
                      <p className="text-xs text-gray-600">Active</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                        <CheckCircle size={16} />
                      </div>
                      <p className="text-xl font-bold text-gray-900">{member.completedOrders || 0}</p>
                      <p className="text-xs text-gray-600">Done</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-brand-navy mb-1">
                        <Briefcase size={16} />
                      </div>
                      <p className="text-xl font-bold text-gray-900">{member.totalOrders || 0}</p>
                      <p className="text-xs text-gray-600">Total</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 md:px-6 pb-4 md:pb-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteStaff(member._id, member.name);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Staff Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-100">
              <div className="sticky top-0 bg-gradient-to-r from-brand-navy to-brand-orange p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users size={28} />
                    <div>
                      <h2 className="text-lg md:text-xl font-bold">Add Staff Member</h2>
                      <p className="text-xs md:text-sm opacity-90">Fill in the details below</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddStaff} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-brand-navy focus:ring-4 focus:ring-brand-navy/10 outline-none transition-all"
                    placeholder="e.g., Abdul Mohammed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-brand-navy focus:ring-4 focus:ring-brand-navy/10 outline-none transition-all"
                    placeholder="e.g., 09010102200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-brand-navy focus:ring-4 focus:ring-brand-navy/10 outline-none transition-all"
                    placeholder="e.g., Agbada, Kaftan, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-brand-navy focus:ring-4 focus:ring-brand-navy/10 outline-none transition-all"
                  >
                    <option value="tailor">Tailor</option>
                    <option value="assistant">Assistant</option>
                    <option value="manager">Manager</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-brand-navy focus:ring-4 focus:ring-brand-navy/10 outline-none transition-all resize-none"
                    rows="3"
                    placeholder="Any additional information..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Save size={20} /> Add Staff Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold transition-all"
                  >
                    <X size={20} /> Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
