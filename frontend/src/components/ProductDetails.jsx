import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../api/products';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuthContext } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import heartIcon from '../images/heartIcon.png';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { user } = useAuthContext();
  const { showNotification } = useNotification();
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(res => setProduct(res.data.product))
      .catch(() => setError('Failed to fetch product'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      showNotification('Please login to add items to cart', 'error');
      return;
    }
    try {
      await addToCart(product._id);
      showNotification('Added to cart!', 'success');
    } catch (err) {
      showNotification('Failed to add to cart', 'error');
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      showNotification('Please login to add items to wishlist', 'error');
      return;
    }
    try {
      await addToWishlist(product._id);
      showNotification('Added to wishlist!', 'success');
    } catch (err) {
      showNotification('Failed to add to wishlist', 'error');
    }
  };

  if (loading) return <div style={{textAlign:'center',marginTop:64}}>Loading product...</div>;
  if (error) return <div style={{textAlign:'center',marginTop:64}}>{error}</div>;
  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : null;
  const stock = typeof product.stock === 'number' ? product.stock : 0;

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'80vh',background:'#f7f8fa'}}>
      <div style={{
        background:'#fff',
        borderRadius:18,
        boxShadow:'0 4px 32px rgba(0,0,0,0.10)',
        padding:'2.5rem 2.5rem 2rem 2.5rem',
        maxWidth:500,
        width:'100%',
        margin:'2rem 0',
        display:'flex',
        flexDirection:'column',
        gap:24
      }}>
        {/* Images carousel */}
        {images && (
          <div style={{marginBottom: 16, position:'relative', width:'100%', height:240, display:'flex', alignItems:'center', justifyContent:'center', background:'#f4f4f4', borderRadius:12, overflow:'hidden'}}>
            <img src={images[imgIdx]} alt={product.name} style={{maxWidth:'100%', maxHeight:220, objectFit:'contain', margin:'0 auto'}} />
            {images.length > 1 && (
              <>
                <button onClick={e => {e.stopPropagation(); setImgIdx((imgIdx-1+images.length)%images.length);}} style={{position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',background:'rgba(0,0,0,0.08)',border:'none',borderRadius:'50%',width:32,height:32,cursor:'pointer',fontSize:20}}>&lt;</button>
                <button onClick={e => {e.stopPropagation(); setImgIdx((imgIdx+1)%images.length);}} style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',background:'rgba(0,0,0,0.08)',border:'none',borderRadius:'50%',width:32,height:32,cursor:'pointer',fontSize:20}}>&gt;</button>
                <div style={{position:'absolute',bottom:8,left:'50%',transform:'translateX(-50%)',display:'flex',gap:4}}>
                  {images.map((_,i) => <span key={i} style={{width:8,height:8,borderRadius:'50%',background:i===imgIdx?'#007bff':'#bbb',display:'inline-block'}} />)}
                </div>
              </>
            )}
          </div>
        )}
        <div style={{fontWeight:800,fontSize:28,marginBottom:4}}>{product.name}</div>
        <div style={{fontSize:15,color:'#888',marginBottom:8}}>{product.category}</div>
        <div style={{color:'#444',fontSize:17,marginBottom:16}}>{product.description}</div>
        <div style={{fontWeight:800,fontSize:26,color:'#007bff',marginBottom:8}}>${product.price}</div>
        <div style={{fontSize:15, color: stock === 0 ? '#b32b2b' : '#1a7f37', fontWeight:700, marginBottom:8}}>
          {stock === 0 ? 'Out of Stock' : `In Stock: ${stock}`}
        </div>
        <div style={{fontSize:13, color:'#888', marginBottom:8}}>Added: {formatDate(product.createdAt)}</div>
        <div style={{display:'flex',gap:16}}>
          <button 
            onClick={handleAddToCart}
            style={{
              padding:'12px 28px',
              background: stock === 0 ? '#bbb' : '#007bff',
              color:'white',
              border:'none',
              borderRadius:8,
              cursor: stock === 0 ? 'not-allowed' : 'pointer',
              fontWeight:700,
              fontSize:17,
              boxShadow:'0 2px 8px rgba(0,0,0,0.07)'
            }}
            disabled={stock === 0}
          >
            Add to Cart
          </button>
          <button 
            onClick={handleAddToWishlist}
            style={{
              padding:'12px',
              background:'#fff',
              color:'#dc3545',
              border:'1.5px solid #dc3545',
              borderRadius:'50%',
              cursor:'pointer',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              width:'48px',
              height:'48px',
              boxShadow:'0 2px 8px rgba(220,53,69,0.07)'
            }}
          >
            <img 
              src={heartIcon} 
              alt="Add to Wishlist" 
              style={{width:'24px',height:'24px',filter:'brightness(0) invert(1)'}}
            />
          </button>
        </div>
      </div>
    </div>
  );
} 