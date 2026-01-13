// src/components/common/Toast.jsx
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const toastTypes = {
  success: { icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200' },
  error: { icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200' },
  warning: { icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  info: { icon: AlertCircle, color: 'text-blue-600 bg-blue-50 border-blue-200' },
};

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = toastTypes[type]?.icon || toastTypes.info.icon;
  const colors = toastTypes[type]?.color || toastTypes.info.color;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${colors} transition-all duration-300`}
    >
      <Icon size={20} />
      <p className="flex-1 font-medium">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        className="hover:opacity-70 transition"
      >
        <X size={18} />
      </button>
    </div>
  );
}

// Toast Container
export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
}

// Toast Hook (to be used with context)
export function useToast() {
  const showToast = (message, type = 'info', duration = 3000) => {
    // This will be connected to a toast context/store
    const event = new CustomEvent('show-toast', {
      detail: { message, type, duration },
    });
    window.dispatchEvent(event);
  };

  return {
    showToast,
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    warning: (message, duration) => showToast(message, 'warning', duration),
    info: (message, duration) => showToast(message, 'info', duration),
  };
}

