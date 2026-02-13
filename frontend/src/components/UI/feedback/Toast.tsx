"use client";

import { useEffect } from "react";
import { Icon } from "../icons/Icon";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
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
      bg: "bg-gradient-to-r from-green-500 to-green-600",
      icon: "check" as const,
    },
    error: {
      bg: "bg-gradient-to-r from-red-500 to-red-600",
      icon: "pause" as const,
    },
  };

  const style = styles[type];

  return (
    <div className="pointer-events-none fixed top-6 right-0 left-0 z-9999 flex justify-center">
      <div className="animate-slide-in-down pointer-events-auto">
        <div
          className={`${style.bg} flex min-w-[300px] items-center gap-3 rounded-lg px-6 py-3 text-white shadow-2xl`}
        >
          <Icon name={style.icon} className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}
