// store/adStore.js
import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const useAdStore = create((set, get) => ({
    properties: [],
    userProperties: [],
    savedProperties: [],
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    },

    // Get auth token helper
    getAuthHeader: () => {
        const { token } = useAuthStore.getState();
        if (!token) {
            throw new Error('No authentication token found. Please login again.');
        }
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    },

    // Create ad with images
    createAd: async (adData) => {
        set({ loading: true, error: null });
        
        try {
            const { user, token } = useAuthStore.getState();
            
            if (!user || !token) {
                throw new Error('Please login to post an ad');
            }

            console.log('Creating ad with user:', user.id);
            console.log('Token exists:', !!token);

            const formData = new FormData();
            
            // Append all text fields
            Object.keys(adData).forEach(key => {
                if (key !== 'images' && key !== 'amenities') {
                    formData.append(key, adData[key]);
                }
            });
            
            // Append amenities array
            if (adData.amenities && adData.amenities.length > 0) {
                adData.amenities.forEach(amenity => {
                    formData.append('amenities[]', amenity);
                });
            }
            
            // Append images (these are File objects from the file input)
            if (adData.images && adData.images.length > 0) {
                adData.images.forEach((image, index) => {
                    formData.append('images', image);
                });
                console.log(`Uploading ${adData.images.length} images`);
            }

            const response = await axios.post(`${API_URL}/api/properties`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Ad created successfully:', response.data);
            set({ loading: false });
            return response.data;
            
        } catch (error) {
            console.error('Create ad error:', error);
            set({ 
                loading: false, 
                error: error.response?.data?.message || error.message 
            });
            throw error;
        }
    },

    // Get all properties with filters
    getProperties: async (filters = {}) => {
        set({ loading: true, error: null });
        
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined && filters[key] !== '') {
                    params.append(key, filters[key]);
                }
            });
            
            const response = await axios.get(`${API_URL}/api/properties?${params}`);
            console.log('ad store',response);
            
            set({ 
                properties: response.data.data.properties,
                pagination: response.data.data.pagination,
                loading: false 
            });
            
            return response.data;
            
        } catch (error) {
            console.error('Get properties error:', error);
            set({ 
                loading: false, 
                error: error.response?.data?.message || error.message 
            });
            throw error;
        }
    },

    // Get single property
    getPropertyById: async (id) => {
        set({ loading: true, error: null });
        
        try {
            const response = await axios.get(`${API_URL}/api/properties/${id}`);
            set({ loading: false });
            return response.data;
            
        } catch (error) {
            console.error('Get property error:', error);
            set({ 
                loading: false, 
                error: error.response?.data?.message || error.message 
            });
            throw error;
        }
    },

    // Get user's properties (requires auth)
    getUserProperties: async (status = null) => {
        set({ loading: true, error: null });
        
        try {
            const { token } = useAuthStore.getState();
            if (!token) {
                throw new Error('Please login to view your properties');
            }
            
            const url = status 
                ? `${API_URL}/api/properties/user/my-properties?status=${status}`
                : `${API_URL}/api/properties/user/my-properties`;
            
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            set({ 
                userProperties: response.data.data.properties,
                pagination: response.data.data.pagination,
                loading: false 
            });
            
            return response.data;
            
        } catch (error) {
            console.error('Get user properties error:', error);
            set({ 
                loading: false, 
                error: error.response?.data?.message || error.message 
            });
            throw error;
        }
    },

    // Update property (requires auth)
    updateProperty: async (id, data) => {
        set({ loading: true, error: null });
        
        try {
            const { token } = useAuthStore.getState();
            if (!token) {
                throw new Error('Please login to update properties');
            }
            
            const response = await axios.put(`${API_URL}/api/properties/${id}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            set({ loading: false });
            return response.data;
            
        } catch (error) {
            console.error('Update property error:', error);
            set({ 
                loading: false, 
                error: error.response?.data?.message || error.message 
            });
            throw error;
        }
    },

    // Delete property (requires auth)
    deleteProperty: async (id) => {
        set({ loading: true, error: null });
        
        try {
            const { token } = useAuthStore.getState();
            if (!token) {
                throw new Error('Please login to delete properties');
            }
            
            await axios.delete(`${API_URL}/api/properties/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Remove from local state
            set(state => ({
                properties: state.properties.filter(p => p.id !== id),
                userProperties: state.userProperties.filter(p => p.id !== id),
                loading: false
            }));
            
        } catch (error) {
            console.error('Delete property error:', error);
            set({ 
                loading: false, 
                error: error.response?.data?.message || error.message 
            });
            throw error;
        }
    },

    // Save/favorite property (requires auth)
    saveProperty: async (id) => {
        set({ loading: true, error: null });
        
        try {
            const { token } = useAuthStore.getState();
            if (!token) {
                throw new Error('Please login to save properties');
            }
            
            const response = await axios.post(`${API_URL}/api/properties/${id}/save`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            set({ loading: false });
            return response.data;
            
        } catch (error) {
            console.error('Save property error:', error);
            set({ 
                loading: false, 
                error: error.response?.data?.message || error.message 
            });
            throw error;
        }
    },

    // Get saved properties (requires auth)
    getSavedProperties: async () => {
        set({ loading: true, error: null });
        
        try {
            const { token } = useAuthStore.getState();
            if (!token) {
                throw new Error('Please login to view saved properties');
            }
            
            const response = await axios.get(`${API_URL}/api/properties/user/saved`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            set({ 
                savedProperties: response.data.data.properties,
                loading: false 
            });
            
            return response.data;
            
        } catch (error) {
            console.error('Get saved properties error:', error);
            set({ 
                loading: false, 
                error: error.response?.data?.message || error.message 
            });
            throw error;
        }
    },

    // Clear error
    clearError: () => set({ error: null })
}));

