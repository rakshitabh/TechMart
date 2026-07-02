import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ products: [], subtotal: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await api.get('/api/cart');
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ products: [], subtotal: 0, totalAmount: 0 });
    }
  }, [user]);

  const addToCart = async (productId, quantity) => {
    if (!user) {
      throw new Error('Please login to add items to cart');
    }
    try {
      const { data } = await api.post('/api/cart', { productId, quantity });
      setCart(data);
      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      const { data } = await api.delete(`/api/cart/${productId}`);
      setCart(data);
      return data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      const { data } = await api.delete('/api/cart');
      setCart(data);
      return data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
