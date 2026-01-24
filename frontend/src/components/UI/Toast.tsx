'use client';

import { useEffect } from 'react';
import Icon from './Icon';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = 'success',
  isVisible,
  onClose,
  duration = 3000
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-green-600',
      icon: 'check' as const
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-red-600',
      icon: 'pause' as const
    }
  };

  const style = styles[type];

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-9999 animate-slide-in-down">
      <div className={`${style.bg} text-white rounded-lg shadow-2xl px-6 py-3 flex items-center gap-3 min-w-[300px]`}>
        <Icon name={style.icon} className="w-5 h-5 shrink-0" />
        <p className="font-medium text-sm">{message}</p>
      </div>
    </div>
  );
}
