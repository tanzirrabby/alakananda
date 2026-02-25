import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ShoppingCart, ArrowLeft, Heart } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'process.env.REACT_APP_API_URL';
const WHATSAPP = '8801843646125';
const SIZES = ['2.2"', '2.4"', '2.6"', '2.8"'];
const categoryLabels = { 'set-combo': 'সেট/কম্বো', 'metal-dhatu': 'মেটাল/ধাতু', 'shuta-kapor': 'সুতা/কাপড়' };

function StarRating({ rating, onRate, interactive, small }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s}
          style={{ color: s <= (hover || Math.round(rating)) ? '#FFD700' : '#E0E0E0', fontSize: small ? 13 : 22, cursor: interactive ? 'pointer' : 'default' }}
          onClick={() => interactive && onRate && onRate(s)}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}>★</span>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // ✅ এখানে সঠিক জায়গায়
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`${API}/products/${id}`).then(r => setProduct(r.data)).catch(() => navigate('/products'));
  }, [id]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    if (product.sizes?.length > 0 && !selectedSize) { toast.error('সাইজ বেছে নিন'); return; }
    try {
      await addToCart(product._id, qty, selectedSize, selectedColor);
      toast.success('কার্টে যোগ হয়েছে! 🎉');
    } catch { toast.error('সমস্যা হয়েছে'); }
  };

  const handleWishlist = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const res = await axios.post(`${API}/wishlist/toggle/${id}`);
      setWishlisted(res.data.wishlisted);
      toast.success(res.data.wishlisted ? 'পছন্দে যোগ হয়েছে ❤️' : 'সরানো হয়েছে');
    } catch { toast.error('সমস্যা হয়েছে'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSubmittingReview(true);
    try {
      await axios.post(`${API}/reviews/${id}`, review);
      toast.success('রিভিউ দেওয়া হয়েছে! 🌟');
      const r = await axios.get(`${API}/products/${id}`);
      setProduct(r.data);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'সমস্যা হয়েছে');
    } finally { setSubmittingReview(false); }
  };

  const whatsappMsg = product
    ? `আমি এই পণ্যটি অর্ডার করতে চাই: ${product.name} (৳${product.price}) - Size: ${selectedSize || 'উল্লেখ নেই'}`
    : '';

  if (!product) return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>💍</div>
        <p style={{ color: '#8B5E8E', fontFamily: 'Hind Siliguri' }}>লোড হচ্ছে...</p>
      </div>
    </div>
  );

  const images = product.images?.filter(Boolean).map(img => `${API_URL}${img}`) || [];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '30px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{
          background: 'none', border: 'none', color: '#E84393', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Hind Siliguri', fontSize: 15, marginBottom: 24
        }}>
          <ArrowLeft size={18} /> ফিরে যান
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>

          {/* ✅ Images with Zoom */}
          <div>
            <div
              style={{ borderRadius: 20, overflow: 'hidden', border: '2px solid #FFD9EC', marginBottom: 12, position: 'relative', cursor: zoom ? 'crosshair' : 'zoom-in' }}
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <div style={{ width: '100%', height: 420, overflow: 'hidden' }}>
                {images.length > 0 ? (
                  <img
                    src={images[selectedImg]}
                    alt={product.name}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: zoom ? 'scale(2.5)' : 'scale(1)',
                      transition: zoom ? 'transform 0.1s ease' : 'transform 0.3s ease'
                    }}
                  />
                ) : (
                  <div style={{ width: '100%', height: 420, background: 'linear-gradient(135deg, #FFD9EC, #E6D5FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>
                    {product.category === 'set-combo' ? '💝' : product.category === 'metal-dhatu' ? '✨' : '🎀'}
                  </div>
                )}
              </div>

              {!zoom && images.length > 0 && (
                <div style={{
                  position: 'absolute', bottom: 12, right: 12,
                  background: 'rgba(0,0,0,0.55)', color: '#fff',
                  borderRadius: 20, padding: '5px 12px', fontSize: 12, pointerEvents: 'none'
                }}>
                  🔍 hover করে zoom করুন
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <div key={i} onClick={() => setSelectedImg(i)} style={{
                    width: 72, height: 72, borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                    border: `3px solid ${selectedImg === i ? '#E84393' : '#FFD9EC'}`,
                    boxShadow: selectedImg === i ? '0 4px 12px rgba(232,67,147,0.4)' : 'none',
                    transform: selectedImg === i ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s'
                  }}>
                    <img src={img} alt={`ছবি ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #E84393, #7C3AED)', color: '#fff', borderRadius: 20, padding: '4px 14px', marginBottom: 12, fontSize: 13 }}>
              {categoryLabels[product.category]}
            </div>

            <h1 style={{ fontFamily: 'Aclonica, sans-serif', color: '#2D1B4E', fontSize: 26, margin: '0 0 10px', lineHeight: 1.3 }}>{product.name}</h1>

            {product.avgRating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <StarRating rating={product.avgRating} />
                <span style={{ color: '#FFD700', fontWeight: 700 }}>{product.avgRating}</span>
                <span style={{ color: '#8B5E8E', fontSize: 14 }}>({product.totalReviews}টি রিভিউ)</span>
              </div>
            )}

            <p style={{ color: '#8B5E8E', lineHeight: 1.8, marginBottom: 20, fontSize: 15 }}>{product.description}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: '#E84393' }}>৳{product.price}</span>
              {product.originalPrice && <span style={{ fontSize: 18, color: '#ccc', textDecoration: 'line-through' }}>৳{product.originalPrice}</span>}
              <span style={{
                background: product.stock > 0 ? '#E8FFF5' : '#FFF0F0',
                color: product.stock > 0 ? '#06D6A0' : '#E84393',
                border: `1px solid ${product.stock > 0 ? '#06D6A0' : '#E84393'}`,
                borderRadius: 20, padding: '3px 12px', fontSize: 13, fontWeight: 600
              }}>
                {product.stock > 0 ? `✓ স্টক আছে (${product.stock})` : '✗ স্টক নেই'}
              </span>
            </div>

            {/* Size selector */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontWeight: 700, color: '#2D1B4E', marginBottom: 10, fontSize: 15 }}>
                সাইজ বেছে নিন: {selectedSize && <span style={{ color: '#E84393' }}>{selectedSize}</span>}
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {(product.sizes?.length > 0 ? product.sizes : SIZES).map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} style={{
                    padding: '10px 18px', borderRadius: 12, cursor: 'pointer',
                    fontFamily: 'Hind Siliguri', fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
                    background: selectedSize === s ? 'linear-gradient(135deg, #E84393, #7C3AED)' : '#fff',
                    color: selectedSize === s ? '#fff' : '#2D1B4E',
                    border: `2px solid ${selectedSize === s ? 'transparent' : '#FFD9EC'}`,
                    boxShadow: selectedSize === s ? '0 4px 12px rgba(232,67,147,0.4)' : 'none',
                    transform: selectedSize === s ? 'scale(1.05)' : 'scale(1)'
                  }}>{s}</button>
                ))}
              </div>
            </div>

            {/* Color selector */}
            {product.colors?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontWeight: 700, color: '#2D1B4E', marginBottom: 10 }}>
                  রং: {selectedColor && <span style={{ color: '#E84393' }}>{selectedColor}</span>}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.colors.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)} style={{
                      padding: '8px 16px', borderRadius: 10, cursor: 'pointer',
                      background: selectedColor === c ? 'linear-gradient(135deg, #E84393, #7C3AED)' : '#fff',
                      color: selectedColor === c ? '#fff' : '#2D1B4E',
                      border: `2px solid ${selectedColor === c ? 'transparent' : '#FFD9EC'}`,
                      fontFamily: 'Hind Siliguri', fontSize: 14
                    }}>{c}</button>
                  ))}
                </div>
              </div>
            )}

            {product.material && (
              <p style={{ color: '#8B5E8E', marginBottom: 18, fontSize: 14 }}>
                উপকরণ: <strong style={{ color: '#2D1B4E' }}>{product.material}</strong>
              </p>
            )}

            {/* Qty */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <span style={{ color: '#2D1B4E', fontWeight: 600 }}>পরিমাণ:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFF0F7', borderRadius: 12, padding: '4px 8px' }}>
                <button onClick={() => setQty(Math.max(1, qty-1))} style={{ background: '#fff', border: '1px solid #FFD9EC', color: '#E84393', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontSize: 18, fontWeight: 700 }}>-</button>
                <span style={{ color: '#2D1B4E', fontWeight: 700, minWidth: 28, textAlign: 'center', fontSize: 16 }}>{qty}</span>
                <button onClick={() => setQty(qty+1)} style={{ background: '#fff', border: '1px solid #FFD9EC', color: '#E84393', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontSize: 18, fontWeight: 700 }}>+</button>
              </div>
            </div>

            {/* Shipping */}
            <div style={{ background: '#FFF8E7', border: '1px solid #FFD700', borderRadius: 12, padding: '10px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>🚚</span>
              <p style={{ margin: 0, color: '#8B5E8E', fontSize: 13 }}>
                <strong style={{ color: '#FF6B35' }}>কুমিল্লায় ফ্রি ডেলিভারি</strong> · বাইরে মাত্র ৳১২০
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <button onClick={handleAddToCart} disabled={product.stock === 0} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: product.stock === 0 ? '#eee' : 'linear-gradient(135deg, #E84393, #7C3AED)',
                color: product.stock === 0 ? '#999' : '#fff',
                border: 'none', borderRadius: 14, padding: '14px',
                fontFamily: 'Hind Siliguri', fontSize: 16, fontWeight: 700,
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                boxShadow: product.stock > 0 ? '0 4px 20px rgba(232,67,147,0.4)' : 'none'
              }}>
                <ShoppingCart size={20} />
                {product.stock === 0 ? 'স্টক শেষ' : 'কার্টে যোগ করুন'}
              </button>
              <button onClick={handleWishlist} style={{
                background: wishlisted ? '#E84393' : '#fff', border: '2px solid #E84393',
                color: wishlisted ? '#fff' : '#E84393', borderRadius: 14, padding: '14px 16px',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                transition: 'all 0.2s'
              }}>
                <Heart size={18} fill={wishlisted ? '#fff' : 'none'} />
              </button>
            </div>

            <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappMsg)}`} target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: '#25D366', color: '#fff', textDecoration: 'none',
              borderRadius: 14, padding: '13px', fontFamily: 'Hind Siliguri',
              fontSize: 15, fontWeight: 700, boxShadow: '0 4px 20px rgba(37,211,102,0.3)'
            }}>
              💬 WhatsApp এ অর্ডার করুন
            </a>
          </div>
        </div>

        {/* Reviews */}
        <div style={{ marginTop: 60, background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #FFD9EC' }}>
          <h2 style={{ fontFamily: 'Aclonica, sans-serif', color: '#2D1B4E', marginBottom: 28, fontSize: 22 }}>
            ⭐ রিভিউ ও রেটিং
            {product.avgRating > 0 && <span style={{ color: '#E84393', marginLeft: 12, fontSize: 18 }}>({product.avgRating}/5)</span>}
          </h2>

          {user && (
            <form onSubmit={handleReview} style={{ background: '#FFF5F9', borderRadius: 16, padding: 24, marginBottom: 28, border: '1px solid #FFD9EC' }}>
              <h4 style={{ color: '#2D1B4E', marginBottom: 14, fontSize: 16 }}>আপনার রিভিউ দিন</h4>
              <div style={{ marginBottom: 14 }}>
                <p style={{ color: '#8B5E8E', marginBottom: 8, fontSize: 14 }}>রেটিং:</p>
                <StarRating rating={review.rating} interactive onRate={r => setReview({...review, rating: r})} />
              </div>
              <textarea value={review.comment} onChange={e => setReview({...review, comment: e.target.value})}
                required placeholder="আপনার অভিজ্ঞতা লিখুন..." rows={3}
                style={{ width: '100%', background: '#fff', border: '2px solid #FFD9EC', borderRadius: 10, padding: '10px 14px', fontFamily: 'Hind Siliguri', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', color: '#2D1B4E' }}
                onFocus={e => e.target.style.borderColor = '#E84393'}
                onBlur={e => e.target.style.borderColor = '#FFD9EC'} />
              <button type="submit" disabled={submittingReview} style={{
                marginTop: 12, background: 'linear-gradient(135deg, #E84393, #7C3AED)',
                color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px',
                fontFamily: 'Hind Siliguri', fontWeight: 700, cursor: submittingReview ? 'not-allowed' : 'pointer', fontSize: 14
              }}>{submittingReview ? 'পাঠানো হচ্ছে...' : 'রিভিউ দিন ✓'}</button>
            </form>
          )}

          {product.reviews?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {product.reviews.map((r, i) => (
                <div key={i} style={{ background: '#FFF5F9', borderRadius: 14, padding: 18, border: '1px solid #FFD9EC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    {r.photo
                      ? <img src={r.photo} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                      : <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #E84393, #7C3AED)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>{r.name?.charAt(0)}</div>}
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: '#2D1B4E', fontSize: 14 }}>{r.name}</p>
                      <StarRating rating={r.rating} small />
                    </div>
                    <span style={{ marginLeft: 'auto', color: '#8B5E8E', fontSize: 12 }}>{new Date(r.createdAt).toLocaleDateString('bn-BD')}</span>
                  </div>
                  <p style={{ color: '#2D1B4E', margin: 0, fontSize: 14, lineHeight: 1.6 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#8B5E8E', textAlign: 'center', padding: '20px 0' }}>এখনো কোনো রিভিউ নেই। প্রথম রিভিউ দিন!</p>
          )}
        </div>
      </div>
    </div>
  );
}