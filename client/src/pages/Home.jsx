import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  Cpu,
  ShieldCheck,
  Zap,
  Truck,
  Heart,
  ShoppingCart,
  Eye,
  Star,
  X,
  Clock,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  Mail,
  ChevronRight,
  Undo2,
  Percent,
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  // Product Lists
  const [trending, setTrending] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  
  // Status states
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  // Flash Sale Timer: 2 hours 45 mins countdown
  const [timeLeft, setTimeLeft] = useState(9912); // seconds (2h 45m 12s)

  // Newsletter email
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const showToast = (message, type) => setToast({ message, type });

  // Ticking Flash Sale timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 9912));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}h : ${mins.toString().padStart(2, '0')}m : ${secs.toString().padStart(2, '0')}s`;
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const { data } = await api.get('/api/products?sort=rating');
        setTrending(data.slice(0, 6)); // Top 6 rated products
        setBestSellers(data.slice(0, 4)); // First 4 rated products
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Please login to add items to cart', 'error');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (product.stock <= 0) {
      showToast('Item is out of stock', 'error');
      return;
    }
    try {
      await addToCart(product._id, 1);
      showToast(`${product.name} added to cart!`, 'success');
    } catch (err) {
      showToast('Failed to add item to cart', 'error');
    }
  };

  const handleBuyNow = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Please login to buy now', 'error');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    try {
      await addToCart(product._id, 1);
      navigate('/checkout');
    } catch (err) {
      showToast('Failed to start checkout', 'error');
    }
  };

  const handleWishlistClick = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Please login to update wishlist', 'error');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    try {
      await toggleWishlist(product);
      showToast(isInWishlist(product._id) ? 'Removed from wishlist' : 'Added to wishlist', 'success');
    } catch (err) {
      showToast('Failed to update wishlist', 'error');
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast('Subscribed successfully! Thank you for joining TechMart.', 'success');
    setNewsletterEmail('');
  };

  // Helper calculating mock discount values dynamically (to ensure premium discount layout details)
  const getProductPricing = (product) => {
    const listPrice = Number(product.price);
    const mockOriginalPrice = Number((listPrice * 1.25).toFixed(2));
    const mockDiscountPct = 20;
    return {
      original: mockOriginalPrice,
      current: listPrice,
      discount: mockDiscountPct,
    };
  };

  return (
    <div className="pb-2 relative overflow-hidden bg-white text-gray-900 dark:bg-darkBg dark:text-gray-100 transition-colors duration-200">
      
      {/* Animations CSS Injections */}
      <style>{`
        @keyframes aurora-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.15); }
        }
        .aurora-bg {
          background: linear-gradient(135deg, rgba(79,70,229,0.15) 0%, rgba(139,92,246,0.1) 40%, rgba(59,130,246,0.12) 100%);
          background-size: 200% 200%;
          animation: aurora-shift 12s ease infinite;
        }
        .float-element {
          animation: float 5s ease-in-out infinite;
        }
        .pulse-blob {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>

      <section className="relative min-h-[80vh] lg:h-[85vh] flex items-center overflow-hidden border-b border-gray-100 dark:border-slate-900/60 bg-white dark:bg-[#0F172A] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Next-Gen Workspace</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-gray-900 dark:text-white">
                Construct Your <br />
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-600 bg-clip-text text-transparent dark:from-white dark:to-indigo-400">
                  Ultimate Desktop
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-gray-500 dark:text-slate-400 max-w-xl leading-relaxed">
                Explore an exclusive, curated portfolio of developer essentials, high-performance electronics, and premium mechanical accessories.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#111827] hover:bg-[#4F46E5] dark:bg-slate-900 dark:hover:bg-indigo-650 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm"
                >
                  Browse Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  to="#categories"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-[#111827] bg-white border border-[#111827] hover:bg-gray-100 dark:bg-slate-900 dark:text-white dark:border-slate-700 dark:hover:bg-slate-800 transition-all hover:scale-[1.01] shadow-sm"
                >
                  Explore Categories
                </Link>
              </div>
            </div>

            {/* Hero Right: Glassmorphic Floating Card */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              {/* Subtle animated indigo glow behind the card */}
              <div className="absolute -inset-10 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-[80px] animate-pulse-slow"></div>
              
              <div className="relative bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-2xl max-w-sm w-full float-element">
                <div className="space-y-5">
                  <div className="aspect-video w-full rounded-2xl bg-gray-100 dark:bg-slate-850 overflow-hidden relative border dark:border-slate-700">
                    <img
                      src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60"
                      alt="Featured Watch"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-indigo-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded shadow-sm">
                      Featured
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-start text-left">
                    <div>
                      <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">AeroPulse Watch</h3>
                      <p className="text-xs text-gray-400 mt-0.5">OLED Display &bull; Bluetooth v5.3</p>
                    </div>
                     <span className="text-xl font-black text-brand-650 dark:text-brand-400">₹5,999.00</span>
                  </div>
                  
                  <Link
                    to="/products"
                    className="w-full flex items-center justify-center py-2.5 rounded-xl bg-[#111827] hover:bg-[#4F46E5] dark:bg-slate-850 dark:hover:bg-[#4F46E5] text-white font-bold text-xs transition-all shadow-md"
                  >
                    View Showcase Catalog
                  </Link>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Shop By Category Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
        <div className="mb-10">
          <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase flex items-center">
            <span className="w-1.5 h-6 bg-indigo-650 rounded-full mr-2.5"></span>
            Shop By Category
          </h2>
          <p className="text-xs text-gray-450 dark:text-slate-450 mt-1">High-performance gear organized by collection</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {[
            { name: 'Smartphones', bg: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=60', count: '14 items' },
            { name: 'Laptops', bg: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=60', count: '18 items' },
            { name: 'Smartwatches', bg: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=300&auto=format&fit=crop&q=60', count: '8 items' },
            { name: 'Audio', bg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=60', count: '12 items' },
            { name: 'Gaming', bg: 'https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?w=300&auto=format&fit=crop&q=60', count: '9 items' },
            { name: 'Monitors', bg: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=60', count: '15 items' },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="group relative rounded-2xl overflow-hidden aspect-square border border-gray-150 dark:border-slate-800 shadow-sm flex flex-col justify-end p-4 hover:scale-[1.03] active:scale-[0.98] transition-all bg-slate-900"
            >
              {/* Background Cover */}
              <img
                src={cat.bg}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              
              <div className="relative z-10 space-y-1">
                <h4 className="font-extrabold text-sm text-white">{cat.name}</h4>
                <p className="text-[10px] text-gray-300 font-medium">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
        <div className="flex justify-between items-end mb-8 border-b dark:border-slate-800/60 pb-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-gray-905 dark:text-white uppercase flex items-center">
              <span className="w-1.5 h-6 bg-indigo-650 rounded-full mr-2.5"></span>
              Trending Gear
            </h2>
            <p className="text-xs text-gray-450 dark:text-slate-455 mt-1">Hottest picks loved by developer circles</p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center"
          >
            Explore Catalog <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((id) => (
              <div key={id} className="animate-pulse bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-5 space-y-4 h-[380px]" />
            ))}
          </div>
        ) : (
          /* Horizontal grid scrollbar */
          <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide py-2 px-1">
            {trending.map((prod) => {
              const pricing = getProductPricing(prod);
              return (
                <div
                  key={prod._id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-150 dark:border-slate-750/70 p-4 shadow-sm w-72 flex-shrink-0 flex flex-col justify-between hover:shadow-lg hover:scale-[1.015] hover:-translate-y-1 transition-all relative group text-left"
                >
                  {/* Badge & Wishlist Container */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                    <span className="bg-red-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                      {pricing.discount}% OFF
                    </span>
                    {prod.stock <= 0 && (
                      <span className="bg-gray-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => handleWishlistClick(e, prod)}
                    className={`absolute top-4 right-4 z-10 p-2 rounded-full border dark:border-slate-700 shadow-sm backdrop-blur-md transition-all ${
                      isInWishlist(prod._id)
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-white/80 dark:bg-slate-800/80 text-gray-400 hover:text-rose-500'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>

                  <div className="space-y-3 flex-1 flex flex-col justify-between">
                    {/* Image */}
                    <div className="aspect-square w-full rounded-xl bg-gray-50 dark:bg-slate-750 overflow-hidden relative border dark:border-slate-700">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      
                      {/* Quick view hover cover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button
                          onClick={() => setQuickViewProduct(prod)}
                          className="px-4 py-2 rounded-xl bg-white text-gray-900 text-xs font-bold shadow-lg hover:bg-brand-50 transition-colors flex items-center"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" />
                          Quick View
                        </button>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{prod.brand}</span>
                      <h4 className="font-extrabold text-sm text-gray-900 dark:text-white line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {prod.name}
                      </h4>
                      
                      {/* Rating block */}
                      <div className="flex items-center space-x-1.5 pt-0.5">
                        <div className="flex items-center text-amber-550">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 fill-current ${
                                i < Math.floor(prod.rating || 5) ? 'text-amber-500' : 'text-gray-200 dark:text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold">({prod.numReviews || 12} reviews)</span>
                      </div>
                    </div>

                    {/* Price block */}
                    <div className="flex items-baseline space-x-2 pt-1.5">
                      <span className="text-base font-black text-brand-650 dark:text-brand-400">
                        ₹{pricing.current.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{pricing.original.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t dark:border-slate-700/50">
                    <button
                      onClick={(e) => handleAddToCart(e, prod)}
                      className="py-2 bg-brand-50 hover:bg-brand-100 dark:bg-slate-750 dark:hover:bg-slate-700 text-brand-700 dark:text-brand-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Cart
                    </button>
                    <button
                      onClick={(e) => handleBuyNow(e, prod)}
                      className="py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Buy Now
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Flash Sale Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-900 to-indigo-950 p-8 md:p-12 shadow-xl border border-brand-500/20 text-white flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="space-y-4 max-w-lg">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400">
              <Percent className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Flash Promotion</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Midnight Blitz Flash Sale!
            </h2>
            <p className="text-slate-300 text-sm">
              Save up to 40% on mechanical keyboards, multi-port USB chargers, and noise-cancelling developer headsets. Deal ends soon!
            </p>

            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-xs font-bold text-brand-950 bg-white hover:bg-gray-100 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Shop Flash Now
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          {/* Timer Clock Box */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-md min-w-[240px] text-center space-y-3">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-black flex items-center justify-center">
              <Clock className="w-4 h-4 mr-1.5 text-red-400 animate-pulse" />
              Offer Closes In
            </p>
            <div className="text-2xl font-black font-mono tracking-wider text-red-400">
              {formatTimer(timeLeft)}
            </div>
          </div>

        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
        <div className="mb-10">
          <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase flex items-center">
            <span className="w-1.5 h-6 bg-indigo-650 rounded-full mr-2.5"></span>
            Best Sellers
          </h2>
          <p className="text-xs text-gray-450 dark:text-slate-450 mt-1">Top volume items checked out this week</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((id) => (
              <div key={id} className="animate-pulse bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-5 space-y-4 h-[380px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((prod) => {
              const pricing = getProductPricing(prod);
              return (
                <div
                  key={prod._id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-150 dark:border-slate-750/70 p-4 shadow-sm hover:shadow-lg hover:scale-[1.015] hover:-translate-y-1 transition-all relative group text-left flex flex-col justify-between"
                >
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                    <span className="bg-brand-600 text-white text-[8px] font-black uppercase px-2.5 py-1 rounded shadow-sm">
                      Best Seller
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleWishlistClick(e, prod)}
                    className={`absolute top-4 right-4 z-10 p-2 rounded-full border dark:border-slate-700 shadow-sm backdrop-blur-md transition-all ${
                      isInWishlist(prod._id)
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-white/80 dark:bg-slate-800/80 text-gray-400 hover:text-rose-500'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>

                  <div className="space-y-3 flex-1 flex flex-col justify-between">
                    <div className="aspect-square w-full rounded-xl bg-gray-50 dark:bg-slate-750 overflow-hidden relative border dark:border-slate-700">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button onClick={() => setQuickViewProduct(prod)} className="px-4 py-2 rounded-xl bg-white text-gray-900 text-xs font-bold shadow-lg hover:bg-brand-50 transition-colors flex items-center">
                          <Eye className="w-3.5 h-3.5 mr-1.5" /> Quick View
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 pt-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{prod.brand}</span>
                      <h4 className="font-extrabold text-sm text-gray-905 dark:text-white line-clamp-1">{prod.name}</h4>
                      <div className="flex items-center space-x-1.5 pt-0.5">
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 fill-current ${i < Math.floor(prod.rating || 5) ? 'text-amber-400' : 'text-gray-200 dark:text-slate-700'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold">({prod.numReviews || 8})</span>
                      </div>
                    </div>

                    <div className="flex items-baseline space-x-2 pt-1.5">
                      <span className="text-base font-black text-brand-650 dark:text-brand-400">₹{pricing.current.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 line-through">₹{pricing.original.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t dark:border-slate-700/50">
                    <button onClick={(e) => handleAddToCart(e, prod)} className="py-2 bg-brand-50 hover:bg-brand-100 dark:bg-slate-750 dark:hover:bg-slate-700 text-brand-700 dark:text-brand-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1">
                      <ShoppingCart className="w-3.5 h-3.5" /> Cart
                    </button>
                    <button onClick={(e) => handleBuyNow(e, prod)} className="py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all">
                      Buy Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Featured Collection Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-auto md:h-[320px] bg-slate-900 border dark:border-slate-800 shadow-lg text-white p-8 flex flex-col justify-end">
            <img
              src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=60"
              alt="Workspace setup"
              className="absolute inset-0 w-full h-full object-cover opacity-30 hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] bg-indigo-650 px-2 py-0.5 rounded text-white font-bold uppercase tracking-widest">Workspace</span>
              <h3 className="text-xl sm:text-2xl font-black">Minimalist peripherals</h3>
              <p className="text-xs text-gray-300 max-w-sm">Ditch the clutter. Build a silent setup with multi-device accessories.</p>
              <Link to="/products" className="inline-flex items-center text-xs font-bold text-indigo-400 hover:underline">
                Explore Setup <ChevronRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-auto md:h-[320px] bg-slate-900 border dark:border-slate-800 shadow-lg text-white p-8 flex flex-col justify-end">
            <img
              src="https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=600&auto=format&fit=crop&q=60"
              alt="Developer accessories"
              className="absolute inset-0 w-full h-full object-cover opacity-35 hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] bg-brand-650 px-2 py-0.5 rounded text-white font-bold uppercase tracking-widest">Sound Engineering</span>
              <h3 className="text-xl sm:text-2xl font-black">ANC Studio Headphones</h3>
              <p className="text-xs text-gray-300 max-w-sm">Immersive audio filters blocking office noise. Pure focus mode.</p>
              <Link to="/products" className="inline-flex items-center text-xs font-bold text-brand-400 hover:underline">
                Explore Sound <ChevronRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>
          </div>

        </div>
        </section>

      {/* Why Choose TechMart Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
            Why Choose TechMart
          </h2>
          <p className="text-xs text-gray-450 mt-1">Providing premium purchasing guarantees for developers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Secure Payments', icon: <ShieldCheck className="w-6 h-6" />, desc: 'Every transaction is fully verified and processed securely using sandbox payment networks.' },
            { title: 'Free & Fast Shipping', icon: <Truck className="w-6 h-6" />, desc: 'Standard express dispatch protocols apply. Free delivery on order subtotals above ₹4,000.' },
            { title: 'Easy 30-Day Returns', icon: <Undo2 className="w-6 h-6" />, desc: 'Not satisfied with your workstation upgrade? Initiate automated refunds or claims within 30 days.' },
            { title: 'Full Brand Warranty', icon: <CheckCircle2 className="w-6 h-6" />, desc: 'We only stock certified, original hardware products, complete with standard replacement warranties.' },
            { title: '24/7 Dedicated Support', icon: <ThumbsUp className="w-6 h-6" />, desc: 'Speak to developer desk agents any time. Resolve configuration and setup tickets instantly.' },
            { title: 'Rapid Instant Deliveries', icon: <Zap className="w-6 h-6" />, desc: 'Local warehouse fulfillment delivers keyboards, monitors, and components in record times.' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-150 dark:border-slate-750/70 flex space-x-4 text-left shadow-sm group hover:border-brand-500/30 transition-all duration-300"
            >
              <div className="p-3 bg-brand-50 dark:bg-slate-750 text-brand-650 dark:text-brand-400 rounded-xl h-fit group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">{item.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews (Testimonials) Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
            Customer Testimonials
          </h2>
          <p className="text-xs text-gray-450 mt-1">Verified reviews from coders, builders, and designers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Sarah Jenkins', role: 'Full Stack Engineer', text: 'The AeroPulse Smart Watch has been fantastic. Tracks my activity, integrates with notification APIs, and holds charge for days. The checkout was seamless.', rating: 5, initial: 'S' },
            { name: 'Alex Rivera', role: 'DevOps Architect', text: 'Got the SonarANC Wireless headphones for the office. Incredible noise isolation, letting me focus on complex build scripts. Quick delivery in just 2 days!', rating: 5, initial: 'A' },
            { name: 'Meera Patel', role: 'UI/UX Designer', text: 'TechMarts selection of mechanical developer gear is unparalleled. The key switches feel great and the warranty cards were verified right out of the box.', rating: 4, initial: 'M' },
          ].map((test, idx) => (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-150 dark:border-slate-750/70 text-left space-y-4 shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-slate-700 text-brand-650 dark:text-brand-400 flex items-center justify-center font-black text-sm">
                  {test.initial}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-sm text-gray-905 dark:text-white">{test.name}</span>
                    <span className="bg-brand-50 text-brand-700 dark:bg-brand-950/20 text-[9px] font-black uppercase px-1.5 py-0.2 rounded flex items-center select-none">
                      Verified
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold">{test.role}</span>
                </div>
              </div>

              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 fill-current ${i < test.rating ? 'text-amber-400' : 'text-gray-250 dark:text-slate-700'}`} />
                ))}
              </div>

              <p className="text-xs text-gray-450 dark:text-slate-350 italic leading-relaxed">
                "{test.text}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-150 dark:border-slate-750/70 p-8 sm:p-12 shadow-xl space-y-6">
          <div className="mx-auto bg-brand-500/10 text-brand-600 dark:text-brand-400 p-3.5 rounded-2xl w-fit flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase">Subscribe To Our Newsletter</h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
              Stay ahead of the curve. Get exclusive developer coupon codes, flash promotions, and restock alerts.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-grow px-4 py-2.5 rounded-xl border border-gray-250 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-gray-905 dark:text-white text-left"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl shadow-md transition-all select-none"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Quick View Dialog / Modal Overlay */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-slate-800 max-w-2xl w-full rounded-3xl border border-gray-200 dark:border-slate-700 shadow-2xl relative overflow-hidden flex flex-col md:flex-row text-left">
            
            {/* Close Button */}
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-gray-500 dark:text-slate-300 z-10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Col: Image */}
            <div className="w-full md:w-1/2 aspect-square bg-gray-50 dark:bg-slate-750 flex items-center justify-center relative">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-brand-600 text-white text-[8px] font-black uppercase px-2.5 py-0.5 rounded shadow-sm">
                {quickViewProduct.category}
              </span>
            </div>

            {/* Right Col: Details */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{quickViewProduct.brand}</span>
                <h3 className="font-extrabold text-xl text-gray-900 dark:text-white leading-tight">
                  {quickViewProduct.name}
                </h3>
                
                {/* Stars */}
                <div className="flex items-center space-x-1.5 pt-0.5">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 fill-current ${i < Math.floor(quickViewProduct.rating || 5) ? 'text-amber-400' : 'text-gray-250 dark:text-slate-700'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold">({quickViewProduct.numReviews || 12} reviews)</span>
                </div>

                <div className="text-xl font-black text-brand-650 dark:text-brand-400 pt-1.5">
                  ₹{quickViewProduct.price?.toFixed(2)}
                </div>

                <p className="text-xs text-gray-450 dark:text-slate-350 leading-relaxed pt-2">
                  {quickViewProduct.description || 'Premium developer component designed to deliver maximum speed, ergonomic comfort, and setup durability.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      handleAddToCart(e, quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-grow py-2.5 bg-brand-50 hover:bg-brand-100 dark:bg-slate-750 dark:hover:bg-slate-700 text-brand-700 dark:text-brand-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border dark:border-slate-700"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                  <button
                    onClick={(e) => handleWishlistClick(e, quickViewProduct)}
                    className={`p-2.5 rounded-xl border dark:border-slate-700 shadow-sm transition-all ${
                      isInWishlist(quickViewProduct._id)
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-white hover:bg-gray-50 text-gray-400 dark:bg-slate-800 dark:hover:bg-slate-750'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    handleBuyNow(e, quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all text-center"
                >
                  Proceed to Checkout
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Toast Notification wrapper */}
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

export default Home;
