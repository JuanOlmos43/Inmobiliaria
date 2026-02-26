"use client";

import { Modal } from "../modals/Modal";
import { Icon, IconName } from "../icons/Icon";
import { Button, type ButtonVariant } from "../buttons/Button";

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

  // Mapeo de variant local a ButtonVariant del componente Button
  const buttonVariantMap: Record<string, ButtonVariant> = {
    danger: "danger",
    warning: "warning",
    success: "success",
    info: "primary",
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
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={buttonVariantMap[variant]}
            fullWidth
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
