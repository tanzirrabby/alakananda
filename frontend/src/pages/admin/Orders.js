import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const orderStatuses = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusLabels = { placed: 'অর্ডার হয়েছে', confirmed: 'নিশ্চিত', processing: 'প্রস্তুত হচ্ছে', shipped: 'পাঠানো হয়েছে', delivered: 'পৌঁছেছে', cancelled: 'বাতিল' };
const statusColors = { placed: '#ff9f43', confirmed: '#26de81', processing: '#a855f7', shipped: '#1a73e8', delivered: '#26de81', cancelled: '#ff6b6b' };
const payLabels = { bkash: 'bKash', nagad: 'Nagad', card: 'কার্ড', cod: 'ক্যাশ' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const q = filter ? `?status=${filter}` : '';
    axios.get(`${API}/admin/orders${q}`).then(r => setOrders(r.data));
  }, [filter]);

  const updateStatus = async (id, field, value) => {
    await axios.put(`${API}/admin/orders/${id}/status`, { [field]: value });
    toast.success('স্ট্যাটাস আপডেট হয়েছে');
    const q = filter ? `?status=${filter}` : '';
    const r = await axios.get(`${API}/admin/orders${q}`);
    setOrders(r.data);
  };

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
        <h1 style={{ color: '#fff', marginBottom: 24 }}>📦 অর্ডার ম্যানেজমেন্ট ({orders.length}টি)</h1>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <button onClick={() => setFilter('')} style={{ padding: '7px 16px', borderRadius: 20, cursor: 'pointer', fontFamily: 'Hind Siliguri', fontSize: 13, background: !filter ? 'linear-gradient(135deg, #e91e8c, #ff6b35)' : 'rgba(233,30,140,0.1)', border: `1px solid ${!filter ? 'transparent' : 'rgba(233,30,140,0.3)'}`, color: '#fff' }}>সব</button>
          {orderStatuses.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '7px 16px', borderRadius: 20, cursor: 'pointer', fontFamily: 'Hind Siliguri', fontSize: 13, background: filter === s ? `${statusColors[s]}33` : 'rgba(255,255,255,0.05)', border: `1px solid ${filter === s ? statusColors[s] : 'rgba(255,255,255,0.1)'}`, color: filter === s ? statusColors[s] : '#cc88aa' }}>{statusLabels[s]}</button>
          ))}
        </div>

        {orders.map(order => (
          <div key={order._id} style={{ background: 'linear-gradient(145deg, #1a0020, #2d0036)', border: '1px solid rgba(233,30,140,0.2)', borderRadius: 16, marginBottom: 14, overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: '#fff', fontWeight: 600 }}>#{order._id.slice(-8).toUpperCase()} — {order.user?.name}</p>
                <p style={{ margin: '3px 0 0', color: '#886699', fontSize: 13 }}>{order.user?.email} · {order.user?.phone} · {new Date(order.createdAt).toLocaleDateString('bn-BD')}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, color: '#e91e8c', fontWeight: 700, fontSize: 18 }}>৳{order.totalAmount}</p>
                <p style={{ margin: 0, color: '#886699', fontSize: 12 }}>{payLabels[order.paymentMethod]}</p>
              </div>
              <div>
                <select value={order.orderStatus} onChange={e => { e.stopPropagation(); updateStatus(order._id, 'orderStatus', e.target.value); }}
                  style={{ background: `${statusColors[order.orderStatus] || '#ff9f43'}22`, border: `1px solid ${statusColors[order.orderStatus] || '#ff9f43'}`, color: statusColors[order.orderStatus] || '#ff9f43', borderRadius: 20, padding: '5px 12px', cursor: 'pointer', fontFamily: 'Hind Siliguri', fontSize: 13 }}
                  onClick={e => e.stopPropagation()}>
                  {orderStatuses.map(s => <option key={s} value={s} style={{ background: '#2d0036', color: '#fff' }}>{statusLabels[s]}</option>)}
                </select>
              </div>
              <span style={{ color: '#886699', fontSize: 18 }}>{expanded === order._id ? '▲' : '▼'}</span>
            </div>

            {expanded === order._id && (
              <div style={{ padding: '0 22px 20px', borderTop: '1px solid rgba(233,30,140,0.15)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, paddingTop: 18 }}>
                  <div>
                    <h4 style={{ color: '#ff9f43', margin: '0 0 10px' }}>📍 ডেলিভারি ঠিকানা</h4>
                    {order.shippingAddress && Object.entries(order.shippingAddress).map(([k, v]) => v && (
                      <p key={k} style={{ margin: '4px 0', color: '#cc88aa', fontSize: 14 }}>{v}</p>
                    ))}
                  </div>
                  <div>
                    <h4 style={{ color: '#ff9f43', margin: '0 0 10px' }}>🛍️ অর্ডারকৃত পণ্য</h4>
                    {order.items.map((item, i) => (
                      <p key={i} style={{ margin: '4px 0', color: '#cc88aa', fontSize: 14 }}>
                        • {item.name} × {item.quantity} = ৳{item.price * item.quantity}
                      </p>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ color: '#886699', fontSize: 14 }}>পেমেন্ট স্ট্যাটাস:</span>
                  <select value={order.paymentStatus} onChange={e => updateStatus(order._id, 'paymentStatus', e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,30,140,0.3)', color: '#fff', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontFamily: 'Hind Siliguri' }}>
                    <option value="pending">পেন্ডিং</option>
                    <option value="paid">পেইড</option>
                    <option value="failed">ব্যর্থ</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
