"use client";

import { ReactNode, useEffect } from "react";
import { Icon } from "../icons/Icon";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl"; // Tamaño del modal
  staticBackdrop?: boolean; // Si es true, no cierra al hacer click fuera ni escape
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md",
  staticBackdrop = false,
}: ModalProps) {
  // Cerrar con tecla ESC y manejar scroll del body
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !staticBackdrop) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      // Restaurar scroll cuando se cierra
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      // Asegurar que siempre se restaure el scroll al desmontar
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen, onClose, staticBackdrop]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className={`rounded-2xl bg-white shadow-2xl ${maxWidthClasses[maxWidth]} animate-scale-in flex max-h-[90vh] w-full flex-col`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 p-6">
          <div className="text-2xl font-bold text-(--primary)">{title}</div>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Cerrar modal"
          >
            <Icon name="close" className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
