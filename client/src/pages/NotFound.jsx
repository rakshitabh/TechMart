import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden text-center">
      {/* Background Glow */}
      <div className="glow-bg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20"></div>

      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700/60 shadow-2xl relative z-10 space-y-6">
        <div className="mx-auto bg-brand-500/10 text-brand-600 dark:text-brand-400 p-4 rounded-2xl w-fit flex items-center justify-center">
          <Compass className="w-12 h-12 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-300">
            404
          </h1>
          <h2 className="text-xl font-bold text-gray-905 dark:text-white">Page Not Found</h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xs mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <Link
          to="/home"
          className="w-full inline-flex items-center justify-center py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md shadow-brand-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
