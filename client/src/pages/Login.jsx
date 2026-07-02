import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ShoppingBag, ArrowRight, Eye, EyeOff, Smartphone } from 'lucide-react';
import Toast from '../components/Toast';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const { user, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Login Input Fields
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Status Fields
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  // Redirect calculation: query param -> router state -> default home
  const redirect = new URLSearchParams(location.search).get('redirect') || location.state?.from || '/home';

  // Prefill remembered user details
  useEffect(() => {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
      setEmailOrPhone(remembered);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    // If user is already logged in, redirect them
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirect && redirect !== '/' && !redirect.startsWith('/admin') ? redirect : '/home');
      }
    }
  }, [user, navigate, redirect]);

  const showToast = (message, type) => setToast({ message, type });

  // Handle Google OAuth
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const data = await loginWithGoogle(credentialResponse.credential);
      showToast('Google Sign-In successful!', 'success');
      setTimeout(() => {
        if (!data.phone) {
          // New Google account without a mobile number gets prompted once
          navigate('/complete-profile', { state: { from: redirect } });
        } else if (data.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate(redirect && redirect !== '/' && !redirect.startsWith('/admin') ? redirect : '/home');
        }
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Google Login failed');
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

  // Submit Credentials Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      setError('Please fill in all email and password fields');
      return;
    }

    const isValidEmail = validateEmail(emailOrPhone);
    const isValidPhone = validatePhone(emailOrPhone);

    if (!isValidEmail && !isValidPhone) {
      setError('Please enter a valid email address or 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Remember Me state management
      if (rememberMe) {
        localStorage.setItem('rememberedUser', emailOrPhone);
      } else {
        localStorage.removeItem('rememberedUser');
      }

      const data = await login(emailOrPhone, password);
      showToast('Login successful!', 'success');
      setTimeout(() => {
        if (data.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate(redirect && redirect !== '/' && !redirect.startsWith('/admin') ? redirect : '/home');
        }
      }, 500);
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.isVerified === false) {
        showToast('Account verification pending. Redirecting...', 'warning');
        setTimeout(() => {
          navigate(`/verify-otp?email=${encodeURIComponent(emailOrPhone)}&redirect=${encodeURIComponent(redirect)}`);
        }, 1200);
      } else {
        setError(err.response?.data?.message || 'Invalid credentials. Please verify details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden text-left">
      {/* Background Glow */}
      <div className="glow-bg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20"></div>

      <div className="max-w-md w-full space-y-7 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto bg-brand-600 text-white p-3 rounded-2xl w-fit flex items-center justify-center shadow-lg shadow-brand-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Sign in to access your premium workspace
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 dark:bg-rose-950/20 dark:text-rose-450 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        {/* Unified Login Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="emailOrPhone" className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
              Email Address or Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                {emailOrPhone && !isNaN(emailOrPhone.charAt(0)) ? (
                  <Smartphone className="w-5 h-5" />
                ) : (
                  <Mail className="w-5 h-5" />
                )}
              </div>
              <input
                id="emailOrPhone"
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => {
                  setEmailOrPhone(e.target.value);
                  if (error) setError('');
                }}
                placeholder="name@domain.com or 9876543210"
                className="pl-11 block w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                Password
              </label>
              <Link
                to={`/forgot-password?redirect=${encodeURIComponent(redirect)}`}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
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
                className="pl-11 pr-11 block w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-650"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Box */}
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4.5 w-4.5 text-brand-650 focus:ring-brand-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-xs font-semibold text-gray-700 dark:text-slate-300 cursor-pointer select-none">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            ) : (
              <>
                Sign In
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
            New to TechMart?{' '}
            <Link
              to={redirect === '/home' || redirect === '/' ? '/register' : `/register?redirect=${encodeURIComponent(redirect)}`}
              className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Create Account
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

export default Login;
