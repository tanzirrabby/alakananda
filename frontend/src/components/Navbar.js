import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User, Heart, LogOut, Package, Menu, X } from 'lucide-react';

const WHATSAPP = '8801843646125';
const FB_LINK = 'https://www.facebook.com/people/%E0%A6%85%E0%A6%B2%E0%A6%95%E0%A6%BE%E0%A6%A8%E0%A6%A8%E0%A6%A6%E0%A6%BE/61574696396143';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [userMenu, setUserMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setUserMenu(false); };

  const navStyle = {
    background: 'linear-gradient(135deg, #FF6B35 0%, #E84393 40%, #7C3AED 100%)',
    position: 'sticky', top: 0, zIndex: 1000,
    boxShadow: '0 4px 20px rgba(232,67,147,0.4)',
    fontFamily: 'Hind Siliguri, sans-serif'
  };

  return (
    <>
      <nav style={navStyle}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.jpg" alt="অলকানন্দা" style={{
              width: 50, height: 50, borderRadius: '50%', objectFit: 'cover',
              border: '2px solid rgba(255,255,255,0.8)',
              boxShadow: '0 0 15px rgba(255,255,255,0.3)'
            }} />
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, fontFamily: 'Aclonica, sans-serif', lineHeight: 1 }}>অলকানন্দা</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>সাজের ঘর</div>
            </div>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {[['/', 'হোম'], ['/products', 'পণ্যসমূহ']].map(([path, label]) => (
              <Link key={path} to={path} style={{
                color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: 16, fontWeight: 500,
                transition: 'all 0.2s', padding: '4px 0', borderBottom: '2px solid transparent'
              }}
              onMouseEnter={e => { e.target.style.color = '#fff'; e.target.style.borderBottomColor = '#FFD700'; }}
              onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.9)'; e.target.style.borderBottomColor = 'transparent'; }}>
                {label}
              </Link>
            ))}
            {/* WhatsApp */}
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" style={{
              background: '#25D366', color: '#fff', textDecoration: 'none',
              borderRadius: 20, padding: '5px 14px', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 5
            }}>
              <span>💬</span> অর্ডার করুন
            </a>
            {/* Facebook */}
            <a href={FB_LINK} target="_blank" rel="noreferrer" style={{
              background: '#1877F2', color: '#fff', textDecoration: 'none',
              borderRadius: 20, padding: '5px 14px', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 5
            }}>
              <span>📘</span> Facebook
            </a>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {user ? (
              <>
                <Link to="/wishlist" style={{ color: '#fff', textDecoration: 'none', position: 'relative' }}>
                  <Heart size={22} fill="rgba(255,255,255,0.3)" />
                </Link>
                <Link to="/cart" style={{ position: 'relative', color: '#fff', textDecoration: 'none' }}>
                  <ShoppingBag size={22} />
                  {cartCount > 0 && (
                    <span style={{
                      position: 'absolute', top: -8, right: -8,
                      background: '#FFD700', color: '#1A0A2E', borderRadius: '50%',
                      width: 18, height: 18, fontSize: 11, fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>{cartCount}</span>
                  )}
                </Link>
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setUserMenu(!userMenu)} style={{
                    background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.5)',
                    borderRadius: '50%', width: 38, height: 38, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                  }}>
                    {user.photo
                      ? <img src={user.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <User size={18} color="#fff" />}
                  </button>
                  {userMenu && (
                    <div style={{
                      position: 'absolute', right: 0, top: 48,
                      background: '#fff', border: '1px solid #FFD9EC',
                      borderRadius: 14, padding: 8, minWidth: 180,
                      boxShadow: '0 10px 40px rgba(232,67,147,0.2)',
                      animation: 'fadeInUp 0.2s ease'
                    }}>
                      <div style={{ padding: '10px 14px 12px', borderBottom: '1px solid #FFD9EC', marginBottom: 6 }}>
                        <p style={{ fontWeight: 700, color: '#2D1B4E', margin: 0, fontSize: 14 }}>{user.name}</p>
                        <p style={{ color: '#8B5E8E', margin: 0, fontSize: 12 }}>{user.email}</p>
                      </div>
                      {[
                        { to: '/profile', icon: <User size={14}/>, label: 'প্রোফাইল' },
                        { to: '/my-orders', icon: <Package size={14}/>, label: 'আমার অর্ডার' },
                        { to: '/wishlist', icon: <Heart size={14}/>, label: 'পছন্দের তালিকা' },
                      ].map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setUserMenu(false)} style={{
                          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                          color: '#2D1B4E', textDecoration: 'none', borderRadius: 8, fontSize: 14
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FFF0F7'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                          {item.icon} {item.label}
                        </Link>
                      ))}
                      <button onClick={handleLogout} style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                        color: '#E84393', background: 'none', border: 'none', cursor: 'pointer',
                        width: '100%', fontSize: 14, borderRadius: 8, fontFamily: 'Hind Siliguri'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FFF0F7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        <LogOut size={14} /> লগআউট
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" style={{
                  color: '#fff', textDecoration: 'none',
                  border: '2px solid rgba(255,255,255,0.7)', borderRadius: 20, padding: '6px 18px', fontSize: 14
                }}>লগইন</Link>
                <Link to="/signup" style={{
                  background: '#FFD700', color: '#1A0A2E', fontWeight: 700,
                  textDecoration: 'none', borderRadius: 20, padding: '6px 18px', fontSize: 14
                }}>সাইনআপ</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
