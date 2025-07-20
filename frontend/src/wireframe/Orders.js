import React from 'react';
import { useOrders } from '../hooks/useOrders';
import { useAuthContext } from '../contexts/AuthContext';

export default function Orders() {
  const { orders, loading, error } = useOrders();
  const { user } = useAuthContext();

  if (!user) {
    return <div>Please login to view your orders.</div>;
  }

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{padding: '2rem 0'}}>
      <h2 style={{textAlign: 'center', fontWeight: 800, fontSize: 32, marginBottom: 32}}>Your Orders</h2>
      {orders.length === 0 ? (
        <p style={{textAlign:'center'}}>No orders found.</p>
      ) : (
        <div style={{display: 'grid', gap: '2rem', maxWidth: 900, margin: '0 auto'}}>
          {orders.map(order => (
            <div key={order._id} style={{
              border: 'none',
              borderRadius: 18,
              padding: '1.5rem 2rem',
              background: '#fff',
              boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                <h4 style={{margin: 0, fontWeight: 700, fontSize: 20}}>Order #{order._id.slice(-8)}</h4>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  background: order.status === 'completed' ? '#28a745' : 
                           order.status === 'pending' ? '#ffc107' : '#dc3545',
                  color: 'white',
                  textTransform: 'capitalize'
                }}>
                  {order.status}
                </span>
              </div>
              <div style={{fontSize: 15, color: '#888', marginBottom: 8}}>
                <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div style={{fontSize: 15, color: '#888', marginBottom: 8}}>
                <strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}
              </div>
              <div style={{fontSize: 15, color: '#888', marginBottom: 8}}>
                <strong>Shipping Address:</strong> {order.shippingAddress || 'N/A'}
              </div>
              <div style={{margin: '0.5rem 0', color: '#666', fontSize: 16}}>
                <strong>Total:</strong> ${order.totalAmount}
              </div>
              <div style={{margin: '0.5rem 0', color: '#444', fontSize: 15}}>
                <strong>Items:</strong>
                <ul style={{margin: '8px 0 0 0', padding: 0, listStyle: 'none'}}>
                  {order.items && order.items.map((item, idx) => (
                    <li key={idx} style={{marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span>Product: {item.productId && item.productId.name ? item.productId.name : item.productId}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>Price: ${item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
