// store/locationStore.js
import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const useLocationStore = create((set, get) => ({
    divisions: [],
    districts: [],
    upazilas: [],
    loading: {
        divisions: false,
        districts: false,
        upazilas: false
    },
    error: null,

    // Get all divisions
    getDivisions: async () => {
        set(state => ({ 
            loading: { ...state.loading, divisions: true },
            error: null 
        }));
        
        try {
            const response = await axios.get(`${API_URL}/api/locations/divisions`);
            set({ 
                divisions: response.data.data,
                loading: { ...get().loading, divisions: false }
            });
            return response.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to fetch divisions',
                loading: { ...get().loading, divisions: false }
            });
            throw error;
        }
    },

    // Get districts by division ID
    getDistricts: async (divisionId) => {
        set(state => ({ 
            loading: { ...state.loading, districts: true },
            error: null 
        }));
        
        try {
            const response = await axios.get(`${API_URL}/api/locations/districts/${divisionId}`);
            set({ 
                districts: response.data.data,
                loading: { ...get().loading, districts: false }
            });
            return response.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to fetch districts',
                loading: { ...get().loading, districts: false }
            });
            throw error;
        }
    },

    // Get upazilas by district ID
    getUpazilas: async (districtId) => {
        set(state => ({ 
            loading: { ...state.loading, upazilas: true },
            error: null 
        }));
        
        try {
            const response = await axios.get(`${API_URL}/api/locations/upazilas/${districtId}`);
            set({ 
                upazilas: response.data.data,
                loading: { ...get().loading, upazilas: false }
            });
            return response.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to fetch upazilas',
                loading: { ...get().loading, upazilas: false }
            });
            throw error;
        }
    },

    // Reset districts (when division changes)
    resetDistricts: () => set({ districts: [] }),
    
    // Reset upazilas (when district changes)
    resetUpazilas: () => set({ upazilas: [] }),
    
    // Clear error
    clearError: () => set({ error: null })
}));