import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { signInWithGoogle, auth } from '../firebase';
import { signOut } from 'firebase/auth';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
const API = process.env.REACT_APP_API_URL || 'process.env.REACT_APP_API_URL/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`${API}/auth/me`)
        .then(res => setUser(res.data))
        .catch(() => { localStorage.removeItem('token'); delete axios.defaults.headers.common['Authorization']; })
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  const signup = async (name, email, password, phone) => {
    const res = await axios.post(`${API}/auth/signup`, { name, email, password, phone });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithGoogle();
    const { displayName, email, photoURL } = result.user;
    const res = await axios.post(`${API}/auth/google`, { name: displayName, email, photoURL });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  const logout = async () => {
    try { await signOut(auth); } catch {}
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
