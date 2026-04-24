import { FormInput, FormSelect, Button, Icon } from "@/components/ui";

interface AgentPropertiesFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filterStatus: "all" | "activa" | "pausada" | "alquilada" | "vendida";
  setFilterStatus: (
    val: "all" | "activa" | "pausada" | "alquilada" | "vendida"
  ) => void;
  filterListingType: "all" | "venta" | "alquiler";
  setFilterListingType: (val: "all" | "venta" | "alquiler") => void;
  onClearFilters: () => void;
}

/**
 * AgentPropertiesFilters
 * Componente de barra de herramientas para buscar y filtrar propiedades.
 */
export default function AgentPropertiesFilters({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterListingType,
  setFilterListingType,
  onClearFilters,
}: AgentPropertiesFiltersProps) {
  const hasFilters =
    searchTerm.trim() !== "" ||
    filterStatus !== "all" ||
    filterListingType !== "all";

  return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-4">
      <div className="md:col-span-2">
        <FormInput
          label="Buscar propiedades por dirección"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ej: Av. Siempre Viva 742"
          maxLength={200}
          icon="location"
        />
      </div>

      <FormSelect
        label="Tipo de negocio"
        value={filterListingType}
        onChange={(e) =>
          setFilterListingType(e.target.value as "all" | "venta" | "alquiler")
        }
      >
        <option value="all">Todos</option>
        <option value="venta">Venta</option>
        <option value="alquiler">Alquiler</option>
      </FormSelect>

      <FormSelect
        label="Filtrar por estado"
        value={filterStatus}
        onChange={(e) =>
          setFilterStatus(
            e.target.value as
              | "all"
              | "activa"
              | "pausada"
              | "alquilada"
              | "vendida"
          )
        }
      >
        <option value="all">Todos los estados</option>
        <option value="activa">Activas</option>
        <option value="pausada">Pausadas</option>
        {filterListingType === "alquiler" && (
          <option value="alquilada">Alquiladas</option>
        )}
        {filterListingType === "venta" && (
          <option value="vendida">Vendidas</option>
        )}
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
