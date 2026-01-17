import { create } from 'zustand';
import { authAPI } from '../api/client';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(credentials);
      const { access_token, refresh_token } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      // Get user info
      const userResponse = await authAPI.getMe();
      set({
        user: userResponse.data,
        isAuthenticated: true,
        isLoading: false
      });

      return true;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Login failed',
        isLoading: false
      });
      return false;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await authAPI.register(userData);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Registration failed',
        isLoading: false
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      const response = await authAPI.getMe();
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ isAuthenticated: false, user: null });
    }
  },
}));

export default useAuthStore;
