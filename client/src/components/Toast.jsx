import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: 'bg-emerald-500 text-white',
    error: 'bg-rose-500 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 mr-2" />,
    error: <XCircle className="w-5 h-5 mr-2" />,
    warning: <AlertCircle className="w-5 h-5 mr-2" />,
    info: <AlertCircle className="w-5 h-5 mr-2" />,
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center px-4 py-3 rounded-lg shadow-lg font-medium transition-all transform duration-300 translate-y-0 ${typeStyles[type]}`}>
      {icons[type]}
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 hover:opacity-80 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
