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
  const [editingContract, setEditingContract] = useState<Contract | null>(null);

  // Estado de Modal de Ver Contrato
  const [isViewContractModalOpen, setIsViewContractModalOpen] = useState(false);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);

  // Estado de Confirmación de Eliminación de Propiedad
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    propertyId: string | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    propertyId: null,
    isLoading: false,
  });

  // Estado de Confirmación de Revocación de Contrato
  const [confirmRevoke, setConfirmRevoke] = useState<{
    isOpen: boolean;
    contractId: string | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    contractId: null,
    isLoading: false,
  });

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
    setEditingContract(null);
    setIsRentalModalOpen(true);
  }, []);

  /**
   * Abre el modal de alquiler en modo edición
   */
  const openEditContractModal = useCallback((contract: Contract) => {
    setEditingContract(contract);
    // Para editar necesitamos la propiedad, el contrato ya la incluye
    setRentingProperty(contract.property as unknown as Property);
    setIsRentalModalOpen(true);
  }, []);

  /**
   * Cierra el modal de alquiler y limpia el estado
   */
  const closeRentalModal = useCallback(() => {
    setIsRentalModalOpen(false);
    setRentingProperty(null);
    setEditingContract(null);
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

  // ============================================
  // FUNCIONES HELPER PARA CONFIRM MODALS
  // ============================================

  const initiateDeleteProperty = useCallback((id: string) => {
    setConfirmDelete({ isOpen: true, propertyId: id, isLoading: false });
  }, []);

  const closeConfirmDelete = useCallback(() => {
    setConfirmDelete((prev) => ({ ...prev, isOpen: false, propertyId: null }));
  }, []);

  const setDeleteLoading = useCallback((isLoading: boolean) => {
    setConfirmDelete((prev) => ({ ...prev, isLoading }));
  }, []);

  const initiateRevokeContract = useCallback((id: string) => {
    setConfirmRevoke({ isOpen: true, contractId: id, isLoading: false });
  }, []);

  const closeConfirmRevoke = useCallback(() => {
    setConfirmRevoke((prev) => ({ ...prev, isOpen: false, contractId: null }));
  }, []);

  const setRevokeLoading = useCallback((isLoading: boolean) => {
    setConfirmRevoke((prev) => ({ ...prev, isLoading }));
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
    editingContract,
    openRentalModal,
    openEditContractModal,
    closeRentalModal,

    // Estados de Modal de Ver Contrato
    isViewContractModalOpen,
    viewingContract,
    openViewContractModal,
    closeViewContractModal,

    // Estados de Confirmación
    confirmDelete,
    initiateDeleteProperty,
    closeConfirmDelete,
    setDeleteLoading,
    confirmRevoke,
    initiateRevokeContract,
    closeConfirmRevoke,
    setRevokeLoading,

    // Estados de Toast
    toast,
    showToast,
    hideToast,
  };
}
