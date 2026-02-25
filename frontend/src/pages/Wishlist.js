import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/wishlist`).then(r => setItems(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '36px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Aclonica, sans-serif', color: '#2D1B4E', fontSize: 28, marginBottom: 30, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Heart color="#E84393" fill="#E84393" /> পছন্দের তালিকা
        </h1>
        {loading ? (
          <p style={{ color: '#8B5E8E', textAlign: 'center', padding: 60, fontSize: 18 }}>লোড হচ্ছে...</p>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 70, marginBottom: 16 }}>💔</div>
            <p style={{ color: '#8B5E8E', fontSize: 18, fontFamily: 'Hind Siliguri' }}>পছন্দের তালিকা খালি</p>
            <p style={{ color: '#8B5E8E', fontSize: 15 }}>পণ্যে ❤️ বাটন চেপে পছন্দে যোগ করুন</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {items.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