// // store/adStore.js
// import { create } from 'zustand';
// import axios from 'axios';
// import { useAuthStore } from './authStore';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// export const useAdStore = create((set, get) => ({
//     properties: [],
//     userProperties: [],
//     savedProperties: [],
//     loading: false,
//     error: null,
//     pagination: {
//         page: 1,
//         limit: 10,
//         total: 0,
//         totalPages: 0
//     },

//     // Create ad with images
//     createAd: async (adData) => {
//         set({ loading: true, error: null });
        
//         try {
//             const { user } = useAuthStore.getState();
//             console.log('ad store',user);
//             if (!user) {
//                 throw new Error('Please login to post an ad');
//             }

//             const formData = new FormData();
            
//             // Append all text fields
//             Object.keys(adData).forEach(key => {
//                 if (key !== 'images' && key !== 'amenities') {
//                     formData.append(key, adData[key]);
//                 }
//             });
            
//             // Append amenities array
//             if (adData.amenities && adData.amenities.length > 0) {
//                 adData.amenities.forEach(amenity => {
//                     formData.append('amenities[]', amenity);
//                 });
//             }
            
//             // Append images
//             if (adData.images && adData.images.length > 0) {
//                 adData.images.forEach(image => {
//                     formData.append('images', image);
//                 });
//             }

//             const response = await axios.post(`${API_URL}/api/properties`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     'Authorization': `Bearer ${user.accessToken}`
//                 }
//             });
            
//             set({ loading: false });
//             return response.data;
            
//         } catch (error) {
//             set({ 
//                 loading: false, 
//                 error: error.response?.data?.message || error.message 
//             });
//             throw error;
//         }
//     },

//     // Get all properties with filters
//     getProperties: async (filters = {}) => {
//         set({ loading: true, error: null });
        
//         try {
//             const params = new URLSearchParams(filters);
//             const response = await axios.get(`${API_URL}/properties?${params}`);
            
//             set({ 
//                 properties: response.data.data.properties,
//                 pagination: response.data.data.pagination,
//                 loading: false 
//             });
            
//             return response.data;
            
