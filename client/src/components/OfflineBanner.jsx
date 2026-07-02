import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      const timer = setTimeout(() => setShowStatus(false), 3000); // Dismiss online status after 3s
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus && isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 animate-bounce">
      {!isOnline ? (
        <div className="bg-rose-600 border border-rose-500 text-white px-5 py-3 rounded-2xl flex items-center shadow-2xl space-x-3 text-xs sm:text-sm font-semibold max-w-sm">
          <WifiOff className="w-5 h-5 flex-shrink-0 animate-pulse" />
          <span>You are currently offline. Product changes and checkout actions are unavailable.</span>
        </div>
      ) : (
        <div className="bg-emerald-600 border border-emerald-500 text-white px-5 py-3 rounded-2xl flex items-center shadow-2xl space-x-3 text-xs sm:text-sm font-semibold max-w-sm">
          <Wifi className="w-5 h-5 flex-shrink-0" />
          <span>Back online! Re-establishing database connection...</span>
        </div>
      )}
    </div>
  );
};

export default OfflineBanner;
