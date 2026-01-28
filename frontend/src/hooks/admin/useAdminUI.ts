import { useState, useCallback } from "react";

/**
 * useAdminUI
 * Maneja estados visuales del dashboard: Modales y Notificaciones (Toasts).
 */
export function useAdminUI() {
  // Estado de Modal de Creación
  const [showModal, setShowModal] = useState(false);

  // Estado de Notificaciones
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error",
    duration: 3000,
  });

  // Estado de Modal de Confirmación para Reset
  const [confirmReset, setConfirmReset] = useState({
    isOpen: false,
    userId: "",
  });

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      const duration = type === "error" ? 6000 : 3000;
      setToast({ isVisible: true, message, type, duration });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const initiateResetPassword = useCallback((userId: string) => {
    setConfirmReset({ isOpen: true, userId });
  }, []);

  const closeConfirmReset = useCallback(() => {
    setConfirmReset({ isOpen: false, userId: "" });
  }, []);

  return {
    showModal,
    setShowModal,
    toast,
    showToast,
    hideToast,
    confirmReset,
    initiateResetPassword,
    closeConfirmReset,
  };
}
