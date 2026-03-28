// store/profileStore.js
import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const useProfileStore = create((set, get) => ({
    user: null,
    listings: [],
    savedProperties: [],
    stats: null,
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    },

    // Get auth header
    getAuthHeader: () => {
        const { token } = useAuthStore.getState();
        if (!token) {
            throw new Error('No authentication token found');
        }
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    },

    // Fetch user profile
    fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/api/profile`, get().getAuthHeader());
            set({ 
                user: response.data.data.user,
                loading: false 
            });
            return response.data;
        } catch (error) {
            set({ 
                loading: false, 
                error: error.response?.data?.message || 'Failed to fetch profile'
            });
            throw error;
        }
    },

    // Update profile
    updateProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.put(`${API_URL}/api/profile`, profileData, get().getAuthHeader());
            set({ 
                user: response.data.data.user,
                loading: false 
            });
            toast.success('Profile updated successfully');
            return response.data;
        } catch (error) {
            set({ 
                loading: false, 
                error: error.response?.data?.message || 'Failed to update profile'
            });
            throw error;
        }
    },

    // Update avatar
    updateAvatar: async (file) => {
        set({ loading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            
            const response = await axios.post(`${API_URL}/api/profile/avatar`, formData, {
                ...get().getAuthHeader(),
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            set(state => ({
                user: state.user ? { ...state.user, avatar_url: response.data.data.avatar_url } : null,
                loading: false
            }));
            
            toast.success('Profile picture updated');
            return response.data;
        } catch (error) {
            set({ 
                loading: false, 
                error: error.response?.data?.message || 'Failed to update avatar'
            });
            throw error;
        }
    },

    // Change password
    changePassword: async (passwordData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/api/profile/change-password`, passwordData, get().getAuthHeader());
            set({ loading: false });
            toast.success('Password changed successfully');
            return response.data;
        } catch (error) {
            set({ 
                loading: false, 
                error: error.response?.data?.message || 'Failed to change password'
            });
            throw error;
        }
    },

    // Fetch user listings
    fetchUserListings: async (page = 1, status = 'all') => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/api/profile/listings?page=${page}&status=${status}`, get().getAuthHeader());
            set({ 
                listings: response.data.data.listings,
                pagination: response.data.data.pagination,
                loading: false 
            });
            return response.data;
        } catch (error) {
            set({ 
                loading: false, 
                error: error.response?.data?.message || 'Failed to fetch listings'
            });
            throw error;
        }
    },

    // Fetch saved properties
    fetchSavedProperties: async (page = 1) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/api/profile/saved?page=${page}`, get().getAuthHeader());
            set({ 
                savedProperties: response.data.data.properties,
                pagination: response.data.data.pagination,
                loading: false 
            });
            return response.data;
        } catch (error) {
            set({ 
                loading: false, 
                error: error.response?.data?.message || 'Failed to fetch saved properties'
            });
            throw error;
        }
    },

    // Fetch user stats
    fetchStats: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/api/profile/stats`, get().getAuthHeader());
            set({ 
                stats: response.data.data,
                loading: false 
            });
            return response.data;
        } catch (error) {
            set({ 
                loading: false, 
                error: error.response?.data?.message || 'Failed to fetch stats'
            });
            throw error;
        }
    },

    // Delete listing
    deleteListing: async (listingId) => {
        set({ loading: true, error: null });
        try {
            const { deleteProperty } = useAdStore.getState();
            await deleteProperty(listingId);
            
            // Refresh listings after deletion
            await get().fetchUserListings();
            
            set({ loading: false });
            toast.success('Listing deleted successfully');
        } catch (error) {
            set({ 
                loading: false, 
                error: error.response?.data?.message || 'Failed to delete listing'
            });
            throw error;
        }
    },

    // Clear error
    clearError: () => set({ error: null })
}));