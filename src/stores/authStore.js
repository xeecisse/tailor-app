import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../lib/api';

const authStore = create((set) => ({
  user: null,
  role: null,
  token: localStorage.getItem('sewtrack_token') || null,
  refreshToken: localStorage.getItem('sewtrack_refresh_token') || null,
  isLoading: false,
  error: null,

  // Login
  login: async (email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
        role,
      });

      const { token, refreshToken, user, role: userRole } = response.data;

      localStorage.setItem('sewtrack_token', token);
      localStorage.setItem('sewtrack_refresh_token', refreshToken);
      localStorage.setItem('sewtrack_role', userRole);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({
        user,
        role: userRole,
        token,
        refreshToken,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Sign up
  signup: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, data);

      const { token, user, role } = response.data;

      localStorage.setItem('sewtrack_token', token);
      localStorage.setItem('sewtrack_role', role);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({
        user,
        role,
        token,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch profile
  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/auth/profile`);
      set({ user: response.data.user || response.data.tailor, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false };
    }
  },

  // Update profile
  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, data);
      set({ user: response.data.user || response.data.tailor, isLoading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.details || error.response?.data?.message || 'Update failed';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('sewtrack_token');
    localStorage.removeItem('sewtrack_refresh_token');
    localStorage.removeItem('sewtrack_role');
    delete axios.defaults.headers.common['Authorization'];
    set({ user: null, role: null, token: null, refreshToken: null, error: null });
  },

  // Initialize auth (check token on app load)
  initializeAuth: () => {
    const token = localStorage.getItem('sewtrack_token');
    const refreshToken = localStorage.getItem('sewtrack_refresh_token');
    const role = localStorage.getItem('sewtrack_role');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ token, refreshToken, role });
    }
  },
}));

export default authStore;
export const useAuthStore = authStore;
