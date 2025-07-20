import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart, removeFromCart, updateQuantity } from '../api/cart';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      const res = await getCart();
      setCart(res.data.cart);
    } catch (err) {
      setError('Failed to fetch cart');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchCart().finally(() => setLoading(false));
  }, [fetchCart]);

  const handleAddToCart = async (productId) => {
    setLoading(true);
    setError(null);
    try {
      await addToCart({ productId, quantity: 1 });
      await fetchCart();
    } catch (err) {
      setError('Add to cart failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    setLoading(true);
    setError(null);
    try {
      await removeFromCart(productId);
      await fetchCart();
    } catch (err) {
      setError('Remove from cart failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      await updateQuantity(productId, quantity);
      await fetchCart();
    } catch (err) {
      setError('Update quantity failed');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    error,
    fetchCart,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
} 