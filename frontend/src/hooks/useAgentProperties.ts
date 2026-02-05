import { useAgentFilters } from "./agent/useAgentFilters";
import { useAgentUI } from "./agent/useAgentUI";
import { useAgentQueries, usePropertyStats, useAgentContracts } from "./agent/useAgentQueries";
import { useAgentMutations } from "./agent/useAgentMutations";
import { Property } from "@/types/property";
import { CreateRentalDto } from "@/types/api";

/**
 * useAgentProperties - Orchestrator Hook
 *
 * Este hook actúa como una "fachada" que combina hooks especializados.
 * Mantiene la compatibilidad con los componentes existentes pero con una
 * estructura interna mucho más limpia y mantenible.
 * 
 * Arquitectura en capas:
 * 1. Filtros → Maneja búsqueda, status y tabs
 * 2. UI → Maneja modales y toasts
 * 3. Queries → Maneja fetching de propiedades y estadísticas
 * 4. Mutations → Maneja operaciones CRUD
 */
export function useAgentProperties() {
  // 1. Capa de Filtros
  const {
    activeTab,
    setActiveTab,
    // Propiedades
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterListingType,
    setFilterListingType,
    activeFilters,
    // Contratos
    searchAddress,
    setSearchAddress,
    searchOwner,
    setSearchOwner,
    searchTenant,
    setSearchTenant,
    contractStatus,
    setContractStatus,
    activeContractFilters,
  } = useAgentFilters();

  // 2. Capa de UI (Modales, Toasts)
  const {
    isModalOpen,
    editingProperty,
    openCreatePropertyModal,
    openEditPropertyModal,
    closePropertyModal,
    isRentalModalOpen,
    rentingProperty,
    openRentalModal,
    closeRentalModal,
    toast,
    showToast,
    hideToast,
    isViewContractModalOpen,
    viewingContract,
    openViewContractModal,
    closeViewContractModal,
    confirmDelete,
    initiateDeleteProperty,
    closeConfirmDelete,
    setDeleteLoading,
    confirmRevoke,
    initiateRevokeContract,
    closeConfirmRevoke,
    setRevokeLoading,
  } = useAgentUI();

  // 3. Capa de Datos (Queries)
  const { properties, isLoading, error, refetch } =
    useAgentQueries(activeFilters);

  // Query de estadísticas
  const { stats, isLoading: isLoadingStats } = usePropertyStats();

  // Query de contratos (Pasamos los filtros activos)
  const { contracts, isLoading: isLoadingContracts } = useAgentContracts(activeContractFilters);

  // 4. Capa de Acciones (Mutations)
  const {
    handleSaveProperty,
    handleDeleteProperty,
    handleCreateRental,
    handleDeleteContract,
  } = useAgentMutations({
    showToast,
    onPropertySaved: closePropertyModal,
    onRentalSaved: closeRentalModal,
  });

  // ============================================
  // HANDLERS PÚBLICOS
  // ============================================

  /**
   * Abre el modal para agregar una nueva propiedad
   */
  const handleAddProperty = () => {
    openCreatePropertyModal();
  };

  /**
   * Abre el modal para editar una propiedad existente
   */
  const handleEditProperty = (property: Property) => {
    openEditPropertyModal(property);
  };

  /**
   * Guarda una propiedad (crear o actualizar)
   */
  const handleSave = async (
    propertyData: Omit<Property, "id">,
    files: File[]
  ) => {
    await handleSaveProperty(propertyData, files, editingProperty);
  };



  /**
   * Abre el modal de alquiler para una propiedad
   */
  const handleRentProperty = (property: Property) => {
    openRentalModal(property);
  };

  /**
   * Guarda un contrato de alquiler
   */
  const handleSaveRental = async (rentalData: CreateRentalDto) => {
    if (rentingProperty) {
      await handleCreateRental(rentingProperty, rentalData);
    }
  };

  /**
   * Cierra el modal de alquiler
   */
  const closeRentalModalHandler = () => {
    closeRentalModal();
  };

  /**
   * Inicia el proceso de eliminación de una propiedad (abre confirmación)
   */
  const handleDeletePropertyHandler = (id: string) => {
    initiateDeleteProperty(id);
  };

  /**
   * Ejecuta la eliminación real de la propiedad
   */
  const executeDeleteProperty = async () => {
    if (confirmDelete.propertyId) {
      setDeleteLoading(true);
      await handleDeleteProperty(confirmDelete.propertyId);
      setDeleteLoading(false);
      closeConfirmDelete();
    }
  };

  /**
   * Inicia el proceso de revocación de un contrato (abre confirmación)
   */
  const handleDeleteContractHandler = async (id: string) => {
    initiateRevokeContract(id);
    return false; // Retornamos false para que el modal de Ver Contrato no se cierre prematuramente si dependiera del valor de retorno
  };

  /**
   * Ejecuta la revocación real del contrato
   */
  const executeRevokeContract = async () => {
    if (confirmRevoke.contractId) {
      setRevokeLoading(true);
      const success = await handleDeleteContract(confirmRevoke.contractId);
      setRevokeLoading(false);
      if (success) {
        closeConfirmRevoke();
        closeViewContractModal();
      }
    }
  };

  // Retornamos todo lo que la Page necesita
  return {
    // Datos
    properties,
    contracts,
    isLoading,
    isLoadingContracts,
    error,

    // Estadísticas
    stats,
    isLoadingStats,

    // Filtros
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterListingType,
    setFilterListingType,
    searchAddress,
    setSearchAddress,
    searchOwner,
    setSearchOwner,
    searchTenant,
    setSearchTenant,
    contractStatus,
    setContractStatus,
    activeTab,
    setActiveTab,

    // UI State - Modales
    isModalOpen,
    editingProperty,
    isRentalModalOpen,
    rentingProperty,

    // UI State - Toast
    toast,
    hideToast,

    // Acciones
    handleAddProperty,
    handleEditProperty,
    handleDeleteProperty: handleDeletePropertyHandler,
    executeDeleteProperty,
    handleSave,
    handleRentProperty,
    handleSaveRental,
    handleDeleteContract: handleDeleteContractHandler,
    executeRevokeContract,
    closePropertyModal,
    closeRentalModal: closeRentalModalHandler,
    isViewContractModalOpen,
    viewingContract,
    openViewContractModal,
    closeViewContractModal,

    // Estados de Confirmación
    confirmDelete,
    closeConfirmDelete,
    confirmRevoke,
    closeConfirmRevoke,

    refetch,
  };
}
