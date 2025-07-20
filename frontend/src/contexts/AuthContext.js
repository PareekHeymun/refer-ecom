import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Try to load user from localStorage
    const stored = localStorage.getItem('auth-user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Remove token cookie on logout (best effort, for non-HTTP-only cookies)
  const clearAuth = () => {
    setUser(null);
    localStorage.removeItem('auth-user');
    // Try to remove token cookie (will only work if not httpOnly)
    document.cookie = 'token=; Max-Age=0; path=/;';
  };

  useEffect(() => {
    // If user is already in localStorage, skip backend check unless cookie is present
    if (user) {
      setLoading(false);
      return;
    }
    // Check if user is already logged in on app start
    const checkAuth = async () => {
      try {
        const res = await getProfile();
        setUser(res.data.user);
        localStorage.setItem('auth-user', JSON.stringify(res.data.user));
      } catch (err) {
        setUser(null);
        localStorage.removeItem('auth-user');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    // Keep localStorage in sync with user state
    if (user) {
      localStorage.setItem('auth-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth-user');
    }
  }, [user]);

  const value = {
    user,
    setUser,
    loading,
    error,
    setError,
    clearAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
} 