import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  User,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  MapPin,
  Settings
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      if (profileDropdownOpen || categoriesDropdownOpen) {
        setProfileDropdownOpen(false);
        setCategoriesDropdownOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [profileDropdownOpen, categoriesDropdownOpen]);

  const cartCount = cart.products.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword)}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#111827]/95 backdrop-blur-md border-b border-gray-800 dark:border-slate-900 transition-all duration-300 shadow-sm text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link to="/home" className="flex items-center space-x-2 flex-shrink-0">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight font-display bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">
              TechMart
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search premium products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm text-gray-900 dark:text-white"
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-500 transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Nav Items - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/home"
              className={`text-sm font-semibold transition-all duration-200 py-1 ${
                location.pathname === '/home' || location.pathname === '/'
                  ? 'text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`text-sm font-semibold transition-all duration-200 py-1 ${
                location.pathname === '/products' && !location.search.includes('sort=newest')
                  ? 'text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Products
            </Link>
            <Link
              to="/products?sort=newest"
              className={`text-sm font-semibold transition-all duration-200 py-1 ${
                location.search.includes('sort=newest')
                  ? 'text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              New Arrivals
            </Link>
            {user && (
              <Link
                to="/orders"
                className={`text-sm font-semibold transition-all duration-200 py-1 ${
                  location.pathname === '/orders'
                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Orders
              </Link>
            )}

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className="flex items-center space-x-1 text-sm font-semibold text-gray-300 hover:text-white transition-colors focus:outline-none"
              >
                <span>Categories</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {categoriesDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCategoriesDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl py-2 border border-gray-100 dark:border-slate-700/60 z-50 text-left">
                    {['Laptops', 'Smartphones', 'Audio', 'Accessories', 'Peripherals'].map((cat) => (
                      <Link
                        key={cat}
                        to={`/products?category=${cat}`}
                        onClick={() => setCategoriesDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-750/50 transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 focus:outline-none transition-all"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-gray-300" />}
            </button>

            {/* Orders Link */}
            {user && (
              <Link
                to="/orders"
                className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white relative transition-all"
                title="My Orders"
              >
                <Package className="w-5 h-5" />
              </Link>
            )}

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white relative transition-all"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-bold leading-none text-white bg-indigo-650 transform translate-x-1/2 -translate-y-1/2">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white relative transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-bold leading-none text-white bg-indigo-650 transform translate-x-1/2 -translate-y-1/2">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-800 transition-all focus:outline-none"
                >
                  <div className="bg-gray-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-300" />
                </button>

                {profileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-[#111827] dark:bg-slate-900 rounded-xl shadow-xl py-2 border border-gray-800 dark:border-slate-800 z-50 text-left dropdown-menu text-white">
                      <div className="px-4 py-2.5 border-b border-gray-800 dark:border-slate-850">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-5 h-5 rounded-full bg-indigo-650 text-white flex items-center justify-center text-xs font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                      >
                        <User className="w-4 h-4 mr-2.5 text-gray-400" />
                        My Profile
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                      >
                        <Package className="w-4 h-4 mr-2.5 text-gray-400" />
                        My Orders
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                      >
                        <Heart className="w-4 h-4 mr-2.5 text-gray-400" />
                        Wishlist
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-950/20 transition-colors border-t border-gray-800 dark:border-slate-850 mt-1"
                      >
                        <LogOut className="w-4 h-4 mr-2.5 text-rose-500" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-800 dark:border-slate-850 text-sm font-semibold rounded-full text-white bg-slate-900 dark:bg-slate-900 hover:bg-[#4F46E5] dark:hover:bg-indigo-650 transition-all duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Burger Menu - Mobile */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-all"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-gray-300" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-gray-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-850 dark:border-slate-850 bg-[#111827] dark:bg-slate-950 px-4 pt-2 pb-6 space-y-4 text-white">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-sm text-gray-950 dark:text-white"
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col space-y-2">
            <Link
              to="/home"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-semibold text-gray-300 hover:bg-gray-800 text-left"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-semibold text-gray-300 hover:bg-gray-800 text-left"
            >
              Products
            </Link>

            {/* Mobile Categories section */}
            <div className="px-3 py-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold text-left">Categories</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {['Laptops', 'Smartphones', 'Audio', 'Accessories', 'Peripherals'].map((cat) => (
                  <Link
                    key={cat}
                    to={`/products?category=${cat}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 text-left"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-lg text-base font-semibold text-gray-300 hover:bg-gray-800"
            >
              Wishlist ({wishlistCount})
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-lg text-base font-semibold text-gray-300 hover:bg-gray-800"
            >
              Shopping Cart ({cartCount})
            </Link>

            {user ? (
              <>
                <div className="border-t border-gray-800 my-2 pt-2 px-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold text-left">Account Info</p>
                  <p className="text-sm font-semibold text-gray-300 mt-1 text-left">{user.name}</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-base font-semibold text-gray-300 hover:bg-gray-800 text-left"
                >
                  👤 My Profile
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-base font-semibold text-gray-300 hover:bg-gray-800 text-left"
                >
                  📦 My Orders
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-base font-semibold text-rose-400 hover:bg-rose-950/20"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 flex items-center justify-center px-4 py-2.5 rounded-full text-base font-semibold text-white bg-slate-900 hover:bg-[#4F46E5]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
