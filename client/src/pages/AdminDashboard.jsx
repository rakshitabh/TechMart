import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  PackageCheck,
  UserCheck,
  Shield,
  Trash2,
  ListOrdered
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => setToast({ message, type });

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/api/orders/admin/stats'),
        api.get('/api/users'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      showToast('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleToggle = async (userId) => {
    try {
      const { data } = await api.put(`/api/users/${userId}/role`);
      showToast(data.message, 'success');
      fetchData(); // Reload
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update user role', 'error');
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const { data } = await api.delete(`/api/users/${userId}`);
      showToast(data.message, 'success');
      fetchData(); // Reload
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkBg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-emerald-500',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'bg-brand-500',
    },
    {
      title: 'Total Users',
      value: users.length,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-indigo-500',
    },
    {
      title: 'Pending Orders',
      value: stats?.statusCounts?.Pending || 0,
      icon: <PackageCheck className="w-6 h-6" />,
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-10">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Admin Dashboard</h1>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.title}</span>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{card.value}</p>
            </div>
            <div className={`p-3 text-white rounded-xl ${card.color}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Manage Users Panel (Col-span-2) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <UserCheck className="w-5 h-5 mr-2 text-brand-500" /> Manage Users
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-slate-400">
              <thead className="text-xs text-gray-400 uppercase bg-gray-50 dark:bg-slate-700/40">
                <tr>
                  <th scope="col" className="px-4 py-3">Name</th>
                  <th scope="col" className="px-4 py-3">Email</th>
                  <th scope="col" className="px-4 py-3">Role</th>
                  <th scope="col" className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700/40">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-750/30">
                    <td className="px-4 py-3.5 font-bold text-gray-900 dark:text-white whitespace-nowrap">{u.name}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">{u.email}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400'
                          : 'bg-gray-150 text-gray-800 dark:bg-slate-700 dark:text-slate-350'
                      }`}>
                        {u.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleRoleToggle(u._id)}
                        className="text-xs font-bold text-brand-600 hover:text-brand-500 underline"
                      >
                        Toggle Role
                      </button>
                      <button
                        onClick={() => handleUserDelete(u._id)}
                        className="text-rose-500 hover:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-1.5 rounded-lg transition-all inline-block"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders Panel */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <ListOrdered className="w-5 h-5 mr-2 text-brand-500" /> Recent Sales
          </h2>

          {stats?.recentOrders?.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No recent sales records.</p>
          ) : (
            <div className="space-y-4">
              {stats?.recentOrders?.map((order) => (
                <div key={order._id} className="text-sm border-b border-gray-50 dark:border-slate-700/40 pb-3 last:border-0 last:pb-0 flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white truncate max-w-[120px]">
                      {order.user?.name || 'Guest User'}
                    </p>
                    <span className="text-[10px] text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-brand-600 dark:text-brand-400">₹{order.totalPrice.toFixed(2)}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default AdminDashboard;
