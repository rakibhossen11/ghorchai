import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const useAdStore = create((set, get) => ({
  ads: [],
  currentAd: null,
  loading: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  },

  fetchAds: async (filters = {}, page = 1) => {
    set({ loading: true });
    try {
      const params = new URLSearchParams({ page, ...filters }).toString();
      const response = await axios.get(`${API_URL}/ads?${params}`);
      
      if (page === 1) {
        set({ 
          ads: response.data.ads,
          pagination: response.data.pagination,
          loading: false 
        });
      } else {
        set((state) => ({ 
          ads: [...state.ads, ...response.data.ads],
          pagination: response.data.pagination,
          loading: false 
        }));
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
      set({ loading: false });
    }
  },

  fetchAdById: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/ads/${id}`);
      set({ currentAd: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.error('Error fetching ad:', error);
      set({ loading: false });
      throw error;
    }
  },

  createAd: async (adData) => {
    set({ loading: true });
    try {
      const response = await axios.post(`${API_URL}/ads`, adData, {
        withCredentials: true
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updateAd: async (id, data) => {
    set({ loading: true });
    try {
      const response = await axios.put(`${API_URL}/ads/${id}`, data, {
        withCredentials: true
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  deleteAd: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/ads/${id}`, {
        withCredentials: true
      });
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  }
}));

export { useAdStore };