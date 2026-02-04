import FormInput from "@/components/UI/FormInput";
import FormSelect from "@/components/UI/FormSelect";

interface AgentPropertiesFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filterStatus: "all" | "activa" | "pausada";
  setFilterStatus: (val: "all" | "activa" | "pausada") => void;
  filterListingType: "all" | "venta" | "alquiler";
  setFilterListingType: (val: "all" | "venta" | "alquiler") => void;
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
}: AgentPropertiesFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
      <FormInput
        label="Buscar propiedades por dirección"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="ej: Av. Siempre Viva 742"
        maxLength={200}
        icon="location"
      />

      <FormSelect
        label="Filtrar por estado"
        value={filterStatus}
        onChange={(e) =>
          setFilterStatus(e.target.value as "all" | "activa" | "pausada")
        }
      >
        <option value="all">Todos los estados</option>
        <option value="activa">Activas</option>
        <option value="pausada">Pausadas</option>
      </FormSelect>

      <FormSelect
        label="Tipo de negocio"
        value={filterListingType}
        onChange={(e) =>
          setFilterListingType(e.target.value as "all" | "venta" | "alquiler")
        }
      >
        <option value="all">Venta y Alquiler</option>
        <option value="venta">Venta</option>
        <option value="alquiler">Alquiler</option>
      </FormSelect>
    </div>
  );
}
