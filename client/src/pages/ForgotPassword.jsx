import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';
import { Smartphone, Mail, ArrowRight, ShoppingBag } from 'lucide-react';

const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [toast, setToast] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/home';

  const showToast = (message, type) => setToast({ message, type });

  const validateEmail = (input) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(input);
  };

  const validatePhone = (input) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!emailOrPhone) {
      setError('Please enter your email address or mobile number');
      return;
    }

    const isEmail = emailOrPhone.includes('@');
    if (isEmail && !validateEmail(emailOrPhone)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!isEmail && !validatePhone(emailOrPhone)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/forgot-password', { emailOrPhone });

      if (isEmail) {
        setSuccessMsg(data.message || 'Password reset link has been dispatched to your email.');
        // Show simulated token in dev mode
        if (data.otp) {
          showToast(`[Dev Mode] Generated Reset OTP: ${data.otp}`, 'info');
        }
      } else {
        showToast('OTP code sent successfully!', 'success');
        // Mobile resets redirect immediately to input the code
        setTimeout(() => {
          navigate(`/reset-password?phone=${encodeURIComponent(data.phone)}&redirect=${encodeURIComponent(redirect)}`, {
            state: { otp: data.otp } // Pass verification code in state for easy autofill in dev
          });
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset. Please try again.');
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
            Forgot Password
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Enter your credentials below to recover your account
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 dark:bg-rose-950/20 dark:text-rose-450 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 rounded-lg text-sm font-medium">
            {successMsg}
          </div>
        )}

        {!successMsg && (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="emailOrPhone" className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                Email Address or 10-Digit Mobile Number
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
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="name@domain.com or 9876543210"
                  className="pl-11 block w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm text-gray-900 dark:text-white"
                />
              </div>
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
                  Request Reset
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Redirect */}
        <div className="text-center pt-1">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Back to{' '}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Sign In Page
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

export default ForgotPassword;
