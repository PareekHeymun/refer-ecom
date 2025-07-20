import { useState } from 'react';
import { signup, signin, logout, getProfile } from '../api/auth';
import { useAuthContext } from '../contexts/AuthContext';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

export function useAuth() {
  const { user, setUser, error, setError, clearAuth } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const resetCart = useCartStore(s => s.reset);
  const resetWishlist = useWishlistStore(s => s.reset);

  const handleSignup = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await signup(data);
      // Immediately fetch profile after signup
      const res = await getProfile();
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await signin(data);
      // Immediately fetch profile after signin
      const res = await getProfile();
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.msg || 'Signin failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await logout();
      setUser(null);
      resetCart();
      resetWishlist();
      clearAuth(); // Ensure all state and cookies are cleared
    } catch (err) {
      setError('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, handleSignup, handleSignin, handleLogout };
}
