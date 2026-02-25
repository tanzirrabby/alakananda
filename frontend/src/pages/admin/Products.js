import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'process.env.REACT_APP_API_URL';

const catLabels = { 'set-combo': 'সেট/কম্বো', 'metal-dhatu': 'মেটাল/ধাতু', 'shuta-kapor': 'সুতা/কাপড়' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${API}/products`);
    setProducts(res.data);
    setLoading(false);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`"${name}" পণ্যটি মুছে দিতে চান?`)) return;
    await axios.delete(`${API}/products/${id}`);
    toast.success('পণ্য মুছে গেছে');
    fetchProducts();
  };

  const toggleFeatured = async (id, current) => {
    await axios.put(`${API}/products/${id}`, { isFeatured: !current });
    fetchProducts();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0014', fontFamily: 'Hind Siliguri' }}>
      {/* Mini sidebar */}
      <AdminSidebar />
      <div style={{ flex: 1, padding: '32px 28px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h1 style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Package color="#e91e8c" /> পণ্য ম্যানেজমেন্ট
          </h1>
          <Link to="/admin/products/add" style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
            background: 'linear-gradient(135deg, #e91e8c, #ff6b35)', color: '#fff',
            textDecoration: 'none', borderRadius: 10, fontWeight: 600
          }}><Plus size={16} /> নতুন পণ্য</Link>
        </div>

        {loading ? (
          <p style={{ color: '#886699', textAlign: 'center', padding: 40 }}>লোড হচ্ছে...</p>
        ) : (
          <div style={{ background: 'linear-gradient(145deg, #1a0020, #2d0036)', border: '1px solid rgba(233,30,140,0.2)', borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(233,30,140,0.2)' }}>
                  {['ছবি', 'নাম', 'বিভাগ', 'দাম', 'স্টক', 'বিশেষ', 'অ্যাকশন'].map(h => (
                    <th key={h} style={{ color: '#886699', padding: '16px 14px', textAlign: 'left', fontSize: 13, fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const imgSrc = p.images?.[0] ? `${API_URL}${p.images[0]}` : null;
                  return (
                    <tr key={p._id} style={{ borderBottom: '1px solid rgba(233,30,140,0.1)' }}>
                      <td style={{ padding: '12px 14px' }}>
                        {imgSrc ? <img src={imgSrc} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                          : <div style={{ width: 48, height: 48, background: '#2d0036', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💍</div>}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#fff', fontSize: 14, fontWeight: 500 }}>{p.name}</td>
                      <td style={{ padding: '12px 14px', color: '#cc88aa', fontSize: 13 }}>{catLabels[p.category]}</td>
                      <td style={{ padding: '12px 14px', color: '#e91e8c', fontWeight: 700 }}>৳{p.price}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ color: p.stock > 0 ? '#26de81' : '#ff6b6b', fontSize: 14 }}>{p.stock}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <button onClick={() => toggleFeatured(p._id, p.isFeatured)} style={{
                          background: p.isFeatured ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${p.isFeatured ? '#ffd700' : 'rgba(255,255,255,0.1)'}`,
                          color: p.isFeatured ? '#ffd700' : '#666', borderRadius: 6, padding: '4px 10px',
                          cursor: 'pointer', fontSize: 13
                        }}>
                          {p.isFeatured ? '⭐ হ্যাঁ' : '☆ না'}
                        </button>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Link to={`/admin/products/add?edit=${p._id}`} style={{
                            background: 'rgba(26,115,232,0.2)', border: '1px solid rgba(26,115,232,0.4)',
                            color: '#1a73e8', borderRadius: 6, padding: '6px 10px', textDecoration: 'none',
                            display: 'flex', alignItems: 'center'
                          }}><Edit size={14} /></Link>
                          <button onClick={() => handleDelete(p._id, p.name)} style={{
                            background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
                            color: '#ff6b6b', borderRadius: 6, padding: '6px 10px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center'
                          }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminSidebar() {
  const links = [
    { to: '/admin', label: '📊 ড্যাশবোর্ড' },
    { to: '/admin/products', label: '💍 পণ্য' },
    { to: '/admin/orders', label: '📦 অর্ডার' },
    { to: '/admin/customers', label: '👥 কাস্টমার' },
  ];
  return (
    <div style={{ width: 200, background: 'linear-gradient(180deg, #1a0020, #0d0014)', borderRight: '1px solid rgba(233,30,140,0.2)', padding: '24px 12px' }}>
      <div style={{ padding: '0 8px 20px', marginBottom: 16, borderBottom: '1px solid rgba(233,30,140,0.2)' }}>
        <p style={{ margin: 0, fontFamily: 'Hind Siliguri', background: 'linear-gradient(135deg, #e91e8c, #ff9f43)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700, fontSize: 16 }}>অলকানন্দা</p>
      </div>
      {links.map(l => (
        <Link key={l.to} to={l.to} style={{ display: 'block', padding: '10px 12px', color: '#cc88aa', textDecoration: 'none', borderRadius: 8, marginBottom: 4, fontFamily: 'Hind Siliguri', fontSize: 14 }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(233,30,140,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}>{l.label}</Link>
      ))}
    </div>
  );
}
