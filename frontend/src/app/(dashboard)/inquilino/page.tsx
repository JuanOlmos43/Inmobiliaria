"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TabNavigation, Icon, EmptyState } from "@/components/ui";
import { RentalPropertyCard } from "@/components/features/properties/cards";
import ViewContractModal from "@/components/dashboard/common/ViewContractModal";
import { contratosService } from "@/lib/api/services/contratos";
import { Contract } from "@/types/api";

export default function TenantDashboardPage() {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data: rentals = [], isLoading } = useQuery({
    queryKey: ["tenant-rentals"],
    queryFn: () => contratosService.getTenantRentals(),
  });

  const activeRentals = rentals.filter((r) => r.status === "active");
  const historyRentals = rentals.filter((r) => r.status !== "active");
  const currentRentals =
    activeTab === "active" ? activeRentals : historyRentals;

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

  const openViewContractModal = (contract: Contract) => {
    setViewingContract(contract);
    setIsViewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-(--background)">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Panel de Inquilino
        </h1>

        <TabNavigation
          tabs={[
            { id: "active", label: "Mis Alquileres" },
            { id: "history", label: "Historial" },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as "active" | "history")}
        />

        <div className="mb-8">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
            </div>
          ) : currentRentals.length === 0 ? (
            <EmptyState
              title={
                activeTab === "active"
                  ? "No tienes alquileres activos"
                  : "No tienes historial de alquileres"
              }
              description={
                activeTab === "active"
                  ? "Tus contratos activos aparecerán aquí"
                  : "Tus contratos finalizados aparecerán aquí"
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentRentals.map((rental) => (
                <RentalCardWrapper
                  key={rental.id}
                  rental={rental}
                  daysUntilExpiration={getDaysUntilExpiration(rental.endDate)}
                  daysUntilAdjustment={getDaysUntilAdjustment(
                    rental.nextAdjustmentDate
                  )}
                  onViewDetails={openViewContractModal}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {isViewModalOpen && viewingContract && (
        <ViewContractModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          contract={viewingContract}
          viewerRole="tenant"
        />
      )}
    </div>
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
        id: rental.id,
        title: rental.property.title || "Propiedad",
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
        // Landlord info
        landlordName: rental.landlord?.name || "Propietario",
        landlordPhone: rental.landlord?.phone || "",
        landlordEmail: rental.landlord?.email || "",
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
        showWarning: rental.status === "active",
      }}
      // Mostrar badge de estado si no es activo (para diferenciar Vencido de Terminado)
      statusBadge={
        rental.status !== "active"
          ? {
              text: rental.status === "terminated" ? "Revocado" : "Vencido",
              variant: rental.status === "terminated" ? "danger" : "default",
            }
          : undefined
      }
      actions={[
        {
          label: "Ver Contrato",
          onClick: () => onViewDetails(rental),
          variant: "secondary",
          icon: <Icon name="document" className="h-5 w-5" />,
          show: true,
        },
      ]}
    />
  );
}
