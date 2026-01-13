// src/contexts/ToastContext.jsx
import { createContext, useContext } from 'react';
import { useToastStore } from '@/store';
import { ToastContainer } from '@/components/common/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);
  const addToast = useToastStore((state) => state.addToast);

  const showToast = (message, type = 'info', duration = 3000) => {
    return addToast({ message, type, duration });
  };

  const value = {
    showToast,
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    warning: (message, duration) => showToast(message, 'warning', duration),
    info: (message, duration) => showToast(message, 'info', duration),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if context is not available
    return {
      showToast: () => {},
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
    };
  }
  return context;
}

