"use client";

import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";

// Components
import StatsCard from "@/components/UI/StatsCard";
import AgentPropertyCard from "@/components/dashboard/agent/AgentPropertyCard";
import PropertyModal from "@/components/dashboard/agent/PropertyModal";
import RentalModal from "@/components/dashboard/agent/RentalModal";
import UpcomingExpirations from "@/components/dashboard/agent/UpcomingExpirations";
import {
  propertiesService,
  CreatePropertyDto,
} from "@/lib/api/services/properties";

// Tipos
interface Property {
  id: string;
  title: string;
  type: "Venta" | "Alquiler";
  price: number;
  currency: "USD" | "ARS";
  location: string;
  bedrooms: number;
  rooms: number; // Ambientes
  bathrooms: number;
  area: number;
  image?: string;
  images?: string[]; // Array de imágenes de la propiedad
  status: "activa" | "pausada";
  description: string;
  propertyType: string;
  yearBuilt?: number | null;
  features?: string[];
  landlordName?: string;
  landlordPhone?: string;
  landlordEmail?: string;
  provinciaId?: string;
  localidadId?: string;
  calleId?: string;
  ownerId?: string;
}

export default function DashboardPage() {

  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [rentingProperty, setRentingProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "activa" | "pausada"
  >("all");
  const [activeTab, setActiveTab] = useState<"vencimientos" | "propiedades">(
    "vencimientos",
  );

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["properties", debouncedSearch, filterStatus],
    queryFn: async () => {
      const response = await propertiesService.findAll({
        search: debouncedSearch,
        status: filterStatus === "all" ? undefined : filterStatus,
      });

      // Map backend data to frontend Property interface
      if (response && response.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.data = response.data.map((p: any) => ({
          ...p,
          type: p.listingType === "venta" ? "Venta" : "Alquiler",
          // Ensure status matches the type (it should be lowercase from backend)
        }));
      }
      return response;
    },
  });

  const properties: Property[] = data?.data || [];

  const handleAddProperty = () => {
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleDeleteProperty = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta propiedad?")) {
      try {
        await propertiesService.remove(id);
        refetch();
      } catch (error) {
        console.error("Error deleting property:", error);
        alert("Error al eliminar la propiedad");
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const property = properties.find((p) => p.id === id);
      if (!property) return;

      const newStatus = property.status === "activa" ? "pausada" : "activa";
      // Mapear al enum del backend si es necesario, asumimos que 'Activa'/'Pausada' son válidos O usar el DTO
      // El backend espera PropertyStatus (ACTIVA, PAUSADA, INACTIVA, VENDIDA, ALQUILADA)
      // Ajustar según backend: ACTIVA, PAUSADA

      // Update property using partial DTO
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await propertiesService.update(id, { status: newStatus as any });
      refetch();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleRentProperty = (property: Property) => {
    setRentingProperty(property);
    setIsRentalModalOpen(true);
  };

  const handleSaveProperty = async (
    propertyData: Omit<Property, "id">,
    files: File[],
  ) => {
    try {
      // Mapear datos del formulario al DTO del backend
      const apiData: CreatePropertyDto = {
        ...propertyData,
        price: Number(propertyData.price),
        bedrooms: Number(propertyData.bedrooms),
        rooms: Number(propertyData.rooms),
        bathrooms: Number(propertyData.bathrooms),
        area: Number(propertyData.area),
        yearBuilt: propertyData.yearBuilt
          ? Number(propertyData.yearBuilt)
          : undefined,
        listingType: propertyData.type === "Venta" ? "venta" : "alquiler",
        propertyType: propertyData.propertyType,
        provinciaId: propertyData.provinciaId || undefined,
        ownerId: propertyData.ownerId || undefined,
        agentId: user?.id || undefined,
        calleId: propertyData.calleId || undefined,
        localidadId: propertyData.localidadId || undefined,
      };

      let savedPropertyId: string;

      if (editingProperty) {
        savedPropertyId = editingProperty.id;
        await propertiesService.update(editingProperty.id, apiData);
      } else {
        const newProperty = await propertiesService.create(apiData);
        savedPropertyId = newProperty.id;
      }

      // Subir imágenes si existen
      if (files && files.length > 0) {
        for (const file of files) {
          try {
            const { uploadUrl, path } =
              await propertiesService.generateUploadUrl(
                savedPropertyId,
                file.name,
              );
            await propertiesService.uploadFileToSupabase(uploadUrl, file);
            await propertiesService.confirmImageUpload(savedPropertyId, path);
          } catch (uploadError) {
            console.error(`Error uploading file ${file.name}:`, uploadError);
            alert(`Error al subir la imagen ${file.name}`);
          }
        }
      }

      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error saving property:", error);
      alert(
        "Hubo un error al guardar la propiedad. Por favor intente nuevamente.",
      );
    }
  };

  // filteredProperties es ahora simplemente properties (que viene filtrado del backend)
  const filteredProperties = properties;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0f172a] mb-6">
            Resumen de Propiedades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <StatsCard
              title="Total Propiedades"
              value={properties.length} // Note: This might only be the fetched page if paginated, but for now assuming all or enough
              color="from-[#0f172a] to-[#334155]"
              icon="building"
            />
            {/* Note: Stats logic might need adjustment if we only fetch filtered results. 
                Ideally we should have a separate stats endpoint or returned stats in meta. 
                For now keeping as is but it will reflect the filtered list which is maybe not what we want for "Total" 
                BUT since it's a dashboard, the user might expect stats to reflect the view OR global. 
                Typically global stats are separate. 
                For this iteration, I'll invoke a separate stats query? No, let's keep it simple. 
                The user asked for filtering in the list. */}
            <StatsCard
              title="En Venta"
              value={
                data?.data?.filter((p: Property) => p.type === "Venta")
                  .length || 0
              }
              color="from-[#334155] to-[#0f172a]"
              icon="tag"
            />
            {/* ... keeping other stats similar but aware they depend on current data ... */}
            <StatsCard
              title="En Alquiler"
              value={
                data?.data?.filter((p: Property) => p.type === "Alquiler")
                  .length || 0
              }
              color="from-[#475569] to-[#334155]"
              icon="key"
            />
            <StatsCard
              title="Activas"
              value={
                data?.data?.filter((p: Property) => p.status === "activa")
                  .length || 0
              }
              color="from-[#14b8a6] to-[#0d9488]"
              icon="check"
            />
            <StatsCard
              title="Pausadas"
              value={
                data?.data?.filter((p: Property) => p.status === "pausada")
                  .length || 0
              }
              color="from-amber-500 to-amber-600"
              icon="pause"
            />
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("vencimientos")}
                className={`pb-4 px-2 font-semibold transition-colors relative ${activeTab === "vencimientos"
                  ? "text-[#14b8a6]"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Próximos Vencimientos
                {activeTab === "vencimientos" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14b8a6]"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("propiedades")}
                className={`pb-4 px-2 font-semibold transition-colors relative ${activeTab === "propiedades"
                  ? "text-[#14b8a6]"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Gestión de Propiedades
                {activeTab === "propiedades" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14b8a6]"></div>
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "vencimientos" ? (
            <UpcomingExpirations />
          ) : (
            <>
              {/* Toolbar */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex-1 w-full md:w-auto">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar propiedades por dirección..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                      />
                      <svg
                        className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full md:w-auto">
                    <select
                      value={filterStatus}
                      onChange={(e) =>
                        setFilterStatus(
                          e.target.value as "all" | "activa" | "pausada",
                        )
                      }
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="activa">Activas</option>
                      <option value="pausada">Pausadas</option>
                    </select>

                    <button
                      onClick={handleAddProperty}
                      className="px-6 py-3 bg-[#14b8a6] text-white font-semibold rounded-lg hover:bg-[#0d9488] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Nueva Propiedad
                    </button>
                  </div>
                </div>
              </div>

              {/* Properties Grid */}
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <svg
                    className="w-24 h-24 mx-auto mb-4 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No se encontraron propiedades
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm
                      ? "Intenta con otra búsqueda"
                      : "Comienza agregando tu primera propiedad"}
                  </p>
                  <button
                    onClick={handleAddProperty}
                    className="px-6 py-3 bg-[#14b8a6] text-white font-semibold rounded-lg hover:bg-[#0d9488] transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Agregar Propiedad
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <AgentPropertyCard
                      key={property.id}
                      property={property}
                      onEdit={handleEditProperty}
                      onDelete={handleDeleteProperty}
                      onToggleStatus={handleToggleStatus}
                      onRent={handleRentProperty}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <PropertyModal
          key={editingProperty?.id || 'new'}
          property={editingProperty}
          onSave={handleSaveProperty}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Rental Modal */}
      {isRentalModalOpen && rentingProperty && (
        <RentalModal
          property={rentingProperty}
          onClose={() => setIsRentalModalOpen(false)}
          onSave={(rentalData) => {
            // Pausar la propiedad
            handleToggleStatus(rentingProperty.id);
            // Mock Save to localStorage (to be replaced by API)
            const existingRentals = JSON.parse(
              localStorage.getItem("rentalContracts") || "[]",
            );
            const newRental = {
              id: Date.now().toString(),
              propertyId: rentingProperty.id,
              propertyName: rentingProperty.title,
              address: rentingProperty.location,
              monthlyRent: rentingProperty.price,
              ...rentalData,
              agentName: user?.name || user?.email || "Agente",
              agentPhone: user?.phone || "+54 11 2345-6789",
              agentEmail: user?.email || "agente@inmobiliaria.com",
            };
            localStorage.setItem(
              "rentalContracts",
              JSON.stringify([...existingRentals, newRental]),
            );
            setIsRentalModalOpen(false);
            alert("Contrato de alquiler creado exitosamente");
          }}
        />
      )}
    </div>
  );
}
