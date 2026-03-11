'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { authAPI } from '../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('tailor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.forgotPassword(email, role);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-navy-50 via-brand-orange-50 to-brand-navy-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-300">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle size={48} className="text-green-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
              Check Your Email
            </h2>
            
            <p className="text-gray-600 text-center mb-6">
              If an account exists with <span className="font-semibold">{email}</span>, we've sent a password reset link. 
              The link will expire in 1 hour.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Check your spam folder if you don't see the email.
              </p>
            </div>

            <Link
              to="/login"
              className="block w-full text-center bg-gradient-to-r from-brand-navy to-brand-orange text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy-50 via-brand-orange-50 to-brand-navy-50 flex items-center justify-center p-4">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-brand-navy to-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-orange to-brand-navy rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Back Button */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-brand-navy hover:text-brand-navy-dark font-semibold mb-8 transition-all"
        >
          <ArrowLeft size={20} /> Back to Login
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-brand-navy to-brand-orange p-4 rounded-full w-fit mx-auto mb-4">
              <Mail size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
            <p className="text-gray-600">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 flex items-center gap-3">
              <AlertTriangle size={20} className="flex-shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('tailor')}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all border-2 ${
                    role === 'tailor'
                      ? 'bg-gradient-to-r from-brand-navy to-brand-orange text-white border-brand-navy'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-brand-navy'
                  }`}
                >
                  Vendor
                </button>
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all border-2 ${
                    role === 'customer'
                      ? 'bg-gradient-to-r from-brand-navy to-brand-orange text-white border-brand-navy'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-brand-navy'
                  }`}
                >
                  Customer
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 outline-none transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-navy to-brand-orange text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Mail size={20} />
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-navy font-bold hover:text-brand-navy-dark transition-all">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
