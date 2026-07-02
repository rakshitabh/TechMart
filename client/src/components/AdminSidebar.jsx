import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Boxes,
  TrendingUp,
  Settings,
  LogOut,
  X
} from 'lucide-react';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();



  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeClass = "bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/10";
  const inactiveClass = "bg-transparent text-gray-650 dark:text-slate-300 hover:bg-gray-100/50 dark:hover:bg-slate-700/40 rounded-xl";

  const getSidebarLinkClass = (path, exact = false) => {
    let active = false;
    if (exact) {
      active = location.pathname === path;
    } else {
      active = location.pathname.startsWith(path);
    }
    return `flex items-center space-x-3 px-4.5 py-3 text-sm font-semibold transition-all duration-200 ${
      active ? activeClass : inactiveClass
    }`;
  };



  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-gray-900/40 dark:bg-slate-950/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-gray-150 dark:border-slate-700/60 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 dark:border-slate-700/50">
          <Link to="/admin/dashboard" className="flex items-center space-x-2.5" onClick={() => setIsOpen(false)}>
            <div className="bg-brand-600 p-2 rounded-lg text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight font-display bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-300">
              TechMart Admin
            </span>
          </Link>
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-700/50 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {/* Dashboard Link */}
          <Link
            to="/admin/dashboard"
            onClick={() => setIsOpen(false)}
            className={getSidebarLinkClass('/admin/dashboard', true)}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          {/* Products Link */}
          <Link
            to="/admin/products"
            onClick={() => setIsOpen(false)}
            className={getSidebarLinkClass('/admin/products')}
          >
            <Package className="w-5 h-5" />
            <span>Products</span>
          </Link>

          {/* Orders Link */}
          <Link
            to="/admin/orders"
            onClick={() => setIsOpen(false)}
            className={getSidebarLinkClass('/admin/orders')}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Orders</span>
          </Link>

          {/* Users Link */}
          <Link
            to="/admin/users"
            onClick={() => setIsOpen(false)}
            className={getSidebarLinkClass('/admin/users')}
          >
            <Users className="w-5 h-5" />
            <span>Users</span>
          </Link>

          {/* Inventory Link */}
          <Link
            to="/admin/inventory"
            onClick={() => setIsOpen(false)}
            className={getSidebarLinkClass('/admin/inventory')}
          >
            <Boxes className="w-5 h-5" />
            <span>Inventory</span>
          </Link>

          {/* Analytics Link */}
          <Link
            to="/admin/analytics"
            onClick={() => setIsOpen(false)}
            className={getSidebarLinkClass('/admin/analytics')}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Analytics</span>
          </Link>

          {/* Settings Link */}
          <Link
            to="/admin/settings"
            onClick={() => setIsOpen(false)}
            className={getSidebarLinkClass('/admin/settings')}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-700/50">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-455 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 text-rose-500" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
