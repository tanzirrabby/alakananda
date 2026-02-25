import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <div className="logo-icon">🌸</div>
          <div className="logo-text">
            <span className="logo-bangla">অলকানন্দা</span>
            <span className="logo-sub">Handmade Churi</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>হোম</Link>
          <Link to="/products" className={`nav-link ${location.pathname.includes('/products') ? 'active' : ''}`}>সব চুড়ি</Link>
          <Link to="/products?category=set-combo" className="nav-link">সেট/কম্বো</Link>
          <Link to="/products?category=metal-dhatu" className="nav-link">মেটাল</Link>
          <Link to="/products?category=shuta-kapor" className="nav-link">সুতা/কাপড়</Link>
        </div>

        {/* Nav Actions */}
        <div className="nav-actions">
          {user && (
            <Link to="/cart" className="cart-btn">
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}

          {user ? (
            <div className="user-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="user-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item admin-item">⚙️ Admin Dashboard</Link>
                  )}
                  <Link to="/profile" className="dropdown-item">👤 প্রোফাইল</Link>
                  <Link to="/my-orders" className="dropdown-item">📦 আমার অর্ডার</Link>
                  <button onClick={handleLogout} className="dropdown-item logout-item">🚪 লগআউট</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline btn-sm">লগইন</Link>
              <Link to="/register" className="btn btn-primary btn-sm">নিবন্ধন</Link>
            </div>
          )}

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
