import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Users, Package, TrendingUp, LogOut, Plus, Bell } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

const statusColors = {
  placed: '#ff9f43', confirmed: '#26de81', processing: '#a855f7',
  shipped: '#1a73e8', delivered: '#26de81', cancelled: '#ff6b6b'
};
const statusLabels = {
  placed: 'অর্ডার হয়েছে', confirmed: 'নিশ্চিত', processing: 'প্রস্তুত হচ্ছে',
  shipped: 'পাঠানো হয়েছে', delivered: 'পৌঁছেছে', cancelled: 'বাতিল'
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`${API}/admin/dashboard`).then(r => setData(r.data)).catch(console.error);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const sideLinks = [
    { to: '/admin', label: 'ড্যাশবোর্ড', icon: '📊' },
    { to: '/admin/products', label: 'পণ্য', icon: '💍' },
    { to: '/admin/orders', label: 'অর্ডার', icon: '📦' },
    { to: '/admin/customers', label: 'কাস্টমার', icon: '👥' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0014', fontFamily: 'Hind Siliguri' }}>
      {/* Sidebar */}
      <div style={{
        width: 240, background: 'linear-gradient(180deg, #1a0020 0%, #0d0014 100%)',
        borderRight: '1px solid rgba(233,30,140,0.2)', padding: '24px 0', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '0 20px 30px', borderBottom: '1px solid rgba(233,30,140,0.2)' }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>💍</div>
          <h2 style={{ margin: 0, fontSize: 18, background: 'linear-gradient(135deg, #e91e8c, #ff9f43)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>অলকানন্দা</h2>
          <p style={{ margin: 0, color: '#886699', fontSize: 12 }}>অ্যাডমিন প্যানেল</p>
        </div>

        <nav style={{ flex: 1, padding: '20px 12px' }}>
          {sideLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
              color: '#cc88aa', textDecoration: 'none', borderRadius: 10, marginBottom: 4, fontSize: 15,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(233,30,140,0.15)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#cc88aa'; }}>
              <span style={{ fontSize: 18 }}>{link.icon}</span> {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '0 12px 20px' }}>
          <Link to="/admin/products/add" style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px',
            background: 'linear-gradient(135deg, #e91e8c, #ff6b35)', color: '#fff',
            textDecoration: 'none', borderRadius: 10, marginBottom: 8, fontSize: 14, fontWeight: 600
          }}>
            <Plus size={16} /> নতুন পণ্য যোগ
          </Link>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px',
            color: '#ff6b6b', background: 'none', border: '1px solid rgba(255,107,107,0.3)',
            borderRadius: 10, cursor: 'pointer', width: '100%', fontSize: 14
          }}>
            <LogOut size={16} /> লগআউট
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '32px 28px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ color: '#fff', margin: '0 0 4px', fontSize: 24 }}>স্বাগতম, {user?.name}! 👋</h1>
            <p style={{ color: '#886699', margin: 0, fontSize: 14 }}>আজকের পর্যালোচনা দেখুন</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Bell size={20} color="#886699" />
            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #e91e8c, #ff6b35)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
              A
            </div>
          </div>
        </div>

        {/* Stats */}
        {data && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
              {[
                { label: 'মোট অর্ডার', value: data.stats.totalOrders, icon: <ShoppingBag size={22}/>, color: '#e91e8c' },
                { label: 'মোট কাস্টমার', value: data.stats.totalUsers, icon: <Users size={22}/>, color: '#ff9f43' },
                { label: 'মোট পণ্য', value: data.stats.totalProducts, icon: <Package size={22}/>, color: '#a855f7' },
                { label: 'মোট আয়', value: `৳${data.stats.totalRevenue}`, icon: <TrendingUp size={22}/>, color: '#26de81' },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: 'linear-gradient(145deg, #1a0020, #2d0036)',
                  border: `1px solid ${stat.color}33`, borderRadius: 16, padding: 22
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <p style={{ color: '#886699', margin: 0, fontSize: 13 }}>{stat.label}</p>
                    <div style={{ color: stat.color }}>{stat.icon}</div>
                  </div>
                  <p style={{ color: stat.color, fontSize: 28, fontWeight: 700, margin: 0 }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Pending */}
            {data.stats.pendingOrders > 0 && (
              <div style={{ background: 'rgba(255,159,67,0.1)', border: '1px solid rgba(255,159,67,0.4)', borderRadius: 12, padding: '14px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Bell size={18} color="#ff9f43" />
                <span style={{ color: '#ff9f43', fontWeight: 600 }}>{data.stats.pendingOrders}টি নতুন অর্ডার পেন্ডিং আছে!</span>
                <Link to="/admin/orders" style={{ color: '#ff9f43', marginLeft: 'auto', textDecoration: 'none', fontWeight: 600 }}>দেখুন →</Link>
              </div>
            )}

            {/* Recent Orders */}
            <div style={{ background: 'linear-gradient(145deg, #1a0020, #2d0036)', border: '1px solid rgba(233,30,140,0.2)', borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ color: '#fff', margin: 0, fontSize: 18 }}>সাম্প্রতিক অর্ডার</h3>
                <Link to="/admin/orders" style={{ color: '#e91e8c', textDecoration: 'none', fontSize: 14 }}>সব দেখুন →</Link>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['অর্ডার ID', 'কাস্টমার', 'পরিমাণ', 'স্ট্যাটাস', 'তারিখ'].map(h => (
                      <th key={h} style={{ color: '#886699', fontSize: 13, textAlign: 'left', padding: '0 0 14px', borderBottom: '1px solid rgba(233,30,140,0.15)', fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map(order => (
                    <tr key={order._id}>
                      <td style={{ padding: '12px 0', color: '#886699', fontSize: 13 }}>#{order._id.slice(-6).toUpperCase()}</td>
                      <td style={{ padding: '12px 0', color: '#fff', fontSize: 14 }}>{order.user?.name || 'অজানা'}</td>
                      <td style={{ padding: '12px 0', color: '#e91e8c', fontWeight: 600 }}>৳{order.totalAmount}</td>
                      <td style={{ padding: '12px 0' }}>
                        <span style={{
                          background: `${statusColors[order.orderStatus] || '#ff9f43'}22`,
                          color: statusColors[order.orderStatus] || '#ff9f43',
                          borderRadius: 20, padding: '3px 12px', fontSize: 12
                        }}>{statusLabels[order.orderStatus] || order.orderStatus}</span>
                      </td>
                      <td style={{ padding: '12px 0', color: '#886699', fontSize: 13 }}>{new Date(order.createdAt).toLocaleDateString('bn-BD')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
