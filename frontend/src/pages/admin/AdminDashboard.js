import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const STATUS_COLORS = {
  placed: 'warning', confirmed: 'info', processing: 'info',
  shipped: 'primary', delivered: 'success', cancelled: 'danger'
};
const STATUS_LABELS = {
  placed: 'অর্ডার হয়েছে', confirmed: 'নিশ্চিত', processing: 'প্রস্তুতি চলছে',
  shipped: 'পাঠানো হয়েছে', delivered: 'পৌঁছেছে', cancelled: 'বাতিল'
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  useEffect(() => {
    API.get('/admin/dashboard')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-icon">🌸</span>
          <div>
            <div className="admin-brand-name">অলকানন্দা</div>
            <div className="admin-brand-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="admin-nav">
          {[
            { key: 'dashboard', icon: '📊', label: 'ড্যাশবোর্ড', path: '/admin' },
            { key: 'products', icon: '💎', label: 'পণ্য', path: '/admin/products' },
            { key: 'orders', icon: '📦', label: 'অর্ডার', path: '/admin/orders' },
            { key: 'users', icon: '👥', label: 'গ্রাহক', path: '/admin/users' }
          ].map(item => (
            <Link
              key={item.key} to={item.path}
              className={`admin-nav-item ${activeMenu === item.key ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.key)}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-item">🌐 সাইট দেখুন</Link>
          <button className="admin-nav-item" onClick={handleLogout}>🚪 লগআউট</button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {/* Top Bar */}
        <div className="admin-topbar">
          <h1 className="admin-page-title">ড্যাশবোর্ড</h1>
          <div className="admin-user">
            <div className="admin-avatar">{user?.name?.charAt(0)}</div>
            <span>{user?.name}</span>
          </div>
        </div>

        {loading ? (
          <div style={{display:'flex',justifyContent:'center',padding:'80px'}}>
            <div className="loader" />
          </div>
        ) : data && (
          <>
            {/* Stats Cards */}
            <div className="stats-grid">
              {[
                { label: 'মোট অর্ডার', value: data.stats.totalOrders, icon: '📦', color: '#E63946' },
                { label: 'মোট গ্রাহক', value: data.stats.totalUsers, icon: '👥', color: '#9B5DE5' },
                { label: 'মোট পণ্য', value: data.stats.totalProducts, icon: '💎', color: '#F4A261' },
                { label: 'মোট আয়', value: `৳${data.stats.totalRevenue?.toLocaleString()}`, icon: '💰', color: '#2A9D8F' },
                { label: 'পেন্ডিং অর্ডার', value: data.stats.pendingOrders, icon: '⏳', color: '#F7B731' }
              ].map((s, i) => (
                <div key={i} className="stat-card" style={{ '--sc-color': s.color }}>
                  <div className="sc-icon">{s.icon}</div>
                  <div className="sc-info">
                    <div className="sc-value">{s.value}</div>
                    <div className="sc-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Monthly Chart + Category */}
            <div className="admin-grid-2">
              <div className="admin-card">
                <h3 className="admin-card-title">মাসিক আয় (শেষ ৬ মাস)</h3>
                <div className="bar-chart">
                  {data.monthlyRevenue?.map((m, i) => {
                    const months = ['জানু','ফেব','মার্চ','এপ্রি','মে','জুন','জুলা','আগ','সেপ','অক্ট','নভে','ডিসে'];
                    const max = Math.max(...data.monthlyRevenue.map(x => x.revenue));
                    return (
                      <div key={i} className="bar-col">
                        <div className="bar-value">৳{m.revenue}</div>
                        <div className="bar" style={{height: `${(m.revenue / max) * 100}%`}} />
                        <div className="bar-label">{months[m._id.month - 1]}</div>
                      </div>
                    );
                  })}
                  {data.monthlyRevenue?.length === 0 && (
                    <p style={{color:'var(--text-muted)', textAlign:'center', width:'100%'}}>কোনো ডেটা নেই</p>
                  )}
                </div>
              </div>

              <div className="admin-card">
                <h3 className="admin-card-title">ক্যাটাগরি বিক্রয়</h3>
                <div className="cat-stats">
                  {data.categoryStats?.map((c, i) => {
                    const labels = { 'set-combo': 'সেট/কম্বো', 'metal-dhatu': 'মেটাল/ধাতু', 'shuta-kapor': 'সুতা/কাপড়' };
                    const total = data.categoryStats.reduce((a,x)=>a+x.count,0);
                    return (
                      <div key={i} className="cat-stat-row">
                        <span>{labels[c._id] || c._id}</span>
                        <div className="cat-stat-bar-wrap">
                          <div className="cat-stat-bar" style={{width:`${(c.count/total)*100}%`}} />
                        </div>
                        <span className="cat-stat-count">{c.count} টি</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">সাম্প্রতিক অর্ডার</h3>
                <Link to="/admin/orders" className="btn btn-outline btn-sm">সব দেখুন</Link>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>অর্ডার ID</th>
                      <th>গ্রাহক</th>
                      <th>মোট</th>
                      <th>পেমেন্ট</th>
                      <th>স্ট্যাটাস</th>
                      <th>তারিখ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders?.map(o => (
                      <tr key={o._id}>
                        <td><span className="order-id">#{o._id.slice(-8).toUpperCase()}</span></td>
                        <td>
                          <div className="user-cell">
                            <div className="mini-avatar">{o.user?.name?.charAt(0)}</div>
                            <div>
                              <div>{o.user?.name}</div>
                              <small>{o.user?.email}</small>
                            </div>
                          </div>
                        </td>
                        <td><strong>৳{o.total}</strong></td>
                        <td>
                          <span className={`badge badge-${o.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                            {o.paymentStatus === 'paid' ? '✅ পেইড' : '⏳ পেন্ডিং'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-${STATUS_COLORS[o.orderStatus]}`}>
                            {STATUS_LABELS[o.orderStatus]}
                          </span>
                        </td>
                        <td>{new Date(o.createdAt).toLocaleDateString('bn-BD')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Stock */}
            {data.lowStockProducts?.length > 0 && (
              <div className="admin-card low-stock-card">
                <h3 className="admin-card-title">⚠️ কম স্টক</h3>
                <div className="low-stock-list">
                  {data.lowStockProducts.map(p => (
                    <div key={p._id} className="low-stock-item">
                      <span className="ls-name">{p.name}</span>
                      <span className={`badge ${p.stock === 0 ? 'badge-danger' : 'badge-warning'}`}>
                        {p.stock === 0 ? 'স্টক শেষ' : `${p.stock} টি বাকি`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
