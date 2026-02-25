import React from 'react';
import { Link } from 'react-router-dom';

const WHATSAPP = '8801843646125';
const FB_LINK = 'https://www.facebook.com/people/%E0%A6%85%E0%A6%B2%E0%A6%95%E0%A6%BE%E0%A6%A8%E0%A6%A8%E0%A6%A6%E0%A6%BE/61574696396143';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #2D1B4E 0%, #1A0A2E 100%)',
      color: '#fff', padding: '50px 20px 24px', marginTop: 60, fontFamily: 'Hind Siliguri, sans-serif'
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, marginBottom: 36 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <img src="/logo.jpg" alt="অলকানন্দা" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #E84393' }} />
              <div>
                <h3 style={{ margin: 0, color: '#E84393', fontFamily: 'Aclonica, sans-serif', fontSize: 18 }}>অলকানন্দা</h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>সাজের ঘর</p>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.8 }}>
              হাতে তৈরি চুড়ির অনন্য সংগ্রহ। প্রতিটি চুড়িতে লুকিয়ে আছে ভালোবাসার ছোঁয়া।
            </p>
          </div>
          <div>
            <h4 style={{ color: '#FFD700', marginBottom: 14, fontSize: 16 }}>দ্রুত লিঙ্ক</h4>
            {[['/', 'হোম'], ['/products', 'পণ্যসমূহ'], ['/my-orders', 'আমার অর্ডার'], ['/wishlist', 'পছন্দের তালিকা']].map(([to, label]) => (
              <Link key={to} to={to} style={{ display: 'block', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: 8, fontSize: 14, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#E84393'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>{label}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ color: '#FFD700', marginBottom: 14, fontSize: 16 }}>যোগাযোগ করুন</h4>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#25D366', textDecoration: 'none', fontSize: 14, fontWeight: 600
            }}>💬 WhatsApp: 01843646125</a>
            <a href={FB_LINK} target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#1877F2', textDecoration: 'none', fontSize: 14, fontWeight: 600
            }}>📘 Facebook Page</a>
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 10 }}>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.6 }}>
                🚚 কুমিল্লায় <strong style={{ color: '#FFD700' }}>ফ্রি ডেলিভারি</strong><br/>
                বাইরে মাত্র <strong style={{ color: '#FF6B35' }}>৳১২০</strong>
              </p>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 18, textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
          © 2024 অলকানন্দা সাজের ঘর · সর্বস্বত্ব সংরক্ষিত · ভালোবাসায় তৈরি 💕
        </div>
      </div>
    </footer>
  );
}
