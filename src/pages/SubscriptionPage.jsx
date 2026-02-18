'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from '../stores/authStore';
import { CreditCard, Check, AlertTriangle } from 'lucide-react';

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const { tailor } = authStore();
  const [selectedPlan, setSelectedPlan] = useState('basic');

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '₦5,000',
      duration: '30 days',
      features: [
        'Unlimited Clients',
        'Unlimited Orders',
        'Unlimited Measurements',
        'Basic Reports',
        'WhatsApp Notifications',
      ],
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      price: '₦12,000',
      duration: '90 days',
      features: [
        'Everything in Basic',
        'Advanced Reports',
        'Staff Management',
        'Inventory Tracking',
        'Priority Support',
        'Custom Branding',
      ],
      popular: true,
    },
  ];

  const handleRenew = (planId) => {
    // TODO: Integrate payment gateway (Paystack, Flutterwave, etc.)
    alert(`Payment integration coming soon!\n\nSelected Plan: ${plans.find(p => p.id === planId)?.name}\n\nFor now, contact support to renew your subscription.`);
  };

  const getSubscriptionStatus = () => {
    if (!tailor?.subscription) return null;

    const { inGracePeriod, canWrite, daysLeftInGrace, endDate } = tailor.subscription;

    if (inGracePeriod) {
      return {
        type: 'grace',
        message: `Grace Period: ${daysLeftInGrace} day(s) remaining`,
        color: 'orange',
      };
    }

    if (!canWrite) {
      return {
        type: 'expired',
        message: 'Subscription Expired - Read-Only Mode',
        color: 'red',
      };
    }

    if (endDate) {
      const now = new Date();
      const end = new Date(endDate);
      const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
      
      if (daysLeft > 0 && daysLeft <= 7) {
        return {
          type: 'expiring',
          message: `Expires in ${daysLeft} day(s)`,
          color: 'yellow',
        };
      }
    }

    return null;
  };

  const status = getSubscriptionStatus();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Subscription & Billing</h1>
        <p className="text-gray-600 mt-2">Manage your subscription and payment details</p>
      </div>

      {/* Current Status */}
      {status && (
        <div className={`bg-${status.color}-50 border-2 border-${status.color}-300 rounded-xl p-4`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className={`text-${status.color}-600`} size={24} />
            <div>
              <h3 className="font-bold text-gray-900">Current Status</h3>
              <p className="text-sm text-gray-700">{status.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Plans */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl shadow-lg border-2 p-6 relative ${
                plan.popular ? 'border-indigo-500' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-indigo-600 mb-1">{plan.price}</div>
                <p className="text-sm text-gray-600">{plan.duration}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check size={16} className="text-green-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleRenew(plan.id)}
                className={`w-full py-3 rounded-lg font-bold transition-colors ${
                  plan.popular
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                <CreditCard className="inline mr-2" size={20} />
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">Payment Information</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Secure payment via Paystack/Flutterwave</li>
          <li>• Instant activation after payment</li>
          <li>• 5-day grace period after expiry</li>
          <li>• Contact support for assistance: support@sewtrack.com</li>
        </ul>
      </div>
    </div>
  );
}
