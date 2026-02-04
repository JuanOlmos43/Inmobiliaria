import { useAgentFilters } from "./agent/useAgentFilters";
import { useAgentUI } from "./agent/useAgentUI";
import { useAgentQueries, usePropertyStats } from "./agent/useAgentQueries";
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
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterListingType,
    setFilterListingType,
    activeTab,
    setActiveTab,
    activeFilters,
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
  } = useAgentUI();

  // 3. Capa de Datos (Queries)
  const { properties, isLoading, error, refetch } =
    useAgentQueries(activeFilters);

  // Query de estadísticas
  const { stats, isLoading: isLoadingStats } = usePropertyStats();

  // 4. Capa de Acciones (Mutations)
  const {
    handleSaveProperty,
    handleDeleteProperty,
    handleCreateRental,
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

  // Retornamos todo lo que la Page necesita
  return {
    // Datos
    properties,
    isLoading,
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
    handleDeleteProperty,
    handleSave,
    handleRentProperty,
    handleSaveRental,
    closePropertyModal,
    closeRentalModal,
    refetch,
  };
}
