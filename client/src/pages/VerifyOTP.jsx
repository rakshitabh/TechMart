import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Toast from '../components/Toast';
import { KeyRound, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

const VerifyOTP = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60); // Resend cooldown timer

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const redirect = new URLSearchParams(location.search).get('redirect') || location.state?.from || '/';

  const showToast = (message, type) => setToast({ message, type });

  useEffect(() => {
    const queryEmail = new URLSearchParams(location.search).get('email');
    if (!queryEmail) {
      navigate('/login');
    } else {
      setEmail(queryEmail);
    }
  }, [location, navigate]);

  // Resend countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Keep last char
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace: clear current and shift back
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs[index - 1].current.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (pasteData.length === 6 && !isNaN(pasteData)) {
      const pasteArray = pasteData.split('');
      setOtp(pasteArray);
      inputRefs[5].current.focus();
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    setResendLoading(true);
    setError('');
    try {
      await api.post('/api/auth/resend-otp', { email });
      showToast('Verification code resent successfully!', 'success');
      setTimeLeft(60); // Reset cooldown
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/verify-otp', { email, otp: code });
      showToast('Account verified successfully!', 'success');
      
      // Update Auth session and store JWT
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));

      setTimeout(() => {
        if (data.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate(redirect && redirect !== '/' && !redirect.startsWith('/admin') ? redirect : '/home');
        }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="glow-bg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20"></div>

      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-2xl relative z-10 text-left">
        <div className="text-center space-y-2">
          <div className="mx-auto bg-brand-600 text-white p-3 rounded-2xl w-fit flex items-center justify-center shadow-lg shadow-brand-500/20">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Email Verification
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Enter the 6-digit OTP code sent to <strong className="text-gray-705 dark:text-slate-300">{email}</strong>
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Digit Input Boxes */}
          <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-extrabold border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            ) : (
              'Verify Account'
            )}
          </button>
        </form>

        {/* Resend Cooldown Section */}
        <div className="text-center pt-2 flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-500 dark:text-slate-450">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={timeLeft > 0 || resendLoading}
            className="inline-flex items-center text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline disabled:text-gray-400 disabled:no-underline disabled:opacity-50"
          >
            {resendLoading ? (
              <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
            ) : timeLeft > 0 ? (
              `Resend code in ${timeLeft}s`
            ) : (
              'Resend Code'
            )}
          </button>
          <Link
            to="/login"
            className="text-xs font-bold text-gray-500 hover:text-brand-600 hover:underline pt-4 block"
          >
            ← Back to Login
          </Link>
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

export default VerifyOTP;
