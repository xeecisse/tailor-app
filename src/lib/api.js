import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', ''); // Get base URL without /api

const client = axios.create({
  baseURL: API_URL,
});

// Helper function to get full image URL
export const getImageUrl = (path) => {
  if (!path) return null;
  // If it's already a full URL (Cloudinary), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Otherwise, construct local server URL
  return `${BASE_URL}${path}`;
};

// Add token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('sewtrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors and token refresh
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('sewtrack_refresh_token');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          localStorage.setItem('sewtrack_token', response.data.token);
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          return client(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('sewtrack_token');
          localStorage.removeItem('sewtrack_refresh_token');
          window.location.href = '/login';
        }
      }
    } else if (error.response?.status === 401) {
      localStorage.removeItem('sewtrack_token');
      localStorage.removeItem('sewtrack_refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== AUTH ENDPOINTS =====
export const authAPI = {
  login: (email, password) => client.post('/auth/login', { email, password }),
  signup: (data) => client.post('/auth/signup', data),
  getProfile: () => client.get('/auth/profile'),
  updateProfile: (data) => client.put('/auth/profile', data),
};

// ===== CLIENT ENDPOINTS =====
export const clientAPI = {
  getAll: (status = 'active', search, page = 1, limit = 20) =>
    client.get('/clients', { params: { status, search, page, limit } }),
  getById: (clientId) => client.get(`/clients/${clientId}`),
  create: (data) => client.post('/clients', data),
  update: (clientId, data) => client.put(`/clients/${clientId}`, data),
  delete: (clientId) => client.delete(`/clients/${clientId}`),
};

// ===== ATTIRE TYPE ENDPOINTS =====
export const attireAPI = {
  getAll: (gender, isActive) =>
    client.get('/attires', { params: { gender, isActive } }),
  getById: (attireId) => client.get(`/attires/${attireId}`),
  create: (data) => client.post('/attires', data),
  update: (attireId, data) => client.put(`/attires/${attireId}`, data),
  delete: (attireId) => client.delete(`/attires/${attireId}`),
};

// ===== MEASUREMENT ENDPOINTS =====
export const measurementAPI = {
  getByClient: (clientId) => client.get(`/measurements/client/${clientId}`),
  getById: (measurementId) => client.get(`/measurements/${measurementId}`),
  create: (data) => client.post('/measurements', data),
  update: (measurementId, data) => client.put(`/measurements/${measurementId}`, data),
  copyToAttire: (measurementId, targetAttireTypeId) =>
    client.post(`/measurements/${measurementId}/copy-to-attire`, {
      targetAttireTypeId,
    }),
  toggleFavorite: (measurementId) =>
    client.patch(`/measurements/${measurementId}/favorite`),
  delete: (measurementId) => client.delete(`/measurements/${measurementId}`),
};

// ===== ORDER ENDPOINTS =====
export const orderAPI = {
  getAll: (status, paymentStatus, clientId, page = 1, limit = 20) =>
    client.get('/orders', { params: { status, paymentStatus, clientId, page, limit } }),
  getById: (orderId) => client.get(`/orders/${orderId}`),
  create: (data) => client.post('/orders', data),
  updateStatus: (orderId, status) =>
    client.patch(`/orders/${orderId}/status`, { status }),
  recordPayment: (orderId, data) =>
    client.post(`/orders/${orderId}/payment`, data),
  delete: (orderId) => client.delete(`/orders/${orderId}`),
};

// ===== INVENTORY ENDPOINTS =====
export const inventoryAPI = {
  // Categories
  getCategories: () => client.get('/inventory/categories'),
  createCategory: (data) => client.post('/inventory/categories', data),

  // Items
  getItems: (categoryId, status, page = 1, limit = 20) =>
    client.get('/inventory/items', { params: { categoryId, status, page, limit } }),
  getItemById: (itemId) => client.get(`/inventory/items/${itemId}`),
  createItem: (data) => client.post('/inventory/items', data),
  updateItem: (itemId, data) => client.put(`/inventory/items/${itemId}`, data),
  adjustInventory: (itemId, data) =>
    client.post(`/inventory/items/${itemId}/adjust`, data),
  deleteItem: (itemId) => client.delete(`/inventory/items/${itemId}`),
};

// ===== PURCHASE ORDER ENDPOINTS =====
export const purchaseOrderAPI = {
  getAll: (status, deliveryStatus, clientId, page = 1, limit = 20) =>
    client.get('/purchase-orders', { params: { status, deliveryStatus, clientId, page, limit } }),
  getById: (poId) => client.get(`/purchase-orders/${poId}`),
  create: (data) => client.post('/purchase-orders', data),
  updateDeliveryStatus: (poId, deliveryStatus) =>
    client.patch(`/purchase-orders/${poId}/delivery-status`, { deliveryStatus }),
  recordPayment: (poId, data) =>
    client.post(`/purchase-orders/${poId}/payment`, data),
  sendReminder: (poId) =>
    client.post(`/purchase-orders/${poId}/send-reminder`),
  delete: (poId) => client.delete(`/purchase-orders/${poId}`),
};

// ===== DASHBOARD ENDPOINTS =====
export const dashboardAPI = {
  getOverview: () => client.get('/dashboard/overview'),
  getRevenueReport: (startDate, endDate, type) =>
    client.get('/dashboard/report/revenue', { params: { startDate, endDate, type } }),
  getTopAttires: () => client.get('/dashboard/report/top-attires'),
  getTopInventory: () => client.get('/dashboard/report/top-inventory'),
  getLowStock: () => client.get('/dashboard/report/low-stock'),
  getPendingPayments: () => client.get('/dashboard/report/pending-payments'),
  getClientStats: () => client.get('/dashboard/report/clients'),
};

// ===== UPLOAD ENDPOINTS =====
export const uploadAPI = {
  getStatus: () => client.get('/upload/status'),
  uploadSingle: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return client.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    return client.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ===== WHATSAPP ENDPOINTS =====
export const whatsappAPI = {
  getStatus: () => client.get('/whatsapp/status'),
  sendOrderCompleted: (orderId) => client.post(`/whatsapp/notify/order-completed/${orderId}`),
  sendOrderDelivered: (orderId) => client.post(`/whatsapp/notify/order-delivered/${orderId}`),
  sendPaymentReminder: (orderId) => client.post(`/whatsapp/notify/payment-reminder/${orderId}`),
  sendCustomMessage: (clientId, message) => client.post(`/whatsapp/send/${clientId}`, { message }),
};

// ===== INVOICE ENDPOINTS =====
export const invoiceAPI = {
  getAll: (type, status, clientId) => client.get('/invoices', { params: { type, status, clientId } }),
  getById: (id) => client.get(`/invoices/${id}`),
  createFromOrder: (orderId, data) => client.post(`/invoices/from-order/${orderId}`, data),
  create: (data) => client.post('/invoices', data),
  update: (id, data) => client.put(`/invoices/${id}`, data),
  delete: (id) => client.delete(`/invoices/${id}`),
  download: (id) => client.get(`/invoices/${id}/download`, { responseType: 'blob' }),
  preview: (id) => client.get(`/invoices/${id}/preview`),
};

// ===== APPOINTMENT ENDPOINTS =====
export const appointmentAPI = {
  getAll: (params) => client.get('/appointments', { params }),
  getByDate: (date) => client.get(`/appointments/date/${date}`),
  getById: (id) => client.get(`/appointments/${id}`),
  create: (data) => client.post('/appointments', data),
  update: (id, data) => client.put(`/appointments/${id}`, data),
  cancel: (id, reason) => client.post(`/appointments/${id}/cancel`, { reason }),
  complete: (id) => client.post(`/appointments/${id}/complete`),
  sendReminder: (id) => client.post(`/appointments/${id}/send-reminder`),
  delete: (id) => client.delete(`/appointments/${id}`),
};

// ===== EXPENSE ENDPOINTS =====
export const expenseAPI = {
  getAll: (params) => client.get('/expenses', { params }),
  getStats: (startDate, endDate) => client.get('/expenses/stats', { params: { startDate, endDate } }),
  getById: (id) => client.get(`/expenses/${id}`),
  create: (data) => client.post('/expenses', data),
  update: (id, data) => client.put(`/expenses/${id}`, data),
  delete: (id) => client.delete(`/expenses/${id}`),
  bulkDelete: (ids) => client.post('/expenses/bulk-delete', { ids }),
};

// ===== STAFF ENDPOINTS =====
export const staffAPI = {
  getAll: () => client.get('/staff'),
  getById: (id) => client.get(`/staff/${id}`),
  create: (data) => client.post('/staff', data),
  update: (id, data) => client.put(`/staff/${id}`, data),
  delete: (id) => client.delete(`/staff/${id}`),
  assignOrder: (id, orderId) => client.post(`/staff/${id}/assign-order`, { orderId }),
  removeOrder: (id, orderId) => client.post(`/staff/${id}/remove-order`, { orderId }),
};

// ===== REPORTS ENDPOINTS =====
export const reportsAPI = {
  getOrdersReport: (period) => client.get('/reports/orders', { params: { period } }),
  getPOSReport: (period) => client.get('/reports/pos', { params: { period } }),
};

// ===== MESSAGES ENDPOINTS =====
export const messagesAPI = {
  getConversations: () => client.get('/messages/conversations'),
  getMessages: (clientId) => client.get(`/messages/client/${clientId}`),
  sendMessage: (clientId, message) => client.post('/messages/send', { clientId, message }),
  markAsRead: (clientId) => client.post(`/messages/mark-read/${clientId}`),
  getUnreadCount: () => client.get('/messages/unread-count'),
  deleteConversation: (clientId) => client.delete(`/messages/conversation/${clientId}`),
};

export default client;
