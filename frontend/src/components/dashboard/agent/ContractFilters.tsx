import { FormInput, FormSelect, EmptyState, Pagination } from "@/components/ui";

interface ContractFiltersProps {
  searchAddress: string;
  setSearchAddress: (val: string) => void;
  searchOwner: string;
  setSearchOwner: (val: string) => void;
  searchTenant: string;
  setSearchTenant: (val: string) => void;
  contractStatus: string;
  setContractStatus: (val: string) => void;
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
}: ContractFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
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
    </div>
  );
}

