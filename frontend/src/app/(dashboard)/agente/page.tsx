"use client";

import { useAgentProperties } from "@/hooks/useAgentProperties";

// Components
import AgentStatsGrid from "@/components/dashboard/agent/AgentStatsGrid";
import Icon from "@/components/UI/Icon";
import Toast from "@/components/UI/Toast";
import TabNavigation from "@/components/UI/TabNavigation";
import AgentPropertyCard from "@/components/dashboard/agent/AgentPropertyCard";
import PropertyModal from "@/components/dashboard/agent/PropertyModal";
import RentalModal from "@/components/dashboard/agent/RentalModal";
import UpcomingExpirations from "@/components/dashboard/agent/UpcomingExpirations";
import AgentPropertiesFilters from "@/components/dashboard/agent/AgentPropertiesFilters";

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
    isLoading,

    // Filtros
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
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
  } = useAgentProperties();

  return (
    <div className="min-h-screen bg-(--background)">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SECCIÓN: ESTADÍSTICAS */}
        <AgentStatsGrid properties={properties} />

        {/* SECCIÓN: PESTAÑAS */}
        <TabNavigation
          tabs={[
            { id: "vencimientos", label: "Próximos Vencimientos" },
            { id: "propiedades", label: "Gestión de Propiedades" },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) =>
            setActiveTab(tabId as "vencimientos" | "propiedades")
          }
        />

        <div className="mb-8">
          {activeTab === "vencimientos" ? (
            <UpcomingExpirations />
          ) : (
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

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
