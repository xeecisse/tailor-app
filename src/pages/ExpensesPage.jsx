'use client';

import React, { useState, useEffect } from 'react';
import { expenseAPI, uploadAPI } from '../lib/api';
import {
  DollarSign,
  Scissors,
  Settings,
  Lightbulb,
  Home,
  Car,
  Megaphone,
  Wrench,
  Package,
  FileText,
  Plus,
  Search,
  Calendar,
  CreditCard,
  User,
  Hash,
  MessageSquare,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Trash2,
  Eye
} from 'lucide-react';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const [formData, setFormData] = useState({
    category: 'materials',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    vendor: '',
    reference: '',
    notes: '',
    status: 'paid',
  });

  const categories = [
    { value: 'materials', label: 'Materials', icon: Scissors },
    { value: 'equipment', label: 'Equipment', icon: Settings },
    { value: 'utilities', label: 'Utilities', icon: Lightbulb },
    { value: 'rent', label: 'Rent', icon: Home },
    { value: 'salaries', label: 'Salaries', icon: DollarSign },
    { value: 'transportation', label: 'Transportation', icon: Car },
    { value: 'marketing', label: 'Marketing', icon: Megaphone },
    { value: 'maintenance', label: 'Maintenance', icon: Wrench },
    { value: 'supplies', label: 'Supplies', icon: Package },
    { value: 'other', label: 'Other', icon: FileText },
  ];

  useEffect(() => {
    fetchExpenses();
    fetchStats();
  }, [filterCategory, filterStatus, dateRange]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterCategory) params.category = filterCategory;
      if (filterStatus) params.status = filterStatus;
      if (dateRange.start) params.startDate = dateRange.start;
      if (dateRange.end) params.endDate = dateRange.end;

      const res = await expenseAPI.getAll(params);
      setExpenses(res.data.expenses);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await expenseAPI.getStats(dateRange.start, dateRange.end);
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      materials: '✂️',
      equipment: '⚙️',
      utilities: '💡',
      rent: '🏠',
      salaries: '💰',
      transportation: '🚗',
      marketing: '📢',
      maintenance: '🔧',
      supplies: '📦',
      other: '📝',
    };
    return emojiMap[category] || '📝';
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      materials: Scissors,
      equipment: Settings,
      utilities: Lightbulb,
      rent: Home,
      salaries: DollarSign,
      transportation: Car,
      marketing: Megaphone,
      maintenance: Wrench,
      supplies: Package,
      other: FileText,
    };
    return iconMap[category] || FileText;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await expenseAPI.create({
        ...formData,
        amount: parseFloat(formData.amount),
      });

      setMessage('Expense added successfully');
      setShowForm(false);
      setFormData({
        category: 'materials',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        vendor: '',
        reference: '',
        notes: '',
        status: 'paid',
      });
      fetchExpenses();
      fetchStats();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await expenseAPI.delete(id);
        setMessage('Expense deleted successfully');
        fetchExpenses();
        fetchStats();
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete expense');
      }
    }
  };

  // const getCategoryIcon = (category) => {
  //   return categories.find((c) => c.value === category)?.icon || FileText;
  // };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading expenses...</p>
        </div>
      </div>
    );
  }

  const totalExpenses = stats?.totalExpenses || 0;
  const expenseCount = stats?.count || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/3 w-[550px] h-[550px] bg-gradient-to-br from-orange-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Expense Tracking
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">{expenseCount} total expenses</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform"
          >
            <span className="text-2xl">➕</span> Add Expense
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transform border border-white/50 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-red-100 p-4 rounded-2xl shadow-md">
                <DollarSign size={32} className="text-red-700" />
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Expenses</p>
              <p className="text-3xl font-extrabold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                ₦{totalExpenses.toLocaleString()}
              </p>
            </div>
          </div>

          {stats?.byCategory && Object.entries(stats.byCategory).slice(0, 3).map(([category, amount], idx) => (
            <div 
              key={category}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transform border border-white/50 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-100 p-4 rounded-2xl shadow-md">
                  {(() => {
                    const Icon = getCategoryIcon(category);
                    return <Icon size={32} className="text-blue-600" />;
                  })()}
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1 capitalize">{category}</p>
                <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  ₦{amount.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Messages */}
        {error && (
          <div className="p-5 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl text-red-700 flex items-center gap-4 shadow-lg">
            <div className="bg-red-100 p-3 rounded-xl">
              <span className="text-2xl">⚠️</span>
            </div>
            <span className="font-semibold text-lg">{error}</span>
          </div>
        )}
        {message && (
          <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl text-green-700 flex items-center gap-4 shadow-lg">
            <div className="bg-green-100 p-3 rounded-xl">
              <span className="text-2xl">✅</span>
            </div>
            <span className="font-semibold text-lg">{message}</span>
          </div>
        )}

        {/* Add Expense Form */}
        {showForm && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                <span className="text-3xl">💸</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Add New Expense
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Package size={20} /> Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.emoji} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign size={20} /> Amount (₦) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={20} /> Date *
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
                    <CreditCard size={20} /> Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                  >
                    <option value="cash">Cash</option>
                    <option value="transfer">Bank Transfer</option>
                    <option value="card">Card</option>
                    <option value="cheque">Cheque</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <User size={20} /> Vendor/Supplier
                  </label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                    placeholder="Vendor name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Hash size={20} /> Reference/Receipt #
                  </label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                    placeholder="Receipt number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FileText size={20} /> Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
                  placeholder="What was this expense for?"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare size={20} /> Notes
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
                  <Save size={20} /> Save Expense
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="text-xl">✕</span> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-4 border-2 border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterCategory('');
                  setDateRange({ start: '', end: '' });
                }}
                className="w-full px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 rounded-xl font-bold transition-all"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        {expenses.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-purple-300 shadow-xl">
            <DollarSign size={80} className="mx-auto mb-6 text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No expenses yet</h3>
            <p className="text-gray-600 text-lg">Start tracking your business expenses</p>
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.map((expense) => {
              const ExpenseIcon = getCategoryIcon(expense.category);
              return (
              <div
                key={expense._id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-purple-200 hover:border-purple-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-2xl">
                      <ExpenseIcon size={28} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{expense.description}</h3>
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-bold capitalize">
                          {expense.category}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-semibold">Date:</span> {new Date(expense.date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-semibold">Method:</span> {expense.paymentMethod}
                        </div>
                        {expense.vendor && (
                          <div>
                            <span className="font-semibold">Vendor:</span> {expense.vendor}
                          </div>
                        )}
                        {expense.reference && (
                          <div>
                            <span className="font-semibold">Ref:</span> {expense.reference}
                          </div>
                        )}
                      </div>
                      {expense.notes && (
                        <p className="mt-2 text-sm text-gray-600 italic">{expense.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-extrabold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                        ₦{expense.amount.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="p-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      <Trash2 size={18} />
                    </button>
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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
