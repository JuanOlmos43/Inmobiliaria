"use client";

import { useAgentProperties } from "@/hooks/useAgentProperties";
import { Contract } from "@/types/api";

// Components
import AgentStatsGrid from "@/components/dashboard/agent/AgentStatsGrid";
import {
  Icon,
  Toast,
  TabNavigation,
  ConfirmModal,
  Pagination,
  EmptyState,
} from "@/components/ui";
import AgentPropertyCard from "@/components/dashboard/agent/AgentPropertyCard";
import PropertyModal from "@/components/dashboard/agent/PropertyModal";
import RentalModal from "@/components/dashboard/agent/RentalModal";
import ViewContractModal from "@/components/dashboard/common/ViewContractModal";
import UpcomingExpirations from "@/components/dashboard/agent/UpcomingExpirations";
import AgentPropertiesFilters from "@/components/dashboard/agent/AgentPropertiesFilters";
import ContractFilters from "@/components/dashboard/agent/ContractFilters";
import { BasePropertyCard } from "@/components/features/properties/cards";

/**
 * AgentDashboardPage
 *
 * Página principal del dashboard de agente.
 * Orquesta los componentes especializados y la lógica de negocio a través del hook useAgentProperties.
 *
 * Arquitectura:
 * - Toda la lógica está en hooks especializados
 * - Este componente solo maneja la presentación (JSX)
 * - Sigue el patrón establecido en admin/page.tsx
 */
