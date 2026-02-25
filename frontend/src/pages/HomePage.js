import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';
import './HomePage.css';

const categories = [
  { key: 'set-combo', label: 'সেট / কম্বো', icon: '💎', desc: 'ম্যাচিং সেটে সাজুন', color: '#E63946' },
  { key: 'metal-dhatu', label: 'মেটাল / ধাতু', icon: '✨', desc: 'টেকসই ও চকচকে', color: '#F4A261' },
  { key: 'shuta-kapor', label: 'সুতা / কাপড়', icon: '🧵', desc: 'হালকা ও রঙিন', color: '#9B5DE5' }
];

function ProductCard({ product }) {
  const navigate = useNavigate();
  const discount = product.discountPrice
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : null;

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product._id}`)}>
      <div className="product-img-wrap">
        {product.images?.[0]
          ? <img src={`${process.env.REACT_APP_API_URL?.replace('/api','')}${product.images[0]}`} alt={product.name} />
          : <div className="img-placeholder">🌸</div>
        }
        {discount && <span className="discount-badge">-{discount}%</span>}
        {product.stock === 0 && <div className="sold-out-overlay">স্টক শেষ</div>}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <div className="product-price">
          {product.discountPrice ? (
            <>
              <span className="price-current">৳{product.discountPrice}</span>
              <span className="price-old">৳{product.price}</span>
            </>
          ) : (
            <span className="price-current">৳{product.price}</span>
          )}
        </div>
        {product.avgRating > 0 && (
          <div className="product-rating">
            {'⭐'.repeat(Math.round(product.avgRating))} <small>({product.ratings?.length})</small>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/products?featured=true&limit=8')
      .then(res => setFeatured(res.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="blob blob1" />
          <div className="blob blob2" />
          <div className="blob blob3" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">🌸 হাতে তৈরি, ভালোবাসায় মোড়া</div>
          <h1 className="hero-title">
            <span className="brand-name">অলকানন্দা</span>
            <br />
            <span>হ্যান্ডমেড চুড়ি</span>
          </h1>
          <p className="hero-desc">
            প্রতিটি চুড়ি তৈরি হয় আন্তরিকতা আর দক্ষতায়।<br />
            আপনার হাতকে করুন আরও সুন্দর, আরও অনন্য।
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg">সব চুড়ি দেখুন →</Link>
            <Link to="/products?featured=true" className="btn btn-outline btn-lg">ফিচার্ড কালেকশন</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><span>500+</span><small>খুশি গ্রাহক</small></div>
            <div className="stat"><span>100%</span><small>হাতে তৈরি</small></div>
            <div className="stat"><span>৳80</span><small>ডেলিভারি চার্জ</small></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-ring ring1">💍</div>
          <div className="visual-ring ring2">🌸</div>
          <div className="visual-ring ring3">✨</div>
          <div className="hero-emoji-main">💎</div>
          <div className="floating-chips">
            <span className="chip">সুতার চুড়ি</span>
            <span className="chip">মেটাল সেট</span>
            <span className="chip">কাপড়ের চুড়ি</span>
            <span className="chip">কম্বো অফার</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <h2 className="section-title">আমাদের কালেকশন</h2>
          <p className="section-subtitle">আপনার পছন্দের ক্যাটাগরি বেছে নিন</p>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link to={`/products?category=${cat.key}`} key={cat.key} className="category-card">
                <div className="cat-icon" style={{ background: `${cat.color}20`, color: cat.color }}>
                  {cat.icon}
                </div>
                <h3>{cat.label}</h3>
                <p>{cat.desc}</p>
                <span className="cat-arrow" style={{ color: cat.color }}>→ দেখুন</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured-section">
        <div className="container">
          <h2 className="section-title">বিশেষ কালেকশন</h2>
          <p className="section-subtitle">আমাদের সবচেয়ে জনপ্রিয় চুড়িগুলো</p>
          {loading ? (
            <div className="products-loading">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
          <div className="view-all-wrap">
            <Link to="/products" className="btn btn-primary">সব চুড়ি দেখুন</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-section">
        <div className="container">
          <h2 className="section-title">কেন অলকানন্দা?</h2>
          <div className="why-grid">
            {[
              { icon: '🤝', title: '১০০% হাতে তৈরি', desc: 'প্রতিটি চুড়ি যত্ন সহকারে হাতে বানানো হয়' },
              { icon: '🚚', title: 'দ্রুত ডেলিভারি', desc: 'অর্ডার দেওয়ার ৩-৫ কার্যদিবসের মধ্যে পৌঁছে যাবে' },
              { icon: '💳', title: 'সহজ পেমেন্ট', desc: 'bKash, Nagad, Card বা Cash on Delivery' },
              { icon: '🌟', title: 'গুণমানের নিশ্চয়তা', desc: 'প্রতিটি পণ্য যাচাই করে পাঠানো হয়' }
            ].map((item, i) => (
              <div key={i} className="why-card">
                <div className="why-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>৳১০০০+ অর্ডারে ফ্রি ডেলিভারি! 🎉</h2>
            <p>আজই অর্ডার করুন এবং বিশেষ ছাড় উপভোগ করুন</p>
            <Link to="/products" className="btn btn-gold btn-lg">এখনই কিনুন</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
