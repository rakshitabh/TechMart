import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';
import { Package, Calendar, User, ChevronDown, ChevronUp, MapPin, CreditCard } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => setToast({ message, type });

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/api/orders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      showToast('Order status updated successfully', 'success');
      fetchOrders(); // Refresh
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const statusOptions = [
    'Order Placed',
    'Payment Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  const statusColors = {
    'Order Placed': 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400',
    'Payment Confirmed': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-400',
    Processing: 'bg-indigo-100 text-indigo-850 dark:bg-indigo-950/20 dark:text-indigo-400',
    Packed: 'bg-amber-100 text-amber-850 dark:bg-amber-950/20 dark:text-amber-400',
    Shipped: 'bg-purple-100 text-purple-850 dark:bg-purple-950/20 dark:text-purple-400',
    'Out for Delivery': 'bg-teal-100 text-teal-850 dark:bg-teal-950/20 dark:text-teal-400',
    Delivered: 'bg-emerald-100 text-emerald-850 dark:bg-emerald-950/20 dark:text-emerald-400',
    Cancelled: 'bg-rose-100 text-rose-850 dark:bg-rose-950/20 dark:text-rose-455',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkBg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Customer Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-gray-150 shadow-sm">
          <p className="text-gray-550">No customer orders recorded in the system.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order._id;
            return (
              <div
                key={order._id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm overflow-hidden"
              >
                {/* Always Visible Row */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-slate-750/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors"
                  onClick={() => toggleExpand(order._id)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                      <span>Order ID: {order._id.substring(12)}...</span>
                      <span>&bull;</span>
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-x-4 gap-y-0.5 text-sm font-semibold text-gray-700 dark:text-slate-200">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1 text-gray-400" />
                        {order.user?.name || 'Guest User'} ({order.user?.email || 'N/A'})
                      </span>
                      <span className="text-brand-600 dark:text-brand-400">
                        Total: ₹{order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Status Dropdown selector */}
                  <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-bold ${statusColors[order.orderStatus]} border-0 cursor-pointer focus:ring-1 focus:ring-brand-500`}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>

                    <button
                      onClick={() => toggleExpand(order._id)}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                {/* Expansion drawer */}
                {isExpanded && (
                  <div className="p-6 bg-gray-50 dark:bg-slate-800/40 border-t border-gray-100 dark:border-slate-700/50 space-y-6">
                    {/* Products Grid */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Order Items Details</h4>
                      <div className="divide-y divide-gray-150 dark:divide-slate-700/40">
                        {order.products.map((item) => (
                          <div key={item._id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                            <div className="flex items-center space-x-3 text-left">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded bg-gray-150"
                              />
                              <div>
                                <h5 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{item.name}</h5>
                                <span className="text-xs text-gray-400">Qty: {item.quantity} &bull; ₹{item.price?.toFixed(2)} each</span>
                              </div>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-slate-700/40">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1" /> Shipping Destination Address
                        </h4>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                          <p className="font-bold text-gray-900 dark:text-white">{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.house}, {order.shippingAddress.street}</p>
                          {order.shippingAddress.landmark && <p>Landmark: {order.shippingAddress.landmark}</p>}
                          {order.shippingAddress.area && <p>Area: {order.shippingAddress.area}</p>}
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                          <p>Country: {order.shippingAddress.country} (Type: {order.shippingAddress.type || 'Home'})</p>
                          <p className="font-bold mt-1 text-gray-700 dark:text-slate-350">Phone: {order.shippingAddress.phone}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center">
                          <CreditCard className="w-3.5 h-3.5 mr-1" /> Payment & Billing Audit
                        </h4>
                        <div className="text-xs sm:text-sm text-gray-550 dark:text-slate-400 space-y-1">
                          <p><strong>Payment Method:</strong> {order.paymentMethod || 'Cash on Delivery'}</p>
                          <p><strong>Payment Status:</strong> {order.paymentStatus || 'Pending'}</p>
                          {order.transactionId && <p><strong>Transaction ID:</strong> {order.transactionId}</p>}
                          {order.razorpayOrderId && <p><strong>Razorpay Order ID:</strong> {order.razorpayOrderId}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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

export default AdminOrders;
