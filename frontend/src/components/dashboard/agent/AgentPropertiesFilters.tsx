import Icon from "@/components/UI/Icon";

interface AgentPropertiesFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filterStatus: "all" | "activa" | "pausada";
  setFilterStatus: (val: "all" | "activa" | "pausada") => void;
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
}: AgentPropertiesFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar propiedades por dirección
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ej: Av. Siempre Viva 742"
            maxLength={200}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent transition-all"
          />
          <Icon
            name="search"
            className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtrar por estado
        </label>
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as "all" | "activa" | "pausada")
          }
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent transition-all"
        >
          <option value="all">Todos los estados</option>
          <option value="activa">Activas</option>
          <option value="pausada">Pausadas</option>
        </select>
      </div>
    </div>
  );
}
