"use client";

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function AuthProvider({ children }) {
  const { checkAuth, isLoading } = useAuthStore();
  console.log(checkAuth);

  useEffect(() => {
    // Check authentication status when app loads
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return children;
}