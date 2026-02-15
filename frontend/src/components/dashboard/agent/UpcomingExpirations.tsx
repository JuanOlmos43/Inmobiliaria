import { Icon } from "@/components/ui";
import { BasePropertyCard } from "@/components/features/properties/cards";
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
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-(--accent)"></div>
      </div>
    );
  }

  if (expiringContracts.length === 0 && adjustmentContracts.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-md">
        <Icon
          name="check"
          className="mx-auto mb-4 h-16 w-16 text-(--success)"
        />
        <h3 className="mb-2 text-xl font-semibold text-(--primary)">
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
          className="group/btn flex w-full items-center justify-center gap-2 rounded-lg bg-(--accent) px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-(--accent-hover) hover:shadow-lg"
          onClick={() => onViewContract?.(contract)}
        >
          <Icon
            name="document"
            className="h-5 w-5 transition-transform group-hover/btn:scale-110"
          />
          Ver Contrato
        </button>
      }
    />
  );

  return (
    <div className="animate-fade-in space-y-12">
      {/* Contratos que vencen */}
      {expiringContracts.length > 0 && (
        <div className="animate-slide-up">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-3 text-xl font-bold text-(--primary)">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <Icon name="calendar" className="h-6 w-6 text-(--danger)" />
              </div>
              Vencimientos del Mes
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {expiringContracts.map((contract) => renderContractCard(contract))}
          </div>
        </div>
      )}

      {/* Ajustes de precio próximos */}
      {adjustmentContracts.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-3 text-xl font-bold text-(--primary)">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <Icon name="trending-up" className="h-6 w-6 text-(--warning)" />
              </div>
              Ajustes de Precio del Mes
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {adjustmentContracts.map((contract) =>
              renderContractCard(contract)
            )}
          </div>
        </div>
      )}
    </div>
  );
}
