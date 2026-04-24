import { FormInput, FormSelect, Button, Icon } from "@/components/ui";

interface ContractFiltersProps {
  searchAddress: string;
  setSearchAddress: (val: string) => void;
  searchOwner: string;
  setSearchOwner: (val: string) => void;
  searchTenant: string;
  setSearchTenant: (val: string) => void;
  contractStatus: string;
  setContractStatus: (val: string) => void;
  onClearFilters: () => void;
}

/**
 * ContractFilters
 * Componente de barra de herramientas para buscar y filtrar contratos de alquiler.
 */
export default function ContractFilters({
  searchAddress,
  setSearchAddress,
  searchOwner,
  setSearchOwner,
  searchTenant,
  setSearchTenant,
  contractStatus,
  setContractStatus,
  onClearFilters,
}: ContractFiltersProps) {
  const hasFilters =
    searchAddress.trim() !== "" ||
    searchOwner.trim() !== "" ||
    searchTenant.trim() !== "" ||
    contractStatus !== "all";

  return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-4">
      {/* Buscar por dirección */}
      <FormInput
        label="Buscar propiedades por dirección"
        type="text"
        value={searchAddress}
        onChange={(e) => setSearchAddress(e.target.value)}
        placeholder="ej: Av. Siempre Viva 742"
        maxLength={200}
        icon="location"
      />

      {/* Buscar por propietario */}
      <FormInput
        label="Buscar nombre Propietario"
        type="text"
        value={searchOwner}
        onChange={(e) => setSearchOwner(e.target.value)}
        placeholder="ej: Juan Pérez"
        maxLength={100}
        icon="user"
      />

      {/* Buscar por inquilino */}
      <FormInput
        label="Buscar nombre Inquilino"
        type="text"
        value={searchTenant}
        onChange={(e) => setSearchTenant(e.target.value)}
        placeholder="ej: María González"
        maxLength={100}
        icon="user"
      />
      {/* Estado del contrato */}
      <FormSelect
        label="Estado del contrato"
        value={contractStatus}
        onChange={(e) => setContractStatus(e.target.value)}
      >
        <option value="all">Todos los estados</option>
        <option value="active">Activo</option>
        <option value="expired">Vencido</option>
        <option value="terminated">Terminado</option>
      </FormSelect>

      {hasFilters && (
        <div className="flex items-center md:col-span-4 md:justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            icon={<Icon name="close" className="h-4 w-4" />}
            className="animate-in fade-in slide-in-from-right-2 duration-300"
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
