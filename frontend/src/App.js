import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import SignInForm from "./components/auth/SignInForm";
import SignUpForm from "./components/auth/SignUpForm";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import ProductList from "./wireframe/ProductList";
import Cart from "./wireframe/Cart";
import Wishlist from "./wireframe/Wishlist";
import { useAuth } from "./hooks/useAuth";

function Home() {
  return (
    <div style={{ minHeight: '80vh', overflowY: 'auto', padding: '2rem' }}>
      <ProductList />
    </div>
  );
}

function Profile() {
  const { user, loading } = useAuthContext();
  const { handleLogout, loading: logoutLoading } = useAuth();
  const navigate = useNavigate();
  if (loading) return null;
  if (!user) return <Navigate to="/signup" replace />;
  const onLogout = async () => {
    await handleLogout();
    navigate('/');
  };
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '2rem' }}>
      <h2>Profile Page</h2>
      <div style={{marginBottom: '1rem'}}>
        <strong>Name:</strong> {user.name}<br/>
        <strong>Email:</strong> {user.email}
      </div>
      <button onClick={onLogout} disabled={logoutLoading} style={{marginBottom: '2rem', padding: '0.5rem 1.5rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>Logout</button>
      <div style={{width: '100%', maxWidth: 900, margin: '2rem auto', display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
        <div style={{flex: 1, minWidth: 350}}>
          <Wishlist />
        </div>
        <div style={{flex: 1, minWidth: 350}}>
          <Cart />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;