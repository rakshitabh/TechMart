import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';
import { Plus, Edit3, Trash2, X, Image as ImageIcon, Sparkles } from 'lucide-react';

const AdminProducts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const handleCloseModal = () => {
    setModalOpen(false);
    if (location.pathname === '/admin/products/new' || location.pathname === '/admin/add-product') {
      navigate('/admin/products');
    }
  };
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [toast, setToast] = useState(null);

  // Form fields state
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const showToast = (message, type) => setToast({ message, type });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/products');
      setProducts(data);
    } catch (error) {
      console.error('Error fetching admin products:', error);
      showToast('Failed to load products list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (
      new URLSearchParams(location.search).get('add') === 'true' ||
      location.pathname === '/admin/products/new' ||
      location.pathname === '/admin/add-product'
    ) {
      openAddModal();
    } else {
      setModalOpen(false);
    }
  }, [location.search, location.pathname]);

  const openAddModal = () => {
    setEditMode(false);
    setCurrentProductId(null);
    setName('');
    setBrand('');
    setCategory('');
    setPrice('');
    setStock('');
    setDescription('');
    setImageFile(null);
    setImagePreview('');
    setImageUrl('');
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditMode(true);
    setCurrentProductId(product._id);
    setName(product.name);
    setBrand(product.brand);
    setCategory(product.category);
    setPrice(product.price);
    setStock(product.stock);
    setDescription(product.description);
    setImageFile(null);
    setImagePreview('');
    setImageUrl(product.image);
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/api/products/${productId}`);
      showToast('Product deleted successfully', 'success');
      fetchProducts();
    } catch (error) {
      showToast(error.response?.data?.message || 'Delete operation failed', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !brand || !category || !price || !stock || !description) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    setSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('brand', brand);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('description', description);

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrl) {
        formData.append('image', imageUrl);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (editMode) {
        await api.put(`/api/products/${currentProductId}`, formData, config);
        showToast('Product updated successfully!', 'success');
      } else {
        await api.post('/api/products', formData, config);
        showToast('Product created successfully!', 'success');
      }

      handleCloseModal();
      fetchProducts();
    } catch (error) {
      showToast(error.response?.data?.message || 'Save product failed', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Product Inventory</h1>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 mr-1.5" /> Add New Product
        </button>
      </div>

      {/* Products Table Card */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-500"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-gray-150 shadow-sm">
          <p className="text-gray-500">No products inside inventory. Add a new product to showcase.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-slate-400">
              <thead className="text-xs text-gray-400 uppercase bg-gray-50 dark:bg-slate-700/40">
                <tr>
                  <th scope="col" className="px-6 py-3">Details</th>
                  <th scope="col" className="px-6 py-3">Category</th>
                  <th scope="col" className="px-6 py-3">Brand</th>
                  <th scope="col" className="px-6 py-3">Price</th>
                  <th scope="col" className="px-6 py-3">Stock</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700/45">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-750/30">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded bg-gray-100 flex-shrink-0"
                      />
                      <span className="font-bold text-gray-900 dark:text-white line-clamp-1 max-w-[200px]" title={p.name}>
                        {p.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.brand}</td>
                    <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                      ₹{p.price?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-bold ${p.stock <= 5 ? 'text-rose-500 font-extrabold' : 'text-gray-500 dark:text-slate-400'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-brand-600 dark:bg-slate-750 dark:hover:bg-slate-700 transition-colors inline-block"
                        title="Edit Product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 rounded-xl bg-gray-50 hover:bg-rose-50 text-gray-500 hover:text-rose-500 dark:bg-slate-750 dark:hover:bg-rose-950/20 transition-colors inline-block"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-2xl max-w-lg w-full overflow-hidden text-left flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-slate-700/50 flex justify-between items-center bg-gray-50 dark:bg-slate-800">
              <h3 className="font-extrabold text-xl text-gray-900 dark:text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-brand-500" />
                {editMode ? 'Edit Product Parameters' : 'Add New Inventory Entry'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mechanical Keyboard"
                    className="block w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Apex"
                    className="block w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Peripherals"
                    className="block w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="11999"
                    className="block w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="25"
                    className="block w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Product Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed specifications and specs..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:outline-none"
                />
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  Product Image *
                </label>
                <div className="flex items-center space-x-4">
                  {/* Image Preview Window */}
                  <div className="w-16 h-16 rounded-xl bg-gray-150 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : imageUrl ? (
                      <img src={imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  {/* File Inputs */}
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="text-xs text-gray-500 dark:text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 dark:file:bg-slate-700 dark:file:text-brand-400 file:cursor-pointer cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-400">Supports JPG, PNG, WEBP. Max size 5MB.</p>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-100 dark:border-slate-700/50 flex justify-end gap-3 bg-white dark:bg-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-250 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-brand-500/10 flex items-center"
                >
                  {submitLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  ) : (
                    'Save Product'
                  )}
                </button>
              </div>
            </form>
          </div>
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

export default AdminProducts;
