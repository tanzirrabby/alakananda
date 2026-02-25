import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPages.css';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`স্বাগতম, ${user.name}! 🌸`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'লগইন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-inner">
          <div className="auth-logo">🌸</div>
          <h2>অলকানন্দা</h2>
          <p>হাতে তৈরি চুড়ির অনন্য সংগ্রহ</p>
          <div className="auth-decorations">
            <span>💎</span><span>🌺</span><span>✨</span><span>🎀</span>
          </div>
        </div>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form-box">
          <h1>লগইন করুন</h1>
          <p className="auth-subtitle">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>ইমেইল</label>
              <input type="email" placeholder="your@email.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>পাসওয়ার্ড</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? '⏳ লগইন হচ্ছে...' : 'লগইন করুন'}
            </button>
          </form>
          <p className="auth-switch">
            অ্যাকাউন্ট নেই? <Link to="/register">নিবন্ধন করুন</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('পাসওয়ার্ড মিলছে না'); return; }
    if (form.password.length < 6) { toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('অ্যাকাউন্ট তৈরি হয়েছে! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'নিবন্ধন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-inner">
          <div className="auth-logo">🌸</div>
          <h2>অলকানন্দা</h2>
          <p>আমাদের পরিবারে যোগ দিন</p>
          <div className="auth-decorations">
            <span>💎</span><span>🌺</span><span>✨</span><span>🎀</span>
          </div>
        </div>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form-box">
          <h1>নিবন্ধন করুন</h1>
          <p className="auth-subtitle">নতুন অ্যাকাউন্ট তৈরি করুন</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>পুরো নাম</label>
              <input placeholder="আপনার নাম" value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>ইমেইল</label>
              <input type="email" placeholder="your@email.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>মোবাইল নম্বর</label>
              <input placeholder="01XXXXXXXXX" value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label>পাসওয়ার্ড</label>
              <input type="password" placeholder="কমপক্ষে ৬ অক্ষর" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>পাসওয়ার্ড নিশ্চিত করুন</label>
              <input type="password" placeholder="আবার লিখুন" value={form.confirm}
                onChange={e => setForm({...form, confirm: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? '⏳ তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
            </button>
          </form>
          <p className="auth-switch">
            ইতিমধ্যে অ্যাকাউন্ট আছে? <Link to="/login">লগইন করুন</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
