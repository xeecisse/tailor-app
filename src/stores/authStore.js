import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authStore = create((set) => ({
  tailor: null,
  token: localStorage.getItem('sewtrack_token') || null,
  refreshToken: localStorage.getItem('sewtrack_refresh_token') || null,
  isLoading: false,
  error: null,

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, refreshToken, tailor } = response.data;

      localStorage.setItem('sewtrack_token', token);
      localStorage.setItem('sewtrack_refresh_token', refreshToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({
        tailor,
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

      const { token, tailor } = response.data;

      localStorage.setItem('sewtrack_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({
        tailor,
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
      set({ tailor: response.data.tailor, isLoading: false });
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
      set({ tailor: response.data.tailor, isLoading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Update failed';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('sewtrack_token');
    localStorage.removeItem('sewtrack_refresh_token');
    delete axios.defaults.headers.common['Authorization'];
    set({ tailor: null, token: null, refreshToken: null, error: null });
  },

  // Initialize auth (check token on app load)
  initializeAuth: () => {
    const token = localStorage.getItem('sewtrack_token');
    const refreshToken = localStorage.getItem('sewtrack_refresh_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ token, refreshToken });
    }
  },
}));

export default authStore;
