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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-(--primary)">
                    Gestión de Propiedades
                  </h2>

                  {/* BOTÓN AGREGAR PROPIEDAD */}
                  <button
                    onClick={handleAddProperty}
                    className="px-6 py-3 bg-(--accent) text-white rounded-lg hover:bg-(--accent-hover) transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:scale-105"
                  >
                    <Icon name="plus" className="w-5 h-5" />
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : properties.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
                    <Icon
                      name="building"
                      className="w-10 h-10 text-(--accent)"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-(--primary) mb-2">
                    No se encontraron propiedades
                  </h3>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {propertyMeta && (propertyMeta.lastPage ?? 0) > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination
                        currentPage={propertyPage}
                        totalPages={propertyMeta.lastPage ?? 0}
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
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
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
                <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
                    <Icon
                      name="document"
                      className="w-10 h-10 text-(--accent)"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-(--primary) mb-2">
                    No se encontraron contratos
                  </h3>
                  <p className="text-gray-600">
                    Los contratos de alquiler aparecerán aquí
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          <div className="flex flex-col gap-2 w-full mt-2">
                            <button
                              className="w-full px-4 py-3 bg-(--accent) text-white rounded-lg hover:bg-(--accent-hover) transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold group/btn"
                              onClick={() => openViewContractModal(contract)}
                            >
                              <Icon
                                name="document"
                                className="w-5 h-5 transition-transform group-hover/btn:scale-110"
                              />
                              Ver Detalle
                            </button>
                            {contract.status !== "terminated" &&
                              contract.status !== "expired" && (
                                <div className="flex gap-2">
                                  <button
                                    className="flex-1 px-4 py-2 bg-(--primary) text-white rounded-lg hover:bg-(--primary-light) transition-all flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                                    onClick={() =>
                                      openEditContractModal(contract)
                                    }
                                  >
                                    <Icon name="edit" className="w-4 h-4" />
                                    Editar
                                  </button>
                                  <button
                                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                                    onClick={() =>
                                      handleDeleteContract(contract.id)
                                    }
                                  >
                                    <Icon name="trash" className="w-4 h-4" />
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
                  {contractMeta && (contractMeta.lastPage ?? 0) > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination
                        currentPage={contractPage}
                        totalPages={contractMeta.lastPage ?? 0}
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

