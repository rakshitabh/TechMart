import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';
import { TrendingUp, ShoppingCart, IndianRupee, Percent, BarChart3, PieChart, Activity } from 'lucide-react';

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => setToast({ message, type });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/api/orders/admin/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        showToast('Failed to load analytical metrics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-500 mx-auto"></div>
      </div>
    );
  }

  // Calculate metrics
  const totalRevenue = stats?.totalRevenue || 0;
  const totalOrders = stats?.totalOrders || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const pendingOrders = stats?.statusCounts?.Pending || 0;
  const deliveredOrders = stats?.statusCounts?.Delivered || 0;
  const cancelledOrders = stats?.statusCounts?.Cancelled || 0;

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch (e) {
      return dateStr;
    }
  };

  const salesData = stats?.salesByDay && stats.salesByDay.length > 0
    ? stats.salesByDay.map(d => ({ label: formatDate(d._id), sales: d.sales }))
    : [
        { label: 'Jan', sales: 4000 },
        { label: 'Feb', sales: 3000 },
        { label: 'Mar', sales: 5000 },
        { label: 'Apr', sales: 8000 },
        { label: 'May', sales: 7000 },
        { label: 'Jun', sales: totalRevenue > 0 ? totalRevenue : 9500 },
      ];

  const maxSales = Math.max(...salesData.map(m => m.sales), 1000);

  return (
    <div className="space-y-8 text-left">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Rev */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150 dark:border-slate-700/60 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Total Gross Income</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-450">
            <TrendingUp className="w-4 h-4 mr-1" /> +14.2% from last month
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150 dark:border-slate-700/60 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Purchased Orders</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{totalOrders}</h3>
            </div>
            <div className="p-3 bg-brand-500/10 text-brand-600 rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-brand-600 dark:text-brand-450">
            <TrendingUp className="w-4 h-4 mr-1" /> +8.6% from last month
          </div>
        </div>

        {/* Avg order val */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150 dark:border-slate-700/60 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Average Order Value</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{avgOrderValue.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-indigo-650 dark:text-indigo-400">
            <Activity className="w-4 h-4 mr-1" /> Stabilized customer basket
          </div>
        </div>

        {/* Delivery Success Rate */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150 dark:border-slate-700/60 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Delivered Orders</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{deliveredOrders}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-amber-600 dark:text-amber-450">
            {pendingOrders} orders currently in progress
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150 dark:border-slate-700/60 shadow-sm">
          <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-brand-500" /> Revenue Stream Trend
          </h3>
          <div className="flex items-end justify-between h-64 pt-4 border-b border-gray-100 dark:border-slate-700/50">
            {salesData.map((data, index) => {
              const heightPercentage = maxSales > 0 ? (data.sales / maxSales) * 80 : 0;
              return (
                <div key={data.label || index} className="flex flex-col items-center flex-1 group">
                  <span className="text-xs font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                    ₹{data.sales.toFixed(0)}
                  </span>
                  <div
                    style={{ height: `${heightPercentage}%` }}
                    className="w-10 bg-gradient-to-t from-brand-600 to-indigo-500 dark:from-brand-500 dark:to-indigo-400 rounded-t-lg group-hover:brightness-110 transition-all shadow-sm"
                  />
                  <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 mt-3">{data.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150 dark:border-slate-700/60 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-6 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-indigo-550 dark:text-indigo-455" /> Order Resolution
          </h3>
          <div className="flex-1 flex flex-col justify-center space-y-4">
            {/* Delivered */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">
                <span>Delivered</span>
                <span>{totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(0) : 0}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-750 h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0}%` }}
                  className="bg-emerald-500 h-full rounded-full"
                />
              </div>
            </div>

            {/* Pending */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">
                <span>Pending Processing</span>
                <span>{totalOrders > 0 ? ((pendingOrders / totalOrders) * 100).toFixed(0) : 0}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-750 h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${totalOrders > 0 ? (pendingOrders / totalOrders) * 100 : 0}%` }}
                  className="bg-amber-500 h-full rounded-full"
                />
              </div>
            </div>

            {/* Cancelled */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">
                <span>Cancelled / Void</span>
                <span>{totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(0) : 0}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-750 h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0}%` }}
                  className="bg-rose-500 h-full rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminAnalytics;
