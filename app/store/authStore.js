import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Login action
      login: async (email, password, rememberMe = false) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
              rememberMe
            }),
          });

          const result = await response.json();
          console.log(result);

          if (!response.ok) {
            throw new Error(result.message || 'Login failed');
          }

          // Store token and user data
          if (result.token) {
            localStorage.setItem('token', result.token);
            if (rememberMe) {
              localStorage.setItem('rememberMe', 'true');
            }
          }

          // Update store state
          set({
            user: result.user,
            token: result.token,
            isLoading: false,
            error: null
          });

          return { success: true, data: result };
          
        } catch (error) {
          set({
            error: error.message,
            isLoading: false
          });
          throw error;
        }
      },

      // Signup action
      signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              email,
              password,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message || 'Registration failed');
          }

          // Store token and user data
          if (result.token) {
            localStorage.setItem('token', result.token);
          }

          // Update store state
          set({
            user: result.user,
            token: result.token,
            isLoading: false,
            error: null
          });

          return { success: true, data: result };
          
        } catch (error) {
          set({
            error: error.message,
            isLoading: false
          });
          throw error;
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true });
        
        try {
          const token = get().token;
          
          if (token) {
            await fetch(`${API_URL}/api/auth/logout`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                refreshToken: localStorage.getItem('refreshToken')
              })
            });
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear all storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('rememberMe');
          
          // Reset store state
          set({
            user: null,
            token: null,
            isLoading: false,
            error: null
          });
        }
      },

      // Check authentication status
      checkAuth: async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
          set({ user: null, token: null, isLoading: false });
          return false;
        }

        set({ isLoading: true });
        
        try {
          const response = await fetch(`${API_URL}/api/auth/profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const result = await response.json();

          if (response.ok && result.success) {
            set({
              user: result.user,
              token: token,
              isLoading: false,
              error: null
            });
            return true;
          } else {
            // Token invalid, clear it
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({
              user: null,
              token: null,
              isLoading: false,
              error: null
            });
            return false;
          }
        } catch (error) {
          console.error('Check auth error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          set({
            user: null,
            token: null,
            isLoading: false,
            error: error.message
          });
          return false;
        }
      },

      // Update user data
      updateUser: (userData) => {
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...userData };
        
        set({ user: updatedUser });
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Getters
      isAuthenticated: () => !!get().token,
      getUser: () => get().user,
      getToken: () => get().token,
      getError: () => get().error,
      isLoading: () => get().isLoading,
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }), // only persist user and token
    }
  )
);