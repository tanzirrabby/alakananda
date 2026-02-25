import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.phone);
      toast.success('একাউন্ট তৈরি হয়েছে! স্বাগতম 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'সাইনআপ ব্যর্থ হয়েছে');
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setGLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Google দিয়ে সাইনআপ সফল! 🎉');
      navigate('/');
    } catch (err) {
      toast.error('Google সাইনআপ ব্যর্থ হয়েছে');
    } finally { setGLoading(false); }
  };

  const inputStyle = {
    width: '100%', background: '#FFF5F9', border: '2px solid #FFD9EC',
    borderRadius: 12, color: '#2D1B4E', padding: '12px 16px',
    fontFamily: 'Hind Siliguri', fontSize: 15, outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #FFF0F7, #F0E6FF, #FFE8F0)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden'
    }}>
      {[
        { w: 250, h: 250, bg: 'rgba(232,67,147,0.1)', top: '-5%', right: '-5%' },
        { w: 180, h: 180, bg: 'rgba(124,58,237,0.1)', bottom: '10%', left: '-5%' },
      ].map((b, i) => (
        <div key={i} style={{ position: 'absolute', width: b.w, height: b.h, background: b.bg, borderRadius: '50%', top: b.top, bottom: b.bottom, left: b.left, right: b.right, filter: 'blur(40px)', pointerEvents: 'none' }} />
      ))}

      <div style={{
        background: '#fff', borderRadius: 24, padding: '36px 32px', width: '100%', maxWidth: 420,
        boxShadow: '0 20px 60px rgba(232,67,147,0.15)', border: '1px solid #FFD9EC'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/logo.jpg" alt="অলকানন্দা" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginBottom: 10, border: '3px solid #E84393' }} />
          <h1 style={{ fontFamily: 'Aclonica, sans-serif', fontSize: 22, color: '#E84393', margin: '0 0 4px' }}>নতুন একাউন্ট</h1>
          <p style={{ color: '#8B5E8E', margin: 0, fontSize: 14 }}>অলকানন্দার পরিবারে যোগ দিন</p>
        </div>

        <button onClick={handleGoogle} disabled={gLoading} style={{
          width: '100%', background: '#fff', border: '2px solid #E0E0E0', borderRadius: 12, padding: '12px',
          cursor: gLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: 'Hind Siliguri', fontSize: 15, color: '#2D1B4E', marginBottom: 18
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#E84393'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#E0E0E0'}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style={{ width: 20, height: 20 }} />
          {gLoading ? 'লোড হচ্ছে...' : 'Google দিয়ে সাইনআপ'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ flex: 1, height: 1, background: '#FFD9EC' }} />
          <span style={{ color: '#8B5E8E', fontSize: 13 }}>অথবা ইমেইল দিয়ে</span>
          <div style={{ flex: 1, height: 1, background: '#FFD9EC' }} />
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { key: 'name', label: 'নাম', type: 'text', placeholder: 'আপনার নাম', required: true },
            { key: 'email', label: 'ইমেইল', type: 'email', placeholder: 'ইমেইল ঠিকানা', required: true },
            { key: 'phone', label: 'ফোন নম্বর', type: 'tel', placeholder: '01XXXXXXXXX', required: false },
            { key: 'password', label: 'পাসওয়ার্ড', type: 'password', placeholder: 'কমপক্ষে ৬ অক্ষর', required: true },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', color: '#7C3AED', fontWeight: 600, marginBottom: 5, fontSize: 14 }}>
                {f.label} {f.required && <span style={{ color: '#E84393' }}>*</span>}
              </label>
              <input type={f.type} value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                required={f.required} placeholder={f.placeholder} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#E84393'}
                onBlur={e => e.target.style.borderColor = '#FFD9EC'} />
            </div>
          ))}
          <div style={{ height: 8 }} />
          <button type="submit" disabled={loading} style={{
            width: '100%', background: loading ? '#ccc' : 'linear-gradient(135deg, #FF6B35, #E84393)',
            color: '#fff', border: 'none', borderRadius: 12, padding: '14px',
            fontFamily: 'Hind Siliguri', fontSize: 16, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(255,107,53,0.4)'
          }}>
            {loading ? 'তৈরি হচ্ছে...' : 'একাউন্ট তৈরি করুন →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#8B5E8E', marginTop: 18, fontSize: 14 }}>
          একাউন্ট আছে?{' '}
          <Link to="/login" style={{ color: '#E84393', fontWeight: 700, textDecoration: 'none' }}>লগইন করুন</Link>
        </p>
      </div>
    </div>
  );
}
