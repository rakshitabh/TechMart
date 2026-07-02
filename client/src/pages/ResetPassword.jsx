import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';
import { Lock, Eye, EyeOff, KeyRound, ShoppingBag, ArrowRight, Check, X } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Route query params (Email flow)
  const queryParams = new URLSearchParams(location.search);
  const emailParam = queryParams.get('email') || '';
  const tokenParam = queryParams.get('token') || '';

  // Route state & query params (Mobile flow)
  const phoneParam = queryParams.get('phone') || '';
  const stateOtp = location.state?.otp || '';

  // Unified States
  const [identifier, setIdentifier] = useState(''); // Email or Phone number
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailMode, setIsEmailMode] = useState(true);

  // Status Fields
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  // Password checks tracked internally
  const [passChecks, setPassChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const showToast = (message, type) => setToast({ message, type });

  useEffect(() => {
    if (emailParam) {
      setIdentifier(emailParam);
      setToken(tokenParam);
      setIsEmailMode(true);
    } else if (phoneParam) {
      setIdentifier(phoneParam);
      setToken(stateOtp);
      setIsEmailMode(false);
    } else {
      // Direct access fallback
      setIsEmailMode(true);
    }
  }, [emailParam, tokenParam, phoneParam, stateOtp]);

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

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier || !token || !password || !confirmPassword) {
      setError('Please fill in all verification and password fields');
      return;
    }
    if (token.length !== 6 || isNaN(token)) {
      setError('Verification code (OTP) must be exactly 6 numeric digits');
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
      await api.post('/api/auth/reset-password', {
        emailOrPhone: identifier,
        token,
        newPassword: password,
      });

      showToast('Password updated successfully!', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please check your verification code.');
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
            Set New Password
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Complete verification to update your credentials
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 dark:bg-rose-950/20 dark:text-rose-455 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleResetSubmit}>
          {/* Target Identifier (Email / Phone) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
              {isEmailMode ? 'Email Address' : 'Mobile Number'}
            </label>
            <input
              type="text"
              disabled
              value={identifier}
              className="block w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-750 text-sm text-gray-500 select-none cursor-not-allowed"
            />
          </div>

          {/* Verification Code input */}
          <div>
            <label htmlFor="token" className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
              6-Digit Verification Code (OTP)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="token"
                type="text"
                maxLength={6}
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="123456"
                className="pl-9 block w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm text-gray-900 dark:text-white tracking-widest text-center font-extrabold"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-gray-750 dark:text-slate-300 mb-1">
              New Password
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
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-750 dark:text-slate-300 mb-1">
              Confirm New Password
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
                onChange={(e) => setConfirmPassword(e.target.value)}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            ) : (
              <>
                Update Password
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Redirect back to Login link */}
        <div className="text-center pt-1">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Remember your credentials?{' '}
            <Link
              to="/login"
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

export default ResetPassword;
