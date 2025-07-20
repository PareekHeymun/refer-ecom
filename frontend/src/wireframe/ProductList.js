import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuthContext } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../store/searchStore';
import heartIcon from '../images/heartIcon.png';

export default function ProductList() {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { user } = useAuthContext();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const search = useSearchStore(s => s.search);

  const filteredProducts = search
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
      )
    : products;

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  const handleAddToCart = async (productId) => {
    if (!user) {
      showNotification('Please login to add items to cart', 'error');
      return;
    }
    try {
      await addToCart(productId);
      showNotification('Added to cart!', 'success');
    } catch (err) {
      showNotification('Failed to add to cart', 'error');
    }
  };

  const handleAddToWishlist = async (productId) => {
    if (!user) {
      showNotification('Please login to add items to wishlist', 'error');
      return;
    }
    try {
      await addToWishlist(productId);
      showNotification('Added to wishlist!', 'success');
    } catch (err) {
      showNotification('Failed to add to wishlist', 'error');
    }
  };

  return (
    <div style={{padding: '2rem 0'}}>
      <h2 style={{textAlign: 'center', fontWeight: 800, fontSize: 32, marginBottom: 32}}>Shop Products</h2>
      {filteredProducts.length === 0 ? <p style={{textAlign:'center'}}>No products found{search ? ' for your search.' : '.'}</p> : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem',
          maxWidth: 1400,
          margin: '0 auto',
        }}>
          {filteredProducts.map(product => (
            <div
              key={product._id}
              className="product-card-landing"
              style={{
                border: 'none',
                borderRadius: 18,
                padding: 0,
                background: '#fff',
                boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                transition: 'box-shadow 0.2s, transform 0.2s',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                minHeight: 320,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onClick={() => navigate(`/product/${product._id}`)}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.13)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.07)'}
            >
              <div style={{padding: '24px 24px 0 24px', flex: 1}}>
                <div style={{fontWeight: 700, fontSize: 20, marginBottom: 6}}>{product.name}</div>
                <div style={{fontSize: 13, color: '#888', marginBottom: 10}}>{product.category}</div>
                <div style={{color: '#666', marginBottom: 16, fontSize: 15, minHeight: 48}}>{product.description}</div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px 24px 24px'}}>
                <div style={{fontWeight: 800, fontSize: 22, color: '#007bff'}}>${product.price}</div>
                <div style={{display: 'flex', gap: 12}} onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => handleAddToCart(product._id)}
                    style={{
                      padding: '8px 16px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: 15,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                    }}
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => handleAddToWishlist(product._id)}
                    style={{
                      padding: '8px',
                      background: '#fff',
                      color: '#dc3545',
                      border: '1.5px solid #dc3545',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      boxShadow: '0 2px 8px rgba(220,53,69,0.07)'
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
            </div>
          ))}
        </div>
      )}
      <style>{`
        .product-card-landing:hover {
          transform: translateY(-4px) scale(1.012);
          box-shadow: 0 12px 36px rgba(0,0,0,0.16) !important;
        }
      `}</style>
    </div>
  );
}
