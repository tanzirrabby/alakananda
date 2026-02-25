import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const WHATSAPP = '8801843646125';

const categories = [
  { id: 'set-combo', label: 'সেট/কম্বো', emoji: '💝', bg: 'linear-gradient(135deg, #FF6B35, #E84393)', desc: 'একসাথে সাজুন' },
  { id: 'metal-dhatu', label: 'মেটাল/ধাতু', emoji: '✨', bg: 'linear-gradient(135deg, #FFD700, #FF6B35)', desc: 'ধ্রুপদী সৌন্দর্য' },
  { id: 'shuta-kapor', label: 'সুতা/কাপড়', emoji: '🎀', bg: 'linear-gradient(135deg, #7C3AED, #E84393)', desc: 'রঙিন বোনা স্বপ্ন' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    axios.get(`${API}/products/featured`).then(r => setFeatured(r.data)).catch(() => {});
  }, []);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #FF6B35 0%, #E84393 45%, #7C3AED 100%)',
        padding: '80px 20px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* Floating decorative circles */}
        {[
          { size: 300, top: '-80px', left: '-80px', opacity: 0.15 },
          { size: 200, bottom: '-60px', right: '-60px', opacity: 0.1 },
          { size: 150, top: '20%', right: '15%', opacity: 0.1 },
          { size: 100, bottom: '20%', left: '10%', opacity: 0.12 },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', width: c.size, height: c.size,
            background: `rgba(255,255,255,${c.opacity})`,
            borderRadius: '50%', top: c.top, bottom: c.bottom, left: c.left, right: c.right,
            animation: `float ${3 + i}s ease-in-out infinite`
          }} />
        ))}

        <div style={{ position: 'relative', zIndex: 1, animation: 'fadeInUp 0.8s ease' }}>
          <div style={{ marginBottom: 20, display: 'inline-block', position: 'relative' }}>
            <img src="/logo.jpg" alt="অলকানন্দা" style={{
              width: 130, height: 130, borderRadius: '50%', objectFit: 'cover',
              border: '4px solid rgba(255,255,255,0.8)',
              boxShadow: '0 0 0 8px rgba(255,255,255,0.2), 0 20px 60px rgba(0,0,0,0.2)',
              animation: 'float 4s ease-in-out infinite'
            }} />
          </div>
          <h1 style={{
            fontFamily: 'Aclonica, sans-serif', color: '#fff',
            fontSize: 'clamp(36px, 6vw, 72px)', margin: '0 0 8px',
            textShadow: '0 2px 20px rgba(0,0,0,0.2)'
          }}>অলকানন্দা</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 8, fontStyle: 'italic' }}>
            হাতে তৈরি চুড়ির অনন্য সংগ্রহ
          </p>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, maxWidth: 500, margin: '0 auto 36px' }}>
            প্রতিটি চুড়িতে লুকিয়ে আছে ভালোবাসার ছোঁয়া ও কারিগরের অদম্য শ্রম
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" style={{
              background: '#fff', color: '#E84393', fontWeight: 700,
              textDecoration: 'none', padding: '14px 32px', borderRadius: 30,
              fontSize: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s'
            }}>পণ্য দেখুন ✨</Link>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" style={{
              background: '#25D366', color: '#fff', fontWeight: 700,
              textDecoration: 'none', padding: '14px 32px', borderRadius: 30,
              fontSize: 16, boxShadow: '0 4px 20px rgba(37,211,102,0.4)'
            }}>💬 WhatsApp অর্ডার</a>
          </div>
        </div>

        {/* Wave bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, overflow: 'hidden', lineHeight: 0 }}>
          <svg viewBox="0 0 1200 80" style={{ display: 'block', width: '100%' }}>
            <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" fill="var(--bg)" />
          </svg>
        </div>
      </section>

      {/* Shipping notice */}
      <div style={{
        background: 'linear-gradient(135deg, #FFD700, #FF6B35)',
        padding: '12px 20px', textAlign: 'center'
      }}>
        <p style={{ margin: 0, fontWeight: 600, color: '#1A0A2E', fontSize: 15 }}>
          🚚 কুমিল্লায় <strong>ফ্রি ডেলিভারি</strong> · বাইরে মাত্র ৳১২০ · হাতে তৈরি, ভালোবাসায় তৈরি 💕
        </p>
      </div>

      {/* Categories */}
      <section style={{ padding: '60px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'Aclonica, sans-serif', fontSize: 32, color: '#2D1B4E', margin: '0 0 8px' }}>বিভাগসমূহ</h2>
          <p style={{ color: '#8B5E8E', fontSize: 16 }}>আপনার পছন্দের চুড়ি বেছে নিন</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {categories.map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: cat.bg, borderRadius: 24, padding: '36px 28px', textAlign: 'center',
                color: '#fff', boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)'; }}>
                <div style={{ fontSize: 52, marginBottom: 14, animation: 'float 3s ease-in-out infinite' }}>{cat.emoji}</div>
                <h3 style={{ fontFamily: 'Aclonica, sans-serif', fontSize: 20, margin: '0 0 8px' }}>{cat.label}</h3>
                <p style={{ opacity: 0.85, fontSize: 14, margin: 0 }}>{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section style={{ padding: '0 20px 60px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontFamily: 'Aclonica, sans-serif', fontSize: 28, color: '#2D1B4E', margin: '0 0 4px' }}>⭐ বিশেষ পণ্য</h2>
              <p style={{ color: '#8B5E8E', margin: 0 }}>আমাদের সেরা সংগ্রহ</p>
            </div>
            <Link to="/products" style={{
              background: 'linear-gradient(135deg, #E84393, #7C3AED)',
              color: '#fff', textDecoration: 'none', padding: '10px 22px', borderRadius: 20, fontSize: 14, fontWeight: 600
            }}>সব দেখুন →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Why us */}
      <section style={{ background: 'linear-gradient(135deg, #FFF0F7, #F0E6FF)', padding: '60px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Aclonica, sans-serif', fontSize: 28, color: '#2D1B4E', marginBottom: 40 }}>কেন আমরা আলাদা?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 28 }}>
            {[
              { icon: '🤲', title: 'হাতে তৈরি', desc: 'প্রতিটি চুড়ি যত্ন সহকারে তৈরি', color: '#E84393' },
              { icon: '🚚', title: 'দ্রুত ডেলিভারি', desc: 'কুমিল্লায় ফ্রি, বাইরে ৳১২০', color: '#FF6B35' },
              { icon: '⭐', title: 'সেরা মান', desc: 'প্রতিটি পণ্যে মান নিশ্চিত', color: '#FFD700' },
              { icon: '💬', title: 'WhatsApp সাপোর্ট', desc: 'যেকোনো সমস্যায় সরাসরি যোগাযোগ', color: '#25D366' },
            ].map(item => (
              <div key={item.title} style={{
                background: '#fff', borderRadius: 20, padding: '28px 20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                border: `2px solid ${item.color}22`,
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ color: item.color, margin: '0 0 8px', fontSize: 17 }}>{item.title}</h3>
                <p style={{ color: '#8B5E8E', fontSize: 14, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
