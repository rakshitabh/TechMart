import React, { useState } from 'react';
import Toast from '../components/Toast';
import { Settings, Save } from 'lucide-react';

const AdminSettings = () => {
  const [storeName, setStoreName] = useState('TechMart Premium Store');
  const [contactEmail, setContactEmail] = useState('support@techmart.com');
  const [currency, setCurrency] = useState('USD');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [toast, setToast] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const showToast = (message, type) => setToast({ message, type });

  const handleSave = (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setTimeout(() => {
      setSaveLoading(false);
      showToast('Store settings saved successfully!', 'success');
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto text-left">
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-150 dark:border-slate-700/60 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-slate-700/50 flex items-center space-x-3 bg-gray-50/50 dark:bg-slate-900/30">
          <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Global Configuration</h3>
            <p className="text-xs text-gray-450 dark:text-slate-400">Configure TechMart store metadata and site parameters</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Store name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-350 mb-1.5">
                Store Front Name
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="block w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-750 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
              />
            </div>

            {/* Email contact */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-350 mb-1.5">
                Store Support Contact Email
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="block w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-750 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
              />
            </div>

            {/* Currency settings */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-350 mb-1.5">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="block w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-750 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all font-semibold"
              >
                <option value="USD">USD ($) United States Dollar</option>
                <option value="EUR">EUR (€) Euro</option>
                <option value="GBP">GBP (£) British Pound</option>
                <option value="INR">INR (₹) Indian Rupee</option>
              </select>
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-slate-700/50" />

          {/* Toggle Switches */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">System Toggles</h4>

            {/* maintenance mode */}
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">Maintenance Lockout</p>
                <span className="text-xs text-gray-400 dark:text-slate-450">Disable storefront interfaces for customer sessions</span>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  maintenanceMode ? 'bg-indigo-650' : 'bg-gray-200 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* allow registration */}
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">Allow New Customer Registrations</p>
                <span className="text-xs text-gray-400 dark:text-slate-450">Open signup endpoints for user account registrations</span>
              </div>
              <button
                type="button"
                onClick={() => setAllowRegistration(!allowRegistration)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  allowRegistration ? 'bg-indigo-650' : 'bg-gray-200 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    allowRegistration ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-900/30 flex justify-end">
          <button
            type="submit"
            disabled={saveLoading}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md shadow-indigo-500/10"
          >
            {saveLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Configuration
          </button>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminSettings;
