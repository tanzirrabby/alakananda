import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { API } from '../context/AuthContext';
import './ProductsPage.css';

const CATEGORIES = [
  { key: '', label: 'সব চুড়ি' },
  { key: 'set-combo', label: 'সেট/কম্বো' },
  { key: 'metal-dhatu', label: 'মেটাল/ধাতু' },
  { key: 'shuta-kapor', label: 'সুতা/কাপড়' }
];

function ProductCard({ product }) {
  const navigate = useNavigate();
  const imgBase = process.env.REACT_APP_API_URL?.replace('/api', '') || 'process.env.REACT_APP_API_URL';
  const discount = product.discountPrice
    ? Math.round((1 - product.discountPrice / product.price) * 100) : null;

  return (
    <div className="p-card" onClick={() => navigate(`/products/${product._id}`)}>
      <div className="p-img">
        {product.images?.[0]
          ? <img src={`${imgBase}${product.images[0]}`} alt={product.name} />
          : <div className="p-img-placeholder">🌸</div>
        }
        {discount && <span className="p-discount">-{discount}%</span>}
        {product.stock === 0 && <div className="p-soldout">স্টক শেষ</div>}
        {product.isFeatured && <span className="p-featured">⭐ Featured</span>}
      </div>
      <div className="p-body">
        <h3>{product.name}</h3>
        <p className="p-desc">{product.description?.slice(0, 60)}...</p>
        <div className="p-price-row">
          <div>
            {product.discountPrice ? (
              <>
                <span className="p-price">৳{product.discountPrice}</span>
                <span className="p-price-old">৳{product.price}</span>
              </>
            ) : (
              <span className="p-price">৳{product.price}</span>
            )}
          </div>
          {product.avgRating > 0 && (
            <span className="p-rating">⭐ {product.avgRating}</span>
          )}
        </div>
        <div className={`p-stock ${product.stock > 0 ? 'in' : 'out'}`}>
          {product.stock > 0 ? `${product.stock} টি আছে` : 'স্টক নেই'}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [searchInput, setSearchInput] = useState(search);
  const [priceMin, setPriceMin] = useState(minPrice);
  const [priceMax, setPriceMax] = useState(maxPrice);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (page > 1) params.set('page', page);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    setLoading(true);
    API.get(`/products?${params}`)
      .then(res => {
        setProducts(res.data.products);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .finally(() => setLoading(false));
  }, [category, search, page, minPrice, maxPrice]);

  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const handlePriceFilter = () => {
    const p = new URLSearchParams(searchParams);
    if (priceMin) p.set('minPrice', priceMin); else p.delete('minPrice');
    if (priceMax) p.set('maxPrice', priceMax); else p.delete('maxPrice');
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1>আমাদের সব চুড়ি</h1>
          <p>{total} টি চুড়ি পাওয়া গেছে</p>
        </div>

        <div className="products-layout">
          {/* Sidebar Filter */}
          <aside className="filter-sidebar">
            <div className="filter-box">
              <h3>ক্যাটাগরি</h3>
              <div className="filter-cats">
                {CATEGORIES.map(c => (
                  <button
                    key={c.key}
                    className={`filter-cat-btn ${category === c.key ? 'active' : ''}`}
                    onClick={() => updateParam('category', c.key)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-box">
              <h3>দাম (৳)</h3>
              <div className="price-inputs">
                <input
                  type="number" placeholder="সর্বনিম্ন"
                  value={priceMin} onChange={e => setPriceMin(e.target.value)}
                />
                <span>—</span>
                <input
                  type="number" placeholder="সর্বোচ্চ"
                  value={priceMax} onChange={e => setPriceMax(e.target.value)}
                />
              </div>
              <button className="btn btn-outline btn-sm w-full mt-8" onClick={handlePriceFilter}>
                ফিল্টার করুন
              </button>
            </div>

            {(category || search || minPrice || maxPrice) && (
              <button
                className="btn btn-primary btn-sm w-full"
                onClick={() => setSearchParams({})}
              >
                ফিল্টার সরিয়ে দিন ✕
              </button>
            )}
          </aside>

          {/* Main Content */}
          <div className="products-main">
            {/* Search */}
            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text" placeholder="চুড়ি খুঁজুন..."
                value={searchInput} onChange={e => setSearchInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">🔍 খুঁজুন</button>
            </form>

            {/* Category Pills */}
            <div className="cat-pills">
              {CATEGORIES.map(c => (
                <button
                  key={c.key}
                  className={`cat-pill ${category === c.key ? 'active' : ''}`}
                  onClick={() => updateParam('category', c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Products */}
            {loading ? (
              <div className="products-grid-pg">
                {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>কোনো চুড়ি পাওয়া যায়নি</h3>
                <p>অনুগ্রহ করে অন্য কিছু খুঁজে দেখুন</p>
              </div>
            ) : (
              <div className="products-grid-pg">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination">
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                    onClick={() => updateParam('page', i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