export default function AgentDashboardPage() {
  const {
    // Datos
    properties,
    contracts,
    isLoading,

    // Estadísticas
    stats,
    contractStats,
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
    contractPage,
    setContractPage,
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
    handleDeleteContract,
    executeRevokeContract,
    executeDeleteProperty,
    closePropertyModal,
    closeRentalModal,
    isViewContractModalOpen,
    viewingContract,
    openViewContractModal,
    closeViewContractModal,

    // Confirm Modals
    confirmDelete,
    closeConfirmDelete,
    confirmRevoke,
    closeConfirmRevoke,

    // Edición de Contratos
    editingContract,
    openEditContractModal,

    // Paginación
    contractMeta,
    propertyMeta,
    propertyPage,
    setPropertyPage,
  } = useAgentProperties();

  const rentedProperties = contracts;

  return (
    <div className="min-h-screen bg-(--background)">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* SECCIÓN: ESTADÍSTICAS */}
        <AgentStatsGrid
          stats={stats}
          contractStats={contractStats}
          isLoading={isLoadingStats}
        />

        {/* SECCIÓN: PESTAÑAS */}
        <TabNavigation
          tabs={[
            { id: "vencimientos", label: "Próximos Vencimientos" },
            { id: "propiedades", label: "Gestión de Propiedades" },
            { id: "contratos", label: "Gestión de Contratos" },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) =>
            setActiveTab(tabId as "vencimientos" | "propiedades" | "contratos")
          }
        />

        <div className="mb-8">
          {activeTab === "vencimientos" ? (
            <UpcomingExpirations onViewContract={openViewContractModal} />
          ) : activeTab === "propiedades" ? (
            <>
              {/* SECCIÓN: GESTIÓN DE PROPIEDADES */}
              <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                  <h2 className="text-2xl font-bold text-(--primary)">
                    Gestión de Propiedades
                  </h2>

                  {/* BOTÓN AGREGAR PROPIEDAD */}
                  <button
                    onClick={handleAddProperty}
                    className="flex transform items-center gap-2 rounded-full bg-(--accent) px-6 py-3 text-white shadow-md transition-all hover:scale-95 hover:bg-(--accent-hover) hover:shadow-lg"
                  >
                    <Icon name="plus" className="h-5 w-5" />
                    Agregar Propiedad
                  </button>
                </div>

                {/* FILTROS DE BÚSQUEDA */}
                <AgentPropertiesFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                  filterListingType={filterListingType}
                  setFilterListingType={setFilterListingType}
                />
              </div>

              {/* GRID DE PROPIEDADES */}
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="border-primary-600 h-12 w-12 animate-spin rounded-full border-b-2"></div>
                </div>
              ) : properties.length === 0 ? (
                <EmptyState
                  title="No se encontraron propiedades"
                  description="Intenta ajustar los filtros de búsqueda o agrega una nueva propiedad."
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {properties.map((property) => (
                      <AgentPropertyCard
                        key={property.id}
                        property={property}
                        onEdit={handleEditProperty}
                        onDelete={handleDeleteProperty}
                        onRent={handleRentProperty}
                      />
                    ))}
                  </div>

                  {/* PAGINACIÓN DE PROPIEDADES */}
                  {propertyMeta && (propertyMeta.totalPages ?? 0) > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination
                        currentPage={propertyPage}
                        totalPages={propertyMeta.totalPages ?? 0}
                        onPageChange={setPropertyPage}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {/* SECCIÓN: GESTIÓN DE CONTRATOS */}
              <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                  <h2 className="text-2xl font-bold text-(--primary)">
                    Gestión de Contratos
                  </h2>
                </div>

                {/* FILTROS DE CONTRATOS */}
                <ContractFilters
                  searchAddress={searchAddress}
                  setSearchAddress={setSearchAddress}
                  searchOwner={searchOwner}
                  setSearchOwner={setSearchOwner}
                  searchTenant={searchTenant}
                  setSearchTenant={setSearchTenant}
                  contractStatus={contractStatus}
                  setContractStatus={setContractStatus}
                />
              </div>

              {/* GRID DE CONTRATOS */}
              {rentedProperties.length === 0 ? (
                <EmptyState
                  icon="document"
                  title="No se encontraron contratos"
                  description="Los contratos de alquiler aparecerán aquí"
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {rentedProperties.map((contract: Contract) => (
                      <BasePropertyCard
                        key={contract.id}
                        title={contract.property.title}
                        price={contract.monthlyRent}
                        currency={contract.property.currency || "ARS"}
                        location={contract.property.location}
                        image={contract.property.mainImage}
                        type="Alquiler"
                        bedrooms={undefined}
                        bathrooms={undefined}
                        area={undefined}
                        showTypeBadge={false}
                        showStatusBadge={true}
                        showDetails={false}
                        status={
                          contract.status === "active"
                            ? "Activo"
                            : contract.status === "expired"
                              ? "Vencido"
                              : "Terminado"
                        }
                        footerSlot={
                          <div className="mt-2 flex w-full flex-col gap-2">
                            <button
                              className="group/btn flex w-full items-center justify-center gap-2 rounded-lg bg-(--accent) px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-(--accent-hover) hover:shadow-lg"
                              onClick={() => openViewContractModal(contract)}
                            >
                              <Icon
                                name="document"
                                className="h-5 w-5 transition-transform group-hover/btn:scale-110"
                              />
                              Ver Detalle
                            </button>
                            {contract.status !== "terminated" &&
                              contract.status !== "expired" && (
                                <div className="flex gap-2">
                                  <button
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-(--primary) px-4 py-2 font-medium text-white shadow-md transition-all hover:bg-(--primary-light) hover:shadow-lg"
                                    onClick={() =>
                                      openEditContractModal(contract)
                                    }
                                  >
                                    <Icon name="edit" className="h-4 w-4" />
                                    Editar
                                  </button>
                                  <button
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 font-medium text-white shadow-md transition-all hover:bg-amber-700 hover:shadow-lg"
                                    onClick={() =>
                                      handleDeleteContract(contract.id)
                                    }
                                  >
                                    <Icon name="trash" className="h-4 w-4" />
                                    Revocar
                                  </button>
                                </div>
                              )}
                          </div>
                        }
                      />
                    ))}
                  </div>

                  {/* PAGINACIÓN DE CONTRATOS */}
                  {contractMeta && (contractMeta.totalPages ?? 0) > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination
                        currentPage={contractPage}
                        totalPages={contractMeta.totalPages ?? 0}
                        onPageChange={setContractPage}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      {/* COMPONENTES DE UI (MODALES Y FEEDBACK) */}
      {isModalOpen && (
        <PropertyModal
          property={editingProperty}
          onSave={handleSave}
          onClose={closePropertyModal}
        />
      )}

      {isRentalModalOpen && rentingProperty && (
        <RentalModal
          property={rentingProperty}
          contract={editingContract}
          onClose={closeRentalModal}
          onSave={(rentalData) => {
            handleSaveRental(rentalData);
          }}
        />
      )}
      {isViewContractModalOpen && viewingContract && (
        <ViewContractModal
          isOpen={isViewContractModalOpen}
          onClose={closeViewContractModal}
          contract={viewingContract}
        />
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* MODALES DE CONFIRMACIÓN */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={closeConfirmDelete}
        onConfirm={executeDeleteProperty}
        title="Eliminar Propiedad"
        message="¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        isLoading={confirmDelete.isLoading}
        variant="danger"
      />

      <ConfirmModal
        isOpen={confirmRevoke.isOpen}
        onClose={closeConfirmRevoke}
        onConfirm={executeRevokeContract}
        title="Revocar Contrato"
        message="¿Estás seguro de que deseas revocar este contrato? La propiedad volverá a estar disponible (Activa)."
        confirmText="Revocar"
        isLoading={confirmRevoke.isLoading}
        variant="warning"
      />
    </div>
  );
}
