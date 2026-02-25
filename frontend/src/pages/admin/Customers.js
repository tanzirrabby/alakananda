import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, ShoppingCart } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'process.env.REACT_APP_API_URL/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/admin/customers`).then(r => setCustomers(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0014', fontFamily: 'Hind Siliguri' }}>
      <div style={{ width: 200, background: 'linear-gradient(180deg, #1a0020, #0d0014)', borderRight: '1px solid rgba(233,30,140,0.2)', padding: '24px 12px' }}>
        <p style={{ margin: '0 0 20px 8px', background: 'linear-gradient(135deg, #e91e8c, #ff9f43)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>অলকানন্দা</p>
        {['/admin', '/admin/products', '/admin/orders', '/admin/customers'].map((to, i) => (
          <Link key={to} to={to} style={{ display: 'block', padding: '10px 12px', color: '#cc88aa', textDecoration: 'none', borderRadius: 8, marginBottom: 4, fontSize: 14 }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(233,30,140,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            {['📊 ড্যাশবোর্ড', '💍 পণ্য', '📦 অর্ডার', '👥 কাস্টমার'][i]}
          </Link>
        ))}
      </div>

      <div style={{ flex: 1, padding: '32px 28px', overflowY: 'auto' }}>
        <h1 style={{ color: '#fff', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Users color="#e91e8c" /> কাস্টমার তালিকা ({customers.length}জন)
        </h1>

        {loading ? (
          <p style={{ color: '#886699', textAlign: 'center', padding: 40 }}>লোড হচ্ছে...</p>
        ) : (
          <div style={{ background: 'linear-gradient(145deg, #1a0020, #2d0036)', border: '1px solid rgba(233,30,140,0.2)', borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(233,30,140,0.2)' }}>
                  {['নাম', 'ইমেইল', 'ফোন', 'মোট অর্ডার', 'কার্টে আছে', 'যোগদানের তারিখ'].map(h => (
                    <th key={h} style={{ color: '#886699', padding: '16px 14px', textAlign: 'left', fontSize: 13, fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c._id} style={{ borderBottom: '1px solid rgba(233,30,140,0.08)' }}>
                    <td style={{ padding: '14px', color: '#fff', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #e91e8c, #a855f7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                          {c.name.charAt(0)}
                        </div>
                        {c.name}
                      </div>
                    </td>
                    <td style={{ padding: '14px', color: '#cc88aa', fontSize: 13 }}>{c.email}</td>
                    <td style={{ padding: '14px', color: '#cc88aa', fontSize: 13 }}>{c.phone || '—'}</td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ShoppingBag size={14} color="#e91e8c" />
                        <span style={{ color: '#fff', fontWeight: 600 }}>{c.orderCount}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ShoppingCart size={14} color={c.cartItemCount > 0 ? '#ff9f43' : '#555'} />
                        <span style={{ color: c.cartItemCount > 0 ? '#ff9f43' : '#555', fontWeight: c.cartItemCount > 0 ? 700 : 400 }}>
                          {c.cartItemCount > 0 ? `${c.cartItemCount}টি পণ্য` : 'খালি'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '14px', color: '#886699', fontSize: 13 }}>{new Date(c.createdAt).toLocaleDateString('bn-BD')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
