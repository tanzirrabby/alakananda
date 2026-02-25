import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

const statusConfig = {
  placed:     { label: 'অর্ডার হয়েছে', color: '#FF9F43', bg: '#FFF8EE', icon: '📦', step: 1 },
  confirmed:  { label: 'নিশ্চিত হয়েছে', color: '#7C3AED', bg: '#F5F0FF', icon: '✅', step: 2 },
  processing: { label: 'প্রস্তুত হচ্ছে',  color: '#1a73e8', bg: '#EEF4FF', icon: '⚙️', step: 3 },
  shipped:    { label: 'পাঠানো হয়েছে', color: '#06D6A0', bg: '#EEFFF9', icon: '🚚', step: 4 },
  delivered:  { label: 'পৌঁছে গেছে',  color: '#06D6A0', bg: '#EEFFF9', icon: '🎉', step: 5 },
  cancelled:  { label: 'বাতিল',        color: '#E84393', bg: '#FFF0F7', icon: '❌', step: 0 },
};

const steps = ['placed','confirmed','processing','shipped','delivered'];

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    axios.get(`${API}/orders/my-orders`).then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5E8E', fontSize: 18 }}>লোড হচ্ছে...</div>;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '36px 20px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Aclonica, sans-serif', color: '#2D1B4E', fontSize: 28, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Package color="#E84393" /> আমার অর্ডার ({orders.length}টি)
        </h1>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 24, border: '1px solid #FFD9EC' }}>
            <div style={{ fontSize: 70, marginBottom: 16 }}>📦</div>
            <p style={{ color: '#8B5E8E', fontSize: 18 }}>এখনো কোনো অর্ডার নেই</p>
          </div>
        ) : orders.map(order => {
          const status = statusConfig[order.orderStatus] || statusConfig.placed;
          const isExpanded = expanded === order._id;
          return (
            <div key={order._id} style={{ background: '#fff', borderRadius: 20, marginBottom: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #FFD9EC' }}>
              {/* Header */}
              <div style={{ padding: '18px 22px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setExpanded(isExpanded ? null : order._id)}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{status.icon}</span>
                    <div style={{ background: status.bg, border: `1px solid ${status.color}`, borderRadius: 20, padding: '3px 14px' }}>
                      <span style={{ color: status.color, fontWeight: 700, fontSize: 13 }}>{status.label}</span>
                    </div>
                  </div>
                  <p style={{ margin: '6px 0 0', color: '#8B5E8E', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> অর্ডার #{order._id.slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                  </p>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div>
                    <p style={{ color: '#E84393', fontWeight: 800, fontSize: 20, margin: 0 }}>৳{order.totalAmount}</p>
                    <p style={{ color: '#8B5E8E', fontSize: 12, margin: 0 }}>{order.items.length}টি পণ্য</p>
                  </div>
                  {isExpanded ? <ChevronUp size={20} color="#8B5E8E" /> : <ChevronDown size={20} color="#8B5E8E" />}
                </div>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div style={{ padding: '0 22px 22px', borderTop: '1px solid #FFF0F7' }}>
                  {/* Progress tracker */}
                  {order.orderStatus !== 'cancelled' && (
                    <div style={{ padding: '18px 0', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 3, background: '#FFD9EC', zIndex: 0, transform: 'translateY(-50%)' }} />
                        <div style={{ position: 'absolute', top: '50%', left: 0, height: 3, background: 'linear-gradient(135deg, #E84393, #7C3AED)', zIndex: 1, transform: 'translateY(-50%)', width: `${(status.step - 1) / 4 * 100}%`, transition: 'width 0.5s' }} />
                        {steps.map((s, i) => {
                          const sc = statusConfig[s];
                          const done = status.step > i;
                          const current = status.step === i + 1;
                          return (
                            <div key={s} style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                              <div style={{ width: 34, height: 34, borderRadius: '50%', background: done || current ? 'linear-gradient(135deg, #E84393, #7C3AED)' : '#fff', border: `2px solid ${done || current ? 'transparent' : '#FFD9EC'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                                {done || current ? '✓' : sc.icon}
                              </div>
                              <span style={{ fontSize: 11, color: done || current ? '#E84393' : '#8B5E8E', fontWeight: done || current ? 700 : 400, textAlign: 'center' }}>{sc.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div style={{ marginBottom: 14 }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #FFF0F7' }}>
                        <span style={{ color: '#2D1B4E', fontSize: 14 }}>• {item.name} × {item.quantity} {item.selectedSize && `(${item.selectedSize})`}</span>
                        <span style={{ color: '#E84393', fontWeight: 700, fontSize: 14 }}>৳{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping */}
                  <div style={{ background: '#FFF5F9', borderRadius: 10, padding: 14 }}>
                    <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#2D1B4E', fontSize: 14 }}>📍 ডেলিভারি ঠিকানা:</p>
                    <p style={{ margin: 0, color: '#8B5E8E', fontSize: 13 }}>
                      {order.shippingAddress?.name}, {order.shippingAddress?.phone}<br/>
                      {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.district}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
