import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, Sun, Moon, Shield } from 'lucide-react';

const AdminHeader = ({ setIsOpen }) => {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const getPageTitle = () => {
    const fullPath = location.pathname + location.search;
    if (fullPath.includes('/admin/products?add=true')) return 'Add New Product';
    if (location.pathname === '/admin/dashboard') return 'Dashboard Overview';
    if (location.pathname === '/admin/products') return 'Manage Products';
    if (location.pathname === '/admin/orders') return 'Customer Orders';
    if (location.pathname === '/admin/users') return 'Manage Users';
    if (location.pathname === '/admin/inventory') return 'Inventory Control';
    if (location.pathname === '/admin/analytics') return 'Analytics & Insights';
    if (location.pathname === '/admin/settings') return 'Global Configurations';
    return 'Admin Management';
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white dark:bg-slate-800 border-b border-gray-150 dark:border-slate-700/50 backdrop-blur-md bg-white/90 dark:bg-slate-800/90 transition-all duration-200">
      {/* Left side: Hamburger (mobile) + Page Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-700/50 md:hidden transition-colors"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl font-display truncate">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right side: Dark Mode + Admin Details */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-150 dark:text-slate-400 dark:hover:bg-slate-700/50 transition-colors"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

        {/* User Card */}
        {user && (
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                {user.name}
              </p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-750 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-150 dark:border-indigo-900/50 mt-0.5">
                <Shield className="w-2.5 h-2.5 mr-1" /> Admin
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-550 dark:from-brand-500 dark:to-indigo-400 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-brand-500/10">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
