import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const ToastItem = ({ toast, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isHovered) return;

    const startTime = Date.now();
    const duration = toast.duration;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);

      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(timer);
        onRemove(toast.id);
      }
    }, 16); // ~60fps

    return () => clearInterval(timer);
  }, [toast.duration, toast.id, onRemove, isHovered]);

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-white dark:bg-gray-800',
          border: 'border-green-500',
          progressBg: 'bg-green-500',
          icon: <i className="fas fa-check-circle text-green-500 text-lg" aria-hidden="true"></i>,
          text: 'text-gray-900 dark:text-white',
        };
      case 'error':
        return {
          bg: 'bg-white dark:bg-gray-800',
          border: 'border-red-500',
          progressBg: 'bg-red-500',
          icon: <i className="fas fa-times-circle text-red-500 text-lg" aria-hidden="true"></i>,
          text: 'text-gray-900 dark:text-white',
        };
      case 'warning':
        return {
          bg: 'bg-white dark:bg-gray-800',
          border: 'border-yellow-500',
          progressBg: 'bg-yellow-500',
          icon: <i className="fas fa-exclamation-circle text-yellow-500 text-lg" aria-hidden="true"></i>,
          text: 'text-gray-900 dark:text-white',
        };
      case 'info':
      default:
        return {
          bg: 'bg-white dark:bg-gray-800',
          border: 'border-blue-500',
          progressBg: 'bg-blue-500',
          icon: <i className="fas fa-info-circle text-blue-500 text-lg" aria-hidden="true"></i>,
          text: 'text-gray-900 dark:text-white',
        };
    }
  };

  const styles = getToastStyles();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative ${styles.bg} rounded-lg shadow-lg overflow-hidden min-w-[320px] max-w-md border-l-4 ${styles.border} border border-gray-200 dark:border-gray-700`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="p-4 pr-10 flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>

        {/* Message */}
        <p className={`${styles.text} text-sm font-medium leading-relaxed flex-1`}>
          {toast.message}
        </p>

        {/* Close Button */}
        <button
          onClick={() => onRemove(toast.id)}
          className="absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <i className="fas fa-times text-sm" aria-hidden="true"></i>
        </button>
      </div>

      {/* Progress Bar */}
      <motion.div
        className={`h-1 ${styles.progressBg}`}
        initial={{ width: '100%' }}
        animate={{ width: `${progress}%` }}
        transition={{
          duration: 0.016,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
};

const Toaster = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toaster;
