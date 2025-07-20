import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductUpload from './components/ProductUpload';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import Orders from './components/Orders';
import Auth from './components/Auth';
import ProductDetails from './components/ProductDetails';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/upload" element={<ProductUpload />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
