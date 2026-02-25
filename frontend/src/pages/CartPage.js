import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

export default function CartPage() {
  const { cart, updateCart, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const imgBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'process.env.REACT_APP_API_URL';
  const shipping = cartTotal >= 1000 ? 0 : 80;
  const total = cartTotal + shipping;

  if (cart.length === 0) return (
    <div className="cart-empty">
      <div className="container">
        <div className="empty-cart-box">
          <div className="empty-cart-icon">🛒</div>
          <h2>আপনার কার্ট খালি</h2>
          <p>পছন্দের চুড়ি কার্টে যোগ করুন</p>
          <Link to="/products" className="btn btn-primary">চুড়ি দেখুন</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">🛒 আমার কার্ট</h1>
        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {cart.map((item, i) => {
              const p = item.product;
              const price = p?.discountPrice || p?.price || 0;
              return (
                <div key={i} className="cart-item">
                  <div className="ci-img">
                    {p?.images?.[0]
                      ? <img src={`${imgBase}${p.images[0]}`} alt={p?.name} />
                      : <div className="ci-placeholder">🌸</div>
                    }
                  </div>
                  <div className="ci-info">
                    <Link to={`/products/${p?._id}`} className="ci-name">{p?.name}</Link>
                    {item.size && <span className="ci-size">সাইজ: {item.size}</span>}
                    <span className="ci-price">৳{price}</span>
                  </div>
                  <div className="ci-qty">
                    <button onClick={() => updateCart(p?._id, item.quantity - 1, item.size)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateCart(p?._id, item.quantity + 1, item.size)}>+</button>
                  </div>
                  <div className="ci-total">৳{price * item.quantity}</div>
                  <button
                    className="ci-remove"
                    onClick={() => removeFromCart(p?._id, item.size)}
                  >✕</button>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2>অর্ডার সারসংক্ষেপ</h2>
            <div className="summary-row"><span>মোট পণ্য মূল্য</span><span>৳{cartTotal}</span></div>
            <div className="summary-row">
              <span>ডেলিভারি চার্জ</span>
              <span>{shipping === 0 ? <span style={{color:'var(--teal)'}}>ফ্রি!</span> : `৳${shipping}`}</span>
            </div>
            {cartTotal < 1000 && (
              <div className="free-delivery-hint">
                ৳{1000 - cartTotal} এর বেশি কিনলে ফ্রি ডেলিভারি! 🎉
              </div>
            )}
            <div className="summary-total">
              <span>সর্বমোট</span><span>৳{total}</span>
            </div>
            <button
              className="btn btn-primary checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              অর্ডার করুন →
            </button>
            <Link to="/products" className="continue-shopping">← কেনাকাটা চালিয়ে যান</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
