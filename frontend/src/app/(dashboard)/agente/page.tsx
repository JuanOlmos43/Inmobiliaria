"use client";

import { useState } from "react";
import { useAgentProperties } from "@/hooks/useAgentProperties";
import { Contract } from "@/types/api";

// Components
import AgentStatsGrid from "@/components/dashboard/agent/AgentStatsGrid";
import Icon from "@/components/UI/Icon";
import Toast from "@/components/UI/Toast";
import TabNavigation from "@/components/UI/TabNavigation";
import AgentPropertyCard from "@/components/dashboard/agent/AgentPropertyCard";
import PropertyModal from "@/components/dashboard/agent/PropertyModal";
import RentalModal from "@/components/dashboard/agent/RentalModal";
import ViewContractModal from "@/components/dashboard/agent/ViewContractModal";
import UpcomingExpirations from "@/components/dashboard/agent/UpcomingExpirations";
import AgentPropertiesFilters from "@/components/dashboard/agent/AgentPropertiesFilters";
import ContractFilters from "@/components/dashboard/agent/ContractFilters";
import BasePropertyCard from "@/components/BasePropertyCard";

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
    // isLoadingContracts,

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
    handleDeleteContract,
    closePropertyModal,
    closeRentalModal,
    isViewContractModalOpen,
    viewingContract,
    openViewContractModal,
    closeViewContractModal,
  } = useAgentProperties();

  // Estado para filtros de contratos
  const [searchAddress, setSearchAddress] = useState("");
  const [searchOwner, setSearchOwner] = useState("");
  const [searchTenant, setSearchTenant] = useState("");
  const [contractStatus, setContractStatus] = useState("all");

  const rentedProperties = contracts;

  return (
    <div className="min-h-screen bg-(--background)">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SECCIÓN: ESTADÍSTICAS */}
        <AgentStatsGrid stats={stats} isLoading={isLoadingStats} />

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
                      showStatusBadge={false}
                      showDetails={false}
                      status={
                        contract.status === "active" ? "Activa" : "Pausada"
                      }
                      footerSlot={
                        <button
                          className="w-full px-4 py-3 bg-(--accent) text-white rounded-lg hover:bg-(--accent-hover) transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold"
                          onClick={() => openViewContractModal(contract)}
                        >
                          <Icon name="document" className="w-5 h-5" />
                          Ver Contrato
                        </button>
                      }
                    />
                  ))}
                </div>
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
          onRevoke={async (id) => {
            const success = await handleDeleteContract(id);
            if (success) {
              closeViewContractModal();
            }
          }}
        />
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
