import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * useAgentFilters
 * 
 * Maneja el estado de filtros, búsqueda y navegación por tabs para el dashboard de agente.
 * Incluye debouncing automático para optimizar las queries de búsqueda.
 * 
 * @returns {Object} Estado y setters de filtros, tabs y búsqueda
 */
export function useAgentFilters() {
  // Estado de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado de filtro por status
  const [filterStatus, setFilterStatus] = useState<"all" | "activa" | "pausada">("all");
  
  // Estado de filtro por tipo de listado (venta/alquiler)
  const [filterListingType, setFilterListingType] = useState<"all" | "venta" | "alquiler">("all");
  
  // Estado de tab activo
  const [activeTab, setActiveTab] = useState<"vencimientos" | "propiedades" | "contratos">("vencimientos");

  // Aplicamos debounce para no saturar la API en cada pulsación
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Memorizamos el objeto de filtros para pasarlo a las queries
  const activeFilters = useMemo(() => {
    const filters: { 
      search?: string; 
      status?: "activa" | "pausada";
      listingType?: "venta" | "alquiler";
    } = {};
    
    if (debouncedSearch.trim()) {
      filters.search = debouncedSearch.trim();
    }
    
    if (filterStatus !== "all") {
      filters.status = filterStatus;
    }

    if (filterListingType !== "all") {
      filters.listingType = filterListingType;
    }
    
    return Object.keys(filters).length > 0 ? filters : undefined;
  }, [debouncedSearch, filterStatus, filterListingType]);

  return {
    // Estados de búsqueda
    searchTerm,
    setSearchTerm,
    debouncedSearch,
    
    // Estados de filtro
    filterStatus,
    setFilterStatus,
    filterListingType,
    setFilterListingType,
    
    // Estados de navegación
    activeTab,
    setActiveTab,
    
    // Filtros procesados para queries
    activeFilters,
  };
}
