import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuthContext } from '../contexts/AuthContext';
import heartIcon from '../../images/heartIcon.png';

export default function ProductList() {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { user } = useAuthContext();

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(productId);
      alert('Added to cart!');
    } catch (err) {
      alert('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (productId) => {
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }
    try {
      await addToWishlist(productId);
      alert('Added to wishlist!');
    } catch (err) {
      alert('Failed to add to wishlist');
    }
  };

  return (
    <div>
      <h3>Product List</h3>
      {products.length === 0 ? <p>No products found.</p> : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem'}}>
          {products.map(product => (
            <div key={product._id} style={{
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '1rem',
              background: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{margin: '0 0 0.5rem 0'}}>{product.name}</h4>
              <p style={{color: '#666', margin: '0 0 0.5rem 0'}}>{product.description}</p>
              <p style={{fontWeight: 'bold', color: '#007bff', margin: '0 0 1rem 0'}}>${product.price}</p>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <button 
                  onClick={() => handleAddToCart(product._id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => handleAddToWishlist(product._id)}
                  style={{
                    padding: '0.5rem',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <img 
                    src={heartIcon} 
                    alt="Add to Wishlist" 
                    style={{
                      width: '20px',
                      height: '20px',
                      filter: 'brightness(0) invert(1)'
                    }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
