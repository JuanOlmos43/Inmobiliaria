"use client";

import { Modal } from "../modals/Modal";
import { Icon, IconName } from "../icons/Icon";

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
    danger: "bg-(--danger) hover:bg-red-700",
    warning: "bg-(--warning) hover:bg-amber-700",
    success: "bg-(--success) hover:bg-green-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  const iconName: IconName = (
    {
      danger: "pause",
      warning: "key",
      success: "check",
      info: "home",
    } as const
  )[variant];

  const modalHeader = (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colors[variant]}`}
      >
        <Icon name={iconName} className="h-5 w-5" />
      </div>
      <span className="text-xl font-bold text-(--primary)">{title}</span>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalHeader} maxWidth="md">
      <div className="p-2">
        <p className="leading-relaxed text-gray-600">{message}</p>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-all duration-200 hover:border-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium text-white transition-all disabled:opacity-50 ${buttonColors[variant]}`}
          >
            {isLoading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
