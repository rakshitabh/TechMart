import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import Rating from './Rating';
import { Heart, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onShowToast }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [adding, setAdding] = useState(false);

  const isWishlisted = isInWishlist(product._id);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      onShowToast('Please login to add items to wishlist', 'error');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    try {
      await toggleWishlist(product);
      onShowToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'success');
    } catch (error) {
      onShowToast(error.response?.data?.message || 'Error updating wishlist', 'error');
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      onShowToast('Please login to add items to cart', 'error');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (product.stock <= 0) {
      onShowToast('Item is out of stock', 'error');
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id, 1);
      onShowToast(`${product.name} added to cart!`, 'success');
    } catch (error) {
      onShowToast(error.response?.data?.message || 'Failed to add item to cart', 'error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 overflow-hidden hover-glow transition-all duration-300 flex flex-col h-full">
      {/* Product Image & Wishlist Button */}
      <div className="relative aspect-video w-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 shadow-md hover:scale-110 active:scale-95 transition-all"
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400' : ''}`} />
        </button>

        {product.stock <= 0 ? (
          <span className="absolute bottom-3 left-3 px-2.5 py-1.5 rounded-lg bg-rose-500/95 text-white font-extrabold text-[10px] uppercase tracking-widest shadow-md">
            Out of Stock
          </span>
        ) : product.stock <= 8 ? (
          <span className="absolute bottom-3 left-3 px-2.5 py-1.5 rounded-lg bg-amber-500/95 text-white font-extrabold text-[10px] uppercase tracking-widest shadow-md">
            Low Stock
          </span>
        ) : null}

        {product.rating >= 4.8 && (
          <span className="absolute top-3 left-3 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
            Top Rated
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            {product.category}
          </span>
          <Link to={`/products/${product._id}`}>
            <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-brand-500 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center pt-1">
            <Rating value={product.rating} text={`(${product.reviews?.length || 0})`} />
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-700/40">
          <span className="text-lg font-extrabold text-gray-900 dark:text-white">
            ₹{product.price?.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || adding}
            className={`inline-flex items-center justify-center p-2.5 rounded-xl border border-transparent font-semibold shadow-sm transition-all duration-200 ${
              product.stock <= 0
                ? 'bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'
                : 'bg-[#111827] dark:bg-slate-900 text-white hover:bg-[#4F46E5] dark:hover:bg-indigo-650 hover:scale-105 active:scale-95'
            }`}
            aria-label="Add to Cart"
          >
            {adding ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-brand-500"></div>
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
