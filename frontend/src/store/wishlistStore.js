import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlist';

export const useWishlistStore = create(persist(
  (set, get) => ({
    wishlist: { products: [] },
    loading: false,
    error: null,
    hydrated: false,

    // Hydrate from backend and localStorage
    hydrate: async () => {
      set({ loading: true });
      try {
        // Try backend first
        const res = await getWishlist();
        set({ wishlist: res.data.wishlist, hydrated: true, loading: false });
      } catch (err) {
        set({ error: 'Failed to fetch wishlist', loading: false });
      }
    },

    reset: () => set({ wishlist: { products: [] }, hydrated: false, loading: false, error: null }),

    add: async (productId) => {
      set({ loading: true });
      try {
        await addToWishlist({ productId });
        // Always fetch latest from backend for consistency
        const res = await getWishlist();
        set({ wishlist: res.data.wishlist, loading: false });
      } catch (err) {
        set({ error: 'Add to wishlist failed', loading: false });
      }
    },

    remove: async (productId) => {
      set({ loading: true });
      try {
        await removeFromWishlist(productId);
        const res = await getWishlist();
        set({ wishlist: res.data.wishlist, loading: false });
      } catch (err) {
        set({ error: 'Remove from wishlist failed', loading: false });
      }
    },
  }),
  {
    name: 'wishlist-storage',
    getStorage: () => localStorage,
    partialize: (state) => ({ wishlist: state.wishlist }),
  }
)); 