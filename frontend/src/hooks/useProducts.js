import { useState, useEffect, useRef } from 'react';
import { getProducts, uploadProduct } from '../api/products';

export function useProducts() {
  const [products, setProducts] = useState(() => {
    // Try to load products from localStorage
    const stored = localStorage.getItem('products-cache');
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const retryTimeout = useRef(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts();
      setProducts(res.data.products);
      localStorage.setItem('products-cache', JSON.stringify(res.data.products));
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
        retryTimeout.current = null;
      }
    } catch (err) {
      setError('Failed to fetch products. Retrying in 5s...');
      retryTimeout.current = setTimeout(fetchProducts, 5000); // retry every 5 seconds
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Cleanup on unmount
    return () => {
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
    };
    // eslint-disable-next-line
  }, []);

  const handleUpload = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await uploadProduct(data);
      await fetchProducts();
    } catch (err) {
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, handleUpload };
}
