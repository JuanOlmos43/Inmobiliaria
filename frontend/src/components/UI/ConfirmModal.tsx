"use client";

import Modal from "./Modal";
import Icon from "./Icon";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  type = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  const colors = {
    danger: "bg-red-100 text-red-600",
    warning: "bg-amber-100 text-amber-600",
    info: "bg-blue-100 text-blue-600",
  };

  const buttonColors = {
    danger: "bg-red-600 hover:bg-red-700 shadow-red-200",
    warning: "bg-amber-600 hover:bg-amber-700 shadow-amber-200",
    info: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="md">
      <div className="p-2">
        <div className="flex items-start gap-4">
          <div
            className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${colors[type]}`}
          >
            <Icon
              name={
                type === "danger"
                  ? "pause"
                  : type === "warning"
                    ? "key"
                    : "home"
              }
              className="w-6 h-6"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-(--primary) mb-2">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`bg-(--primary) hover:bg-(--primary-light) text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 inline-flex items-center justify-center gap-2 ${buttonColors[type]}`}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
