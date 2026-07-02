import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          setUser(JSON.parse(userInfo));
          // Refresh user data from API to ensure it's up to date
          const { data } = await api.get('/api/auth/profile');
          const updatedUser = { ...JSON.parse(userInfo), ...data };
          setUser(updatedUser);
          localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        } catch (error) {
          console.error('Session expired or token invalid', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    if (data.token) {
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
    }
    return data;
  };

  const register = async (name, email, phone, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, phone, password });
    if (data.token) {
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
    }
    return data;
  };

  const loginWithGoogle = async (idToken) => {
    const { data } = await api.post('/api/auth/google', { idToken });
    if (data.token) {
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const updateProfile = async (profileData) => {
    const { data } = await api.put('/api/auth/profile', profileData);
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, setUser, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
