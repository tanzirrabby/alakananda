import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchCart();
    else setCart({ items: [] });
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API}/cart`);
      setCart(res.data);
    } catch (err) { console.error(err); }
  };

  const addToCart = async (productId, quantity = 1, selectedSize, selectedColor) => {
    const res = await axios.post(`${API}/cart/add`, { productId, quantity, selectedSize, selectedColor });
    setCart(res.data);
  };

  const updateQuantity = async (productId, quantity) => {
    const res = await axios.put(`${API}/cart/update`, { productId, quantity });
    setCart(res.data);
  };

  const removeFromCart = async (productId) => {
    const res = await axios.delete(`${API}/cart/remove/${productId}`);
    setCart(res.data);
  };

  const clearCart = async () => {
    await axios.delete(`${API}/cart/clear`);
    setCart({ items: [] });
  };

  const cartCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
