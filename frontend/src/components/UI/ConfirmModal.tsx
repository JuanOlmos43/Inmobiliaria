"use client";

import { ReactNode } from "react";
import { Modal } from "./Modal";
import { Icon } from "./Icon";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "success" | "info";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  const colors = {
    danger: "bg-red-100 text-red-600",
    warning: "bg-amber-100 text-amber-600",
    success: "bg-green-100 text-green-600",
    info: "bg-blue-100 text-blue-600",
  };

  const buttonColors = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-amber-600 hover:bg-amber-700",
    success: "bg-green-600 hover:bg-green-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  const iconName = {
    danger: "pause",
    warning: "key",
    success: "check",
    info: "home",
  }[variant] as any;

  const modalHeader = (
    <div className="flex items-center gap-4">
      <div
        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colors[variant]}`}
      >
        <Icon name={iconName} className="w-5 h-5" />
      </div>
      <span className="text-xl font-bold text-(--primary)">{title}</span>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalHeader} maxWidth="md">
      <div className="p-2">
        <p className="text-gray-600 leading-relaxed">{message}</p>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 text-white font-medium rounded-lg transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2 ${buttonColors[variant]}`}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
