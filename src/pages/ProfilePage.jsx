'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Globe, 
  Bell, 
  MessageSquare, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Mail,
  Phone,
  Building2
} from 'lucide-react';
import authStore from '../stores/authStore';

export default function ProfilePage() {
  const { tailor, logout, fetchProfile } = authStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    whatsappNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
    },
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        await fetchProfile();
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (tailor) {
      setFormData({
        businessName: tailor.businessName || '',
        ownerName: tailor.ownerName || '',
        phone: tailor.phone || '',
        whatsappNumber: tailor.whatsappNumber || '',
        address: {
          street: tailor.address?.street || '',
          city: tailor.address?.city || '',
          state: tailor.address?.state || '',
          postalCode: tailor.address?.postalCode || '',
        },
      });
    }
  }, [tailor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const result = await authStore.getState().updateProfile(formData);
    if (result.success) {
      setMessage('Profile updated successfully');
      setTimeout(() => {
        setMessage('');
        setShowAccountModal(false);
      }, 2000);
    } else {
      setError(result.error || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const SettingItem = ({ icon: Icon, title, subtitle, onClick, border = true }) => (
    <div
      onClick={onClick}
      className={`flex items-center p-4 cursor-pointer hover:bg-brand-navy-50 transition-colors ${
        border ? 'border-b border-gray-100 last:border-b-0' : ''
      }`}
    >
      <div className="w-12 h-12 bg-gradient-to-br from-brand-navy-100 to-brand-orange-100 rounded-full flex items-center justify-center mr-4">
        <Icon size={24} className="text-brand-navy" />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-900">{title}</div>
        {subtitle && <div className="text-sm text-gray-600 mt-0.5">{subtitle}</div>}
      </div>
      <ChevronRight size={20} className="text-brand-navy" />
    </div>
  );

  const ProfileCard = () => (
    <div
      onClick={() => setShowAccountModal(true)}
      className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl border-2 border-gray-100 p-6 mb-6 cursor-pointer hover:border-brand-orange/50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
    >
      <div className="flex items-center">
        <div className="w-16 h-16 bg-gradient-to-br from-brand-navy to-brand-orange rounded-full flex items-center justify-center mr-4 shadow-lg">
          <span className="text-2xl font-bold text-white">
            {getInitials(tailor?.businessName)}
          </span>
        </div>
        <div className="flex-1">
          <div className="font-bold text-gray-900 text-lg">
            {tailor?.businessName || 'Business Name'}
          </div>
          <div className="text-sm text-gray-600 mt-0.5">{tailor?.ownerName || 'Owner'}</div>
          <div className="text-sm text-gray-600">{tailor?.email}</div>
          <div className="text-sm text-gray-600">{tailor?.phone || 'No phone'}</div>
        </div>
        <ChevronRight size={20} className="text-brand-navy" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy-50 via-brand-orange-50 to-brand-navy-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Enhanced Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-brand-navy to-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-orange to-brand-navy rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-[550px] h-[550px] bg-gradient-to-br from-brand-navy to-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-brand-navy via-brand-orange to-brand-orange-dark bg-clip-text text-transparent">Settings</h1>
          <p className="text-gray-600 mt-2 text-base md:text-lg font-medium">Manage your account and preferences</p>
        </div>

        {/* Profile Card */}
        <ProfileCard />

        {/* Account Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl border-2 border-gray-100 overflow-hidden mb-6 shadow-lg hover:shadow-xl transition-all">
          <SettingItem
            icon={User}
            title="Account"
            subtitle={tailor?.email}
            onClick={() => setShowAccountModal(true)}
            border={false}
          />
        </div>

        {/* Preferences Section */}
        <div className="mb-4">
          <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider mb-3 px-1">Preferences</h2>
        </div>
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl border-2 border-gray-100 overflow-hidden mb-6 shadow-lg hover:shadow-xl transition-all">
          <SettingItem
            icon={Globe}
            title="Language"
            subtitle="English"
            onClick={() => console.log('Language clicked')}
          />
          <SettingItem
            icon={Bell}
            title="Notifications"
            subtitle="WhatsApp & Email"
            onClick={() => console.log('Notifications clicked')}
            border={false}
          />
        </div>

        {/* Communication Section */}
        <div className="mb-4">
          <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider mb-3 px-1">Communication</h2>
        </div>
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl border-2 border-gray-100 overflow-hidden mb-6 shadow-lg hover:shadow-xl transition-all">
          <SettingItem
            icon={MessageSquare}
            title="Message Templates"
            subtitle="Customize notification messages"
            onClick={() => console.log('Message Templates clicked')}
            border={false}
          />
        </div>

        {/* Support Section */}
        <div className="mb-4">
          <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider mb-3 px-1">Support</h2>
        </div>
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl border-2 border-gray-100 overflow-hidden mb-6 shadow-lg hover:shadow-xl transition-all">
          <SettingItem
            icon={HelpCircle}
            title="Help & FAQ"
            subtitle="Get help using SewTrack"
            onClick={() => console.log('Help clicked')}
            border={false}
          />
        </div>

        {/* Log Out Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl border-2 border-red-300 p-5 flex items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all shadow-lg hover:shadow-xl group transform hover:scale-105"
        >
          <LogOut size={20} className="text-red-600 mr-2" />
          <span className="font-bold text-red-600">Log Out</span>
        </button>
      </div>

      {/* Account Edit Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border-2 border-gray-100 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-navy to-brand-orange bg-clip-text text-transparent">Account Settings</h3>
              <button
                onClick={() => setShowAccountModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {message && (
              <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 text-green-700 rounded-xl text-sm font-semibold">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 text-red-700 rounded-xl text-sm font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Building2 size={16} /> Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all"
                  placeholder="Enter business name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <User size={16} /> Owner Name
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all"
                  placeholder="Enter owner name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={16} /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare size={16} /> WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all"
                  placeholder="Enter WhatsApp number"
                />
              </div>

              <div className="border-t-2 border-gray-100 pt-4">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Address</h4>
                
                <div className="mb-3">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Street</label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value }
                    })}
                    className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all text-sm"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value }
                      })}
                      className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all text-sm"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">State</label>
                    <input
                      type="text"
                      value={formData.address.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value }
                      })}
                      className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all text-sm"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={formData.address.postalCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, postalCode: e.target.value }
                    })}
                    className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-brand-navy outline-none transition-all text-sm"
                    placeholder="Postal code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Mail size={16} /> Email
                </label>
                <input
                  type="email"
                  value={tailor?.email || ''}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-600 mt-1 font-medium">Email cannot be changed</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-100 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-br from-brand-navy to-brand-orange hover:from-brand-navy-dark hover:to-brand-orange-dark text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-sm w-full border-2 border-gray-100 shadow-2xl">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Log Out</h3>
            <p className="text-gray-600 mb-6 font-medium">Are you sure you want to log out?</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-100 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
