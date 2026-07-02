import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';
import { Boxes, AlertTriangle, CheckCircle, XCircle, Search, ArrowUpDown } from 'lucide-react';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'low', 'out', 'ok'

  const showToast = (message, type) => setToast({ message, type });

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/api/products');
      setProducts(data);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      showToast('Failed to load inventory logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-455', icon: <XCircle className="w-3.5 h-3.5 mr-1" /> };
    if (stock <= 5) return { label: 'Low Stock', color: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-450', icon: <AlertTriangle className="w-3.5 h-3.5 mr-1" /> };
    return { label: 'In Stock', color: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-450', icon: <CheckCircle className="w-3.5 h-3.5 mr-1" /> };
  };

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || prod.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (stockFilter === 'low') {
      return matchesSearch && prod.stock > 0 && prod.stock <= 5;
    }
    if (stockFilter === 'out') {
      return matchesSearch && prod.stock === 0;
    }
    if (stockFilter === 'ok') {
      return matchesSearch && prod.stock > 5;
    }
    return matchesSearch;
  });

  const totalItems = products.reduce((acc, item) => acc + item.stock, 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div className="space-y-6 text-left">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150 dark:border-slate-700/60 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-brand-500/10 text-brand-600 rounded-xl">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Total Units in Stock</p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{loading ? '...' : totalItems}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150 dark:border-slate-700/60 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Low Stock SKUs</p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{loading ? '...' : lowStockCount}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150 dark:border-slate-700/60 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Out of Stock SKUs</p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{loading ? '...' : outOfStockCount}</h3>
          </div>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-150 dark:border-slate-700/60 shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="p-6 border-b border-gray-100 dark:border-slate-700/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search products/brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-750 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
          </div>

          <div className="flex space-x-2 w-full sm:w-auto">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-750 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-full sm:w-auto font-semibold"
            >
              <option value="all">All Inventory Status</option>
              <option value="ok">Healthy Stock (&gt;5)</option>
              <option value="low">Low Stock (1-5)</option>
              <option value="out">Out of Stock (0)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500 mx-auto"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            No products match the filter search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-slate-400">
              <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-700 dark:text-slate-350 text-xs font-bold uppercase tracking-wider border-b border-gray-100 dark:border-slate-750">
                <tr>
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock Levels</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-750">
                {filteredProducts.map((prod) => {
                  const status = getStockStatus(prod.stock);
                  return (
                    <tr key={prod._id} className="hover:bg-gray-50/40 dark:hover:bg-slate-750/10 transition-colors">
                      <td className="px-6 py-4 flex items-center space-x-3.5">
                        <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border border-gray-100 dark:border-slate-700" />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{prod.name}</p>
                          <span className="text-xs text-gray-400 font-mono">ID: {prod._id.substring(12)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700 dark:text-slate-300">{prod.category}</td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">₹{prod.price.toFixed(2)}</td>
                      <td className="px-6 py-4 w-1/4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${Math.min((prod.stock / 50) * 100, 100)}%` }}
                              className={`h-full rounded-full ${
                                prod.stock === 0 ? 'bg-rose-500' : prod.stock <= 5 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                            />
                          </div>
                          <span className="font-bold text-gray-800 dark:text-slate-200">{prod.stock}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                          {status.icon}
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminInventory;
