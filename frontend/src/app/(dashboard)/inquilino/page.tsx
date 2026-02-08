"use client";

import { useState, useEffect } from "react";

import RentalPropertyCard from "@/components/RentalPropertyCard";
import { useAuth } from "@/hooks/useAuth";
import ViewContractModal from "@/components/dashboard/common/ViewContractModal";
import { Icon } from "@/components/UI";
import { Contract, ContractStatus } from "@/types/api";

// Tipos
interface Rental {
  id: string;
  propertyName: string;
  address: string;
  monthlyRent: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  startDate: string;
  endDate: string;
  nextAdjustmentDate: string;
  adjustmentPercentage: number;
  landlordName: string;
  landlordPhone: string;
  landlordEmail: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  status: "active" | "expiring" | "expired";
}

export default function TenantDashboardPage() {
  const { user } = useAuth(); // Usar hook de auth
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const loadRentals = () => {
    // Datos de ejemplo - en producción vendrían de una API
    const sampleRentals: Rental[] = [
      {
        id: "1",
        propertyName: "Departamento Céntrico",
        address: "Av. Principal 1234, Piso 5, Depto A",
        monthlyRent: 85000,
        bedrooms: 2,
        bathrooms: 1,
        area: 65,
        startDate: "2024-01-15",
        endDate: "2026-01-15",
        nextAdjustmentDate: "2026-01-15",
        adjustmentPercentage: 15,
        landlordName: "María González",
        landlordPhone: "+54 11 4567-8901",
        landlordEmail: "maria.gonzalez@email.com",
        agentName: "Carlos Rodríguez",
        agentPhone: "+54 11 2345-6789",
        agentEmail: "carlos.rodriguez@inmobiliaria.com",
        status: "active",
      },
      {
        id: "2",
        propertyName: "Casa en Barrio Residencial",
        address: "Calle Los Aromos 567",
        monthlyRent: 120000,
        bedrooms: 3,
        bathrooms: 2,
        area: 180,
        startDate: "2023-06-01",
        endDate: "2025-12-31",
        nextAdjustmentDate: "2025-06-01",
        adjustmentPercentage: 12,
        landlordName: "Juan Pérez",
        landlordPhone: "+54 11 5678-9012",
        landlordEmail: "juan.perez@email.com",
        agentName: "Ana Martínez",
        agentPhone: "+54 11 3456-7890",
        agentEmail: "ana.martinez@inmobiliaria.com",
        status: "expiring",
      },
    ];
    setRentals(sampleRentals);
  };

  const openViewContractModal = (rental: Rental) => {
    // Map Rental mock data to Contract interface
    const mappedContract: Contract = {
      id: rental.id,
      propertyId: rental.id,
      landlordId: "mock-landlord",
      tenantId: user?.id || "mock-tenant",
      monthlyRent: rental.monthlyRent,
      startDate: rental.startDate,
      endDate: rental.endDate,
      nextAdjustmentDate: rental.nextAdjustmentDate,
      status:
        rental.status === "expired"
          ? ContractStatus.EXPIRED
          : ContractStatus.ACTIVE,
      property: {
        id: rental.id,
        title: rental.propertyName,
        location: rental.address,
        bedrooms: rental.bedrooms || 0,
        bathrooms: rental.bathrooms || 0,
        area: rental.area || 0,
      },
      landlord: {
        id: "mock-landlord",
        name: rental.landlordName,
        email: rental.landlordEmail,
        phone: rental.landlordPhone,
      },
      tenant: {
        id: user?.id || "mock-tenant",
        name: user?.name || "Inquilino",
        email: user?.email || "",
      },
      agent: {
        id: "mock-agent",
        name: rental.agentName,
        email: rental.agentEmail,
        phone: rental.agentPhone,
      },
    };
    setViewingContract(mappedContract);
    setIsViewModalOpen(true);
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadRentals();
  }, []);

  const getDaysUntilExpiration = (endDate: string) => {
    const today = new Date();
    const expiration = new Date(endDate);
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysUntilAdjustment = (adjustmentDate: string) => {
    const today = new Date();
    const adjustment = new Date(adjustmentDate);
    const diffTime = adjustment.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-(--background)">
      {/* Header */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Rentals List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Mis Rentas</h2>
          {rentals.length === 0 ? (
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No tienes rentas activas
              </h3>
              <p className="text-gray-500">
                Comienza buscando tu próximo hogar
              </p>
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

// Rental Card Component - Using RentalPropertyCard with integrated modal
function RentalCardWrapper({
  rental,
  daysUntilExpiration,
  daysUntilAdjustment,
  onViewDetails,
}: {
  rental: Rental;
  daysUntilExpiration: number;
  daysUntilAdjustment: number;
  onViewDetails: (rental: Rental) => void;
}) {
  return (
    <RentalPropertyCard
      property={{
        id: rental.id,
        title: rental.propertyName,
        price: rental.monthlyRent,
        location: rental.address,
        type: "Alquiler",
        bedrooms: rental.bedrooms,
        bathrooms: rental.bathrooms,
        area: rental.area,
        startDate: rental.startDate,
        endDate: rental.endDate,
        nextAdjustmentDate: rental.nextAdjustmentDate,
        landlordName: rental.landlordName,
        landlordPhone: rental.landlordPhone,
        landlordEmail: rental.landlordEmail,
        agentName: rental.agentName,
        agentPhone: rental.agentPhone,
        agentEmail: rental.agentEmail,
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
