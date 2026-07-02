import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';
import {
  Package,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  XCircle,
  FileText,
  Printer,
  CheckCircle,
} from 'lucide-react';

// Invoice Modal Component
const InvoiceModal = ({ order, onClose }) => {
  const handlePrint = () => {
    const printContent = document.getElementById('printable-invoice-content').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore React state bindings
  };

  const invoiceDate = new Date(order.createdAt).toLocaleDateString();
  const subtotal = order.products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const shippingFee = order.totalPrice - subtotal > 0 ? (order.totalPrice - subtotal) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white text-lg font-bold"
        >
          &times;
        </button>

        {/* Invoice Printable Wrapper */}
        <div id="printable-invoice-content" className="text-left text-gray-800 dark:text-slate-100 font-sans space-y-6">
          <div className="flex justify-between items-start border-b dark:border-slate-700 pb-5">
            <div>
              <h1 className="text-2xl font-black text-brand-600 dark:text-brand-450 tracking-wider">TECHMART</h1>
              <p className="text-xs text-gray-400">Your ultimate coding workspace partner</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase">Tax Invoice / Bill</h2>
              <p className="text-xs text-gray-400">Order ID: #{order._id.substring(12).toUpperCase()}</p>
              <p className="text-xs text-gray-400">Date: {invoiceDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="font-extrabold text-gray-900 dark:text-white uppercase mb-1">Sold By</h4>
              <p className="font-bold">TechMart Retail Pvt. Ltd.</p>
              <p>Electronics City, Phase 1</p>
              <p>Bengaluru, Karnataka - 560100</p>
              <p>GSTIN: 29AAACT9812M1Z3</p>
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 dark:text-white uppercase mb-1">Shipping Destination</h4>
              <p className="font-bold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.house}, {order.shippingAddress.street}</p>
              {order.shippingAddress.landmark && <p>Landmark: {order.shippingAddress.landmark}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="font-semibold mt-1">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          <table className="w-full border-collapse border-b border-gray-150 dark:border-slate-700 text-xs text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-750 font-bold border-t border-b border-gray-200 dark:border-slate-700">
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Net Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((item) => (
                <tr key={item._id} className="border-b border-gray-100 dark:border-slate-700/40">
                  <td className="py-3 px-3 font-semibold text-gray-900 dark:text-white">{item.name}</td>
                  <td className="py-3 px-3 text-right">₹{item.price.toFixed(2)}</td>
                  <td className="py-3 px-3 text-center">{item.quantity}</td>
                  <td className="py-3 px-3 text-right font-bold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-start pt-2">
            <div className="text-xs space-y-1 text-gray-500 dark:text-slate-400">
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
              {order.transactionId && <p><strong>Transaction ID:</strong> {order.transactionId}</p>}
            </div>
            <div className="w-1/2 text-xs space-y-1.5 text-right font-semibold">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping Fee</span>
                <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold border-t border-gray-200 dark:border-slate-750 pt-2 text-gray-900 dark:text-white">
                <span>Grand Total</span>
                <span>₹{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="flex space-x-3 mt-8 border-t dark:border-slate-700/60 pt-4">
          <button
            onClick={handlePrint}
            className="flex-grow flex items-center justify-center py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md transition-all text-sm"
          >
            <Printer className="w-4 h-4 mr-2" /> Print Invoice
          </button>
          <button
            onClick={onClose}
            className="flex-grow flex items-center justify-center py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-slate-750 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-350 rounded-xl font-bold transition-all text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Invoice selection state
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const showToast = (message, type) => setToast({ message, type });

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/api/orders/myorders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      showToast('Failed to load order history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Order status cancellation handler
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This will restore product stock.')) {
      return;
    }

    try {
      await api.put(`/api/orders/${orderId}/cancel`);
      showToast('Order cancelled successfully', 'success');
      fetchOrders(); // Refresh orders list
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to cancel order', 'error');
    }
  };

  // Modern tracking status indexes
  const statusSteps = [
    'Order Placed',
    'Payment Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const statusColors = {
    'Order Placed': 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400',
    'Payment Confirmed': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-400',
    Processing: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-400',
    Packed: 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400',
    Shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400',
    'Out for Delivery': 'bg-teal-100 text-teal-800 dark:bg-teal-950/30 dark:text-teal-400',
    Delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400',
    Cancelled: 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400',
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-700/60 shadow-sm">
          <div className="mx-auto w-16 h-16 bg-brand-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">No orders placed yet</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
            Your purchase history is currently empty. Browse our premium store to construct your ultimate coding environment!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order._id;
            const currentStatusIndex = statusSteps.indexOf(order.orderStatus);
            const isCancelled = order.orderStatus === 'Cancelled';
            const isCancellable = !isCancelled && currentStatusIndex >= 0 && currentStatusIndex < 4; // Before 'Shipped' (Placed, Confirmed, Processing, Packed)

            return (
              <div
                key={order._id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm overflow-hidden"
              >
                {/* Header Summary (Always Visible) */}
                <div
                  onClick={() => toggleExpand(order._id)}
                  className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-750/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Order ID: {order._id.substring(12).toUpperCase()}
                    </span>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-gray-650 dark:text-slate-300">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center text-brand-600 dark:text-brand-400">
                        Total: ₹{order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${statusColors[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 bg-gray-50 dark:bg-slate-800/40 border-t border-gray-100 dark:border-slate-700/50 space-y-6">
                    
                    {/* Visual Tracking Progress Timeline */}
                    {!isCancelled && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" /> Order Delivery Timeline
                        </h4>
                        
                        <div className="relative pt-2 pb-6 px-4">
                          {/* Progress Line */}
                          <div className="absolute top-[21px] left-8 right-8 h-1 bg-gray-200 dark:bg-slate-700 z-0">
                            <div
                              className="h-full bg-brand-650 dark:bg-brand-500 transition-all duration-500"
                              style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                            ></div>
                          </div>

                          {/* Steps circles */}
                          <div className="flex justify-between items-center relative z-10">
                            {statusSteps.map((step, idx) => {
                              const isCompleted = idx <= currentStatusIndex;
                              const isActive = idx === currentStatusIndex;
                              return (
                                <div key={step} className="flex flex-col items-center">
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                      isCompleted
                                        ? 'bg-brand-600 dark:bg-brand-500 text-white shadow-sm ring-4 ring-brand-100 dark:ring-brand-950/20'
                                        : 'bg-gray-200 dark:bg-slate-700 text-gray-500'
                                    }`}
                                  >
                                    {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                                  </div>
                                  <span
                                    className={`absolute text-[9px] font-bold mt-7 truncate max-w-[80px] ${
                                      isActive
                                        ? 'text-brand-600 dark:text-brand-450'
                                        : isCompleted
                                        ? 'text-gray-700 dark:text-slate-300'
                                        : 'text-gray-400'
                                    }`}
                                  >
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Products Grid */}
                    <div className="space-y-3 pt-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Items Purchased</h4>
                      <div className="divide-y divide-gray-150 dark:divide-slate-700/40">
                        {order.products.map((item) => (
                          <div key={item._id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                            <div className="flex items-center space-x-3 text-left">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded bg-gray-100 border dark:border-slate-700"
                              />
                              <div>
                                <h5 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{item.name}</h5>
                                <span className="text-xs text-gray-400">Qty: {item.quantity} &bull; ₹{item.price?.toFixed(2)} each</span>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address snapshot & Payment info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-slate-700/40 text-xs sm:text-sm">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1" /> Shipping Destination Snapshot
                        </h4>
                        <div className="text-gray-500 dark:text-slate-400 space-y-0.5 text-left">
                          <p className="font-bold text-gray-800 dark:text-slate-200">{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.house}, {order.shippingAddress.street}</p>
                          {order.shippingAddress.landmark && <p>Landmark: {order.shippingAddress.landmark}</p>}
                          {order.shippingAddress.area && <p>Area: {order.shippingAddress.area}</p>}
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                          {order.shippingAddress.latitude && (
                            <p className="text-[10px] text-gray-400 font-semibold">
                              Coordinates: {order.shippingAddress.latitude.toFixed(5)}, {order.shippingAddress.longitude.toFixed(5)}
                            </p>
                          )}
                          <p className="font-semibold text-gray-750 dark:text-slate-300 mt-1">
                            Contact Phone: {order.shippingAddress.phone}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center">
                          <CreditCard className="w-3.5 h-3.5 mr-1" /> Billing & Payment Details
                        </h4>
                        <div className="text-gray-500 dark:text-slate-400 space-y-1">
                          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                          <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                          {order.transactionId && <p><strong>Transaction ID:</strong> {order.transactionId}</p>}
                          {order.razorpayOrderId && <p><strong>Razorpay Order ID:</strong> {order.razorpayOrderId}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Action Panel: Cancel and Invoice */}
                    <div className="flex space-x-3 pt-4 border-t border-gray-100 dark:border-slate-700/40">
                      <button
                        onClick={() => setSelectedInvoice(order)}
                        className="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 dark:bg-slate-750 dark:hover:bg-slate-700 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-slate-200 rounded-xl transition-all shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1.5" /> View Invoice
                      </button>
                      
                      {isCancellable && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="inline-flex items-center px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-xs font-bold text-rose-600 dark:text-rose-400 rounded-xl transition-all border border-rose-200 dark:border-rose-900/40"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1.5" /> Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal Overlay */}
      {selectedInvoice && (
        <InvoiceModal
          order={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
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

export default OrderHistory;
