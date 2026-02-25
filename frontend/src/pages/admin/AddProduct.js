import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'process.env.REACT_APP_API_URL/api';

export default function AddProduct() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', price: '', originalPrice: '', category: 'set-combo',
    stock: '', material: '', sizes: '', colors: '', isFeatured: false, isAvailable: true
  });

  useEffect(() => {
    if (editId) {
      axios.get(`${API}/products/${editId}`).then(r => {
        const p = r.data;
        setForm({
          name: p.name, description: p.description, price: p.price, originalPrice: p.originalPrice || '',
          category: p.category, stock: p.stock, material: p.material || '',
          sizes: p.sizes?.join(', ') || '', colors: p.colors?.join(', ') || '',
          isFeatured: p.isFeatured, isAvailable: p.isAvailable
        });
      });
    }
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sizesArray = (form.sizes || '').split(',').map(s => s.trim()).filter(Boolean);
      const colorsArray = (form.colors || '').split(',').map(c => c.trim()).filter(Boolean);

      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('originalPrice', form.originalPrice);
      fd.append('category', form.category);
      fd.append('stock', form.stock);
      fd.append('material', form.material);
      fd.append('isFeatured', form.isFeatured);
      fd.append('isAvailable', form.isAvailable);
      sizesArray.forEach(s => fd.append('sizes', s));
      colorsArray.forEach(c => fd.append('colors', c));
      images.forEach(img => fd.append('images', img));

      if (editId) {
        await axios.put(`${API}/products/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('পণ্য আপডেট হয়েছে!');
      } else {
        await axios.post(`${API}/products`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('নতুন পণ্য যোগ হয়েছে! 🎉');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error('সমস্যা হয়েছে: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const toggleSize = (s) => {
    const current = (form.sizes || '').split(',').map(x => x.trim()).filter(Boolean);
    const idx = current.indexOf(s);
    if (idx > -1) current.splice(idx, 1);
    else current.push(s);
    setForm({ ...form, sizes: current.join(', ') });
  };

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,30,140,0.3)',
    borderRadius: 10, color: '#fff', padding: '11px 14px', fontFamily: 'Hind Siliguri', fontSize: 14,
    outline: 'none', boxSizing: 'border-box'
  };
  const labelStyle = { fontFamily: 'Hind Siliguri', color: '#cc88aa', display: 'block', marginBottom: 6, fontSize: 14 };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0014', fontFamily: 'Hind Siliguri' }}>
      {/* Sidebar */}
      <div style={{ width: 200, background: 'linear-gradient(180deg, #1a0020, #0d0014)', borderRight: '1px solid rgba(233,30,140,0.2)', padding: '24px 12px' }}>
        <p style={{ margin: '0 0 20px 8px', fontFamily: 'Hind Siliguri', background: 'linear-gradient(135deg, #e91e8c, #ff9f43)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>অলকানন্দা</p>
        {['/admin', '/admin/products', '/admin/orders', '/admin/customers'].map((to, i) => (
          <Link key={to} to={to} style={{ display: 'block', padding: '10px 12px', color: '#cc88aa', textDecoration: 'none', borderRadius: 8, marginBottom: 4, fontSize: 14 }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(233,30,140,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            {['📊 ড্যাশবোর্ড', '💍 পণ্য', '📦 অর্ডার', '👥 কাস্টমার'][i]}
          </Link>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '32px 28px', overflowY: 'auto' }}>
        <h1 style={{ color: '#fff', marginBottom: 28, fontSize: 24 }}>
          {editId ? '✏️ পণ্য সম্পাদনা' : '➕ নতুন পণ্য যোগ'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

            {/* Left */}
            <div style={{ background: 'linear-gradient(145deg, #1a0020, #2d0036)', border: '1px solid rgba(233,30,140,0.2)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ color: '#e91e8c', marginBottom: 20 }}>মূল তথ্য</h3>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>পণ্যের নাম *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
                  style={inputStyle} placeholder="পণ্যের নাম লিখুন"
                  onFocus={e => e.target.style.borderColor = '#e91e8c'}
                  onBlur={e => e.target.style.borderColor = 'rgba(233,30,140,0.3)'} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>বিবরণ *</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }} placeholder="পণ্যের বিস্তারিত বিবরণ"
                  onFocus={e => e.target.style.borderColor = '#e91e8c'}
                  onBlur={e => e.target.style.borderColor = 'rgba(233,30,140,0.3)'} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>বিভাগ *</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="set-combo">সেট/কম্বো</option>
                  <option value="metal-dhatu">মেটাল/ধাতু</option>
                  <option value="shuta-kapor">সুতা/কাপড়</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>দাম (৳) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required
                    style={inputStyle} placeholder="350"
                    onFocus={e => e.target.style.borderColor = '#e91e8c'}
                    onBlur={e => e.target.style.borderColor = 'rgba(233,30,140,0.3)'} />
                </div>
                <div>
                  <label style={labelStyle}>আগের দাম (৳)</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})}
                    style={inputStyle} placeholder="500 (ঐচ্ছিক)"
                    onFocus={e => e.target.style.borderColor = '#e91e8c'}
                    onBlur={e => e.target.style.borderColor = 'rgba(233,30,140,0.3)'} />
                </div>
              </div>
            </div>

            {/* Right */}
            <div style={{ background: 'linear-gradient(145deg, #1a0020, #2d0036)', border: '1px solid rgba(233,30,140,0.2)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ color: '#e91e8c', marginBottom: 20 }}>অতিরিক্ত তথ্য</h3>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>স্টক পরিমাণ</label>
                <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})}
                  style={inputStyle} placeholder="0"
                  onFocus={e => e.target.style.borderColor = '#e91e8c'}
                  onBlur={e => e.target.style.borderColor = 'rgba(233,30,140,0.3)'} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>উপকরণ</label>
                <input value={form.material} onChange={e => setForm({...form, material: e.target.value})}
                  style={inputStyle} placeholder="কাঁচ, ধাতু, সুতা..."
                  onFocus={e => e.target.style.borderColor = '#e91e8c'}
                  onBlur={e => e.target.style.borderColor = 'rgba(233,30,140,0.3)'} />
              </div>

              {/* Size selector */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>সাইজ বেছে নিন</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {['2.2"', '2.4"', '2.6"', '2.8"'].map(s => {
                    const selected = (form.sizes || '').split(',').map(x => x.trim()).filter(Boolean).includes(s);
                    return (
                      <button key={s} type="button" onClick={() => toggleSize(s)} style={{
                        padding: '10px 18px', borderRadius: 12, cursor: 'pointer',
                        fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
                        background: selected ? 'linear-gradient(135deg, #e91e8c, #ff6b35)' : 'rgba(255,255,255,0.05)',
                        color: selected ? '#fff' : '#cc88aa',
                        border: `2px solid ${selected ? 'transparent' : 'rgba(233,30,140,0.3)'}`,
                        boxShadow: selected ? '0 4px 12px rgba(233,30,140,0.4)' : 'none',
                        transform: selected ? 'scale(1.05)' : 'scale(1)'
                      }}>{s}</button>
                    );
                  })}
                </div>
                <p style={{ color: '#886699', fontSize: 12, marginTop: 6 }}>
                  ✓ Selected: {form.sizes || 'কোনোটা select হয়নি'}
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>রং (কমা দিয়ে আলাদা করুন)</label>
                <input value={form.colors} onChange={e => setForm({...form, colors: e.target.value})}
                  style={inputStyle} placeholder="লাল, নীল, সবুজ"
                  onFocus={e => e.target.style.borderColor = '#e91e8c'}
                  onBlur={e => e.target.style.borderColor = 'rgba(233,30,140,0.3)'} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>ছবি আপলোড (সর্বোচ্চ ৫টি)</label>
                <input type="file" multiple accept="image/*" onChange={e => setImages([...e.target.files])}
                  style={{ ...inputStyle, cursor: 'pointer' }} />
                {images.length > 0 && (
                  <p style={{ color: '#06D6A0', fontSize: 12, marginTop: 6 }}>
                    ✓ {images.length}টি ছবি selected
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#cc88aa' }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})}
                    style={{ accentColor: '#e91e8c' }} />
                  বিশেষ পণ্য হিসেবে দেখান
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#cc88aa' }}>
                  <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({...form, isAvailable: e.target.checked})}
                    style={{ accentColor: '#e91e8c' }} />
                  পণ্য সক্রিয়
                </label>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', gap: 14, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => navigate('/admin/products')} style={{
              padding: '12px 28px', background: 'none', border: '1px solid rgba(233,30,140,0.3)',
              color: '#cc88aa', borderRadius: 10, cursor: 'pointer', fontFamily: 'Hind Siliguri', fontSize: 15
            }}>বাতিল</button>
            <button type="submit" disabled={loading} style={{
              padding: '12px 32px', background: loading ? '#333' : 'linear-gradient(135deg, #e91e8c, #ff6b35)',
              color: '#fff', border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Hind Siliguri', fontSize: 15, fontWeight: 600,
              boxShadow: loading ? 'none' : '0 4px 15px rgba(233,30,140,0.4)'
            }}>{loading ? 'সেভ হচ্ছে...' : (editId ? '✓ আপডেট করুন' : '✓ পণ্য যোগ করুন')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}