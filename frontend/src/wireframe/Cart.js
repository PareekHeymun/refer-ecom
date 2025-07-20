import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useAuthContext } from '../contexts/AuthContext';
import { useCartStore } from '../store/cartStore';
import { useNotification } from '../contexts/NotificationContext';

export default function Cart() {
  const { cart, loading, error, hydrated, add, remove, update } = useCartStore();
  const { products } = useProducts();
  const { user } = useAuthContext();
  const { showNotification } = useNotification();
  const [updating, setUpdating] = useState(false);

  if (!user) {
    return <div>Please login to view your cart.</div>;
  }

  if (!hydrated) return <div>Loading cart...</div>;
  if (loading) return <div>Loading cart...</div>;
  if (error) return <div>{error}</div>;

  const getProductDetails = (productId) => {
    return products.find(p => p._id === productId);
  };

  const handleQuantityChange = async (productId, newQuantity, stock) => {
    if (newQuantity > stock) {
      showNotification('Cannot add more than available stock', 'error');
      return;
    }
    setUpdating(true);
    try {
      if (newQuantity <= 0) {
        await remove(productId);
      } else {
        await update(productId, newQuantity);
      }
    } catch (err) {
      showNotification('Error updating quantity', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{padding: '2rem 0'}}>
      <h2 style={{textAlign: 'center', fontWeight: 800, fontSize: 32, marginBottom: 32}}>Your Cart</h2>
      {!cart || !cart.products || cart.products.length === 0 ? (
        <p style={{textAlign:'center'}}>Cart is empty.</p>
      ) : (
        <div>
          <div style={{marginBottom: '2rem', display: 'grid', gap: '2rem', maxWidth: 900, margin: '0 auto'}}>
            {cart.products.map(item => {
              const product = getProductDetails(item.productId);
              if (!product) return null;
              const stock = typeof product.stock === 'number' ? product.stock : 0;
              const image = product.images && product.images.length > 0 ? product.images[0] : null;
              return (
                <div key={item.productId} style={{
                  border: 'none',
                  borderRadius: 18,
                  padding: '1.5rem 2rem',
                  background: '#fff',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24
                }}>
                  {image && <img src={image} alt={product.name} style={{width: 80, height: 80, objectFit: 'contain', borderRadius: 12, background:'#f4f4f4'}} />}
                  <div style={{flex: 1}}>
                    <h4 style={{margin: '0 0 0.5rem 0', fontWeight: 700, fontSize: 20}}>{product.name}</h4>
                    <p style={{color: '#666', margin: '0 0 0.5rem 0', fontSize: 15}}>{product.description}</p>
                    <div style={{fontWeight: 'bold', color: '#007bff', fontSize: 18}}>${product.price}</div>
                    <div style={{fontSize: 14, color: stock === 0 ? '#b32b2b' : '#1a7f37', fontWeight: 700, marginTop: 4}}>
                      {stock === 0 ? 'Out of Stock' : `In Stock: ${stock}`}
                    </div>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12}}>
                    <div>
                      <label style={{fontWeight:600}}>Qty: </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value), stock)}
                        style={{width: '60px', padding: '0.25rem', marginLeft: '0.5rem', fontSize: 15}}
                        disabled={updating || stock === 0}
                      />
                    </div>
                    <div style={{fontSize: 15, color: '#888'}}>Subtotal: ${(product.price * item.quantity).toFixed(2)}</div>
                    <button
                      onClick={() => remove(item.productId)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: 15
                      }}
                      disabled={updating}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{
            borderTop: '2px solid #ddd',
            paddingTop: '1rem',
            textAlign: 'right',
            maxWidth: 900,
            margin: '0 auto'
          }}>
            <h3 style={{fontWeight:800, fontSize: 24}}>Total: ${cart.total ? cart.total.toFixed(2) : '0.00'}</h3>
            <button style={{
              padding: '0.75rem 2rem',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 700,
              marginTop: 16
            }}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
