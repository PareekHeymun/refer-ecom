import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useAuthContext } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

export default function ProductUpload() {
  const { handleUpload, loading, error } = useProducts();
  const { user } = useAuthContext();
  const { showNotification } = useNotification();
  const [form, setForm] = useState({ name: '', price: '', description: '', category: 'electronics', stock: '', images: [] });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [success, setSuccess] = useState(false);

  if (!user) {
    return <div style={{padding:'2rem',textAlign:'center'}}>Please login to upload products.</div>;
  }

  if (user.role !== 'seller') {
    return <div style={{padding:'2rem',textAlign:'center'}}>Only sellers can upload products. Your current role is: {user.role}</div>;
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const previews = [];
    const base64s = [];
    for (const file of files) {
      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      previews.push(base64);
      base64s.push(base64);
    }
    setImagePreviews(previews);
    setForm(f => ({ ...f, images: base64s }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.price || !form.description || !form.stock) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    try {
      await handleUpload({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10)
      });
      setForm({ name: '', price: '', description: '', category: 'electronics', stock: '', images: [] });
      setImagePreviews([]);
      setSuccess(true);
      showNotification('Product uploaded successfully!', 'success');
    } catch {
      showNotification('Upload failed', 'error');
    }
  };

  return (
    <div style={{background:'#f8fafc',minHeight:'100vh',padding:'2.5rem 0'}}>
      <div style={{maxWidth: 900, margin: '0 auto', display: 'flex', gap: 32}}>
        {/* Seller Sidebar/Navigation */}
        <aside style={{minWidth: 220, background:'#fff', borderRadius: 16, boxShadow:'0 2px 16px rgba(30,41,59,0.07)', padding:'2rem 1.5rem', display:'flex', flexDirection:'column', alignItems:'center', height:'fit-content'}}>
          <h3 style={{fontWeight:800, fontSize: 22, marginBottom: 18, color:'#2563eb'}}>Seller Panel</h3>
          <div style={{fontSize:15, color:'#64748b', marginBottom: 12}}>Welcome, <b>{user.name}</b></div>
          <div style={{fontSize:14, color:'#64748b'}}>Role: <b style={{color:'#10b981'}}>Seller</b></div>
        </aside>
        {/* Upload Card */}
        <div style={{flex:1, background:'#fff', borderRadius:18, boxShadow:'0 4px 24px rgba(30,41,59,0.10)', padding:'2.5rem 2.5rem 2rem 2.5rem', minWidth:320}}>
          <h2 style={{fontWeight: 800, fontSize: 28, marginBottom: 24, color:'#222'}}>Upload a New Product</h2>
          {success && <div style={{background:'#e6f9ed',color:'#1a7f37',border:'1.5px solid #1a7f37',borderRadius:8,padding:'1rem 1.5rem',marginBottom:18,fontWeight:600}}>Product uploaded successfully!</div>}
          <form onSubmit={handleSubmit} autoComplete="off">
            <div style={{marginBottom: '1.2rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Product Name:</label>
              <input 
                name="name" 
                type="text" 
                placeholder="Product name" 
                value={form.name} 
                onChange={handleChange} 
                style={{
                  width: '100%', 
                  padding: '0.85rem', 
                  border: '1.5px solid #e5e7eb', 
                  borderRadius: '8px',
                  fontSize: '1.08rem',
                  background:'#f8fafc'
                }} 
              />
            </div>
            <div style={{display:'flex',gap:18,marginBottom:'1.2rem'}}>
              <div style={{flex:1}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Price:</label>
                <input 
                  name="price" 
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  value={form.price} 
                  onChange={handleChange} 
                  style={{
                    width: '100%', 
                    padding: '0.85rem', 
                    border: '1.5px solid #e5e7eb', 
                    borderRadius: '8px',
                    fontSize: '1.08rem',
                    background:'#f8fafc'
                  }} 
                />
              </div>
              <div style={{flex:1}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Stock:</label>
                <input 
                  name="stock" 
                  type="number" 
                  min="0"
                  placeholder="0" 
                  value={form.stock} 
                  onChange={handleChange} 
                  style={{
                    width: '100%', 
                    padding: '0.85rem', 
                    border: '1.5px solid #e5e7eb', 
                    borderRadius: '8px',
                    fontSize: '1.08rem',
                    background:'#f8fafc'
                  }} 
                />
              </div>
            </div>
            <div style={{marginBottom: '1.2rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Category:</label>
              <select 
                name="category" 
                value={form.category} 
                onChange={handleChange}
                style={{
                  width: '100%', 
                  padding: '0.85rem', 
                  border: '1.5px solid #e5e7eb', 
                  borderRadius: '8px',
                  fontSize: '1.08rem',
                  background:'#f8fafc'
                }}
              >
                <option value="electronics">Electronics</option>
                <option value="toys">Toys</option>
                <option value="books">Books</option>
              </select>
            </div>
            <div style={{marginBottom: '1.2rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Description:</label>
              <textarea 
                name="description" 
                placeholder="Product description" 
                value={form.description} 
                onChange={handleChange} 
                rows="4"
                style={{
                  width: '100%', 
                  padding: '0.85rem', 
                  border: '1.5px solid #e5e7eb', 
                  borderRadius: '8px',
                  fontSize: '1.08rem',
                  background:'#f8fafc',
                  resize: 'vertical'
                }} 
              />
            </div>
            <div style={{marginBottom: '1.2rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Product Images:</label>
              <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleImageChange}
                style={{marginBottom: '0.5rem'}}
              />
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {imagePreviews.map((src, i) => (
                  <img key={i} src={src} alt={`Preview ${i+1}`} style={{width:60,height:60,objectFit:'cover',borderRadius:8,border:'1.5px solid #eee'}} />
                ))}
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.08rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                fontWeight: 700,
                marginTop: 12
              }}
            >
              {loading ? 'Uploading...' : 'Upload Product'}
            </button>
            {error && <div style={{color: '#b91c1c', marginTop: '1rem', fontWeight:600}}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
