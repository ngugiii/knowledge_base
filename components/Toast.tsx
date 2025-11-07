'use client';

import { useEffect } from 'react';
import { Check, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-500 dark:bg-green-600 text-white shadow-lg',
    error: 'bg-destructive text-destructive-foreground shadow-lg',
    info: 'bg-primary text-primary-foreground shadow-lg',
  };

  const icons = {
    success: <Check className="h-5 w-5" />,
    error: <X className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg px-6 py-4 shadow-lg transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      } ${typeStyles[type]}`}
      data-testid={`toast-${type}`}
    >
      {icons[type]}
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 rounded p-1 hover:bg-white/20"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

