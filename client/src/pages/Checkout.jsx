import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Toast from '../components/Toast';
import {
  ArrowLeft,
  CreditCard,
  ShoppingBag,
  ShieldCheck,
  MapPin,
  Truck,
  Plus,
  Check,
  AlertCircle,
  Edit,
} from 'lucide-react';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressList, setShowAddressList] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null); // Tracks if form is in edit mode

  // Add/Edit Address Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [house, setHouse] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');
  const [type, setType] = useState('Home');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Delivery Method State
  const [deliveryMethod, setDeliveryMethod] = useState('Standard');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  // QoL States
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => setToast({ message, type });

  const cartItems = cart.products || [];
  const subtotal = cart.subtotal || 0;
  const shippingFee = deliveryMethod === 'Express' ? 499.00 : (subtotal >= 4000 || subtotal === 0 ? 0 : 199.00);
  const total = Number((subtotal + shippingFee).toFixed(2));

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Load user's saved addresses
  const loadAddresses = async () => {
    try {
      const { data } = await api.get('/api/addresses');
      setAddresses(data);

      if (user && user.lastUsedAddress) {
        setSelectedAddress(user.lastUsedAddress);
      } else {
        const defaultAddr = data.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        } else if (data.length > 0) {
          setSelectedAddress(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading addresses', 'error');
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [user]);

  // Load Razorpay Script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Reverse Geocoding with OpenCage
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);

        try {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=fa96699325c945ac998f95ef6bb757da`
          );
          const data = await res.json();

          if (data.results && data.results.length > 0) {
            const comp = data.results[0].components;
            setHouse(comp.house_number || comp.building || comp.residential || comp.house || '');
            setStreet(comp.road || comp.street || comp.suburb || comp.neighbourhood || '');
            setArea(comp.suburb || comp.neighbourhood || comp.city_district || comp.subdistrict || comp.state_district || comp.village || '');
            setLandmark(comp.amenity || comp.restaurant || comp.poi || comp.commercial || comp.industrial || comp.historic || '');
            setCity(comp.city || comp.town || comp.village || comp.county || comp.city_district || '');
            setStateVal(comp.state || '');
            setCountry(comp.country || 'India');
            setPincode(comp.postcode || comp.postal_code || '');
            if (!fullName && user?.name) setFullName(user.name);
            if (!phone && user?.phone) setPhone(user.phone);
            showToast('Location resolved! Please verify and fill in any missing fields manually.', 'success');
          } else {
            showToast('Unable to reverse geocode address coordinates.', 'warning');
          }
        } catch (err) {
          console.error(err);
          showToast('Failed to contact reverse geocoding API.', 'error');
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          showToast('Location permission denied. Please enter your address manually.', 'error');
        } else {
          showToast('Failed to acquire device GPS coordinates.', 'error');
        }
      }
    );
  };

  // Open Edit Form inside Checkout
  const handleStartEdit = (addr) => {
    setEditingAddressId(addr._id);
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setHouse(addr.house);
    setStreet(addr.street);
    setLandmark(addr.landmark || '');
    setArea(addr.area || '');
    setCity(addr.city);
    setStateVal(addr.state);
    setPincode(addr.pincode);
    setCountry(addr.country || 'India');
    setType(addr.type || 'Home');
    setLatitude(addr.latitude || null);
    setLongitude(addr.longitude || null);
    setShowAddForm(true);
  };

  // Clear Form Fields
  const clearForm = () => {
    setEditingAddressId(null);
    setFullName('');
    setPhone('');
    setHouse('');
    setStreet('');
    setLandmark('');
    setArea('');
    setCity('');
    setStateVal('');
    setPincode('');
    setCountry('India');
    setType('Home');
    setLatitude(null);
    setLongitude(null);
  };

  // Add / Update Address Handler inside Checkout
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !house || !street || !city || !stateVal || !pincode) {
      showToast('Please fill in all required address fields', 'warning');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      showToast('Please enter a valid 10-digit mobile number', 'warning');
      return;
    }

    const pinRegex = /^[0-9]{6}$/;
    if (!pinRegex.test(pincode)) {
      showToast('Please enter a valid 6-digit PIN code', 'warning');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName,
        phone,
        house,
        street,
        landmark,
        area,
        city,
        state: stateVal,
        country,
        pincode,
        type,
        latitude,
        longitude,
      };

      let addressResult;
      if (editingAddressId) {
        const { data } = await api.put(`/api/addresses/${editingAddressId}`, payload);
        addressResult = data;
        showToast('Address updated successfully!', 'success');
      } else {
        const { data } = await api.post('/api/addresses', payload);
        addressResult = data;
        showToast('Address saved to address book!', 'success');
      }

      setSelectedAddress(addressResult);
      setShowAddForm(false);
      clearForm();
      loadAddresses();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save address details', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Main Submit Order Flow
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!selectedAddress) {
      showToast('Please select a shipping address', 'warning');
      return;
    }

    setLoading(true);

    try {
      const orderProducts = cartItems.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));

      // Copying address snapshot strictly preserves delivery information
      const shippingAddressSnapshot = {
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        house: selectedAddress.house,
        street: selectedAddress.street,
        landmark: selectedAddress.landmark || '',
        area: selectedAddress.area || '',
        city: selectedAddress.city,
        state: selectedAddress.state,
        country: selectedAddress.country || 'India',
        pincode: selectedAddress.pincode,
        type: selectedAddress.type || 'Home',
        latitude: selectedAddress.latitude || null,
        longitude: selectedAddress.longitude || null,
      };

      if (paymentMethod === 'Cash on Delivery') {
        await api.post('/api/orders', {
          products: orderProducts,
          shippingAddress: shippingAddressSnapshot,
          totalPrice: total,
          paymentMethod: 'Cash on Delivery',
          paymentStatus: 'Pending',
        });

        showToast('Order placed successfully via Cash on Delivery!', 'success');
        clearCart();
        setTimeout(() => navigate('/orders'), 1000);
      } else {
        // Online Payment flow (Razorpay)
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          showToast('Failed to load Razorpay SDK. Please check your internet connection.', 'error');
          setLoading(false);
          return;
        }

        const { data: rzpOrder } = await api.post('/api/payments/razorpay-order', {
          amount: total,
        });

        const { data: keyData } = await api.get('/api/payments/razorpay-key');

        const options = {
          key: keyData.key,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: 'TechMart',
          description: 'Secure Order Payment',
          image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
          order_id: rzpOrder.id,
          handler: async (response) => {
            try {
              const { data: verifyData } = await api.post('/api/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyData.success) {
                await api.post('/api/orders', {
                  products: orderProducts,
                  shippingAddress: shippingAddressSnapshot,
                  totalPrice: total,
                  paymentMethod,
                  paymentStatus: 'Paid',
                  transactionId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                });

                showToast('Online Payment Successful! Order Placed!', 'success');
                clearCart();
                setTimeout(() => navigate('/orders'), 1000);
              } else {
                showToast('Payment verification failed. Please contact customer support.', 'error');
              }
            } catch (verificationErr) {
              console.error(verificationErr);
              showToast('Error verifying online payment transaction.', 'error');
            }
          },
          prefill: {
            name: selectedAddress.fullName,
            contact: selectedAddress.phone,
            email: user?.email,
          },
          theme: {
            color: '#4f46e5',
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response) {
          showToast(`Payment failed: ${response.error.description}`, 'error');
        });
        paymentObject.open();
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to complete checkout flow', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      <Link to="/cart" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-brand-500 mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
      </Link>

      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Checkout Flow</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Flow steps */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Select Shipping Address */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-brand-500" />
                1. Delivery Address
              </h2>
              {selectedAddress && !showAddressList && (
                <button
                  onClick={() => {
                    setShowAddressList(true);
                    setShowAddForm(false);
                  }}
                  className="text-xs sm:text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Change
                </button>
              )}
            </div>

            {/* Selected Address Card Summary */}
            {selectedAddress && !showAddressList ? (
              <div className="p-4 bg-gray-50 dark:bg-slate-750/30 rounded-xl border dark:border-slate-700 text-xs sm:text-sm text-gray-600 dark:text-slate-355 space-y-1 relative">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-gray-900 dark:text-white">{selectedAddress.fullName}</span>
                  <span className="bg-brand-50 text-brand-650 dark:bg-slate-700 dark:text-brand-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {selectedAddress.type}
                  </span>
                </div>
                <p>{selectedAddress.house}, {selectedAddress.street}</p>
                {selectedAddress.landmark && <p>Landmark: {selectedAddress.landmark}</p>}
                {selectedAddress.area && <p>Area: {selectedAddress.area}</p>}
                <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                {selectedAddress.latitude && (
                  <p className="text-[10px] text-gray-400 font-semibold">
                    Coordinates: {selectedAddress.latitude.toFixed(5)}, {selectedAddress.longitude.toFixed(5)}
                  </p>
                )}
                <p className="font-bold flex items-center pt-1 text-gray-800 dark:text-slate-300">
                  Phone: {selectedAddress.phone}
                </p>
                <button
                  onClick={() => handleStartEdit(selectedAddress)}
                  className="absolute bottom-4 right-4 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-gray-600 dark:text-slate-300 transition-all"
                  title="Edit Address"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              // Address Selector
              <div className="space-y-4 pt-2">
                {addresses.length === 0 ? (
                  <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 text-xs sm:text-sm rounded-lg">
                    No delivery addresses found in your Address Book. Please create one below.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => {
                          setSelectedAddress(addr);
                          setShowAddressList(false);
                        }}
                        className={`p-4 rounded-xl border cursor-pointer hover:bg-gray-50/50 dark:hover:bg-slate-750/50 transition-all relative group ${
                          selectedAddress?._id === addr._id
                            ? 'border-brand-500 bg-brand-500/[0.01]'
                            : 'border-gray-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1 text-xs font-bold text-gray-900 dark:text-white">
                          <span>{addr.fullName}</span>
                          <span className="uppercase text-[9px] bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-gray-500">
                            {addr.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-2">
                          {addr.house}, {addr.street}, {addr.city}, {addr.state}
                        </p>
                        <p className="text-[11px] font-bold text-gray-700 dark:text-slate-300 mt-1">Phone: {addr.phone}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(addr);
                          }}
                          className="absolute bottom-2.5 right-2.5 p-1 rounded bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 text-gray-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add / Edit Form Toggle Button */}
                {!showAddForm ? (
                  <button
                    onClick={() => {
                      clearForm();
                      setShowAddForm(true);
                    }}
                    className="inline-flex items-center text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add a new address during checkout
                  </button>
                ) : (
                  <form onSubmit={handleSaveAddress} className="p-4 border border-dashed border-gray-250 dark:border-slate-700 rounded-xl space-y-4">
                    <h3 className="font-bold text-xs">{editingAddressId ? 'Edit Address' : 'Add New Shipping Address'}</h3>
                    
                    {/* Geolocation Button */}
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={locating}
                      className="w-full py-2.5 px-4 bg-brand-50 hover:bg-brand-100 dark:bg-slate-750 dark:hover:bg-slate-700 text-brand-650 dark:text-brand-400 rounded-xl font-bold flex items-center justify-center border border-brand-200 dark:border-slate-700 transition-all text-xs"
                    >
                      {locating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-brand-500 mr-2"></div>
                      ) : (
                        <MapPin className="w-4 h-4 mr-2" />
                      )}
                      Use Current Location
                    </button>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-gray-500 mb-1">Contact Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-gray-500 mb-1">Mobile Number *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">House / Flat *</label>
                        <input
                          type="text"
                          required
                          value={house}
                          onChange={(e) => setHouse(e.target.value)}
                          placeholder="102 block B"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">Street Address *</label>
                        <input
                          type="text"
                          required
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="Main Avenue"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">Area / Suburb</label>
                        <input
                          type="text"
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          placeholder="Indiranagar"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">Landmark</label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="Near metro station"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">State *</label>
                        <input
                          type="text"
                          required
                          value={stateVal}
                          onChange={(e) => setStateVal(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">PIN Code *</label>
                        <input
                          type="text"
                          required
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="560001"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1">Address Type</label>
                        <select
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none cursor-pointer text-gray-900 dark:text-white"
                        >
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Hostel">Hostel</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    {latitude && (
                      <div className="text-[10px] text-gray-400 font-semibold text-left">
                        Acquired coordinates: {latitude.toFixed(5)}, {longitude.toFixed(5)}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button type="submit" className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold">
                        {editingAddressId ? 'Update Address' : 'Save Address'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(false);
                          clearForm();
                        }}
                        className="px-4 py-1.5 bg-gray-100 dark:bg-slate-750 text-gray-700 dark:text-slate-300 rounded-lg font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Delivery Option */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <Truck className="w-5 h-5 mr-2 text-brand-500" />
              2. Delivery Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setDeliveryMethod('Standard')}
                className={`p-4 rounded-xl border cursor-pointer text-left flex justify-between items-center transition-all ${
                  deliveryMethod === 'Standard'
                    ? 'border-brand-500 bg-brand-500/[0.01]'
                    : 'border-gray-200 dark:border-slate-700'
                }`}
              >
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Standard Delivery</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Delivered in 3-5 business days</p>
                  <p className="text-xs font-bold text-emerald-500 mt-1">
                    {subtotal >= 4000 ? 'FREE Shipping' : '₹199.00 Delivery Fee'}
                  </p>
                </div>
                {deliveryMethod === 'Standard' && (
                  <span className="p-1 rounded-full bg-brand-600 text-white shadow-sm flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div
                onClick={() => setDeliveryMethod('Express')}
                className={`p-4 rounded-xl border cursor-pointer text-left flex justify-between items-center transition-all ${
                  deliveryMethod === 'Express'
                    ? 'border-brand-500 bg-brand-500/[0.01]'
                    : 'border-gray-200 dark:border-slate-700'
                }`}
              >
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Express Delivery</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Delivered in 1-2 business days</p>
                  <p className="text-xs font-bold text-brand-650 dark:text-brand-400 mt-1">
                    ₹499.00 Shipping Fee
                  </p>
                </div>
                {deliveryMethod === 'Express' && (
                  <span className="p-1 rounded-full bg-brand-600 text-white shadow-sm flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method Selection */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-brand-500" />
              3. Payment Option
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet', 'Cash on Delivery'].map((method) => {
                const isSelected = paymentMethod === method;
                return (
                  <div
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-3 rounded-xl border cursor-pointer text-center flex flex-col justify-between items-center space-y-1.5 transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-500/[0.01]'
                        : 'border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-800 dark:text-slate-205">{method}</span>
                    <span className={`text-[10px] uppercase font-bold py-0.5 px-1.5 rounded ${
                      method === 'Cash on Delivery' 
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/20' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950/20'
                    }`}>
                      {method === 'Cash on Delivery' ? 'Offline' : 'Razorpay'}
                    </span>
                  </div>
                );
              })}
            </div>

            {paymentMethod !== 'Cash on Delivery' && (
              <div className="pt-4 border-t border-gray-100 dark:border-slate-700/40">
                <div className="p-4 bg-gray-50 dark:bg-slate-750 border border-gray-100 dark:border-slate-700 rounded-2xl flex items-start space-x-3 text-xs text-gray-500 dark:text-slate-400">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>
                    <strong>Razorpay Test Mode</strong> is enabled. Payments will trigger standard mock verification overlays. Choose "Success" inside the popup to simulate a paid order.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Place button */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-6 col-span-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-slate-700/40">
            Order Summary
          </h3>

          {/* Items Drawer */}
          <div className="max-h-48 overflow-y-auto space-y-3">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between items-center text-xs sm:text-sm">
                <div className="flex items-center space-x-2 text-left">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-8 h-8 object-cover rounded bg-gray-50 border dark:border-slate-700"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{item.product.name}</h4>
                    <span className="text-[10px] text-gray-400">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-gray-800 dark:text-slate-200">
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Fees Summary */}
          <div className="space-y-3 text-xs sm:text-sm font-semibold border-t border-gray-100 dark:border-slate-700/40 pt-4">
            <div className="flex justify-between text-gray-500 dark:text-slate-400">
              <span>Items Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-slate-400 text-left">
              <span>
                Shipping ({deliveryMethod})
              </span>
              <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold border-t border-gray-150 dark:border-slate-700/40 pt-3 text-gray-900 dark:text-white">
              <span>Order Total</span>
              <span className="text-brand-650 dark:text-brand-400">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Final warnings */}
          {!selectedAddress && (
            <div className="p-3 bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-450 border-l-4 border-rose-500 rounded-xl text-[11px] font-semibold flex items-start space-x-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Please add or select a shipping address before completing order placement.</span>
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={loading || !selectedAddress}
            className="w-full flex items-center justify-center py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md shadow-brand-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5 mr-2" />
                Place Your Order
              </>
            )}
          </button>
        </div>
      </div>

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

export default Checkout;
