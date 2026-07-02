import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import Rating from '../components/Rating';
import Toast from '../components/Toast';
import { ShoppingCart, Heart, ArrowLeft, Send, Check } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [addingCart, setAddingCart] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => setToast({ message, type });

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/api/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product detail:', error);
      showToast('Product not found', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      showToast('Please login to add items to cart', 'error');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setAddingCart(true);
    try {
      await addToCart(product._id, qty);
      showToast(`Added ${qty} item(s) to cart!`, 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error adding to cart', 'error');
    } finally {
      setAddingCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      showToast('Please login to add items to wishlist', 'error');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    try {
      await toggleWishlist(product);
      showToast(isInWishlist(product._id) ? 'Removed from wishlist' : 'Added to wishlist', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating wishlist', 'error');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      showToast('Please login to checkout', 'error');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setAddingCart(true);
    try {
      await addToCart(product._id, qty);
      navigate('/checkout');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error processing purchase', 'error');
    } finally {
      setAddingCart(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please write a comment', 'error');
      return;
    }

    setSubmitLoading(true);
    try {
      await api.post(`/api/products/${id}/reviews`, { rating, comment });
      showToast('Review submitted successfully!', 'success');
      setComment('');
      setRating(5);
      fetchProduct(); // Refresh product reviews
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkBg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/products" className="inline-flex items-center text-brand-600 font-semibold hover:underline">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Products
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Back Link */}
      <Link to="/products" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-brand-500 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image Panel */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-slate-700/60 shadow-md aspect-video max-h-[500px] flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Product Meta details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              {product.brand} &bull; {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center pt-2">
              <Rating value={product.rating} text={`${product.rating.toFixed(1)} Stars (${product.reviews?.length || 0} customer reviews)`} />
            </div>
          </div>

          <div className="text-3xl font-black text-gray-900 dark:text-white">
            ₹{product.price?.toFixed(2)}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Cart & Wishlist Actions */}
          <div className="bg-gray-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/40 space-y-4">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-gray-500 dark:text-slate-400">Availability</span>
              <span className={product.stock > 0 ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="flex justify-between items-center text-sm font-medium border-t border-gray-100 dark:border-slate-700/40 pt-4">
                <span className="text-gray-500 dark:text-slate-400">Select Quantity</span>
                <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 py-1 bg-gray-50 dark:bg-slate-700/40 text-gray-600 dark:text-slate-300 font-bold hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 font-bold text-gray-800 dark:text-gray-200">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="px-3 py-1 bg-gray-50 dark:bg-slate-700/40 text-gray-600 dark:text-slate-300 font-bold hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 dark:border-slate-700/40">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || addingCart}
                className="flex-1 inline-flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 dark:bg-slate-700/60 dark:hover:bg-slate-700 dark:text-brand-400 border border-transparent disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {addingCart ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-brand-500"></div>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add To Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0 || addingCart}
                className="flex-1 inline-flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 border border-transparent disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-brand-500/10"
              >
                Buy Now
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/20 dark:border-rose-900/50'
                    : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400'
                }`}
                aria-label="Wishlist Toggle"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews and Ratings Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-gray-100 dark:border-slate-800 pt-16">
        {/* Left Side: Existing Reviews */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Customer Reviews</h2>
          {product.reviews?.length === 0 ? (
            <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-50 dark:border-slate-800 text-center text-gray-400">
              No reviews yet for this product. Be the first to leave one!
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((rev) => (
                <div key={rev._id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-50 dark:border-slate-800/80 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{rev.name}</h4>
                      <span className="text-xs text-gray-400">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <Rating value={rev.rating} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-300">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Create Review Form */}
        <div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Write a Review</h3>

            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                    Rating Stars
                  </label>
                  <Rating value={rating} onChange={setRating} color="text-amber-400" />
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    placeholder="Describe your experience with this tech product..."
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full inline-flex items-center justify-center py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md shadow-brand-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {submitLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-lg text-sm text-amber-800 dark:text-amber-400 font-medium">
                Please{' '}
                <Link to={`/login?redirect=/products/${id}`} className="font-bold underline">
                  login
                </Link>{' '}
                to write a customer review.
              </div>
            )}
          </div>
        </div>
      </section>

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

export default ProductDetails;
