import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ShoppingBag, ArrowRight, Phone, Eye, EyeOff, Check, X } from 'lucide-react';
import api from '../services/api';
import Toast from '../components/Toast';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const { user, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Registration Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Status Fields
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  // Password validation properties tracked internally
  const [passChecks, setPassChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const redirect = new URLSearchParams(location.search).get('redirect') || location.state?.from || '/home';

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirect && redirect !== '/' && !redirect.startsWith('/admin') ? redirect : '/home');
      }
    }
  }, [user, navigate, redirect]);

  const showToast = (message, type) => setToast({ message, type });

  // Update password strength criteria silently on input change
  useEffect(() => {
    setPassChecks({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@$!%*?&#]/.test(password),
    });
  }, [password]);

  const isPasswordStrong = () => {
    return Object.values(passChecks).every(Boolean);
  };

  // Google OAuth Success
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const data = await loginWithGoogle(credentialResponse.credential);
      showToast('Google login successful!', 'success');
      setTimeout(() => {
        if (!data.phone) {
          navigate('/complete-profile', { state: { from: redirect } });
        } else if (data.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate(redirect && redirect !== '/' && !redirect.startsWith('/admin') ? redirect : '/home');
        }
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Google signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In failed. Please try again.');
  };

  const validateEmail = (input) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(input);
  };

  const validatePhone = (input) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(input);
  };

  // Submit Password Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all registration fields');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!termsAccepted) {
      setError('Please review and accept the Terms & Conditions to proceed');
      return;
    }
    if (!isPasswordStrong()) {
      setError('Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, phone, password);
      showToast('Registration successful! Check your email for OTP.', 'success');
      setTimeout(() => {
        navigate(`/verify-otp?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirect)}`);
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  // Helper text dynamically shown if password has been typed but is not strong enough
  const getPasswordWarning = () => {
    if (!password) return null;
    const missing = [];
    if (!passChecks.length) missing.push('8+ characters');
    if (!passChecks.uppercase) missing.push('uppercase letter');
    if (!passChecks.lowercase) missing.push('lowercase letter');
    if (!passChecks.number) missing.push('number');
    if (!passChecks.special) missing.push('special character');

    if (missing.length > 0) {
      return `Password needs: ${missing.join(', ')}`;
    }
    return null;
  };

  const passwordWarning = getPasswordWarning();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden text-left">
      {/* Background Glow */}
      <div className="glow-bg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20"></div>

      <div className="max-w-md w-full space-y-7 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto bg-brand-600 text-white p-3 rounded-2xl w-fit flex items-center justify-center shadow-lg shadow-brand-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Sign up to get access to custom discounts and checkouts
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 dark:bg-rose-950/20 dark:text-rose-450 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-gray-750 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="John Doe"
                className="pl-9 block w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-750 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="name@domain.com"
                className="pl-9 block w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-gray-750 dark:text-slate-300 mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError('');
                }}
                placeholder="9876543210"
                className="pl-9 block w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-gray-750 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                className="pl-9 pr-9 block w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-650"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordWarning && (
              <p className="mt-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 animate-pulse text-left">
                {passwordWarning}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-755 dark:text-slate-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                className="pl-9 pr-9 block w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-650"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start pt-1">
            <input
              id="termsAccepted"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 text-brand-650 focus:ring-brand-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="termsAccepted" className="ml-2 block text-xs font-medium text-gray-600 dark:text-slate-350 cursor-pointer select-none leading-relaxed text-left">
              I agree to the{' '}
              <span className="font-bold text-brand-600 dark:text-brand-400 hover:underline">Terms of Service</span> and{' '}
              <span className="font-bold text-brand-600 dark:text-brand-400 hover:underline">Privacy Policy</span>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Google OAuth Section */}
        <div className="flex flex-col items-center pt-4 border-t border-gray-150 dark:border-slate-700/50">
          <span className="text-xs font-semibold text-gray-450 dark:text-slate-400 uppercase tracking-widest mb-3">Or continue with</span>
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>
        </div>

        {/* Footer Redirect */}
        <div className="text-center pt-1">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              to={redirect === '/home' || redirect === '/' ? '/login' : `/login?redirect=${encodeURIComponent(redirect)}`}
              className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Sign In Here
            </Link>
          </p>
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

export default Register;
