import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'process.env.REACT_APP_API_URL/api';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API}/auth/profile`, form);
      toast.success('প্রোফাইল আপডেট হয়েছে!');
    } catch { toast.error('সমস্যা হয়েছে'); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,30,140,0.3)',
    borderRadius: 10, color: '#fff', padding: '11px 14px', fontFamily: 'Hind Siliguri', fontSize: 15,
    outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{ background: '#0d0014', minHeight: '100vh', padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ background: 'linear-gradient(145deg, #1a0020, #2d0036)', border: '1px solid rgba(233,30,140,0.3)', borderRadius: 24, padding: 36 }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{
              width: 80, height: 80, background: 'linear-gradient(135deg, #e91e8c, #ff6b35)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px'
            }}><User size={36} color="#fff" /></div>
            <h2 style={{ fontFamily: 'Hind Siliguri', color: '#fff', margin: '0 0 4px' }}>{user?.name}</h2>
            <p style={{ fontFamily: 'Hind Siliguri', color: '#886699', margin: 0, fontSize: 14 }}>{user?.email}</p>
          </div>
          <form onSubmit={handleSave}>
            {[
              { key: 'name', label: 'নাম', type: 'text' },
              { key: 'phone', label: 'ফোন নম্বর', type: 'tel' },
              { key: 'address', label: 'ঠিকানা', type: 'text' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 18 }}>
                <label style={{ fontFamily: 'Hind Siliguri', color: '#cc88aa', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#e91e8c'}
                  onBlur={e => e.target.style.borderColor = 'rgba(233,30,140,0.3)'} />
              </div>
            ))}
            <button type="submit" disabled={loading} style={{
              width: '100%', background: loading ? '#333' : 'linear-gradient(135deg, #e91e8c, #ff6b35)',
              color: '#fff', border: 'none', borderRadius: 12, padding: '13px',
              fontFamily: 'Hind Siliguri', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8
            }}>{loading ? 'আপডেট হচ্ছে...' : 'প্রোফাইল সেভ করুন'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
