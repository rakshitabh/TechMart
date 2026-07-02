import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { Trash2, ArrowRight, ShoppingCart, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { cart, addToCart, removeFromCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => setToast({ message, type });

  const handleQtyChange = async (productId, quantity, maxStock) => {
    if (quantity < 1) return;
    if (quantity > maxStock) {
      showToast('Requested quantity exceeds available stock', 'warning');
      return;
    }
    try {
      await addToCart(productId, quantity);
    } catch (error) {
      showToast(error.response?.data?.message || 'Quantity update failed', 'error');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      showToast('Item removed from cart', 'info');
    } catch (error) {
      showToast('Remove item failed', 'error');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      showToast('Please login to checkout', 'error');
      navigate('/login?redirect=/checkout', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  const cartItems = cart.products || [];
  const subtotal = cart.subtotal || 0;
  const shipping = subtotal >= 4000 || subtotal === 0 ? 0 : 199.00;
  const total = Number((subtotal + shipping).toFixed(2));

  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkBg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="mx-auto w-16 h-16 bg-brand-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
            You don't have any items in your shopping cart. Browse our store to discover new gear.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-all hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const prod = item.product;
              if (!prod) return null;
              return (
                <div
                  key={item._id}
                  className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-gray-50 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                  {/* Thumbnail & Title */}
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-20 h-20 object-cover rounded-xl bg-gray-100 flex-shrink-0"
                    />
                    <div className="text-left space-y-1">
                      <Link to={`/products/${prod._id}`} className="font-bold text-gray-900 dark:text-white hover:text-brand-500 line-clamp-1">
                        {prod.name}
                      </Link>
                      <p className="text-xs text-gray-400 font-semibold uppercase">{prod.brand}</p>
                      <p className="text-sm font-extrabold text-brand-600 dark:text-brand-400">₹{prod.price?.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Quantity selectors */}
                    <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-700/30">
                      <button
                        onClick={() => handleQtyChange(prod._id, item.quantity - 1, prod.stock)}
                        className="px-3 py-1 font-bold text-gray-500 hover:bg-gray-150"
                      >
                        -
                      </button>
                      <span className="px-3 font-bold text-sm text-gray-800 dark:text-gray-200">{item.quantity}</span>
                      <button
                        onClick={() => handleQtyChange(prod._id, item.quantity + 1, prod.stock)}
                        className="px-3 py-1 font-bold text-gray-500 hover:bg-gray-150"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => handleRemove(prod._id)}
                      className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-750 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                      aria-label="Remove Item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Totals Summary */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-md space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-slate-700/40">
              Order Summary
            </h3>

            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-slate-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-slate-400">Shipping</span>
                <span className="text-gray-900 dark:text-white">
                  {shipping === 0 ? (
                    <span className="text-emerald-500 font-bold">FREE</span>
                  ) : (
                    `₹${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[11px] text-gray-400 text-left leading-normal">
                  Add just ₹{(4000 - subtotal).toFixed(2)} more to qualify for FREE shipping.
                </p>
              )}

              <div className="flex justify-between text-base font-extrabold border-t border-gray-100 dark:border-slate-700/40 pt-4">
                <span className="text-gray-900 dark:text-white">Total Amount</span>
                <span className="text-brand-600 dark:text-brand-400">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md shadow-brand-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>

            <Link
              to="/products"
              className="w-full flex items-center justify-center py-2 text-sm text-gray-500 hover:text-brand-500 font-semibold"
            >
              Continue Shopping
            </Link>
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

export default Cart;
