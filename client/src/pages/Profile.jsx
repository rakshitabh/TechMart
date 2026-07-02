import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Toast from '../components/Toast';
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  MapPin,
  Lock,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle,
  Bell,
  Home,
  Briefcase,
  BookOpen,
  HelpCircle,
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Active Settings Tab: 'account', 'addresses', 'security', 'notifications'
  const [activeTab, setActiveTab] = useState('account');

  // Account Information State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Password Update State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Address Book State
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Address Form Fields
  const [fullName, setFullName] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [house, setHouse] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [country, setCountry] = useState('India');
  const [pincode, setPincode] = useState('');
  const [type, setType] = useState('Home');
  const [isDefault, setIsDefault] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // General Page State
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const showToast = (message, type) => setToast({ message, type });

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Load addresses when address tab is active
  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const { data } = await api.get('/api/addresses');
      setAddresses(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load address book', 'error');
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [activeTab]);

  // Handle Account Details Form Submit
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      showToast('Name, Email, and Mobile Number are required', 'error');
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ name, email, phone });
      showToast('Profile credentials saved successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error updating profile details', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Update Form Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      showToast('Both password fields are required', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      showToast('Password must be at least 8 characters, with 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.', 'error');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ name, email, password });
      showToast('Password updated successfully!', 'success');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Geolocation & Reverse Geocoding with OpenCage
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
            if (!addressPhone && user?.phone) setAddressPhone(user.phone);
            showToast('Location resolved! Please verify and fill in any missing fields manually.', 'success');
          } else {
            showToast('Unable to resolve address from coordinates.', 'warning');
          }
        } catch (err) {
          console.error(err);
          showToast('Failed to contact reverse geocoding service.', 'error');
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          showToast('Location permission denied. Please enter your address manually.', 'error');
        } else {
          showToast('Failed to retrieve location details.', 'error');
        }
      }
    );
  };

  // Address CRUD Handlers
  const handleOpenAddressAdd = () => {
    setEditingAddress(null);
    setFullName(user.name || '');
    setAddressPhone(user.phone || '');
    setHouse('');
    setStreet('');
    setLandmark('');
    setArea('');
    setCity('');
    setStateVal('');
    setCountry('India');
    setPincode('');
    setType('Home');
    setLatitude(null);
    setLongitude(null);
    setIsDefault(false);
    setShowAddressForm(true);
  };

  const handleOpenAddressEdit = (addr) => {
    setEditingAddress(addr);
    setFullName(addr.fullName || '');
    setAddressPhone(addr.phone || '');
    setHouse(addr.house || '');
    setStreet(addr.street || '');
    setLandmark(addr.landmark || '');
    setArea(addr.area || '');
    setCity(addr.city || '');
    setStateVal(addr.state || '');
    setCountry(addr.country || 'India');
    setPincode(addr.pincode || '');
    setType(addr.type || 'Home');
    setLatitude(addr.latitude || null);
    setLongitude(addr.longitude || null);
    setIsDefault(addr.isDefault || false);
    setShowAddressForm(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !addressPhone || !house || !street || !city || !stateVal || !pincode) {
      showToast('Please fill in all required address fields', 'warning');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(addressPhone)) {
      showToast('Please enter a valid 10-digit mobile number for the address contact', 'warning');
      return;
    }

    const pinRegex = /^[0-9]{6}$/;
    if (!pinRegex.test(pincode)) {
      showToast('Please enter a valid 6-digit PIN code', 'warning');
      return;
    }

    const payload = {
      fullName,
      phone: addressPhone,
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
      isDefault,
    };

    setLoading(true);
    try {
      if (editingAddress) {
        await api.put(`/api/addresses/${editingAddress._id}`, payload);
        showToast('Address updated successfully!', 'success');
      } else {
        await api.post('/api/addresses', payload);
        showToast('New address saved to Address Book!', 'success');
      }
      setShowAddressForm(false);
      fetchAddresses();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error processing address', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/api/addresses/${id}`);
      showToast('Address removed successfully', 'success');
      fetchAddresses();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete address', 'error');
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await api.put(`/api/addresses/${id}/default`);
      showToast('Default address updated!', 'success');
      fetchAddresses();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update default address', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE PERMANENTLY') {
      showToast('Please type the exact phrase to verify deletion', 'error');
      return;
    }

    if (!window.confirm('WARNING: Are you absolutely sure you want to delete your account permanently? This cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await api.delete('/api/auth/profile');
      showToast('Account deleted successfully. We are sad to see you go!', 'success');
      // Clean token and redirect
      localStorage.removeItem('userInfo');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (err) {
      showToast(err.response?.data?.message || 'Account deletion failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper mapping address type icons
  const getAddressTypeIcon = (t) => {
    switch (t) {
      case 'Home':
        return <Home className="w-4 h-4 mr-2 text-indigo-500" />;
      case 'Work':
        return <Briefcase className="w-4 h-4 mr-2 text-blue-500" />;
      case 'Hostel':
        return <BookOpen className="w-4 h-4 mr-2 text-amber-500" />;
      default:
        return <HelpCircle className="w-4 h-4 mr-2 text-teal-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      <h1 className="text-3xl font-extrabold text-gray-905 dark:text-white mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Account Sidebar */}
        <div className="space-y-4 col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-5 shadow-sm space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="bg-gradient-to-tr from-brand-600 to-indigo-500 text-white w-14 h-14 rounded-full flex items-center justify-center font-black text-xl shadow-md border-2 border-brand-400 select-none">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{user?.name}</h3>
                <span className="text-xs text-gray-400 capitalize bg-gray-50 dark:bg-slate-700/50 px-2 py-0.5 rounded-md font-semibold border dark:border-slate-700">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-2 shadow-sm flex flex-col">
            <button
              onClick={() => setActiveTab('account')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'account'
                  ? 'bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400'
                  : 'text-gray-555 hover:text-brand-500 dark:text-slate-400'
              }`}
            >
              <UserIcon className="w-5 h-5" />
              <span>Personal Information</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'addresses'
                  ? 'bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400'
                  : 'text-gray-550 hover:text-brand-500 dark:text-slate-400'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span>Saved Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'security'
                  ? 'bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400'
                  : 'text-gray-550 hover:text-brand-500 dark:text-slate-400'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>Account Security</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'notifications'
                  ? 'bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400'
                  : 'text-gray-550 hover:text-brand-500 dark:text-slate-400'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Display Panel */}
        <div className="lg:col-span-3">
          {activeTab === 'account' && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/60 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
                <p className="text-sm text-gray-400 mt-1">Manage your basic contact settings</p>
              </div>

              <form onSubmit={handleAccountSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-350 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="pl-11 block w-full px-3 py-2.5 rounded-xl border border-gray-250 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-gray-905 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-355 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        required
                        disabled={user?.provider === 'google'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="pl-11 block w-full px-3 py-2.5 rounded-xl border border-gray-255 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-gray-900 dark:text-white disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-355 mb-1.5">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Phone className="w-5 h-5" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="pl-11 block w-full px-3 py-2.5 rounded-xl border border-gray-255 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-gray-905 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-fit flex justify-center items-center py-2.5 px-6 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  ) : (
                    <>
                      Save Changes
                      <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/60 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-905 dark:text-white">Saved Delivery Addresses</h2>
                  <p className="text-sm text-gray-400 mt-1">Manage multiple addresses for faster checkouts</p>
                </div>
                {!showAddressForm && (
                  <button
                    onClick={handleOpenAddressAdd}
                    className="inline-flex items-center px-4 py-2 text-xs sm:text-sm font-bold bg-brand-50 hover:bg-brand-100 dark:bg-slate-700 dark:hover:bg-slate-650 text-brand-650 dark:text-brand-400 rounded-xl transition-all"
                  >
                    <Plus className="w-4 h-4 mr-1.5" /> Add Address
                  </button>
                )}
              </div>

              {/* Address Form Card */}
              {showAddressForm && (
                <form
                  onSubmit={handleAddressSubmit}
                  className="p-5 sm:p-6 border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/40 rounded-2xl space-y-5 text-left"
                >
                  <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 pb-2 border-b dark:border-slate-700">
                    {editingAddress ? 'Modify Address' : 'Add Delivery Address'}
                  </h3>

                  {/* Geocoding Button */}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Contact Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-brand-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Mobile Number (Delivery updates) *</label>
                      <input
                        type="tel"
                        required
                        value={addressPhone}
                        onChange={(e) => setAddressPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-brand-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">House / Flat / Building No. *</label>
                      <input
                        type="text"
                        required
                        value={house}
                        onChange={(e) => setHouse(e.target.value)}
                        placeholder="Flat 101, block A"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-brand-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Main street, Area 51"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-brand-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Landmark (Optional)</label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="Near clock tower"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-brand-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Area / Locality</label>
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="Gandhi nagar"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-brand-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Bengaluru"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-brand-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={stateVal}
                        onChange={(e) => setStateVal(e.target.value)}
                        placeholder="Karnataka"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-brand-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">PIN Code *</label>
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="560001"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-brand-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Address Type</label>
                      <div className="flex space-x-2">
                        {['Home', 'Work', 'Hostel', 'Other'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                              type === t
                                ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                                : 'border-gray-200 text-gray-500 dark:border-slate-700 dark:text-slate-400 hover:bg-gray-100/50 dark:hover:bg-slate-755'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-5">
                      <input
                        id="isDefault"
                        type="checkbox"
                        checked={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                        className="h-4.5 w-4.5 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isDefault" className="text-xs font-semibold text-gray-700 dark:text-slate-350 select-none">
                        Set as Default Address
                      </label>
                    </div>
                  </div>

                  {latitude && (
                    <div className="text-[10px] text-gray-400 font-semibold text-left">
                      GPS coordinates: {latitude.toFixed(5)}, {longitude.toFixed(5)}
                    </div>
                  )}

                  <div className="flex space-x-3 pt-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2 text-xs sm:text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md transition-all"
                    >
                      {loading ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-5 py-2 text-xs sm:text-sm font-bold bg-gray-100 hover:bg-gray-200 dark:bg-slate-750 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Address Cards List */}
              {loadingAddresses ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500"></div>
                </div>
              ) : addresses.length === 0 ? (
                <div className="bg-gray-50 dark:bg-slate-800/30 rounded-2xl p-10 text-center border border-dashed dark:border-slate-700">
                  <p className="text-gray-500 text-sm">Your Address Book is empty. Please add a delivery address.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                        addr.isDefault
                          ? 'border-brand-500 bg-brand-500/[0.02] shadow-sm relative'
                          : 'border-gray-250/70 dark:border-slate-700/60'
                      }`}
                    >
                      {addr.isDefault && (
                        <span className="absolute top-4 right-4 bg-brand-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm select-none">
                          Default Address
                        </span>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center text-sm font-bold text-gray-900 dark:text-white">
                          {getAddressTypeIcon(addr.type)}
                          <span className="capitalize">{addr.fullName}</span>
                        </div>

                        <div className="text-xs text-gray-650 dark:text-slate-400 space-y-1">
                          <p>{addr.house}, {addr.street}</p>
                          {addr.landmark && <p>Landmark: {addr.landmark}</p>}
                          {addr.area && <p>Area: {addr.area}</p>}
                          <p>{addr.city}, {addr.state} - <span className="font-semibold">{addr.pincode}</span></p>
                          {addr.latitude && (
                            <p className="text-[10px] text-gray-400 font-semibold">
                              Coordinates: {addr.latitude.toFixed(5)}, {addr.longitude.toFixed(5)}
                            </p>
                          )}
                          <p className="font-bold flex items-center pt-1 text-gray-800 dark:text-slate-300">
                            <Phone className="w-3.5 h-3.5 mr-1" /> {addr.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t dark:border-slate-700/50 pt-4 mt-4 text-xs font-bold">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleOpenAddressEdit(addr)}
                            className="text-gray-500 hover:text-brand-650 flex items-center"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            className="text-rose-500 hover:text-rose-600 flex items-center"
                          >
                            Delete
                          </button>
                        </div>
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(addr._id)}
                            className="text-brand-600 hover:text-brand-700"
                          >
                            Make Default
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/60 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-905 dark:text-white">Account Security</h2>
                <p className="text-sm text-gray-400 mt-1">Configure credentials and delete configurations</p>
              </div>

              {/* Password update form */}
              {user?.provider === 'local' ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-brand-500 text-gray-905 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-brand-500 text-gray-905 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md transition-all disabled:opacity-50"
                  >
                    Change Password
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-gray-500 max-w-lg">
                  Account is linked via Google OAuth. Credential modifications are handled directly through Google Accounts.
                </div>
              )}

              {/* Delete Account */}
              <div className="pt-6 border-t border-gray-100 dark:border-slate-700/50">
                <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-2">Danger Zone: Delete Account</h3>
                <p className="text-xs text-gray-400 dark:text-slate-400 mb-4 max-w-xl">
                  Permanently delete your account and all associated order history, saved addresses, and wishlists. This action is irreversible.
                </p>
                <p className="text-xs font-semibold text-gray-750 dark:text-slate-300 mb-2">
                  To verify, type <span className="font-bold select-all text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-750 px-2 py-0.5 rounded border dark:border-slate-700">DELETE PERMANENTLY</span> below:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="Type confirmation phrase"
                    className="flex-grow px-3 py-2 rounded-xl border border-gray-250 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-rose-500 text-gray-900 dark:text-white font-semibold"
                  />
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmation !== 'DELETE PERMANENTLY'}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/60 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notification Settings</h2>
                <p className="text-sm text-gray-400 mt-1">Configure when and how we reach you</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-850/50 rounded-2xl border dark:border-slate-700/40">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Order Updates</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Receive real-time mobile and email updates on your order status</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500 cursor-pointer" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-850/50 rounded-2xl border dark:border-slate-700/40">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Promotional Emails</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Receive newsletters, flash sales, and special coupon codes</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500 cursor-pointer" />
                </div>
              </div>
            </div>
          )}
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

export default Profile;
