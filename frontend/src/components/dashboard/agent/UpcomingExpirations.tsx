import { useState, useEffect } from "react";
import Icon from "@/components/UI/Icon";
import RentalPropertyCard from "@/components/RentalPropertyCard";

// Tipos
interface RentalContract {
  id: string;
  propertyId?: string;
  propertyName: string;
  address: string;
  monthlyRent: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  startDate: string;
  endDate: string;
  nextAdjustmentDate: string;
  adjustmentPercentage: number;
  landlordName: string;
  landlordPhone: string;
  landlordEmail: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  status: "active" | "inactive";
}

export default function UpcomingExpirations() {
  const [expiringContracts, setExpiringContracts] = useState<RentalContract[]>(
    [],
  );
  const [adjustmentContracts, setAdjustmentContracts] = useState<
    RentalContract[]
  >([]);

  useEffect(() => {
    // Mock fetch replacement using localStorage (to be replaced by API)
    const storedContracts = localStorage.getItem("rentalContracts");
    const contracts = storedContracts ? JSON.parse(storedContracts) : [];

    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // Filtrar contratos que vencen en los próximos 30 días
    const expiring = contracts.filter((contract: RentalContract) => {
      const endDate = new Date(contract.endDate);
      return (
        endDate >= today &&
        endDate <= thirtyDaysFromNow &&
        contract.status === "active"
      );
    });

    // Filtrar contratos que requieren ajuste de precio en los próximos 30 días
    const adjustments = contracts.filter((contract: RentalContract) => {
      if (!contract.nextAdjustmentDate || contract.status !== "active")
        return false;
      const adjustmentDate = new Date(contract.nextAdjustmentDate);
      return adjustmentDate >= today && adjustmentDate <= thirtyDaysFromNow;
    });

    setExpiringContracts(expiring);
    setAdjustmentContracts(adjustments);
  }, []);

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (expiringContracts.length === 0 && adjustmentContracts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <Icon name="check" className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No hay vencimientos próximos
        </h3>
        <p className="text-gray-500">
          No hay contratos que venzan o requieran ajuste en los próximos 30 días
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Contratos que vencen */}
      {expiringContracts.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-[#0f172a] mb-4 flex items-center gap-2">
            <Icon name="calendar" className="w-5 h-5 text-red-500" />
            Contratos por Vencer ({expiringContracts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expiringContracts.map((contract) => (
              <RentalPropertyCard
                key={contract.id}
                property={{
                  id: contract.id,
                  title: contract.propertyName,
                  price: contract.monthlyRent,
                  location: contract.address,
                  type: "Alquiler",
                  bedrooms: contract.bedrooms,
                  bathrooms: contract.bathrooms,
                  area: contract.area,
                  startDate: contract.startDate,
                  endDate: contract.endDate,
                  nextAdjustmentDate: contract.nextAdjustmentDate,
                  landlordName: contract.landlordName,
                  landlordPhone: contract.landlordPhone,
                  landlordEmail: contract.landlordEmail,
                  tenantName: contract.tenantName,
                  tenantPhone: contract.tenantPhone,
                  tenantEmail: contract.tenantEmail,
                  agentName: contract.agentName,
                  agentPhone: contract.agentPhone,
                  agentEmail: contract.agentEmail,
                }}
                viewerRole="agent"
                showPropertyDetails={true}
                warningBadge={{
                  daysUntilExpiration: getDaysUntil(contract.endDate),
                  daysUntilAdjustment: getDaysUntil(
                    contract.nextAdjustmentDate,
                  ),
                  showWarning: true,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ajustes de precio próximos */}
      {adjustmentContracts.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-[#0f172a] mb-4 flex items-center gap-2">
            <Icon name="trending-up" className="w-5 h-5 text-amber-500" />
            Ajustes de Precio Próximos ({adjustmentContracts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adjustmentContracts.map((contract) => (
              <RentalPropertyCard
                key={contract.id}
                property={{
                  id: contract.id,
                  title: contract.propertyName,
                  price: contract.monthlyRent,
                  location: contract.address,
                  type: "Alquiler",
                  bedrooms: contract.bedrooms,
                  bathrooms: contract.bathrooms,
                  area: contract.area,
                  startDate: contract.startDate,
                  endDate: contract.endDate,
                  nextAdjustmentDate: contract.nextAdjustmentDate,
                  landlordName: contract.landlordName,
                  landlordPhone: contract.landlordPhone,
                  landlordEmail: contract.landlordEmail,
                  tenantName: contract.tenantName,
                  tenantPhone: contract.tenantPhone,
                  tenantEmail: contract.tenantEmail,
                  agentName: contract.agentName,
                  agentPhone: contract.agentPhone,
                  agentEmail: contract.agentEmail,
                }}
                viewerRole="agent"
                showPropertyDetails={true}
                warningBadge={{
                  daysUntilExpiration: getDaysUntil(contract.endDate),
                  daysUntilAdjustment: getDaysUntil(
                    contract.nextAdjustmentDate,
                  ),
                  showWarning: true,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
