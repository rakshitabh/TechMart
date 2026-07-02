import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setWishlist(user.wishlist || []);
    } else {
      setWishlist([]);
    }
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user) {
      throw new Error('Please login to manage your wishlist');
    }

    const productId = product._id || product;
    const isExist = wishlist.some((item) => (item._id || item) === productId);

    setLoading(true);
    try {
      let updatedWishlist;
      if (isExist) {
        // Remove from wishlist
        const { data } = await api.delete(`/api/users/wishlist/${productId}`);
        updatedWishlist = data;
      } else {
        // Add to wishlist
        const { data } = await api.post('/api/users/wishlist', { productId });
        updatedWishlist = data;
      }

      setWishlist(updatedWishlist);

      // Sync user context
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const updatedUser = { ...userInfo, wishlist: updatedWishlist };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
