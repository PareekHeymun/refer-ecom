import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCart, addToCart, removeFromCart, updateQuantity } from '../api/cart';

export const useCartStore = create(persist(
  (set, get) => {
    let actionQueue = [];
    let processing = false;

    // Helper to process the next action in the queue
    const processQueue = async () => {
      if (processing || actionQueue.length === 0) return;
      processing = true;
      const next = actionQueue.shift();
      try {
        await next();
      } catch (err) {
        // Optionally handle error globally
      } finally {
        processing = false;
        if (actionQueue.length > 0) processQueue();
      }
    };

    return {
      cart: { products: [] },
      loading: false,
      error: null,
      hydrated: false,

      hydrate: async () => {
        set({ loading: true });
        try {
          const res = await getCart();
          set({ cart: res.data.cart, hydrated: true, loading: false });
        } catch (err) {
          set({ error: 'Failed to fetch cart', loading: false });
        }
      },

      reset: () => set({ cart: { products: [] }, hydrated: false, loading: false, error: null }),

      add: async (productId) => {
        set(state => ({
          loading: true,
          // Optimistically add to cart
          cart: {
            ...state.cart,
            products: [...(state.cart.products || []), { productId, quantity: 1 }]
          }
        }));
        // Queue the backend call
        actionQueue.push(async () => {
          try {
            await addToCart({ productId, quantity: 1 });
            const res = await getCart();
            set({ cart: res.data.cart, loading: false });
          } catch (err) {
            set({ error: 'Add to cart failed', loading: false });
          }
        });
        processQueue();
      },

      remove: async (productId) => {
        set(state => ({
          loading: true,
          // Optimistically remove from cart
          cart: {
            ...state.cart,
            products: (state.cart.products || []).filter(p => p.productId !== productId)
          }
        }));
        actionQueue.push(async () => {
          try {
            await removeFromCart(productId);
            const res = await getCart();
            set({ cart: res.data.cart, loading: false });
          } catch (err) {
            set({ error: 'Remove from cart failed', loading: false });
          }
        });
        processQueue();
      },

      update: async (productId, quantity) => {
        set(state => ({
          loading: true,
          // Optimistically update quantity
          cart: {
            ...state.cart,
            products: (state.cart.products || []).map(p =>
              p.productId === productId ? { ...p, quantity } : p
            )
          }
        }));
        actionQueue.push(async () => {
          try {
            await updateQuantity(productId, quantity);
            const res = await getCart();
            set({ cart: res.data.cart, loading: false });
          } catch (err) {
            set({ error: 'Update quantity failed', loading: false });
          }
        });
        processQueue();
      },
    };
  },
  {
    name: 'cart-storage',
    getStorage: () => localStorage,
    partialize: (state) => ({ cart: state.cart }),
  }
)); 