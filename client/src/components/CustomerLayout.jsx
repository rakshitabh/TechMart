import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

const CustomerLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && !user.phone) {
      if (location.pathname !== '/complete-profile') {
        navigate('/complete-profile');
      }
    }
  }, [user, loading, location.pathname, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-darkBg dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
