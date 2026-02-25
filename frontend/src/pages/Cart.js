import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function Cart() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    toast.success('সরানো হয়েছে');
  };

  if (!cart.items?.length) return (
    <div style={{ background: '#0d0014', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ fontSize: 80, marginBottom: 20 }}>🛒</div>
      <h2 style={{ fontFamily: 'Hind Siliguri', color: '#fff', marginBottom: 12 }}>আপনার কার্ট খালি</h2>
      <p style={{ fontFamily: 'Hind Siliguri', color: '#886699', marginBottom: 24 }}>কিছু পণ্য যোগ করুন!</p>
      <Link to="/products" style={{
        background: 'linear-gradient(135deg, #e91e8c, #ff6b35)', color: '#fff',
        textDecoration: 'none', padding: '12px 28px', borderRadius: 25, fontFamily: 'Hind Siliguri'
      }}>পণ্য দেখুন</Link>
    </div>
  );

  return (
    <div style={{ background: '#0d0014', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Hind Siliguri', color: '#fff', fontSize: 28, marginBottom: 30, display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShoppingBag style={{ color: '#e91e8c' }} /> আমার কার্ট ({cart.items.length}টি পণ্য)
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cart.items.map(item => {
              const p = item.product;
              if (!p) return null;
              const imgSrc = p.images?.[0] ? `${API_URL}${p.images[0]}` : `https://via.placeholder.com/80x80/2d0036/e91e8c?text=চুড়ি`;
              return (
                <div key={item._id} style={{
                  background: 'linear-gradient(145deg, #1a0020, #2d0036)',
                  border: '1px solid rgba(233,30,140,0.2)', borderRadius: 16, padding: 20,
                  display: 'flex', gap: 16, alignItems: 'center'
                }}>
                  <img src={imgSrc} alt={p.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10 }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: 'Hind Siliguri', color: '#fff', margin: '0 0 4px', fontSize: 16 }}>{p.name}</h3>
                    {item.selectedSize && <p style={{ color: '#886699', fontSize: 13, fontFamily: 'Hind Siliguri', margin: '0 0 4px' }}>সাইজ: {item.selectedSize}</p>}
                    {item.selectedColor && <p style={{ color: '#886699', fontSize: 13, fontFamily: 'Hind Siliguri', margin: 0 }}>রং: {item.selectedColor}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => updateQuantity(p._id, item.quantity - 1)} style={{
                      background: 'rgba(233,30,140,0.2)', border: '1px solid #e91e8c', color: '#fff',
                      width: 28, height: 28, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}><Minus size={12} /></button>
                    <span style={{ color: '#fff', fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(p._id, item.quantity + 1)} style={{
                      background: 'rgba(233,30,140,0.2)', border: '1px solid #e91e8c', color: '#fff',
                      width: 28, height: 28, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}><Plus size={12} /></button>
                  </div>
                  <div style={{ minWidth: 70, textAlign: 'right' }}>
                    <p style={{ color: '#e91e8c', fontWeight: 700, fontSize: 16, margin: 0 }}>৳{p.price * item.quantity}</p>
                    <p style={{ color: '#555', fontSize: 12, margin: 0 }}>৳{p.price} × {item.quantity}</p>
                  </div>
                  <button onClick={() => handleRemove(p._id)} style={{
                    background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
                    color: '#ff6b6b', width: 34, height: 34, borderRadius: 8, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}><Trash2 size={14} /></button>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div style={{
            background: 'linear-gradient(145deg, #1a0020, #2d0036)',
            border: '1px solid rgba(233,30,140,0.3)', borderRadius: 16, padding: 24, alignSelf: 'start'
          }}>
            <h3 style={{ fontFamily: 'Hind Siliguri', color: '#fff', marginBottom: 20, fontSize: 18 }}>অর্ডার সারসংক্ষেপ</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: 'Hind Siliguri', color: '#886699' }}>মোট পণ্য:</span>
              <span style={{ color: '#fff' }}>৳{cartTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontFamily: 'Hind Siliguri', color: '#886699' }}>ডেলিভারি:</span>
              <span style={{ color: '#26de81' }}>আলোচনা সাপেক্ষে</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(233,30,140,0.2)', paddingTop: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Hind Siliguri', color: '#fff', fontWeight: 700 }}>মোট:</span>
                <span style={{ color: '#e91e8c', fontWeight: 700, fontSize: 20 }}>৳{cartTotal}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} style={{
              width: '100%', background: 'linear-gradient(135deg, #e91e8c, #ff6b35)',
              color: '#fff', border: 'none', borderRadius: 12, padding: '14px',
              fontFamily: 'Hind Siliguri', fontSize: 16, fontWeight: 600, cursor: 'pointer'
            }}>অর্ডার করুন →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
