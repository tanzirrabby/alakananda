import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Search, Filter } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const categories = [
  { id: '', label: 'সব পণ্য' },
  { id: 'set-combo', label: 'সেট/কম্বো' },
  { id: 'metal-dhatu', label: 'মেটাল/ধাতু' },
  { id: 'shuta-kapor', label: 'সুতা/কাপড়' },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    axios.get(`${API}/products?${params}`).then(r => setProducts(r.data)).finally(() => setLoading(false));
  }, [category, search, sort]);

  const inputStyle = {
    background: '#1a0020', border: '1px solid rgba(233,30,140,0.3)',
    borderRadius: 8, color: '#fff', padding: '10px 14px',
    fontFamily: 'Hind Siliguri', fontSize: 14, outline: 'none'
  };

  return (
    <div style={{ background: '#0d0014', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Hind Siliguri', color: '#fff', fontSize: 32, marginBottom: 30,
          background: 'linear-gradient(135deg, #e91e8c, #ff9f43)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>সকল পণ্য</h1>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#886699' }} />
            <input
              placeholder="পণ্য খুঁজুন..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: 38, width: '100%', boxSizing: 'border-box' }}
            />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} style={inputStyle}>
            <option value="">ডিফল্ট</option>
            <option value="price-asc">দাম: কম থেকে বেশি</option>
            <option value="price-desc">দাম: বেশি থেকে কম</option>
          </select>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSearchParams(cat.id ? { category: cat.id } : {})} style={{
              background: category === cat.id ? 'linear-gradient(135deg, #e91e8c, #ff6b35)' : 'rgba(233,30,140,0.1)',
              border: `1px solid ${category === cat.id ? 'transparent' : 'rgba(233,30,140,0.3)'}`,
              color: '#fff', borderRadius: 20, padding: '8px 20px',
              cursor: 'pointer', fontFamily: 'Hind Siliguri', fontSize: 14
            }}>{cat.label}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, fontFamily: 'Hind Siliguri', color: '#886699', fontSize: 18 }}>
            লোড হচ্ছে... ✨
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
            <p style={{ fontFamily: 'Hind Siliguri', color: '#886699', fontSize: 18 }}>কোনো পণ্য পাওয়া যায়নি</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
