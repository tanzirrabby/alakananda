import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const PAYMENT_METHODS = [
  { key: 'bkash', label: 'bKash', icon: '📱', color: '#E2136E', desc: 'মোবাইল ব্যাংকিং' },
  { key: 'nagad', label: 'Nagad', icon: '💸', color: '#F26522', desc: 'মোবাইল ব্যাংকিং' },
  { key: 'card', label: 'ডেবিট/ক্রেডিট কার্ড', icon: '💳', color: '#2563eb', desc: 'Visa / Mastercard' },
  { key: 'cod', label: 'Cash on Delivery', icon: '🏠', color: '#059669', desc: 'ডেলিভারির সময় পেমেন্ট' }
];

const DISTRICTS = ['ঢাকা','চট্টগ্রাম','রাজশাহী','খুলনা','বরিশাল','সিলেট','ময়মনসিংহ','রংপুর'];

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    district: user?.address?.district || 'ঢাকা',
    postalCode: user?.address?.postalCode || '',
    notes: ''
  });

  const shipping = cartTotal >= 1000 ? 0 : 80;
  const total = cartTotal + shipping;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.street || !form.city) {
      toast.error('সব তথ্য পূরণ করুন');
      return;
    }
    setLoading(true);
    try {
      const { data: order } = await API.post('/orders', {
        shippingAddress: {
          name: form.name, phone: form.phone,
          street: form.street, city: form.city,
          district: form.district, postalCode: form.postalCode
        },
        paymentMethod,
        notes: form.notes
      });

      // For online payments, redirect to payment gateway
      if (paymentMethod !== 'cod') {
        const { data: payData } = await API.post('/payment/sslcommerz/init', {
          orderId: order._id,
          amount: total,
          name: form.name,
          email: user.email,
          phone: form.phone,
          address: `${form.street}, ${form.city}, ${form.district}`
        });
        if (payData.url) {
          window.location.href = payData.url;
          return;
        }
      }

      toast.success('অর্ডার সফলভাবে দেওয়া হয়েছে! 🎉');
      navigate(`/order-success/${order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'অর্ডার দিতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">অর্ডার করুন</h1>
        <form onSubmit={handleSubmit}>
          <div className="checkout-grid">
            {/* Left */}
            <div className="checkout-left">
              {/* Shipping */}
              <div className="checkout-section">
                <h2>🚚 ডেলিভারি তথ্য</h2>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>পুরো নাম *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="আপনার নাম" required />
                  </div>
                  <div className="form-group">
                    <label>মোবাইল নম্বর *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="01XXXXXXXXX" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>ঠিকানা *</label>
                  <input name="street" value={form.street} onChange={handleChange} placeholder="বাড়ি নম্বর, রাস্তা, এলাকা" required />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>শহর/উপজেলা *</label>
                    <input name="city" value={form.city} onChange={handleChange} placeholder="শহর/উপজেলা" required />
                  </div>
                  <div className="form-group">
                    <label>জেলা</label>
                    <select name="district" value={form.district} onChange={handleChange}>
                      {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>নোট (ঐচ্ছিক)</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="বিশেষ কোনো নির্দেশনা থাকলে লিখুন..." rows={3} />
                </div>
              </div>

              {/* Payment */}
              <div className="checkout-section">
                <h2>💳 পেমেন্ট পদ্ধতি</h2>
                <div className="payment-methods">
                  {PAYMENT_METHODS.map(pm => (
                    <label
                      key={pm.key}
                      className={`payment-option ${paymentMethod === pm.key ? 'active' : ''}`}
                      style={{ '--pm-color': pm.color }}
                    >
                      <input
                        type="radio" name="payment"
                        value={pm.key} checked={paymentMethod === pm.key}
                        onChange={() => setPaymentMethod(pm.key)}
                      />
                      <div className="pm-icon">{pm.icon}</div>
                      <div className="pm-info">
                        <strong>{pm.label}</strong>
                        <small>{pm.desc}</small>
                      </div>
                      {paymentMethod === pm.key && <span className="pm-check">✓</span>}
                    </label>
                  ))}
                </div>
                {paymentMethod !== 'cod' && (
                  <p className="payment-note">
                    💡 পেমেন্ট গেটওয়েতে redirect হবেন। SSLCommerz নিরাপদ গেটওয়েতে পেমেন্ট করুন।
                  </p>
                )}
              </div>
            </div>

            {/* Right - Order Summary */}
            <div className="checkout-right">
              <div className="order-summary">
                <h2>অর্ডার সারসংক্ষেপ</h2>
                <div className="order-items">
                  {cart.map((item, i) => {
                    const p = item.product;
                    const price = p?.discountPrice || p?.price || 0;
                    return (
                      <div key={i} className="oi-row">
                        <div className="oi-name">
                          <span>{p?.name}</span>
                          {item.size && <small>সাইজ: {item.size}</small>}
                          <small>× {item.quantity}</small>
                        </div>
                        <span className="oi-price">৳{price * item.quantity}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="os-row"><span>পণ্যের মূল্য</span><span>৳{cartTotal}</span></div>
                <div className="os-row">
                  <span>ডেলিভারি</span>
                  <span>{shipping === 0 ? '✅ ফ্রি!' : `৳${shipping}`}</span>
                </div>
                <div className="os-total"><span>সর্বমোট</span><span>৳{total}</span></div>

                <button type="submit" className="btn btn-primary place-order-btn" disabled={loading}>
                  {loading ? '⏳ অর্ডার হচ্ছে...' : '🛍️ অর্ডার নিশ্চিত করুন'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
