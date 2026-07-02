import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';
import { SlidersHorizontal, ArrowUpDown, X, Search, AlertCircle, RefreshCw } from 'lucide-react';

const priceRanges = [
  { label: 'All', min: '', max: '' },
  { label: 'Under ₹10,000', min: '', max: '10000' },
  { label: '₹10,000 - ₹30,000', min: '10000', max: '30000' },
  { label: '₹30,000 - ₹75,000', min: '30000', max: '75000' },
  { label: '₹75,000 - ₹1,50,000', min: '75000', max: '150000' },
  { label: 'Over ₹1,50,000', min: '150000', max: '' }
];

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [toast, setToast] = useState(null);

  // Filters State
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [searchVal, setSearchVal] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const showToast = (message, type) => setToast({ message, type });

  // Read URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const urlKeyword = queryParams.get('keyword') || '';
  const urlCategory = queryParams.get('category') || '';

  // Synchronize URL parameters with local filter states
  useEffect(() => {
    setSearchVal(urlKeyword);
    if (urlCategory) {
      setCategoryFilter(urlCategory);
    }
  }, [urlKeyword, urlCategory]);

  // Fetch metadata categories and brands
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const { data } = await api.get('/api/products/meta/categories');
        setCategories(['All', ...data.categories]);
        setBrands(['All', ...data.brands]);
      } catch (error) {
        console.error('Error fetching categories/brands metadata:', error);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch products whenever filters or URL query changes
  const fetchFilteredProducts = async () => {
    setLoading(true);
    setErrorOccurred(false);
    try {
      const params = new URLSearchParams();
      if (searchVal) params.append('keyword', searchVal);
      if (categoryFilter && categoryFilter !== 'All') params.append('category', categoryFilter);
      if (brandFilter && brandFilter !== 'All') params.append('brand', brandFilter);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sort) params.append('sort', sort);

      const { data } = await api.get(`/api/products?${params.toString()}`);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      setErrorOccurred(true);
      showToast('Error loading products list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [urlKeyword, categoryFilter, brandFilter, minPrice, maxPrice, sort]);

  const handleResetFilters = () => {
    setCategoryFilter('All');
    setBrandFilter('All');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setSearchVal('');
    navigate('/products');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchVal)}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-left space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Products Catalog</h1>
        <p className="text-sm text-gray-550 dark:text-slate-400">Discover and select premium developer gear and accessories</p>
      </div>

      {/* Top Horizontal Category Bar (Pills) */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide text-left flex-nowrap w-full">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 border uppercase tracking-wider ${
              categoryFilter === cat
                ? 'bg-brand-600 border-brand-600 text-white shadow-md shadow-brand-500/10'
                : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-350 border-gray-150 dark:border-slate-700/60 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sleek Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search products..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-3 pr-8 py-2 rounded-xl border border-gray-250 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-sm text-gray-900 dark:text-white"
          />
          <button type="submit" className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-500">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Toggle Filters Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)} // Reuse showMobileFilters as filters drawer toggle
            className={`inline-flex items-center justify-center px-4 py-2 border rounded-xl text-sm font-bold transition-all shadow-sm ${
              showMobileFilters
                ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-slate-700 dark:border-slate-600 dark:text-brand-400'
                : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-650 dark:text-slate-350 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters {(brandFilter !== 'All' || minPrice || maxPrice) ? `(${(brandFilter !== 'All' ? 1 : 0) + (minPrice || maxPrice ? 1 : 0)})` : ''}
          </button>

          {/* Sort Selection */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-gray-450 uppercase tracking-wider hidden md:inline">Sort By</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none text-sm font-bold text-gray-750 dark:text-slate-200 cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ArrowUpDown className="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-450 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Collapsible Filters Panel Drawer */}
      {showMobileFilters && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm text-left grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {/* Brand Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-450">Filter By Brand</label>
            <div className="flex flex-wrap gap-1.5">
              {brands.map((br) => (
                <button
                  key={br}
                  onClick={() => setBrandFilter(br)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    brandFilter === br
                      ? 'bg-brand-600 border-brand-600 text-white font-bold shadow-md shadow-brand-500/10'
                      : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-605 dark:text-slate-400 hover:bg-gray-100'
                  }`}
                >
                  {br}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-455">Price Range</label>
            <div className="flex flex-wrap gap-1.5">
              {priceRanges.map((range) => {
                const isSelected = minPrice === range.min && maxPrice === range.max;
                return (
                  <button
                    key={range.label}
                    onClick={() => {
                      setMinPrice(range.min);
                      setMaxPrice(range.max);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-brand-600 border-brand-600 text-white font-bold shadow-md shadow-brand-500/10'
                        : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-605 dark:text-slate-400 hover:bg-gray-100'
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Column */}
          <div className="flex flex-col justify-end gap-3">
            <button
              onClick={handleResetFilters}
              className="w-full py-2.5 text-center text-sm font-bold text-gray-550 hover:bg-gray-50 border border-gray-250 dark:border-slate-700 dark:hover:bg-slate-700 rounded-xl"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Tags */}
      {(categoryFilter !== 'All' || brandFilter !== 'All' || minPrice || maxPrice || urlKeyword) && (
        <div className="flex flex-wrap gap-2 text-left">
          {categoryFilter !== 'All' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-slate-700 dark:text-brand-400">
              Category: {categoryFilter}
              <button onClick={() => setCategoryFilter('All')} className="ml-1.5 hover:opacity-85">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {brandFilter !== 'All' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-slate-700 dark:text-brand-400">
              Brand: {brandFilter}
              <button onClick={() => setBrandFilter('All')} className="ml-1.5 hover:opacity-85">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-slate-700 dark:text-brand-400">
              Price: {
                priceRanges.find(r => r.min === minPrice && r.max === maxPrice)?.label || 
                `₹${minPrice || '0'} - ₹${maxPrice || '∞'}`
              }
              <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="ml-1.5 hover:opacity-85">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {urlKeyword && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-slate-700 dark:text-brand-400">
              Search: "{urlKeyword}"
              <button onClick={() => { setSearchVal(''); navigate('/products'); }} className="ml-1.5 hover:opacity-85">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Products Grid Section */}
      {errorOccurred ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/60 p-12 text-center shadow-sm max-w-lg mx-auto space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-xl font-bold text-gray-905 dark:text-white">Network Connection Error</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Failed to retrieve the products list due to network issues.
          </p>
          <button
            onClick={() => fetchFilteredProducts()}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md transition-all inline-flex items-center text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2 animate-spin-reverse" /> Retry Connection
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
            <div key={id} className="animate-pulse bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-5 space-y-4 h-[350px]">
              <div className="bg-gray-200 dark:bg-slate-700 aspect-video rounded-xl w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
              <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-full mt-4"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/60 p-12 text-center shadow-sm max-w-lg mx-auto">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Products Found</h3>
          <p className="text-gray-500 dark:text-slate-400 mb-6">
            Try widening your price sliders or refining your search queries.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-bold shadow-md transition-all"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onShowToast={showToast} />
          ))}
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

export default Products;
