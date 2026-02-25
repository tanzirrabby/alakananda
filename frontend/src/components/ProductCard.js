import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'process.env.REACT_APP_API_URL/api';
const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'process.env.REACT_APP_API_URL';

const categoryColors = { 'set-combo': '#E84393', 'metal-dhatu': '#FF9F43', 'shuta-kapor': '#7C3AED' };
const categoryLabels = { 'set-combo': 'সেট/কম্বো', 'metal-dhatu': 'মেটাল/ধাতু', 'shuta-kapor': 'সুতা/কাপড়' };

function StarRating({ rating, small }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? '#FFD700' : '#E0E0E0', fontSize: small ? 12 : 14 }}>★</span>
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      await addToCart(product._id);
      toast.success('কার্টে যোগ হয়েছে! 🛍️');
    } catch { toast.error('সমস্যা হয়েছে'); }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      const res = await axios.post(`${API}/wishlist/toggle/${product._id}`);
      setWishlisted(res.data.wishlisted);
      toast.success(res.data.wishlisted ? 'পছন্দে যোগ হয়েছে ❤️' : 'পছন্দ থেকে সরানো হয়েছে');
    } catch { toast.error('সমস্যা হয়েছে'); }
  };

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const catColor = categoryColors[product.category] || '#E84393';
  const imgSrc = !imgError && product.images?.[0] ? `${API_URL}${product.images[0]}` : null;

  return (
    <div style={{
      background: '#fff', borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #FFD9EC',
      transition: 'transform 0.3s, box-shadow 0.3s'
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(232,67,147,0.2)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; }}>

      {/* Image area */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {imgSrc ? (
          <img src={imgSrc} alt={product.name} onError={() => setImgError(true)} style={{ width: '100%', height: 220, objectFit: 'cover', transition: 'transform 0.4s' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
        ) : (
          <div style={{ width: '100%', height: 220, background: `linear-gradient(135deg, ${catColor}22, ${catColor}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>
            {product.category === 'set-combo' ? '💝' : product.category === 'metal-dhatu' ? '✨' : '🎀'}
          </div>
        )}

        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <span style={{ background: catColor, color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>
            {categoryLabels[product.category]}
          </span>
        </div>
        {discount > 0 && (
          <div style={{ position: 'absolute', top: 10, right: 45 }}>
            <span style={{ background: '#FF6B35', color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
              {discount}% ছাড়
            </span>
          </div>
        )}
        {product.stock === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ background: '#fff', color: '#E84393', borderRadius: 20, padding: '6px 18px', fontWeight: 700, fontSize: 15 }}>স্টক শেষ</span>
          </div>
        )}

        {/* Wishlist btn */}
        <button onClick={handleWishlist} style={{
          position: 'absolute', top: 8, right: 8,
          background: wishlisted ? '#E84393' : 'rgba(255,255,255,0.9)',
          border: 'none', borderRadius: '50%', width: 34, height: 34,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 0.2s'
        }}>
          <Heart size={16} color={wishlisted ? '#fff' : '#E84393'} fill={wishlisted ? '#fff' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px 16px' }}>
        <h3 style={{ color: '#2D1B4E', fontSize: 15, fontWeight: 700, margin: '0 0 4px', lineHeight: 1.3 }}>{product.name}</h3>

        {product.avgRating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <StarRating rating={product.avgRating} small />
            <span style={{ color: '#8B5E8E', fontSize: 12 }}>({product.totalReviews})</span>
          </div>
        )}

        <p style={{ color: '#8B5E8E', fontSize: 13, margin: '0 0 10px', lineHeight: 1.5 }}>
          {product.description?.substring(0, 55)}...
        </p>

        {/* Sizes preview */}
        {product.sizes?.length > 0 && (
          <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
            {product.sizes.map(s => (
              <span key={s} style={{ background: '#FFF0F7', border: '1px solid #FFD9EC', color: '#E84393', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>{s}</span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ color: '#E84393', fontWeight: 800, fontSize: 20 }}>৳{product.price}</span>
          {product.originalPrice && <span style={{ color: '#ccc', fontSize: 13, textDecoration: 'line-through' }}>৳{product.originalPrice}</span>}
          {product.stock > 0 && product.stock <= 5 && (
            <span style={{ color: '#FF6B35', fontSize: 11, fontWeight: 600 }}>মাত্র {product.stock}টি!</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/products/${product._id}`} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            border: '2px solid #E84393', color: '#E84393', textDecoration: 'none',
            borderRadius: 10, padding: '8px 0', fontSize: 13, fontWeight: 600, transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FFF0F7'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}>
            <Eye size={14} /> বিস্তারিত
          </Link>
          <button onClick={handleAddToCart} disabled={product.stock === 0} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            background: product.stock === 0 ? '#eee' : 'linear-gradient(135deg, #E84393, #7C3AED)',
            color: product.stock === 0 ? '#999' : '#fff',
            border: 'none', borderRadius: 10, padding: '8px 0',
            cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
            fontSize: 13, fontWeight: 600
          }}>
            <ShoppingCart size={14} /> কার্টে যোগ
          </button>
        </div>
      </div>
    </div>
  );
}
