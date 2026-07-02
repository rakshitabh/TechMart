import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Rating from '../components/Rating';
import Toast from '../components/Toast';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, toggleWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const [addingCart, setAddingCart] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => setToast({ message, type });

  const handleAddToCart = async (product) => {
    if (product.stock <= 0) {
      showToast('Product is out of stock', 'error');
      return;
    }
    setAddingCart((prev) => ({ ...prev, [product._id]: true }));
    try {
      await addToCart(product._id, 1);
      showToast(`${product.name} added to cart!`, 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to add item to cart', 'error');
    } finally {
      setAddingCart((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  const handleRemove = async (productId) => {
    try {
      await toggleWishlist(productId);
      showToast('Removed from wishlist', 'info');
    } catch (error) {
      showToast('Failed to remove item', 'error');
    }
  };

  if (loading && wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkBg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="mx-auto w-16 h-16 bg-brand-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
            Save premium tech gears to your wishlist so you can track inventory levels and add them to cart anytime.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-all hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((product) => {
            if (!product) return null;
            return (
              <div
                key={product._id}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 overflow-hidden shadow-sm flex flex-col justify-between h-full"
              >
                {/* Thumbnail & Remove button */}
                <div className="relative aspect-video w-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 text-gray-400 hover:text-rose-500 shadow-md transition-colors"
                    aria-label="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {product.stock <= 0 && (
                    <span className="absolute bottom-3 left-3 px-2 py-1 rounded bg-rose-500/95 text-white font-bold text-xs uppercase tracking-wider">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Details */}
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
                    <div className="flex items-center">
                      <Rating value={product.rating} text={`(${product.reviews?.length || 0})`} />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-700/40">
                    <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                      ₹{product.price?.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0 || addingCart[product._id]}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-gray-100 disabled:text-gray-400 text-white text-xs font-bold shadow-sm transition-all duration-200"
                    >
                      {addingCart[product._id] ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Wishlist;
