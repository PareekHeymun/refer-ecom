import React, { useState, useEffect } from 'react';
import { ChevronDown, ShoppingCart, Star, Truck, Shield, CreditCard, Palette } from 'lucide-react';
import heartIcon from '../../images/heartIcon.png';
import cartIcon from '../../images/cartIcon.png';
import { useProducts } from '../../hooks/useProducts';
import { useUserRating } from '../../hooks/useUserRating';
import { useAuthContext } from '../../contexts/AuthContext';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { useNotification } from '../../contexts/NotificationContext';
import { useSearchStore } from '../../store/searchStore';
import { useNavigate } from 'react-router-dom';

const CATEGORY_LABELS = {
  books: 'Books',
  electronics: 'Electronics',
  toys: 'Toys',
};

export default function ScrollToShipThemes() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(0);
  const { user } = useAuthContext();
  const { products, loading, error } = useProducts();
  const { add: addToCart } = useCartStore();
  const { add: addToWishlist } = useWishlistStore();
  const { showNotification } = useNotification();
  const search = useSearchStore(s => s.search);
  const navigate = useNavigate();

  // Add to Cart handler
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

  // Add to Wishlist handler
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

  // Filter products by search
  const filteredProducts = search
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
      )
    : products;

  // Group filtered products by category
  const grouped = filteredProducts.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  // Modern e-commerce color palette
  const palette = {
    cardBg: '#fff',
    cardShadow: '0 2px 16px rgba(30, 41, 59, 0.08)',
    cardShadowHover: '0 8px 32px rgba(30, 41, 59, 0.13)',
    border: '#e5e7eb',
    accent: '#2563eb', // blue
    accentSoft: '#e0e7ff',
    badge: '#10b981', // teal
    badgeText: '#fff',
    price: '#2563eb',
    outOfStock: '#b91c1c',
    outOfStockBg: '#fee2e2',
    text: '#222',
    subtext: '#6b7280',
    category: '#64748b',
    hover: '#f1f5f9',
  };

  // Move ProductCard here so it can access styles
  function ProductCard({ product }) {
    const { ratings, loading } = useUserRating(product._id);
    let avgRating = null;
    if (ratings && ratings.length > 0) {
      avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    }
    const reviewText =
      ratings && ratings.length > 0
        ? `${avgRating.toFixed(1)} (${ratings.length})`
        : 'be the first one to review';

    return (
      <div style={{ background: palette.cardBg, border: `1.5px solid ${palette.border}`, borderRadius: 18, overflow: 'hidden', transition: 'all 0.3s cubic-bezier(.4,2,.6,1)', cursor: 'pointer', boxShadow: palette.cardShadow, minHeight: 220, minWidth: 260, maxWidth: 340, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 0, margin: '0 auto', position: 'relative' }} className="product-card">
        {/* Top row: Review (left), Cart/Wishlist (right) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px 16px 0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {avgRating ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    style={{
                      width: '16px',
                      height: '16px',
                      color: i < Math.round(avgRating) ? palette.accent : '#e5e7eb',
                      fill: i < Math.round(avgRating) ? palette.accent : '#e5e7eb',
                    }}
                  />
                ))}
              </>
            ) : null}
            <span style={{ fontSize: 13, color: palette.subtext, marginLeft: 4 }}>{loading ? '...' : reviewText}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button style={{ background: palette.accent, color: '#fff', border: 'none', borderRadius: 20, padding: '7px 18px', fontWeight: 700, fontSize: 15, boxShadow: '0 2px 8px rgba(37,99,235,0.07)', cursor: 'pointer', transition: 'background 0.18s, transform 0.13s', display: 'flex', alignItems: 'center', gap: 7 }} title="Add to Cart" onClick={() => handleAddToCart(product._id)}>
              <img src={cartIcon} alt="Add to Cart" style={{width:20,height:20}} />
            </button>
            <button style={{ background: '#fff', color: palette.accent, border: `1.5px solid ${palette.accent}`, borderRadius: 20, padding: '7px 14px', fontWeight: 700, fontSize: 15, boxShadow: '0 2px 8px rgba(37,99,235,0.07)', cursor: 'pointer', transition: 'border 0.18s, color 0.13s', display: 'flex', alignItems: 'center', gap: 7 }} title="Add to Wishlist" onClick={() => handleAddToWishlist(product._id)}>
              <img src={heartIcon} alt="Wishlist" style={{width:20,height:20}} />
            </button>
          </div>
        </div>
        {/* Main: Name and Category */}
        <div style={{ padding: '8px 16px 0 16px', flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4, color: palette.text }}>{product.name}</div>
          <div style={{ fontSize: 13, color: palette.category, marginBottom: 8 }}>{CATEGORY_LABELS[product.category] || product.category}</div>
        </div>
        {/* Bottom: Description */}
        <div style={{ padding: '0 16px 16px 16px', color: palette.subtext, fontSize: 15, minHeight: 40, marginTop: 'auto' }}>
          {product.description ? product.description : product.name}
        </div>
      </div>
    );
  }

  // Featured products for banner (top 3 by rating or random)
  const featuredProducts = [...filteredProducts]
    .sort((a, b) => (b.ratings?.length || 0) - (a.ratings?.length || 0))
    .slice(0, 3);

  // Helper: get product image
  function getProductImage(product) {
    return product.images && product.images.length > 0 ? product.images[0] : null;
  }

  // Helper: featured badge
  function getBadge(product, idx) {
    if (product.stock === 0) return { text: 'Out of Stock', color: palette.outOfStock, bg: palette.outOfStockBg };
    if (idx % 7 === 0) return { text: 'Best Seller', color: palette.badgeText, bg: palette.badge };
    if (idx % 5 === 0) return { text: 'New', color: palette.badgeText, bg: palette.accent };
    return null;
  }

  // Enhanced ProductCard
  function ProductCard({ product, idx, featured, onAddToCart, onAddToWishlist }) {
    const { ratings, loading } = useUserRating(product._id);
    let avgRating = null;
    if (ratings && ratings.length > 0) {
      avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    }
    const reviewText =
      ratings && ratings.length > 0
        ? `${avgRating.toFixed(1)} (${ratings.length})`
        : 'be the first one to review';
    const image = product.images && product.images.length > 0 ? product.images[0] : null;
    const badge = getBadge(product, idx);
    return (
      <div
        style={{
          background: palette.cardBg,
          color: palette.text,
          border: `1.5px solid ${palette.border}`,
          borderRadius: 18,
          overflow: 'hidden',
          transition: 'box-shadow 0.18s, transform 0.16s',
          cursor: 'pointer',
          boxShadow: palette.cardShadow,
          minHeight: 260,
          minWidth: 260,
          maxWidth: 340,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 0,
          margin: '0 auto',
          position: 'relative',
        }}
        className="product-card"
        tabIndex={0}
        onClick={() => navigate(`/product/${product._id}`)}
        onKeyDown={e => { if (e.key === 'Enter') navigate(`/product/${product._id}`); }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.012)';
          e.currentTarget.style.boxShadow = palette.cardShadowHover;
          e.currentTarget.style.background = palette.hover;
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = palette.cardShadow;
          e.currentTarget.style.background = palette.cardBg;
        }}
      >
        {/* Badge */}
        {badge && (
          <div style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: badge.bg,
            color: badge.color,
            fontWeight: 700,
            fontSize: 13,
            borderRadius: 7,
            padding: '3px 12px',
            zIndex: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            opacity: 0.97
          }}>{badge.text}</div>
        )}
        {/* Product Image */}
        <div style={{width:'100%',height:160,background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
          {image ? (
            <img src={image} alt={product.name} style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain',transition:'transform 0.3s',filter:'drop-shadow(0 2px 8px #0001)'}} />
          ) : (
            <div style={{color:'#bbb',fontSize:32,fontWeight:700}}>No Image</div>
          )}
        </div>
        {/* Main: Name, Category, Description */}
        <div style={{ padding: '16px 20px 0 20px', flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4, color: palette.text }}>{product.name}</div>
          <div style={{ fontSize: 13, color: palette.category, marginBottom: 8 }}>{CATEGORY_LABELS[product.category] || product.category}</div>
          <div style={{ color: palette.subtext, fontSize: 15, minHeight: 40, marginBottom: 8 }}>{product.description}</div>
        </div>
        {/* Bottom: Price, Review, Cart/Wishlist */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 20px 20px', marginTop: 'auto' }}>
          <div style={{ fontWeight: 900, fontSize: 20, color: palette.price }}>${product.price}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {avgRating && (
              <span style={{display:'flex',alignItems:'center',gap:2}}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    style={{
                      width: '16px',
                      height: '16px',
                      color: i < Math.round(avgRating) ? palette.accent : '#e5e7eb',
                      fill: i < Math.round(avgRating) ? palette.accent : '#e5e7eb',
                    }}
                  />
                ))}
                <span style={{fontSize:13,marginLeft:4}}>{reviewText}</span>
              </span>
            )}
            <button style={{
              background: palette.accent,
              color: '#fff',
              border: 'none',
              borderRadius: 20,
              padding: '7px 18px',
              fontWeight: 700,
              fontSize: 15,
              boxShadow: '0 2px 8px rgba(37,99,235,0.07)',
              cursor: 'pointer',
              transition: 'background 0.18s, transform 0.13s',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
            title="Add to Cart"
            onClick={e => {e.stopPropagation();onAddToCart(product._id);}}
            onMouseOver={e => e.currentTarget.style.background=palette.badge}
            onMouseOut={e => e.currentTarget.style.background=palette.accent}
            >
              <img src={cartIcon} alt="Add to Cart" style={{width:20,height:20}} />
            </button>
            <button style={{
              background: '#fff',
              color: palette.accent,
              border: `1.5px solid ${palette.accent}`,
              borderRadius: 20,
              padding: '7px 14px',
              fontWeight: 700,
              fontSize: 15,
              boxShadow: '0 2px 8px rgba(37,99,235,0.07)',
              cursor: 'pointer',
              transition: 'border 0.18s, color 0.13s',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
            title="Add to Wishlist"
            onClick={e => {e.stopPropagation();onAddToWishlist(product._id);}}
            onMouseOver={e => {e.currentTarget.style.border=`1.5px solid ${palette.badge}`;e.currentTarget.style.color=palette.badge;}}
            onMouseOut={e => {e.currentTarget.style.border=`1.5px solid ${palette.accent}`;e.currentTarget.style.color=palette.accent;}}
            >
              <img src={heartIcon} alt="Wishlist" style={{width:20,height:20}} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Robust product grid state handling
  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading products...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc3545', fontWeight: 600 }}>
        Failed to load products. Please try again later.
      </div>
    );
  }
  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontWeight: 500 }}>
        No products found{search ? ' for your search.' : '.'}
      </div>
    );
  }

  // Premium landing page background and floating shapes
  const landingBg = `linear-gradient(120deg, #f8fafc 0%, #f1f5f9 40%, #f3e8ff 100%)`;
  const floatingShapes = [
    { top: 80, left: 40, size: 80, color: '#f59e0b', opacity: 0.13 },
    { top: 320, right: 60, size: 120, color: '#6366f1', opacity: 0.10 },
    { bottom: 120, left: 120, size: 100, color: '#10b981', opacity: 0.10 },
    { bottom: 60, right: 80, size: 60, color: '#dc2626', opacity: 0.10 },
  ];

  // Main container and section styles
  const mainContainerStyle = {
    background: landingBg,
    minHeight: '100vh',
    paddingBottom: 64,
    position: 'relative',
    width: '100%',
  };
  const sectionStyle = {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '0 24px',
  };
  const sectionTitleStyle = {
    fontSize: 28,
    fontWeight: 700,
    color: palette.accent,
    margin: '32px 0 18px 0',
  };
  const sectionSubtitleStyle = {
    color: palette.subtext,
    fontSize: 17,
    marginBottom: 32,
  };

  return (
    <div style={mainContainerStyle}>
      {/* Floating background shapes */}
      {floatingShapes.map((s, i) => (
        <div key={i} style={{
          position:'absolute',
          ...('top' in s ? {top:s.top} : {bottom:s.bottom}),
          ...('left' in s ? {left:s.left} : {right:s.right}),
          width:s.size,
          height:s.size,
          borderRadius:'50%',
          background:s.color,
          opacity:s.opacity,
          zIndex:0,
          filter:'blur(2px)'
        }} />
      ))}
      {/* Featured Banner Carousel */}
      {featuredProducts.length > 0 && (
        <div style={{width:'100%',maxWidth:1200,margin:'0 auto 48px auto',padding:'0 0 24px 0',display:'flex',gap:32,overflowX:'auto',scrollSnapType:'x mandatory'}}>
          {featuredProducts.map((product, idx) => (
            <div key={product._id} style={{minWidth:340,maxWidth:420,flex:'0 0 340px',scrollSnapAlign:'center'}}>
              <ProductCard product={product} idx={idx} featured={true} onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} />
            </div>
          ))}
        </div>
      )}
      {/* Products Section */}
      <section style={sectionStyle}>
        <div>
          <h3 style={sectionTitleStyle}>Shop by Category</h3>
          <p style={sectionSubtitleStyle}>Browse our curated selection of books, electronics, and toys</p>
          {Object.keys(CATEGORY_LABELS).map((cat) => (
            grouped[cat] && grouped[cat].length > 0 ? (
              <div key={cat} style={{ marginBottom: 48 }}>
                <h4 style={sectionTitleStyle}>{CATEGORY_LABELS[cat]}</h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '32px',
                  alignItems: 'stretch',
                }}>
                  {grouped[cat].map((product, idx) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      idx={idx}
                      featured={idx % 7 === 0}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                    />
                  ))}
                </div>
              </div>
            ) : null
          ))}
        </div>
      </section>
      <style>{`
        @keyframes fadeInBadge {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
} 