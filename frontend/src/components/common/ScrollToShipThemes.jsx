import React, { useState, useEffect } from 'react';
import { ChevronDown, ShoppingCart, Star, Truck, Shield, CreditCard, Palette } from 'lucide-react';
import heartIcon from '../../images/heartIcon.png';
import cartIcon from '../../images/cartIcon.png';
import { useProducts } from '../../hooks/useProducts';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { useUserRating } from '../../hooks/useUserRating';
import { useAuthContext } from '../../contexts/AuthContext';

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
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Group products by category
  const grouped = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  const themes = [
    {
      name: "Red & Gold Luxury",
      primary: "#DC2626",
      secondary: "#F59E0B",
      accent: "#FEF3C7",
      gradient: "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #F59E0B 100%)",
      textLight: "#FEF3C7",
      shadow: "0 20px 40px rgba(220, 38, 38, 0.3)"
    },
    {
      name: "Red & Cyan Electric",
      primary: "#EF4444",
      secondary: "#06B6D4",
      accent: "#CFFAFE",
      gradient: "linear-gradient(135deg, #EF4444 0%, #F97316 50%, #06B6D4 100%)",
      textLight: "#CFFAFE",
      shadow: "0 20px 40px rgba(239, 68, 68, 0.3)"
    },
    {
      name: "Red & Lime Vibrant",
      primary: "#DC2626",
      secondary: "#84CC16",
      accent: "#ECFCCB",
      gradient: "linear-gradient(135deg, #DC2626 0%, #EF4444 50%, #84CC16 100%)",
      textLight: "#ECFCCB",
      shadow: "0 20px 40px rgba(220, 38, 38, 0.3)"
    },
    {
      name: "Red & Purple Cosmic",
      primary: "#E11D48",
      secondary: "#8B5CF6",
      accent: "#EDE9FE",
      gradient: "linear-gradient(135deg, #E11D48 0%, #BE185D 50%, #8B5CF6 100%)",
      textLight: "#EDE9FE",
      shadow: "0 20px 40px rgba(225, 29, 72, 0.3)"
    },
    {
      name: "Red & Orange Sunset",
      primary: "#DC2626",
      secondary: "#FB923C",
      accent: "#FED7AA",
      gradient: "linear-gradient(135deg, #DC2626 0%, #EF4444 30%, #FB923C 70%, #FBBF24 100%)",
      textLight: "#FED7AA",
      shadow: "0 20px 40px rgba(220, 38, 38, 0.3)"
    }
  ];
  const currentThemeData = themes[currentTheme];

  const features = [
    {
      icon: <Truck style={{ width: '32px', height: '32px' }} />,
      title: "Fast Shipping",
      description: "Get your orders delivered in 24-48 hours"
    },
    {
      icon: <Shield style={{ width: '32px', height: '32px' }} />,
      title: "Secure Shopping",
      description: "Your data and payments are completely secure"
    },
    {
      icon: <CreditCard style={{ width: '32px', height: '32px' }} />,
      title: "Easy Returns",
      description: "30-day hassle-free return policy"
    }
  ];

  const styles = {
    // ... keep all your previous styles ...
    productCard: {
      background: 'white',
      border: `1.5px solid ${currentThemeData.accent}`,
      borderRadius: '20px',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
      cursor: 'pointer',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      minHeight: '220px',
      minWidth: '260px',
      maxWidth: '340px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 0,
      margin: '0 auto',
      position: 'relative',
    },
    wishlistBtn: {
      background: currentThemeData.primary,
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      cursor: 'pointer',
      zIndex: 2,
      transition: 'background 0.2s',
    },
    wishlistIcon: {
      width: '22px',
      height: '22px',
      filter: 'brightness(0) invert(1)'
    },
    cartBtn: {
      background: currentThemeData.primary,
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    cartIcon: {
      width: '22px',
      height: '22px',
      filter: 'brightness(0) invert(1)'
    },
    // ... keep all other styles as in your code ...
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

    // Alert logic for add to cart
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

    // Alert logic for add to wishlist
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
      <div style={styles.productCard} className="product-card">
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
                      color: i < Math.round(avgRating) ? '#F59E0B' : '#D1D5DB',
                      fill: i < Math.round(avgRating) ? '#F59E0B' : '#D1D5DB',
                    }}
                  />
                ))}
              </>
            ) : null}
            <span style={{ fontSize: 13, color: '#6B7280', marginLeft: 4 }}>{loading ? '...' : reviewText}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button style={styles.cartBtn} title="Add to Cart" onClick={() => handleAddToCart(product._id)}>
              <img src={cartIcon} alt="Add to Cart" style={styles.cartIcon} />
            </button>
            <button style={styles.wishlistBtn} title="Add to Wishlist" onClick={() => handleAddToWishlist(product._id)}>
              <img src={heartIcon} alt="Wishlist" style={styles.wishlistIcon} />
            </button>
          </div>
        </div>
        {/* Main: Name and Category */}
        <div style={{ padding: '8px 16px 0 16px', flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{product.name}</div>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{CATEGORY_LABELS[product.category] || product.category}</div>
        </div>
        {/* Bottom: Description */}
        <div style={{ padding: '0 16px 16px 16px', color: '#444', fontSize: 15, minHeight: 40, marginTop: 'auto' }}>
          {product.description ? product.description : product.name}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* ... keep all your style and layout code ... */}
      {/* Products Section */}
      <section style={styles.section}>
        <div style={styles.sectionContainer}>
          <h3 style={styles.sectionTitle}>Shop by Category</h3>
          <p style={styles.sectionSubtitle}>Browse our curated selection of books, electronics, and toys</p>
          {Object.keys(CATEGORY_LABELS).map((cat) => (
            grouped[cat] && grouped[cat].length > 0 ? (
              <div key={cat} style={{ marginBottom: 48 }}>
                <h4 style={{ fontSize: 28, fontWeight: 700, color: currentThemeData.primary, margin: '32px 0 18px 0' }}>{CATEGORY_LABELS[cat]}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
                  {grouped[cat].map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>
              </div>
            ) : null
          ))}
        </div>
      </section>
      {/* ... keep the rest of your component code ... */}
    </div>
  );
} 