'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scissors,
  Users,
  ShoppingBag,
  Ruler,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Zap,
  BarChart3,
  Lock,
  Smartphone,
} from 'lucide-react';
import logo from '../assets/logo.png';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Client Management',
      description: 'Organize and manage all your clients in one place with detailed profiles and history',
    },
    {
      icon: Ruler,
      title: 'Measurements Storage',
      description: 'Store precise body measurements for each client and attire type',
    },
    {
      icon: ShoppingBag,
      title: 'Order Tracking',
      description: 'Create, track, and manage orders from start to delivery',
    },
    {
      icon: TrendingUp,
      title: 'Financial Analytics',
      description: 'Monitor revenue, expenses, and payment status in real-time',
    },
    {
      icon: MessageSquare,
      title: 'Direct Messaging',
      description: 'Communicate seamlessly with customers and team members',
    },
    {
      icon: BarChart3,
      title: 'Business Reports',
      description: 'Get insights into your business performance and growth',
    },
  ];

  const userTypes = [
    {
      title: 'For Tailors',
      description: 'Manage your entire tailoring business efficiently',
      features: [
        'Client & measurement database',
        'Order management & tracking',
        'Inventory management',
        'Financial analytics',
        'Staff management',
        'Appointment scheduling',
      ],
      color: 'from-brand-navy to-brand-navy-light',
    },
    {
      title: 'For Customers',
      description: 'Track your orders and measurements with ease',
      features: [
        'Order tracking',
        'Measurement storage',
        'Connect with tailors',
        'Direct messaging',
        'Order history',
        'Easy communication',
      ],
      color: 'from-brand-orange to-brand-orange-light',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="SewTrack Logo" className="h-16 w-auto" />
            {/* <h1 className="text-2xl font-bold text-brand-navy">SewTrack</h1> */}
          </div>
          <div className="flex items-center gap-3">
        
            <button
              onClick={() => navigate('/login')}
              className="bg-brand-navy hover:bg-brand-navy-dark text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy-dark text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-4">
                {/* <img src={logo} alt="SewTrack Logo" className="h-16 w-auto" /> */}
                <div>
                  <h1 className="text-3xl font-bold">SewTrack</h1>
                  <p className="text-sm text-gray-300">Tailoring Business Management</p>
                </div>
              </div>
              <div>
                <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                  Manage Your Tailoring Business with Ease
                </h2>
                <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                  SewTrack is the all-in-one platform for tailors and customers. Streamline your operations, track orders, manage clients, and grow your business.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started <ArrowRight size={24} />
                </button>
                <button
                  onClick={() => {
                    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 border-2 border-white/50"
                >
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <p className="text-3xl font-bold text-brand-orange">100%</p>
                  <p className="text-gray-300 text-sm">Cloud Based</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brand-orange">24/7</p>
                  <p className="text-gray-300 text-sm">Accessible</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brand-orange">Secure</p>
                  <p className="text-gray-300 text-sm">Data Protected</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 rounded-3xl p-12 border-2 border-brand-orange/30">
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle size={24} className="text-brand-orange" />
                      <p className="font-semibold">Orders Managed</p>
                    </div>
                    <p className="text-3xl font-bold text-brand-orange">1,250+</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Users size={24} className="text-brand-orange" />
                      <p className="font-semibold">Clients Connected</p>
                    </div>
                    <p className="text-3xl font-bold text-brand-orange">500+</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp size={24} className="text-brand-orange" />
                      <p className="font-semibold">Revenue Tracked</p>
                    </div>
                    <p className="text-3xl font-bold text-brand-orange">₦50M+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src={logo} alt="SewTrack Logo" className="h-12 w-auto" />
              <h3 className="text-4xl font-bold text-brand-navy">Powerful Features</h3>
            </div>
            <p className="text-xl text-gray-600">Everything you need to run your tailoring business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-brand-navy hover:border-brand-orange"
                >
                  <div className="bg-brand-navy/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    <Icon size={32} className="text-brand-navy" />
                  </div>
                  <h4 className="text-xl font-bold text-brand-navy mb-3">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src={logo} alt="SewTrack Logo" className="h-12 w-auto" />
              <h3 className="text-4xl font-bold text-brand-navy">Built for Everyone</h3>
            </div>
            <p className="text-xl text-gray-600">Whether you're a tailor or a customer, SewTrack has you covered</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {userTypes.map((userType, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${userType.color} rounded-3xl p-10 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
              >
                <h4 className="text-3xl font-bold mb-3">{userType.title}</h4>
                <p className="text-lg opacity-90 mb-8">{userType.description}</p>
                <ul className="space-y-4">
                  {userType.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-3">
                      <CheckCircle size={20} className="flex-shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src={logo} alt="SewTrack Logo" className="h-12 w-auto" />
              <h3 className="text-4xl font-bold text-brand-navy">Why Choose SewTrack?</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: 'Fast & Efficient', desc: 'Streamline your workflow and save time' },
              { icon: Lock, title: 'Secure', desc: 'Your data is protected with encryption' },
              { icon: Smartphone, title: 'Mobile Ready', desc: 'Access from any device, anywhere' },
              { icon: BarChart3, title: 'Analytics', desc: 'Make data-driven business decisions' },
            ].map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all text-center">
                  <div className="bg-brand-orange/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Icon size={32} className="text-brand-orange" />
                  </div>
                  <h5 className="text-lg font-bold text-brand-navy mb-2">{benefit.title}</h5>
                  <p className="text-gray-600">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src={logo} alt="SewTrack Logo" className="h-12 w-auto" />
              <h3 className="text-4xl font-bold text-brand-navy">Simple, Transparent Pricing</h3>
            </div>
            <p className="text-xl text-gray-600">Choose the perfect plan for your business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Monthly Plan */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 overflow-hidden">
              <div className="p-8">
                <h4 className="text-2xl font-bold text-brand-navy mb-2">Monthly</h4>
                <p className="text-gray-600 text-sm mb-6">Pay as you go</p>
                
                <div className="mb-8">
                  <span className="text-5xl font-extrabold text-brand-navy">₦10,000</span>
                  <span className="text-gray-600 text-lg">/month</span>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-brand-navy px-6 py-3 rounded-lg font-bold transition-all duration-300 mb-8"
                >
                  Get Started
                </button>

                <div className="space-y-4">
                  {[
                    'Unlimited clients',
                    'All measurement types',
                    'Unlimited orders',
                    'Inventory management',
                    'Revenue tracking',
                    'Staff management',
                    'Customer communication',
                    'Mobile app access',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Annual Plan - Most Popular (Middle) */}
            <div className="bg-white rounded-2xl shadow-2xl hover:shadow-2xl transition-all border-4 border-brand-orange overflow-hidden transform md:scale-105 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-brand-orange text-white px-6 py-2 rounded-full font-bold text-sm">
                  Most Popular
                </div>
              </div>

              <div className="p-8 pt-12">
                <h4 className="text-2xl font-bold text-brand-navy mb-2">Annual</h4>
                <p className="text-gray-600 text-sm mb-6">Best value — save ₦24,000</p>
                
                <div className="mb-8">
                  <span className="text-5xl font-extrabold text-brand-navy">₦96,000</span>
                  <span className="text-gray-600 text-lg">/year</span>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 mb-8 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </button>

                <div className="space-y-4">
                  {[
                    'Everything in Quarterly',
                    'Save 20% vs monthly',
                    'Dedicated support',
                    'Advanced analytics',
                    'Custom integrations',
                    'Priority feature requests',
                    'Training & onboarding',
                    'White-label options',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quarterly Plan */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 overflow-hidden">
              <div className="p-8">
                <h4 className="text-2xl font-bold text-brand-navy mb-2">Quarterly</h4>
                <p className="text-gray-600 text-sm mb-6">Save ₦3,000 every quarter</p>
                
                <div className="mb-8">
                  <span className="text-5xl font-extrabold text-brand-navy">₦27,000</span>
                  <span className="text-gray-600 text-lg">/3 months</span>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-brand-navy px-6 py-3 rounded-lg font-bold transition-all duration-300 mb-8"
                >
                  Get Started
                </button>

                <div className="space-y-4">
                  {[
                    'Everything in Monthly',
                    'Save 10% vs monthly',
                    'Priority support',
                    'Data export',
                    'Advanced reporting',
                    'Custom fields',
                    'API access',
                    'Dedicated account manager',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-brand-navy to-brand-navy-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-brand-orange p-3 rounded-lg">
              <Scissors size={32} className="text-white" />
            </div>
            <h3 className="text-4xl font-bold">Ready to Transform Your Business?</h3>
          </div>
          <p className="text-xl text-gray-200 mb-10">
            Join hundreds of tailors and customers already using SewTrack to manage their business efficiently.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Get Started Now <ArrowRight size={24} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-navy-dark text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="SewTrack Logo" className="h-8 w-auto" />
                <span className="font-bold text-white">SewTrack</span>
              </div>
              <p className="text-sm">The complete tailoring business management platform.</p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-4">Product</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-brand-orange transition">Features</a></li>
                <li><a href="#" className="hover:text-brand-orange transition">Pricing</a></li>
                <li><a href="#" className="hover:text-brand-orange transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-4">Company</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-brand-orange transition">About</a></li>
                <li><a href="#" className="hover:text-brand-orange transition">Blog</a></li>
                <li><a href="#" className="hover:text-brand-orange transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-4">Legal</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-brand-orange transition">Privacy</a></li>
                <li><a href="#" className="hover:text-brand-orange transition">Terms</a></li>
                <li><a href="#" className="hover:text-brand-orange transition">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>&copy; 2024 SewTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
