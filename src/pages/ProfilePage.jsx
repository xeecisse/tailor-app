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
  const { tailor, logout } = authStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    whatsappNumber: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (tailor) {
      setFormData({
        businessName: tailor.businessName || '',
        phone: tailor.phone || '',
        whatsappNumber: tailor.whatsappNumber || '',
      });
    }
  }, [tailor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await authStore.getState().updateProfile(formData);
    if (result.success) {
      setMessage('Profile updated successfully');
      setTimeout(() => {
        setMessage('');
        setShowAccountModal(false);
      }, 2000);
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
      className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
        border ? 'border-b border-gray-100 last:border-b-0' : ''
      }`}
    >
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
        <Icon size={24} className="text-gray-600" />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-900">{title}</div>
        {subtitle && <div className="text-sm text-gray-500 mt-0.5">{subtitle}</div>}
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </div>
  );

  const ProfileCard = () => (
    <div
      onClick={() => setShowAccountModal(true)}
      className="bg-white rounded-2xl border border-purple-200 p-5 mb-6 cursor-pointer hover:border-purple-300 transition-colors"
    >
      <div className="flex items-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
          <span className="text-2xl font-bold text-white">
            {getInitials(tailor?.businessName)}
          </span>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-900 text-lg">
            {tailor?.businessName || 'Business Name'}
          </div>
          <div className="text-sm text-gray-500 mt-0.5">{tailor?.email}</div>
          <div className="text-sm text-gray-500">{tailor?.phone || 'No phone'}</div>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-2">Manage your account and preferences</p>
        </div>

        {/* Profile Card */}
        <ProfileCard />

        {/* Account Section */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
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
          <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">Preferences</h2>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
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
          <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">Communication</h2>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
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
          <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">Support</h2>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
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
          className="w-full bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors group"
        >
          <LogOut size={20} className="text-red-600 mr-2" />
          <span className="font-semibold text-red-600">Log Out</span>
        </button>
      </div>

      {/* Account Edit Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Account Settings</h3>
              <button
                onClick={() => setShowAccountModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {message && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Building2 size={16} /> Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Enter business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={16} /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare size={16} /> WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Enter WhatsApp number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail size={16} /> Email
                </label>
                <input
                  type="email"
                  value={tailor?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors"
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
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Log Out</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
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
