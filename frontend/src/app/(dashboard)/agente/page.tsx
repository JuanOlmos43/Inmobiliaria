"use client";

import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Components
import AgentStatsGrid from "@/components/dashboard/agent/AgentStatsGrid";
import Icon from "@/components/UI/Icon";
import AgentPropertyCard from "@/components/dashboard/agent/AgentPropertyCard";
import PropertyModal from "@/components/dashboard/agent/PropertyModal";
import RentalModal from "@/components/dashboard/agent/RentalModal";
import UpcomingExpirations from "@/components/dashboard/agent/UpcomingExpirations";
import {
  propertiesService,
  CreatePropertyDto,
} from "@/lib/api/services/properties";

import { Property } from "@/types/property";

export default function DashboardPage() {
  const queryClient = useQueryClient();

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
          image: p.mainImage,
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
        title: propertyData.title,
        description: propertyData.description,
        propertyType: propertyData.propertyType,
        listingType: propertyData.type === "Venta" ? "venta" : "alquiler",
        price: Number(propertyData.price),
        bedrooms: Number(propertyData.bedrooms),
        rooms: Number(propertyData.rooms),
        bathrooms: Number(propertyData.bathrooms),
        area: Number(propertyData.area),
        // Solo enviar yearBuilt si es un valor válido (>= 1800)
        yearBuilt:
          propertyData.yearBuilt && Number(propertyData.yearBuilt) >= 1800
            ? Number(propertyData.yearBuilt)
            : undefined,
        streetNumber: propertyData.streetNumber,
        apartment: propertyData.apartment,
        location: propertyData.location,
        provinciaId: propertyData.provinciaId || undefined,
        localidadId: propertyData.localidadId || undefined,
        calleId: propertyData.calleId || undefined,
        ownerId: propertyData.ownerId || undefined,
        agentId: user?.id || undefined,
        features: propertyData.features,
        // Note: images are NOT part of CreatePropertyDto - they're uploaded separately
        // mainImage will be set when first image is uploaded
      };

      let savedPropertyId: string;

      if (editingProperty) {
        savedPropertyId = editingProperty.id!;
        await propertiesService.update(editingProperty.id!, apiData);
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

      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({
        queryKey: ["property", savedPropertyId],
      });
      // Remove manual refetch as invalidate triggers it if active
      // refetch();
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
    <div className="min-h-screen bg-(--background)">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <AgentStatsGrid properties={properties} />

        {/* Tabs Section */}
        <div className="mb-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("vencimientos")}
                className={`pb-4 px-2 font-semibold transition-colors relative ${
                  activeTab === "vencimientos"
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
                className={`pb-4 px-2 font-semibold transition-colors relative ${
                  activeTab === "propiedades"
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
                    <div className="relative flex-1">
                      <Icon
                        name="search"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Buscar propiedades por dirección..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent transition-all"
                      />
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
                    className=" px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent transition-all"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="activa">Activas</option>
                      <option value="pausada">Pausadas</option>
                    </select>

                    <button
                      onClick={handleAddProperty}
                      className="px-6 py-3 bg-(--accent) text-white rounded-lg hover:bg-(--accent-hover) transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:scale-105"
                    >
                      <Icon name="plus" className="w-5 h-5" />
                      Agregar Propiedad
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
                <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
                    <Icon name="building" className="w-10 h-10 text-(--accent)" />
                  </div>
                  <h3 className="text-xl font-bold text-(--primary) mb-2">
                    No se encontraron propiedades
                  </h3>
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
            handleToggleStatus(rentingProperty.id!);
            // Mock Save to localStorage (to be replaced by API)
            const existingRentals = JSON.parse(
              localStorage.getItem("rentalContracts") || "[]",
            );
            const newRental = {
              id: Date.now().toString(),
              propertyId: rentingProperty.id!,
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
