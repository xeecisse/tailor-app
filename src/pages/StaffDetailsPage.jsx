import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { staffAPI } from '../lib/api';
import {
  ArrowLeft,
  Phone,
  Briefcase,
  Clock,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Package,
  FileText,
} from 'lucide-react';

export default function StaffDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchStaffDetails();
  }, [id]);

  const fetchStaffDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await staffAPI.getById(id);
      setStaff(response.data.staff);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load staff details');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getDeliveriesForDate = (day) => {
    if (!staff?.upcomingDeliveries) return [];
    const dateStr = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    ).toISOString().split('T')[0];

    return staff.upcomingDeliveries.filter((delivery) => {
      const deliveryDate = new Date(delivery.deliveryDate).toISOString().split('T')[0];
      return deliveryDate === dateStr;
    });
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
    setSelectedDate(null);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Loading staff details...</p>
        </div>
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Staff member not found'}</p>
          <button
            onClick={() => navigate('/staff')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all shadow-lg"
          >
            Back to Staff List
          </button>
        </div>
      </div>
    );
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const deliveriesForSelectedDate = selectedDate ? getDeliveriesForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/staff')}
              className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-purple-50 hover:-translate-x-1 transition-all shadow-sm"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {staff.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-1">
                {staff.name}
              </h1>
              <div className="text-purple-600 text-sm font-semibold uppercase tracking-wider mb-3">
                {staff.role}
              </div>
              <div className="flex items-center gap-8 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Phone size={16} /> {staff.phone}
                </span>
                {staff.specialization && (
                  <span className="flex items-center gap-2">
                    <Briefcase size={16} /> Specializes in: {staff.specialization}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className="px-7 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold hover:-translate-y-0.5 transition-all shadow-lg"
          >
            <FileText size={18} className="inline mr-2" />
            View in Orders
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-14">
          {[
            { label: 'Active', value: staff.stats?.active || 0, icon: Clock, color: 'from-orange-500 to-amber-500', bgColor: 'bg-orange-50' },
            { label: 'Completed', value: staff.stats?.completed || 0, icon: CheckCircle, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50' },
            { label: 'Total', value: staff.stats?.total || 0, icon: BarChart3, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50' },
            { label: 'Completion Rate', value: `${staff.stats?.completionRate || 0}%`, icon: TrendingUp, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`${stat.bgColor} p-8 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-200`}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4`}>
                  <Icon size={20} />
                </div>
                <div className="text-4xl font-extrabold mb-2 text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Monthly Performance */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Monthly Performance
          </h2>
          <div className="grid grid-cols-6 gap-4">
            {staff.monthlyPerformance?.map((month, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all border border-gray-200"
              >
                <div className="text-xs text-gray-500 font-semibold mb-4">{month.month}</div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-1000"
                    style={{ width: `${month.percentage}%` }}
                  />
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {month.completed}/{month.total}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Delivery Calendar */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">
            Delivery Calendar
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Tap a highlighted date to see assigned orders
          </p>
          <div className="grid grid-cols-[320px_1fr] gap-8">
            {/* Calendar */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => changeMonth(-1)}
                  className="w-8 h-8 bg-purple-100 rounded-md hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center text-gray-700"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="text-xl font-bold text-gray-900">
                  {monthName}
                </div>
                <button
                  onClick={() => changeMonth(1)}
                  className="w-8 h-8 bg-purple-100 rounded-md hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center text-gray-700"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-center text-xs text-gray-500 font-semibold p-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
                  <div key={`empty-${idx}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const day = idx + 1;
                  const hasDeliveries = getDeliveriesForDate(day).length > 0;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(day)}
                      className={`aspect-square flex items-center justify-center text-sm rounded-lg font-medium transition-all ${
                        isToday(day)
                          ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-md'
                          : selectedDate === day
                          ? 'bg-purple-600 text-white'
                          : hasDeliveries
                          ? 'bg-purple-100 text-purple-700 font-bold'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center justify-center text-center">
              {selectedDate && deliveriesForSelectedDate.length > 0 ? (
                <div className="w-full">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">
                    Deliveries for {monthName.split(' ')[0]} {selectedDate}
                  </h3>
                  <div className="space-y-4">
                    {deliveriesForSelectedDate.map((delivery) => (
                      <div
                        key={delivery.orderId}
                        className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg text-left hover:from-purple-100 hover:to-pink-100 transition-all cursor-pointer border border-purple-200"
                        onClick={() => navigate(`/orders/${delivery.orderId}`)}
                      >
                        <div className="font-bold text-gray-900 mb-1">
                          {delivery.orderNumber}
                        </div>
                        <div className="text-sm text-gray-600">
                          Client: {delivery.clientName}
                        </div>
                        <div className="text-xs text-purple-600 mt-2 capitalize font-semibold">
                          Status: {delivery.status.replace('_', ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <Calendar size={64} className="text-gray-300 mb-4" />
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    {selectedDate
                      ? `No deliveries on ${monthName.split(' ')[0]} ${selectedDate}`
                      : 'Select a date to view deliveries'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {selectedDate
                      ? 'No orders are scheduled for delivery on this date'
                      : 'Choose a date from the calendar to see assigned orders'}
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Order History */}
        <section>
          <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Order History
            </h2>
            {staff.orderHistory && staff.orderHistory.length > 0 ? (
              <div className="space-y-4">
                {staff.orderHistory.map((order) => (
                  <div
                    key={order._id}
                    className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all cursor-pointer flex justify-between items-center border border-purple-200"
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    <div>
                      <div className="font-bold text-lg mb-1 text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-600">
                        Client: {order.clientId?.name} • {order.attireType}
                      </div>
                      <div className="text-xs text-purple-600 mt-2 font-semibold">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    <div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${
                          order.status === 'completed' || order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package size={64} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No orders assigned yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
