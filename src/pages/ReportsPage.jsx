import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../lib/api';
import {
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  BarChart3,
  Package,
  ShoppingCart,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [period, setPeriod] = useState('thisMonth');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReport();
  }, [activeTab, period]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');
      const response = activeTab === 'orders'
        ? await reportsAPI.getOrdersReport(period)
        : await reportsAPI.getPOSReport(period);
      setReport(response.data.report);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading && !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading reports...</p>
        </div>
      </div>
    );
  }

  const revenueChartData = {
    labels: report?.monthlyRevenue?.map((m) => m.month) || [],
    datasets: [
      {
        label: 'Revenue',
        data: report?.monthlyRevenue?.map((m) => m.revenue) || [],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context) => `Revenue: ${formatCurrency(context.parsed.y)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₦${(value / 1000).toFixed(0)}k`,
          font: { size: 12 },
          color: '#64748b',
        },
        grid: {
          color: '#f1f5f9',
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          font: { size: 12 },
          color: '#64748b',
        },
        grid: { display: false },
      },
    },
  };

  const paymentChartData = {
    labels: ['Paid', 'Pending'],
    datasets: [
      {
        data: [
          report?.paymentStatus?.paid || 0,
          report?.paymentStatus?.pending || 0,
        ],
        backgroundColor: ['#10b981', '#e5e7eb'],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  };

  const paymentChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        callbacks: {
          label: (context) =>
            `${context.label}: ${context.parsed} order${context.parsed !== 1 ? 's' : ''}`,
        },
      },
    },
  };

  const paidPercentage =
    report?.metrics?.totalOrders > 0
      ? ((report.paymentStatus.paid / report.metrics.totalOrders) * 100).toFixed(0)
      : 0;

  const pipelineData = activeTab === 'orders'
    ? [
        { label: 'Completed', value: report?.pipeline?.completed || 0 },
        { label: 'In Progress', value: report?.pipeline?.in_progress || 0 },
        { label: 'Pending', value: report?.pipeline?.pending || 0 },
      ]
    : [
        { label: 'Delivered', value: report?.pipeline?.delivered || 0 },
        { label: 'In Transit', value: report?.pipeline?.in_transit || 0 },
        { label: 'Pending', value: report?.pipeline?.pending || 0 },
      ];

  const totalPipeline = pipelineData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Revenue Reports
          </h1>
          <p className="text-gray-600 text-base md:text-lg font-medium">
            Track your business performance and growth
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
            }`}
          >
            <Package size={20} /> Orders
          </button>
          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'pos'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
            }`}
          >
            <ShoppingCart size={20} /> POS Sales
          </button>
        </div>

        {/* Period Selector */}
        <div className="flex justify-end mb-8">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-6 py-3 bg-white rounded-xl border-0 font-semibold text-gray-700 shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="last3Months">Last 3 Months</option>
            <option value="last6Months">Last 6 Months</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {activeTab === 'orders' ? (
            <>
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(report?.metrics?.totalRevenue || 0)}
                subtitle={`${report?.metrics?.totalOrders || 0} orders`}
                icon={<DollarSign size={24} />}
                color="orange"
                trend="neutral"
              />
              <MetricCard
                title="Collected"
                value={formatCurrency(report?.metrics?.collected || 0)}
                subtitle={`${formatPercentage(report?.metrics?.collectionRate || 0)} collected`}
                icon={<CheckCircle size={24} />}
                color="green"
                trend="up"
                trendValue={formatPercentage(report?.metrics?.collectionRate || 0)}
              />
              <MetricCard
                title="Outstanding"
                value={formatCurrency(report?.metrics?.outstanding || 0)}
                subtitle={`${report?.paymentStatus?.pending || 0} pending payments`}
                icon={<Clock size={24} />}
                color="red"
              />
              <MetricCard
                title="Avg Order Value"
                value={formatCurrency(report?.metrics?.avgOrderValue || 0)}
                subtitle={`${report?.metrics?.uniqueClients || 0} clients`}
                icon={<BarChart3 size={24} />}
                color="purple"
              />
            </>
          ) : (
            <>
              <MetricCard
                title="Total POS Sales"
                value={formatCurrency(report?.metrics?.totalRevenue || 0)}
                subtitle={`${report?.metrics?.totalOrders || 0} transactions`}
                icon={<ShoppingCart size={24} />}
                color="orange"
                trend="neutral"
              />
              <MetricCard
                title="Today's Sales"
                value={formatCurrency(report?.metrics?.todayRevenue || 0)}
                subtitle="Daily revenue"
                icon={<TrendingUp size={24} />}
                color="green"
              />
              <MetricCard
                title="This Week"
                value={formatCurrency(report?.metrics?.weekRevenue || 0)}
                subtitle="Weekly revenue"
                icon={<BarChart3 size={24} />}
                color="blue"
              />
              <MetricCard
                title="Avg Sale Value"
                value={formatCurrency(report?.metrics?.avgOrderValue || 0)}
                subtitle="Per transaction"
                icon={<DollarSign size={24} />}
                color="purple"
              />
            </>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Revenue Trend</h3>
              <p className="text-sm text-gray-600">Monthly revenue performance</p>
            </div>
            <div className="h-[300px]">
              <Line data={revenueChartData} options={revenueChartOptions} />
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Payment Status</h3>
              <p className="text-sm text-gray-600">Payment collection overview</p>
            </div>
            <div className="relative w-48 h-48 mx-auto mb-6">
              <Doughnut data={paymentChartData} options={paymentChartOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-gray-900">{paidPercentage}%</div>
                <div className="text-sm text-gray-600">Paid</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-sm text-gray-600">Paid</span>
                </div>
                <span className="font-bold text-gray-900">{report?.paymentStatus?.paid || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-300"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <span className="font-bold text-gray-900">{report?.paymentStatus?.pending || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pipeline or Payment Methods */}
          {activeTab === 'orders' ? (
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Order Pipeline</h3>
                <p className="text-sm text-gray-600">Orders by processing stage</p>
              </div>
              <div className="space-y-6">
                {pipelineData.map((item, idx) => {
                  const percentage = totalPipeline > 0 ? (item.value / totalPipeline) * 100 : 0;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-gray-900">{item.label}</span>
                        <span className="font-bold text-purple-600">
                          {item.value} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Payment Methods</h3>
                <p className="text-sm text-gray-600">Breakdown by payment type</p>
              </div>
              {report?.paymentMethods && report.paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {report.paymentMethods.map((method, idx) => {
                    const totalAmount = report.paymentMethods.reduce((sum, m) => sum + m.amount, 0);
                    const percentage = totalAmount > 0 ? (method.amount / totalAmount) * 100 : 0;
                    return (
                      <div key={idx} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-900 capitalize">{method.method}</span>
                          <span className="text-sm text-gray-600">{method.count} transactions</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-purple-600">
                            {formatCurrency(method.amount)}
                          </span>
                          <span className="text-sm font-semibold text-gray-600">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <DollarSign size={64} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 font-medium">No sales yet</p>
                </div>
              )}
            </div>
          )}

          {/* Top Items */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {activeTab === 'orders' ? 'Top Selling Attires' : 'Best Selling Items'}
              </h3>
              <p className="text-sm text-gray-600">Best performing products</p>
            </div>
            {(activeTab === 'orders' ? report?.topAttires : report?.topItems)?.length > 0 ? (
              <div className="space-y-3">
                {(activeTab === 'orders' ? report?.topAttires : report?.topItems)?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all border border-purple-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.count} {activeTab === 'orders' ? 'orders' : 'sold'}</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(item.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package size={64} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 font-medium">No sales yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, color, trend, trendValue }) {
  const colorClasses = {
    orange: {
      accent: 'from-orange-500 to-amber-500',
      bg: 'bg-orange-50',
      icon: 'bg-orange-100 text-orange-600',
    },
    green: {
      accent: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50',
      icon: 'bg-green-100 text-green-600',
    },
    red: {
      accent: 'from-red-500 to-pink-500',
      bg: 'bg-red-50',
      icon: 'bg-red-100 text-red-600',
    },
    purple: {
      accent: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-50',
      icon: 'bg-purple-100 text-purple-600',
    },
    blue: {
      accent: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      icon: 'bg-blue-100 text-blue-600',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all relative overflow-hidden`}>
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.accent}`} />
      <div className="flex justify-between items-start mb-4">
        <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          {title}
        </div>
        <div className={`w-12 h-12 rounded-xl ${colors.icon} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-extrabold text-gray-900 mb-2">{value}</div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>{subtitle}</span>
        {trend && (
          <span
            className={`px-2 py-0.5 rounded-md text-xs font-bold ${
              trend === 'up'
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {trend === 'up' ? '↑' : '⚡'} {trendValue || 'New'}
          </span>
        )}
      </div>
    </div>
  );
}
