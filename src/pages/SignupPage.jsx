'use client';

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authStore from '../stores/authStore';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading, error } = authStore();
  const [role, setRole] = useState('tailor');
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    whatsappNumber: '',
  });
  const [localError, setLocalError] = useState('');
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === 'tailor') {
      if (
        !formData.businessName ||
        !formData.ownerName ||
        !formData.email ||
        !formData.password ||
        !formData.phone ||
        !formData.whatsappNumber
      ) {
        setLocalError('All fields are required');
        return;
      }
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.phone) {
        setLocalError('All fields are required');
        return;
      }
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (!acceptedPolicies) {
      setLocalError('You must accept the Terms of Service and Privacy Policy');
      return;
    }

    const signupData = { role };
    
    if (role === 'tailor') {
      signupData.businessName = formData.businessName;
      signupData.ownerName = formData.ownerName;
      signupData.email = formData.email;
      signupData.password = formData.password;
      signupData.phone = formData.phone;
      signupData.whatsappNumber = formData.whatsappNumber;
    } else {
      signupData.name = formData.name;
      signupData.email = formData.email;
      signupData.password = formData.password;
      signupData.phone = formData.phone;
    }

    const result = await signup(signupData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-navy-dark to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-brand-navy to-brand-orange rounded-xl mb-4 shadow-lg">
              <span className="text-white font-bold text-xl">ST</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">SewTrack</h1>
            <p className="text-gray-500 text-sm mt-1">Create your tailor account</p>
          </div>

          {/* Error Message */}
          {(error || localError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium">{error || localError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Sign Up As
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['tailor', 'customer'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      role === r
                        ? 'bg-gradient-to-r from-brand-navy to-brand-orange text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tailor Fields */}
            {role === 'tailor' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Your Tailor Shop"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Your Full Name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  />
                </div>
              </>
            )}

            {/* Customer Fields */}
            {role === 'customer' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all bg-gray-50 hover:bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+234..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all bg-gray-50 hover:bg-white"
              />
            </div>

            {/* WhatsApp (Tailor only) */}
            {role === 'tailor' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="+234..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
              </div>
            )}

            {/* Terms and Privacy Policy */}
            <div className="flex items-start gap-3 mt-4">
              <input
                type="checkbox"
                id="acceptPolicies"
                checked={acceptedPolicies}
                onChange={(e) => {
                  setAcceptedPolicies(e.target.checked);
                  setLocalError('');
                }}
                className="mt-1 w-4 h-4 text-brand-orange border-gray-300 rounded focus:ring-brand-orange"
              />
              <label htmlFor="acceptPolicies" className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="/terms" target="_blank" className="text-brand-orange hover:underline font-semibold">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" className="text-brand-orange hover:underline font-semibold">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !acceptedPolicies}
              className="w-full bg-gradient-to-r from-brand-navy to-brand-orange hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already registered?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="w-full block text-center py-3 px-4 border-2 border-brand-orange text-brand-orange font-semibold rounded-lg hover:bg-indigo-50 transition-all"
          >
            Sign In
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2024 SewTrack. All rights reserved.
        </p>
      </div>
    </div>
  );
}
