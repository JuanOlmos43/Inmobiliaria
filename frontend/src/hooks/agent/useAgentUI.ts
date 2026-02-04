import { useState, useCallback } from "react";
import { Property } from "@/types/property";
import { Contract } from "@/types/api";

/**
 * useAgentUI
 * 
 * Maneja estados visuales del dashboard de agente: Modales y Notificaciones (Toasts).
 * Centraliza toda la lógica de UI sin incluir lógica de negocio.
 */
export function useAgentUI() {
  // Estado de Modal de Propiedades (Crear/Editar)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Estado de Modal de Alquiler
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [rentingProperty, setRentingProperty] = useState<Property | null>(null);

  // Estado de Modal de Ver Contrato
  const [isViewContractModalOpen, setIsViewContractModalOpen] = useState(false);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);

  // Estado de Notificaciones (Toast)
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error",
  });

  // ============================================
  // FUNCIONES HELPER PARA TOAST
  // ============================================

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setToast({ isVisible: true, message, type });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  // ============================================
  // FUNCIONES HELPER PARA MODAL DE PROPIEDADES
  // ============================================

  /**
   * Abre el modal de propiedades en modo creación (sin propiedad)
   */
  const openCreatePropertyModal = useCallback(() => {
    setEditingProperty(null);
    setIsModalOpen(true);
  }, []);

  /**
   * Abre el modal de propiedades en modo edición (con propiedad)
   */
  const openEditPropertyModal = useCallback((property: Property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  }, []);

  /**
   * Cierra el modal de propiedades y limpia el estado
   */
  const closePropertyModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingProperty(null);
  }, []);

  // ============================================
  // FUNCIONES HELPER PARA MODAL DE ALQUILER
  // ============================================

  /**
   * Abre el modal de alquiler con la propiedad seleccionada
   */
  const openRentalModal = useCallback((property: Property) => {
    setRentingProperty(property);
    setIsRentalModalOpen(true);
  }, []);

  /**
   * Cierra el modal de alquiler y limpia el estado
   */
  const closeRentalModal = useCallback(() => {
    setIsRentalModalOpen(false);
    setRentingProperty(null);
  }, []);

  // ============================================
  // FUNCIONES HELPER PARA MODAL DE VER CONTRATO
  // ============================================

  /**
   * Abre el modal de ver contrato con el contrato seleccionado
   */
  const openViewContractModal = useCallback((contract: Contract) => {
    setViewingContract(contract);
    setIsViewContractModalOpen(true);
  }, []);

  /**
   * Cierra el modal de ver contrato y limpia el estado
   */
  const closeViewContractModal = useCallback(() => {
    setIsViewContractModalOpen(false);
    setViewingContract(null);
  }, []);

  return {
    // Estados de Modal de Propiedades
    isModalOpen,
    editingProperty,
    openCreatePropertyModal,
    openEditPropertyModal,
    closePropertyModal,

    // Estados de Modal de Alquiler
    isRentalModalOpen,
    rentingProperty,
    openRentalModal,
    closeRentalModal,

    // Estados de Modal de Ver Contrato
    isViewContractModalOpen,
    viewingContract,
    openViewContractModal,
    closeViewContractModal,

    // Estados de Toast
    toast,
    showToast,
    hideToast,
  };
}
