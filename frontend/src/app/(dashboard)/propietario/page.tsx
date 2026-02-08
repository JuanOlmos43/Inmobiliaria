"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TabNavigation } from "@/components/UI";
import RentalPropertyCard from "@/components/RentalPropertyCard";
import BasePropertyCard from "@/components/BasePropertyCard";
import ViewContractModal from "@/components/dashboard/common/ViewContractModal";
import { Icon } from "@/components/UI";
import { propertiesService } from "@/lib/api/services/properties";
import { contratosService } from "@/lib/api/services/contratos";
import { Contract } from "@/types/api";
import { Property } from "@/types/property";

// Helper functions (moved outside or kept inside if no dependencies)
const getDaysUntilExpiration = (endDate: string) => {
  const today = new Date();
  const expiration = new Date(endDate);
  const diffTime = expiration.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getDaysUntilAdjustment = (adjustmentDate?: string | null) => {
  if (!adjustmentDate) return 999;
  const today = new Date();
  const adjustment = new Date(adjustmentDate);
  const diffTime = adjustment.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

import { authService } from "@/lib/api/services/auth";
import { UserProfile } from "@/types/api";

export default function LandlordDashboardPage() {
  const [activeTab, setActiveTab] = useState<"rentals" | "properties">(
    "rentals",
  );

  // Filters
  const [listingType, setListingType] = useState<"venta" | "alquiler" | "all">(
    "all",
  );
  const [status, setStatus] = useState<string>("all");
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const openViewContractModal = (contract: Contract) => {
    // Si el contrato no trae la info del landlord (común en este endpoint), la inyectamos del usuario logueado
    if (!contract.landlord && user) {
      contract.landlord = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || undefined,
      };
    }
    setViewingContract(contract);
    setIsViewModalOpen(true);
  };

  const closeViewContractModal = () => {
    setViewingContract(null);
    setIsViewModalOpen(false);
  };

  // 1. Get User ID from "me" cache
  const { data: user } = useQuery<UserProfile>({
    queryKey: ["me"],
    queryFn: () => authService.getMe(),
    staleTime: Infinity, // Assuming "me" doesn't change often
  });

  // 2. Query for Rented Properties (Contracts)
  const { data: rentals = [], isLoading: isLoadingRentals } = useQuery({
    queryKey: ["landlord-rentals"],
    queryFn: () => contratosService.getLandlordRentedProperties(),
  });

  // 3. Query for Published Properties
  const { data: propertiesData, isLoading: isLoadingProperties } = useQuery({
    queryKey: ["landlord-properties", user?.id, listingType, status],
    queryFn: () => {
      // Logic to determine if we are filtering by Property Status or Contract Status
      const isContractStatus = status === "expired" || status === "terminated";
      const propertyStatus =
        !isContractStatus && status !== "all" ? status : undefined;
      const contractStatus = isContractStatus ? status : undefined;

      return propertiesService.findAll({
        ownerId: user?.id,
        listingType: listingType !== "all" ? listingType : undefined,
        status: propertyStatus as any,
        contractStatus: contractStatus,
      });
    },
    enabled: !!user?.id, // Only run if we have the user ID
  });

  const properties = propertiesData?.data || [];

  return (
    <div className="min-h-screen bg-(--background)">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Panel de Propietario
        </h1>

        {/* Tabs */}
        <TabNavigation
          tabs={[
            { id: "rentals", label: "Mis Rentas" },
            { id: "properties", label: "Mis Propiedades Publicadas" },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) =>
            setActiveTab(tabId as "rentals" | "properties")
          }
        />

        {/* Rentals Tab */}
        {activeTab === "rentals" && (
          <div className="mb-8">
            {isLoadingRentals ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : rentals.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <EmptyRentalsState />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentals.map((rental) => (
                  <RentalCardWrapper
                    key={rental.id}
                    rental={rental}
                    daysUntilExpiration={getDaysUntilExpiration(rental.endDate)}
                    daysUntilAdjustment={getDaysUntilAdjustment(
                      rental.nextAdjustmentDate,
                    )}
                    onViewDetails={openViewContractModal}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <div className="mb-8">
            {/* Filters Bar */}
            <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Operación
                </label>
                <select
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-(--primary) focus:border-transparent outline-none bg-white min-w-[150px]"
                >
                  <option value="all">Todas</option>
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-(--primary) focus:border-transparent outline-none bg-white min-w-[150px]"
                >
                  <option value="all">Todos</option>
                  <option value="activa">Activa</option>
                  <option value="pausada">Pausada</option>
                  {listingType === "alquiler" && (
                    <>
                      <option value="alquilada">Alquilada</option>
                      <option value="expired">Con Contrato Vencido</option>
                      <option value="terminated">Con Contrato Revocado</option>
                    </>
                  )}
                </select>
              </div>

              {(listingType !== "all" || status !== "all") && (
                <button
                  onClick={() => {
                    setListingType("all");
                    setStatus("all");
                  }}
                  className="mt-6 text-sm text-(--primary) hover:underline font-medium"
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            {isLoadingProperties ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <EmptyPropertiesState />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCardWrapper key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {isViewModalOpen && viewingContract && (
        <ViewContractModal
          isOpen={isViewModalOpen}
          onClose={closeViewContractModal}
          contract={viewingContract}
          viewerRole="landlord"
        />
      )}
    </div>
  );
}

// Sub-components for cleaner render
function EmptyRentalsState() {
  return (
    <>
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
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No tienes rentas activas
      </h3>
      <p className="text-gray-500">
        No estás alquilando ninguna propiedad actualmente
      </p>
    </>
  );
}

function EmptyPropertiesState() {
  return (
    <>
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
        No tienes propiedades publicadas
      </h3>
      <p className="text-gray-500">Comienza publicando tu primera propiedad</p>
    </>
  );
}

function RentalCardWrapper({
  rental,
  daysUntilExpiration,
  daysUntilAdjustment,
  onViewDetails,
}: {
  rental: Contract;
  daysUntilExpiration: number;
  daysUntilAdjustment: number;
  onViewDetails: (rental: Contract) => void;
}) {
  return (
    <RentalPropertyCard
      property={{
        id: rental.property.id,
        title: rental.property.title || "Propiedad", // Fallback if title is missing
        price: rental.monthlyRent,
        currency: "ARS",
        location: rental.property.location || "Ubicación desconocida",
        type: "Alquiler",
        bedrooms: rental.property.bedrooms,
        bathrooms: rental.property.bathrooms,
        area: rental.property.area,
        startDate: rental.startDate,
        endDate: rental.endDate,
        nextAdjustmentDate: rental.nextAdjustmentDate || undefined,
        adjustmentScheduledDates: rental.adjustmentScheduledDates,
        adjustmentFrequency: rental.adjustmentFrequency,
        // Since we are landlord, we see Tenant info
        landlordName: rental.tenant?.name || "Inquilino",
        landlordPhone: rental.tenant?.phone || "",
        landlordEmail: rental.tenant?.email || "",
        // Agent info
        agentName: rental.agent?.name || "",
        agentPhone: rental.agent?.phone || "",
        agentEmail: rental.agent?.email || "",
        image:
          rental.property.images?.[0]?.url ||
          rental.property.mainImage ||
          undefined,
      }}
      showPropertyDetails={true}
      warningBadge={{
        daysUntilExpiration,
        daysUntilAdjustment,
        showWarning: true,
      }}
      actions={[
        {
          label: "Ver Contrato",
          onClick: () => onViewDetails(rental),
          variant: "secondary",
          icon: <Icon name="document" className="w-5 h-5" />,
          show: true,
        },
      ]}
    />
  );
}

// Property Card Component - Using shared component
function PropertyCardWrapper({ property }: { property: Property }) {
  const publishedDate = property.createdAt
    ? new Date(property.createdAt).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const renderHistory = () => (
    <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
      {publishedDate && (
        <div className="flex justify-between text-gray-500 mb-2">
          <span>Publicada:</span>
          <span className="font-medium text-gray-700">{publishedDate}</span>
        </div>
      )}

      {property.rentalContracts && property.rentalContracts.length > 0 && (
        <div className="mt-2">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Historial de Alquileres
          </h4>
          <div className="space-y-2">
            {property.rentalContracts.slice(0, 2).map((contract) => (
              <div key={contract.id} className="bg-gray-50 p-2 rounded text-xs">
                <div className="font-medium text-gray-700">
                  {contract.tenant?.name || "Inquilino"}
                </div>
                <div className="text-gray-500 flex justify-between mt-1">
                  <span>
                    {new Date(contract.startDate).toLocaleDateString("es-ES")}
                  </span>
                  <span>-</span>
                  <span>
                    {new Date(contract.endDate).toLocaleDateString("es-ES")}
                  </span>
                </div>
              </div>
            ))}
            {property.rentalContracts.length > 2 && (
              <div className="text-center text-xs text-(--primary) cursor-pointer hover:underline">
                + {property.rentalContracts.length - 2} contratos más
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <BasePropertyCard
      title={property.title}
      price={property.price}
      currency={property.currency}
      location={property.location}
      type={property.listingType === "venta" ? "Venta" : "Alquiler"}
      bedrooms={property.bedrooms}
      bathrooms={property.bathrooms}
      area={property.area}
      image={property.mainImage}
      status={property.status}
      showStatusBadge={true}
      showTypeBadge={true}
      showDetails={true}
      footerSlot={renderHistory()}
    />
  );
}
