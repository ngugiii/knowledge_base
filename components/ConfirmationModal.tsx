'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'warning' | 'default';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
}: ConfirmationModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const confirmStyles = {
    danger: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    default: 'bg-primary hover:bg-primary/90 text-primary-foreground',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      data-testid="confirmation-modal-overlay"
    >
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity" />

      <div
        className="relative z-10 w-full max-w-md rounded-2xl p-6 shadow-xl animate-scale-in bg-card text-card-foreground border border-border"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>

        <h3 className="mb-2 text-center text-xl font-semibold text-card-foreground">
          {title}
        </h3>

        <p className="mb-6 text-center text-muted-foreground">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 rounded-lg px-4 py-2.5 font-medium transition-colors ${confirmStyles[confirmVariant]}`}
            data-testid="confirm-delete-button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

