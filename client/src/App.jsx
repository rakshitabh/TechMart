import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import CustomerLayout from './components/CustomerLayout';
import AdminLayout from './components/AdminLayout';
import CustomerRoute from './components/CustomerRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import Profile from './pages/Profile';
import VerifyOTP from './pages/VerifyOTP';
import CompleteProfile from './pages/CompleteProfile';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminInventory from './pages/AdminInventory';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';

import ErrorBoundary from './components/ErrorBoundary';
import OfflineBanner from './components/OfflineBanner';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <Routes>
                  {/* Public and Customer routes wrapped in CustomerLayout */}
                  <Route element={<CustomerLayout />}>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />
                    <Route path="/complete-profile" element={<CompleteProfile />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/403" element={<Forbidden />} />
                    <Route path="/404" element={<NotFound />} />

                    {/* Customer-only protected routes */}
                    <Route element={<CustomerRoute />}>
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/orders" element={<OrderHistory />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                    </Route>
                  </Route>

                  {/* Admin-only protected routes wrapped in AdminLayout */}
                  <Route element={<AdminRoute />}>
                    <Route element={<AdminLayout />}>
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/admin/products" element={<AdminProducts />} />
                      <Route path="/admin/products/new" element={<AdminProducts />} />
                      <Route path="/admin/add-product" element={<AdminProducts />} />
                      <Route path="/admin/orders" element={<AdminOrders />} />
                      <Route path="/admin/users" element={<AdminUsers />} />
                      <Route path="/admin/inventory" element={<AdminInventory />} />
                      <Route path="/admin/analytics" element={<AdminAnalytics />} />
                      <Route path="/admin/settings" element={<AdminSettings />} />
                    </Route>
                  </Route>

                  {/* Catch-all 404 */}
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
                <OfflineBanner />
              </Router>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
