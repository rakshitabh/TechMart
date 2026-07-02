import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';
import {
  Users,
  Shield,
  Trash2,
  UserCheck,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => setToast({ message, type });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching admin users list:', error);
      showToast('Error loading users list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId) => {
    try {
      const { data } = await api.put(`/api/users/${userId}/role`);
      showToast(data.message, 'success');
      fetchUsers(); // Refresh
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update user role', 'error');
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const { data } = await api.delete(`/api/users/${userId}`);
      showToast(data.message, 'success');
      fetchUsers(); // Refresh
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="space-y-1">
          <Link to="/admin/dashboard" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-brand-500 mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
            <Users className="w-8 h-8 mr-3 text-brand-500" /> User Accounts
          </h1>
        </div>
        <div className="bg-brand-50 dark:bg-slate-800 text-brand-700 dark:text-brand-400 px-4 py-2.5 rounded-2xl border border-brand-100 dark:border-slate-700/60 font-semibold text-sm w-fit">
          Total Users Registered: {users.length}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-slate-400">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50 dark:bg-slate-700/40">
              <tr>
                <th scope="col" className="px-6 py-3.5">Name</th>
                <th scope="col" className="px-6 py-3.5">Email Address</th>
                <th scope="col" className="px-6 py-3.5">Role</th>
                <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700/40">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-750/30">
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400'
                        : 'bg-gray-150 text-gray-800 dark:bg-slate-700 dark:text-slate-350'
                    }`}>
                      {u.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => handleRoleToggle(u._id)}
                      className="text-xs font-bold text-brand-600 hover:text-brand-500 underline"
                    >
                      Toggle Role
                    </button>
                    <button
                      onClick={() => handleUserDelete(u._id)}
                      className="text-rose-500 hover:text-rose-455 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-2 rounded-xl transition-all inline-block"
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

export default AdminUsers;
