/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react';
import '../css/Toast.css';

/**
 * Toast notification component
 * Types: 'success', 'error', 'warning', 'info'
 */
const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-exclamation-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill',
  };

  return (
    <div className={`toast-notification toast-${type} ${isExiting ? 'toast-exit' : 'toast-enter'}`}>
      <i className={`bi ${icons[type]} toast-icon`}></i>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={() => {
        setIsExiting(true);
        setTimeout(() => { setIsVisible(false); if (onClose) onClose(); }, 300);
      }}>
        <i className="bi bi-x"></i>
      </button>
    </div>
  );
};

/**
 * Toast container to manage multiple toasts
 */
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

/**
 * Custom hook for managing toast notifications
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
};

export default Toast;