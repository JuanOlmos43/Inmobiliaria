import { useAgentFilters } from "./agent/useAgentFilters";
import { useAgentUI } from "./agent/useAgentUI";
import {
  useAgentQueries,
  usePropertyStats,
  useAgentContracts,
  useContractStats,
} from "./agent/useAgentQueries";
import { useAgentMutations } from "./agent/useAgentMutations";
import { Property } from "@/types/property";
import { CreateRentalDto } from "@/types/api";

/**
 * useAgentProperties - Orchestrator Hook
 *
 * Este hook actúa como una "fachada" que combina hooks especializados.
 * Mantiene la compatibilidad con los componentes existentes pero con una
 * estructura interna mucho más limpia y mantenible.
 */
export function useAgentProperties() {
  // 1. Capa de Filtros
  const {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterListingType,
    setFilterListingType,
    activeFilters,
    searchAddress,
    setSearchAddress,
    searchOwner,
    setSearchOwner,
    searchTenant,
    setSearchTenant,
    contractStatus,
    setContractStatus,
    contractPage,
    setContractPage,
    activeContractFilters,
    propertyPage,
    setPropertyPage,
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
    editingContract,
    openEditContractModal,
    confirmDelete,
    initiateDeleteProperty,
    closeConfirmDelete,
    setDeleteLoading,
    confirmRevoke,
    initiateRevokeContract,
    closeConfirmRevoke,
    setRevokeLoading,
    confirmSell,
    initiateSellProperty,
    closeConfirmSell,
    setSellLoading,
  } = useAgentUI();

  // 3. Capa de Datos (Queries)
  const {
    properties,
    isLoading,
    error,
    refetch,
    meta: propertyMeta,
  } = useAgentQueries(activeFilters);
  const { stats, isLoading: isLoadingStats } = usePropertyStats();
  const {
    contracts,
    isLoading: isLoadingContracts,
    meta: contractMeta,
  } = useAgentContracts(activeContractFilters);
  const { contractStats } = useContractStats();

  // 4. Capa de Acciones (Mutations)
  const {
    handleSaveProperty,
    handleDeleteProperty,
    handleSellProperty,
    handleSaveRental,
    handleDeleteContract,
  } = useAgentMutations({
    showToast,
    onPropertySaved: closePropertyModal,
    onRentalSaved: closeRentalModal,
  });

  // Handlers
  const handleAddProperty = () => openCreatePropertyModal();
  const handleEditProperty = (p: Property) => openEditPropertyModal(p);
  const handleSave = async (data: Omit<Property, "id">, files: File[]) => {
    await handleSaveProperty(data, files, editingProperty);
  };
  const handleRentProperty = (p: Property) => openRentalModal(p);
  const handleSaveRentalHandler = async (data: CreateRentalDto) => {
    await handleSaveRental(data, editingContract);
  };
  const handleDeletePropertyHandler = (id: string) =>
    initiateDeleteProperty(id);
  const executeDeleteProperty = async () => {
    if (confirmDelete.propertyId) {
      setDeleteLoading(true);
      await handleDeleteProperty(confirmDelete.propertyId);
      setDeleteLoading(false);
      closeConfirmDelete();
    }
  };
  const handleDeleteContractHandler = async (id: string) => {
    initiateRevokeContract(id);
    return false;
  };
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
  const handleSellPropertyHandler = (p: Property) => {
    // Usar el estado dedicado para venta
    initiateSellProperty(p.id!);
  };
  const executeSellProperty = async () => {
    if (confirmSell.propertyId) {
      setSellLoading(true);
      await handleSellProperty(confirmSell.propertyId);
      setSellLoading(false);
      closeConfirmSell();
    }
  };

  return {
    properties,
    contracts,
    isLoading,
    isLoadingContracts,
    error,
    stats,
    contractStats,
    isLoadingStats,
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
    contractPage,
    setContractPage,
    propertyPage,
    setPropertyPage,
    activeTab,
    setActiveTab,
    isModalOpen,
    editingProperty,
    isRentalModalOpen,
    rentingProperty,
    toast,
    hideToast,
    handleAddProperty,
    handleEditProperty,
    handleDeleteProperty: handleDeletePropertyHandler,
    executeDeleteProperty,
    handleSave,
    handleRentProperty,
    handleSellProperty: handleSellPropertyHandler,
    executeSellProperty,
    handleSaveRental: handleSaveRentalHandler,
    handleDeleteContract: handleDeleteContractHandler,
    executeRevokeContract,
    closePropertyModal,
    closeRentalModal: () => closeRentalModal(),
    isViewContractModalOpen,
    viewingContract,
    openViewContractModal,
    closeViewContractModal,
    editingContract,
    openEditContractModal,
    confirmDelete,
    closeConfirmDelete,
    confirmRevoke,
    closeConfirmRevoke,
    confirmSell,
    closeConfirmSell,
    refetch,
    contractMeta,
    propertyMeta,
  };
}
