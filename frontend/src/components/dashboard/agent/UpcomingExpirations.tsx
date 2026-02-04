import Icon from "@/components/UI/Icon";
import BasePropertyCard from "@/components/BasePropertyCard";
import { useContractExpirations } from "@/hooks/agent/useContractExpirations";
import { ContractActivity, Contract } from "@/types/api";

interface UpcomingExpirationsProps {
  onViewContract?: (contract: Contract) => void;
}

export default function UpcomingExpirations({
  onViewContract,
}: UpcomingExpirationsProps) {
  const { expiringContracts, adjustmentContracts, isLoading } =
    useContractExpirations();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--accent)"></div>
      </div>
    );
  }

  if (expiringContracts.length === 0 && adjustmentContracts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
        <Icon name="check" className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h3 className="text-xl font-semibold text-(--primary) mb-2">
          No hay vencimientos próximos
        </h3>
        <p className="text-gray-500">
          No hay contratos que venzan o requieran ajuste en el mes actual
        </p>
      </div>
    );
  }

  const renderContractCard = (contract: ContractActivity) => (
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
      footerSlot={
        <button
          className="w-full px-4 py-3 bg-(--accent) text-white rounded-lg hover:bg-(--accent-hover) transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold group/btn"
          onClick={() => onViewContract?.(contract)}
        >
          <Icon
            name="document"
            className="w-5 h-5 transition-transform group-hover/btn:scale-110"
          />
          Ver Contrato
        </button>
      }
    />
  );

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Contratos que vencen */}
      {expiringContracts.length > 0 && (
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-(--primary) flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Icon name="calendar" className="w-6 h-6 text-red-500" />
              </div>
              Vencimientos del Mes
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                {expiringContracts.length}
              </span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {expiringContracts.map((contract) => renderContractCard(contract))}
          </div>
        </div>
      )}

      {/* Ajustes de precio próximos */}
      {adjustmentContracts.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-(--primary) flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Icon name="trending-up" className="w-6 h-6 text-amber-500" />
              </div>
              Ajustes de Precio del Mes
              <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-sm">
                {adjustmentContracts.length}
              </span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {adjustmentContracts.map((contract) =>
              renderContractCard(contract),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
