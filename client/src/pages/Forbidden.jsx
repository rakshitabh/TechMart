import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, LayoutDashboard, Home } from 'lucide-react';

const Forbidden = () => {
  const { user } = useAuth();

  const getBackLink = () => {
    if (!user) return { path: '/login', label: 'Go to Sign In', icon: <ArrowLeft className="w-5 h-5 mr-2" /> };
    if (user.role === 'admin') return { path: '/admin/dashboard', label: 'Back to Admin Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-2" /> };
    return { path: '/home', label: 'Back to TechMart Home', icon: <Home className="w-5 h-5 mr-2" /> };
  };

  const backLink = getBackLink();

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden text-center bg-gray-50 dark:bg-darkBg text-gray-900 dark:text-gray-150 transition-colors duration-200">
      {/* Background Glow */}
      <div className="glow-bg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20"></div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        <h1 className="text-9xl font-black tracking-widest text-rose-500 dark:text-rose-450 font-display">
          403
        </h1>
        <div className="bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20 text-rose-600 dark:text-rose-400 w-fit mx-auto flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" /> Access Forbidden
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-snug">
          Restricted Workstation
        </h2>
        <p className="text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
          You do not have the security clearances required to operate this workspace. Please contact your system administrator if you believe this is an error.
        </p>

        <div className="pt-6">
          <Link
            to={backLink.path}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5"
          >
            {backLink.icon}
            {backLink.label}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