//         } catch (error) {
//             set({ 
//                 loading: false, 
//                 error: error.response?.data?.message || error.message 
//             });
//             throw error;
//         }
//     },

//     // Get single property
//     getPropertyById: async (id) => {
//         set({ loading: true, error: null });
        
//         try {
//             const response = await axios.get(`${API_URL}/properties/${id}`);
//             set({ loading: false });
//             return response.data;
            
//         } catch (error) {
//             set({ 
//                 loading: false, 
//                 error: error.response?.data?.message || error.message 
//             });
//             throw error;
//         }
//     },

//     // Get user's properties
//     getUserProperties: async (status = null) => {
//         set({ loading: true, error: null });
        
//         try {
//             const { user } = useAuthStore.getState();
//             if (!user) throw new Error('Not authenticated');
            
//             const url = status 
//                 ? `${API_URL}/properties/user/my-properties?status=${status}`
//                 : `${API_URL}/properties/user/my-properties`;
            
//             const response = await axios.get(url, {
//                 headers: {
//                     'Authorization': `Bearer ${user.accessToken}`
//                 }
//             });
            
//             set({ 
//                 userProperties: response.data.data.properties,
//                 pagination: response.data.data.pagination,
//                 loading: false 
//             });
            
//             return response.data;
            
//         } catch (error) {
//             set({ 
//                 loading: false, 
//                 error: error.response?.data?.message || error.message 
//             });
//             throw error;
//         }
//     },

//     // Update property
//     updateProperty: async (id, data) => {
//         set({ loading: true, error: null });
        
//         try {
//             const { user } = useAuthStore.getState();
//             const response = await axios.put(`${API_URL}/properties/${id}`, data, {
//                 headers: {
//                     'Authorization': `Bearer ${user.accessToken}`
//                 }
//             });
            
//             set({ loading: false });
//             return response.data;
            
//         } catch (error) {
//             set({ 
//                 loading: false, 
//                 error: error.response?.data?.message || error.message 
//             });
//             throw error;
//         }
//     },

//     // Delete property
//     deleteProperty: async (id) => {
//         set({ loading: true, error: null });
        
//         try {
//             const { user } = useAuthStore.getState();
//             await axios.delete(`${API_URL}/properties/${id}`, {
//                 headers: {
//                     'Authorization': `Bearer ${user.accessToken}`
//                 }
//             });
            
//             // Remove from local state
//             set(state => ({
//                 properties: state.properties.filter(p => p.id !== id),
//                 userProperties: state.userProperties.filter(p => p.id !== id),
//                 loading: false
//             }));
            
//         } catch (error) {
//             set({ 
//                 loading: false, 
//                 error: error.response?.data?.message || error.message 
//             });
//             throw error;
//         }
//     },

//     // Save/favorite property
//     saveProperty: async (id) => {
//         set({ loading: true, error: null });
        
//         try {
//             const { user } = useAuthStore.getState();
//             const response = await axios.post(`${API_URL}/properties/${id}/save`, {}, {
//                 headers: {
//                     'Authorization': `Bearer ${user.accessToken}`
//                 }
//             });
            
//             set({ loading: false });
//             return response.data;
            
//         } catch (error) {
//             set({ 
//                 loading: false, 
//                 error: error.response?.data?.message || error.message 
//             });
//             throw error;
//         }
//     },

//     // Get saved properties
//     getSavedProperties: async () => {
//         set({ loading: true, error: null });
        
//         try {
//             const { user } = useAuthStore.getState();
//             const response = await axios.get(`${API_URL}/properties/user/saved`, {
//                 headers: {
//                     'Authorization': `Bearer ${user.accessToken}`
//                 }
//             });
            
//             set({ 
//                 savedProperties: response.data.data.properties,
//                 loading: false 
//             });
            
//             return response.data;
            
//         } catch (error) {
//             set({ 
//                 loading: false, 
//                 error: error.response?.data?.message || error.message 
//             });
//             throw error;
//         }
//     },

//     // Clear error
//     clearError: () => set({ error: null })
// }));