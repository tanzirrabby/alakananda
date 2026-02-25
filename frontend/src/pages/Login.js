import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success('স্বাগতম! 🎉');
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'লগইন ব্যর্থ হয়েছে');
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setGLoading(true);
    try {
      const user = await loginWithGoogle();
      toast.success('Google দিয়ে লগইন সফল! 🎉');
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error('Google লগইন ব্যর্থ হয়েছে');
    } finally { setGLoading(false); }
  };

  const inputStyle = {
    width: '100%', background: '#FFF5F9', border: '2px solid #FFD9EC',
    borderRadius: 12, color: '#2D1B4E', padding: '12px 16px',
    fontFamily: 'Hind Siliguri', fontSize: 15, outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s'
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #FFF0F7 0%, #F0E6FF 50%, #FFE8F0 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden'
    }}>
      {/* Decorative blobs */}
      {[
        { w: 300, h: 300, bg: 'rgba(232,67,147,0.1)', top: '-10%', left: '-10%' },
        { w: 200, h: 200, bg: 'rgba(124,58,237,0.1)', bottom: '-5%', right: '-5%' },
        { w: 150, h: 150, bg: 'rgba(255,215,0,0.15)', top: '50%', right: '10%' },
      ].map((b, i) => (
        <div key={i} style={{
          position: 'absolute', width: b.w, height: b.h, background: b.bg,
          borderRadius: '50%', top: b.top, bottom: b.bottom, left: b.left, right: b.right,
          filter: 'blur(40px)', pointerEvents: 'none'
        }} />
      ))}

      <div style={{
        background: '#fff', borderRadius: 24, padding: '40px 36px',
        width: '100%', maxWidth: 420, position: 'relative',
        boxShadow: '0 20px 60px rgba(232,67,147,0.15)',
        border: '1px solid #FFD9EC'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/logo.jpg" alt="অলকানন্দা" style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', marginBottom: 12, border: '3px solid #E84393' }} />
          <h1 style={{ fontFamily: 'Aclonica, sans-serif', fontSize: 24, color: '#E84393', margin: '0 0 4px' }}>স্বাগতম!</h1>
          <p style={{ color: '#8B5E8E', margin: 0, fontSize: 14 }}>আপনার একাউন্টে লগইন করুন</p>
        </div>

        {/* Google Login */}
        <button onClick={handleGoogle} disabled={gLoading} style={{
          width: '100%', background: '#fff', border: '2px solid #E0E0E0',
          borderRadius: 12, padding: '12px', cursor: gLoading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: 'Hind Siliguri', fontSize: 15, color: '#2D1B4E', marginBottom: 20,
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#E84393'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#E0E0E0'}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style={{ width: 20, height: 20 }} />
          {gLoading ? 'লোড হচ্ছে...' : 'Google দিয়ে লগইন করুন'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: '#FFD9EC' }} />
          <span style={{ color: '#8B5E8E', fontSize: 13 }}>অথবা</span>
          <div style={{ flex: 1, height: 1, background: '#FFD9EC' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: '#7C3AED', fontWeight: 600, marginBottom: 6, fontSize: 14 }}>ইমেইল</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="আপনার ইমেইল" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#E84393'}
              onBlur={e => e.target.style.borderColor = '#FFD9EC'} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', color: '#7C3AED', fontWeight: 600, marginBottom: 6, fontSize: 14 }}>পাসওয়ার্ড</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="পাসওয়ার্ড" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#E84393'}
              onBlur={e => e.target.style.borderColor = '#FFD9EC'} />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', background: loading ? '#ccc' : 'linear-gradient(135deg, #E84393, #7C3AED)',
            color: '#fff', border: 'none', borderRadius: 12, padding: '14px',
            fontFamily: 'Hind Siliguri', fontSize: 16, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(232,67,147,0.4)'
          }}>
            {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#8B5E8E', marginTop: 20, fontSize: 14 }}>
          একাউন্ট নেই?{' '}
          <Link to="/signup" style={{ color: '#E84393', fontWeight: 700, textDecoration: 'none' }}>সাইনআপ করুন</Link>
        </p>
      </div>
    </div>
  );
}
