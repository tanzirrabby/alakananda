import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

const CATEGORY_LABELS = {
  'set-combo': 'সেট/কম্বো', 'metal-dhatu': 'মেটাল/ধাতু', 'shuta-kapor': 'সুতা/কাপড়'
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cartLoading } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);

  const imgBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'process.env.REACT_APP_API_URL';

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => { setProduct(res.data); if (res.data.sizes?.[0]) setSelectedSize(res.data.sizes[0]); })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('সাইজ নির্বাচন করুন'); return;
    }
    await addToCart(product._id, quantity, selectedSize);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      await API.post(`/products/${id}/review`, { rating, review });
      toast.success('রিভিউ দেওয়া হয়েছে! ধন্যবাদ 🙏');
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
      setReview('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  if (loading) return <div className="loading-screen"><div className="loader" /></div>;
  if (!product) return <div className="container" style={{padding:'40px 0'}}><h2>Product not found</h2></div>;

  return (
    <div className="detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate('/')} className="bc-link">হোম</span>
          <span> / </span>
          <span onClick={() => navigate('/products')} className="bc-link">সব চুড়ি</span>
          <span> / </span>
          <span>{product.name}</span>
        </div>

        <div className="detail-grid">
          {/* Images */}
          <div className="detail-images">
            <div className="main-img">
              {product.images?.[selectedImg]
                ? <img src={`${imgBase}${product.images[selectedImg]}`} alt={product.name} />
                : <div className="big-placeholder">🌸</div>
              }
              {product.stock === 0 && <div className="soldout-overlay">স্টক শেষ</div>}
            </div>
            {product.images?.length > 1 && (
              <div className="thumb-row">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className={`thumb ${selectedImg === i ? 'active' : ''}`}
                    onClick={() => setSelectedImg(i)}
                  >
                    <img src={`${imgBase}${img}`} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-badges">
              <span className="badge badge-primary">{CATEGORY_LABELS[product.category]}</span>
              {product.isFeatured && <span className="badge badge-warning">⭐ Featured</span>}
            </div>

            <h1 className="detail-name">{product.name}</h1>

            {product.avgRating > 0 && (
              <div className="detail-rating">
                {'⭐'.repeat(Math.round(product.avgRating))}
                <span>({product.ratings?.length} টি রিভিউ)</span>
              </div>
            )}

            <div className="detail-price">
              {product.discountPrice ? (
                <>
                  <span className="dp-current">৳{product.discountPrice}</span>
                  <span className="dp-old">৳{product.price}</span>
                  <span className="dp-save">
                    {Math.round((1 - product.discountPrice / product.price) * 100)}% ছাড়
                  </span>
                </>
              ) : (
                <span className="dp-current">৳{product.price}</span>
              )}
            </div>

            <div className="detail-section">
              <h3>বিবরণ</h3>
              <p>{product.description}</p>
            </div>

            {product.material && (
              <div className="detail-meta">
                <span>🧵 উপকরণ: <strong>{product.material}</strong></span>
              </div>
            )}

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div className="detail-section">
                <h3>সাইজ নির্বাচন করুন</h3>
                <div className="size-options">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="detail-section">
                <h3>রঙ</h3>
                <div className="color-row">
                  {product.colors.map((c, i) => (
                    <span key={i} className="color-chip">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="detail-section">
              <h3>পরিমাণ</h3>
              <div className="qty-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
              <small className="stock-info">
                {product.stock > 0 ? `মজুদ আছে: ${product.stock} টি` : 'স্টক শেষ'}
              </small>
            </div>

            {/* Actions */}
            <div className="detail-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || cartLoading}
              >
                🛒 কার্টে যোগ করুন
              </button>
              <button
                className="btn btn-gold btn-lg"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                এখনই কিনুন →
              </button>
            </div>

            <div className="detail-perks">
              <span>🚚 ৳1000+ অর্ডারে ফ্রি ডেলিভারি</span>
              <span>🔄 সহজ রিটার্ন পলিসি</span>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2>ক্রেতাদের রিভিউ</h2>

          {/* Add review */}
          {user && (
            <form className="review-form" onSubmit={handleReview}>
              <h3>আপনার রিভিউ দিন</h3>
              <div className="star-select">
                {[1,2,3,4,5].map(s => (
                  <button type="button" key={s}
                    className={`star-btn ${s <= rating ? 'active' : ''}`}
                    onClick={() => setRating(s)}>⭐</button>
                ))}
              </div>
              <textarea
                placeholder="আপনার অভিজ্ঞতা লিখুন..."
                value={review} onChange={e => setReview(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">রিভিউ দিন</button>
            </form>
          )}

          {/* Review list */}
          {product.ratings?.length === 0 ? (
            <p className="no-reviews">এখনো কোনো রিভিউ নেই</p>
          ) : (
            <div className="review-list">
              {product.ratings?.map((r, i) => (
                <div key={i} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-avatar">{r.user?.name?.charAt(0) || 'U'}</div>
                    <div>
                      <strong>{r.user?.name || 'গ্রাহক'}</strong>
                      <div>{'⭐'.repeat(r.rating)}</div>
                    </div>
                    <small className="review-date">
                      {new Date(r.createdAt).toLocaleDateString('bn-BD')}
                    </small>
                  </div>
                  <p>{r.review}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
