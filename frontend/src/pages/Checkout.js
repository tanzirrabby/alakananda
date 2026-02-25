import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

const paymentMethods = [
  { id: 'bkash', label: 'bKash', icon: '💚', color: '#E01E5A' },
  { id: 'nagad', label: 'Nagad', icon: '🧡', color: '#F5821F' },
  { id: 'card', label: 'কার্ড', icon: '💳', color: '#1a73e8' },
  { id: 'cod', label: 'ক্যাশ অন ডেলিভারি', icon: '💵', color: '#06D6A0' },
];

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [district, setDistrict] = useState('');
  const [addr, setAddr] = useState({ name: user?.name || '', phone: user?.phone || '', address: '', city: '', district: '' });

  const shippingCost = district.toLowerCase().includes('কুমিল্লা') || district.toLowerCase().includes('cumilla') ? 0 : (district ? 120 : 0);
  const finalTotal = cartTotal - couponDiscount + shippingCost;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await axios.post(`${API}/coupons/validate`, { code: couponCode, orderTotal: cartTotal });
      setCouponDiscount(res.data.discount);
      toast.success(`কুপন প্রয়োগ হয়েছে! ৳${res.data.discount} ছাড় পেয়েছেন 🎉`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'কুপন কোড সঠিক নয়');
      setCouponDiscount(0);
    } finally { setCouponLoading(false); }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!payment) { toast.error('পেমেন্ট পদ্ধতি বেছে নিন'); return; }
    if (!addr.district) { toast.error('জেলার নাম দিন'); return; }
    setLoading(true);
    try {
      const items = cart.items.map(i => ({
        product: i.product._id, name: i.product.name, price: i.product.price,
        quantity: i.quantity, image: i.product.images?.[0],
        selectedSize: i.selectedSize, selectedColor: i.selectedColor
      }));
      await axios.post(`${API}/orders`, {
        items, shippingAddress: addr, paymentMethod: payment,
        couponCode: couponDiscount > 0 ? couponCode : undefined,
        shippingCost, totalAmount: finalTotal
      });
      await clearCart();
      toast.success('অর্ডার সফল হয়েছে! 🎉');
      navigate('/my-orders');
    } catch { toast.error('অর্ডার ব্যর্থ হয়েছে'); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', background: '#FFF5F9', border: '2px solid #FFD9EC',
    borderRadius: 10, color: '#2D1B4E', padding: '11px 14px',
    fontFamily: 'Hind Siliguri', fontSize: 14, outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '36px 20px' }}>
      <div style={{ maxWidth: 950, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Aclonica, sans-serif', color: '#2D1B4E', fontSize: 28, marginBottom: 28 }}>চেকআউট 🛍️</h1>

        <form onSubmit={handleOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Shipping address */}
              <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #FFD9EC' }}>
                <h3 style={{ color: '#E84393', marginBottom: 20, fontFamily: 'Aclonica, sans-serif', fontSize: 18 }}>📍 ডেলিভারি ঠিকানা</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { key: 'name', label: 'পূর্ণ নাম', placeholder: 'আপনার নাম' },
                    { key: 'phone', label: 'ফোন নম্বর', placeholder: '01XXXXXXXXX' },
                    { key: 'city', label: 'শহর/উপজেলা', placeholder: 'শহর বা উপজেলা' },
                    { key: 'district', label: 'জেলা ⚠️', placeholder: 'জেলার নাম (শিপিং নির্ধারণ করে)' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: 'block', color: '#7C3AED', fontWeight: 600, marginBottom: 6, fontSize: 13 }}>{f.label}</label>
                      <input value={addr[f.key]} onChange={e => { setAddr({...addr, [f.key]: e.target.value}); if(f.key === 'district') setDistrict(e.target.value); }}
                        required placeholder={f.placeholder} style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#E84393'}
                        onBlur={e => e.target.style.borderColor = '#FFD9EC'} />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={{ display: 'block', color: '#7C3AED', fontWeight: 600, marginBottom: 6, fontSize: 13 }}>সম্পূর্ণ ঠিকানা</label>
                  <textarea value={addr.address} onChange={e => setAddr({...addr, address: e.target.value})}
                    required placeholder="বাড়ি নম্বর, রাস্তা, এলাকা..." rows={2}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = '#E84393'}
                    onBlur={e => e.target.style.borderColor = '#FFD9EC'} />
                </div>

                {/* Shipping cost indicator */}
                {district && (
                  <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: shippingCost === 0 ? '#E8FFF5' : '#FFF8E7', border: `1px solid ${shippingCost === 0 ? '#06D6A0' : '#FFD700'}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{shippingCost === 0 ? '🎉' : '🚚'}</span>
                    <p style={{ margin: 0, color: shippingCost === 0 ? '#06D6A0' : '#FF6B35', fontWeight: 700, fontSize: 14 }}>
                      {shippingCost === 0 ? 'কুমিল্লায় ফ্রি ডেলিভারি!' : `ডেলিভারি চার্জ: ৳${shippingCost}`}
                    </p>
                  </div>
                )}
              </div>

              {/* Coupon */}
              <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #FFD9EC' }}>
                <h3 style={{ color: '#E84393', marginBottom: 16, fontFamily: 'Aclonica, sans-serif', fontSize: 18 }}>🎟️ কুপন কোড</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="কুপন কোড লিখুন" style={{ ...inputStyle, flex: 1 }}
                    onFocus={e => e.target.style.borderColor = '#E84393'}
                    onBlur={e => e.target.style.borderColor = '#FFD9EC'} />
                  <button type="button" onClick={applyCoupon} disabled={couponLoading} style={{
                    background: 'linear-gradient(135deg, #E84393, #7C3AED)', color: '#fff',
                    border: 'none', borderRadius: 10, padding: '0 20px', cursor: couponLoading ? 'not-allowed' : 'pointer',
                    fontFamily: 'Hind Siliguri', fontWeight: 700, whiteSpace: 'nowrap'
                  }}>{couponLoading ? '...' : 'প্রয়োগ করুন'}</button>
                </div>
                {couponDiscount > 0 && (
                  <p style={{ color: '#06D6A0', fontWeight: 700, marginTop: 8, margin: '8px 0 0' }}>✓ ৳{couponDiscount} ছাড় পেয়েছেন!</p>
                )}
              </div>

              {/* Payment */}
              <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #FFD9EC' }}>
                <h3 style={{ color: '#E84393', marginBottom: 16, fontFamily: 'Aclonica, sans-serif', fontSize: 18 }}>💳 পেমেন্ট পদ্ধতি</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {paymentMethods.map(m => (
                    <button key={m.id} type="button" onClick={() => setPayment(m.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: payment === m.id ? `${m.color}15` : '#FFF5F9',
                      border: `2px solid ${payment === m.id ? m.color : '#FFD9EC'}`,
                      borderRadius: 12, padding: '12px 16px', cursor: 'pointer',
                      color: '#2D1B4E', fontFamily: 'Hind Siliguri', fontSize: 14, fontWeight: 600,
                      transition: 'all 0.2s'
                    }}>
                      <span style={{ fontSize: 22 }}>{m.icon}</span> {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div style={{ alignSelf: 'start', background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #FFD9EC' }}>
              <h3 style={{ fontFamily: 'Aclonica, sans-serif', color: '#2D1B4E', marginBottom: 18, fontSize: 18 }}>অর্ডার সারসংক্ষেপ</h3>
              {cart.items?.map(item => item.product && (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #FFF0F7' }}>
                  <div>
                    <p style={{ margin: 0, color: '#2D1B4E', fontSize: 13, fontWeight: 600 }}>{item.product.name}</p>
                    <p style={{ margin: 0, color: '#8B5E8E', fontSize: 12 }}>× {item.quantity} {item.selectedSize && `| ${item.selectedSize}`}</p>
                  </div>
                  <span style={{ color: '#E84393', fontWeight: 700 }}>৳{item.product.price * item.quantity}</span>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#8B5E8E', fontSize: 14 }}>পণ্যের মূল্য:</span>
                <span style={{ color: '#2D1B4E' }}>৳{cartTotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#06D6A0', fontSize: 14 }}>কুপন ছাড়:</span>
                  <span style={{ color: '#06D6A0', fontWeight: 700 }}>-৳{couponDiscount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ color: '#8B5E8E', fontSize: 14 }}>ডেলিভারি:</span>
                <span style={{ color: shippingCost === 0 ? '#06D6A0' : '#FF6B35', fontWeight: 600 }}>
                  {district ? (shippingCost === 0 ? 'ফ্রি!' : `৳${shippingCost}`) : 'জেলা দিন'}
                </span>
              </div>
              <div style={{ borderTop: '2px solid #FFD9EC', paddingTop: 14, display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontWeight: 800, color: '#2D1B4E', fontSize: 16 }}>মোট:</span>
                <span style={{ color: '#E84393', fontWeight: 800, fontSize: 22 }}>৳{finalTotal}</span>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', background: loading ? '#ccc' : 'linear-gradient(135deg, #E84393, #7C3AED)',
                color: '#fff', border: 'none', borderRadius: 14, padding: '15px',
                fontFamily: 'Hind Siliguri', fontSize: 16, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(232,67,147,0.4)'
              }}>{loading ? 'প্রক্রিয়া চলছে...' : '✓ অর্ডার নিশ্চিত করুন'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
