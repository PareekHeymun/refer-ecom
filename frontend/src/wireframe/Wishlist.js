import React from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { useWishlistStore } from '../store/wishlistStore';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const { user } = useAuthContext();
  const { products } = useProducts();
  const { wishlist, loading, error, hydrated, add, remove } = useWishlistStore();
  const navigate = useNavigate();

  if (!user) {
    return <div>Please login to view your wishlist.</div>;
  }

  if (!hydrated) return <div>Loading wishlist...</div>;
  if (loading) return <div>Loading wishlist...</div>;
  if (error) return <div>{error}</div>;

  // Helper to get product details if wishlist.products contains IDs
  const getProductDetails = (prod) => {
    if (!prod) return null;
    if (typeof prod === 'string' || typeof prod === 'number') {
      // It's an ID, look up in products
      return products.find(p => p._id === prod || p.id === prod);
    }
    return prod; // Already a populated object
  };

  const wishlistItems = wishlist && wishlist.products
    ? wishlist.products.map(getProductDetails).filter(Boolean)
    : [];

  return (
    <div style={{padding: '2rem 0'}}>
      <h2 style={{textAlign: 'center', fontWeight: 800, fontSize: 32, marginBottom: 32}}>Your Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p style={{textAlign:'center'}}>Wishlist is empty.</p>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', maxWidth: 1400, margin: '0 auto'}}>
          {wishlistItems.map(product => {
            const stock = typeof product.stock === 'number' ? product.stock : 0;
            const image = product.images && product.images.length > 0 ? product.images[0] : null;
            return (
              <div key={product._id} style={{
                border: 'none',
                borderRadius: 18,
                padding: '1.5rem 2rem',
                background: '#fff',
                boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                alignItems: 'center',
                position: 'relative'
              }}>
                {image && <img src={image} alt={product.name} style={{width: 100, height: 100, objectFit: 'contain', borderRadius: 12, background:'#f4f4f4', marginBottom: 12}} />}
                <div style={{fontWeight: 700, fontSize: 20, marginBottom: 4}}>{product.name}</div>
                <div style={{color: '#666', fontSize: 15, marginBottom: 8}}>{product.description}</div>
                <div style={{fontWeight: 800, fontSize: 18, color: '#007bff', marginBottom: 4}}>${product.price}</div>
                <div style={{fontSize: 14, color: stock === 0 ? '#b32b2b' : '#1a7f37', fontWeight: 700, marginBottom: 8}}>
                  {stock === 0 ? 'Out of Stock' : `In Stock: ${stock}`}
                </div>
                <div style={{display: 'flex', gap: 12, width: '100%', justifyContent: 'center'}}>
                  <button
                    onClick={() => navigate(`/product/${product._id}`)}
                    style={{
                      padding: '0.5rem 1.5rem',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: 15
                    }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => remove(product._id)}
                    style={{
                      padding: '0.5rem 1.5rem',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: 15
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
