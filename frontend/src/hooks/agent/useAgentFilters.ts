import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { ContractFilters, ContractStatus } from "@/types/api";

/**
 * useAgentFilters
 * 
 * Maneja el estado de filtros, búsqueda y navegación por tabs para el dashboard de agente.
 * Incluye debouncing automático para optimizar las queries de búsqueda.
 * 
 * @returns {Object} Estado y setters de filtros, tabs y búsqueda
 */
export function useAgentFilters() {
  // Estado de tab activo
  const [activeTab, setActiveTab] = useState<"vencimientos" | "propiedades" | "contratos">("vencimientos");

  // --- Estados de Filtros (Propiedades) ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "activa" | "pausada">("all");
  const [filterListingType, setFilterListingType] = useState<"all" | "venta" | "alquiler">("all");

  // --- Estados de Filtros (Contratos) ---
  const [searchAddress, setSearchAddress] = useState("");
  const [searchOwner, setSearchOwner] = useState("");
  const [searchTenant, setSearchTenant] = useState("");
  const [contractStatus, setContractStatus] = useState("all");

  // Aplicamos debounce para no saturar la API
  const debouncedSearch = useDebounce(searchTerm, 500);
  const debouncedAddress = useDebounce(searchAddress, 500);
  const debouncedOwner = useDebounce(searchOwner, 500);
  const debouncedTenant = useDebounce(searchTenant, 500);

  // Filtros procesados para Propiedades
  const activeFilters = useMemo(() => {
    const filters: { 
      search?: string; 
      status?: "activa" | "pausada";
      listingType?: "venta" | "alquiler";
    } = {};
    
    if (debouncedSearch.trim()) filters.search = debouncedSearch.trim();
    if (filterStatus !== "all") filters.status = filterStatus;
    if (filterListingType !== "all") filters.listingType = filterListingType;
    
    return Object.keys(filters).length > 0 ? filters : undefined;
  }, [debouncedSearch, filterStatus, filterListingType]);

  const activeContractFilters = useMemo(() => {
    const filters: ContractFilters = {};

    if (debouncedAddress.trim()) filters.propertyLocation = debouncedAddress.trim();
    if (debouncedOwner.trim()) filters.landlordName = debouncedOwner.trim();
    if (debouncedTenant.trim()) filters.tenantName = debouncedTenant.trim();
    if (contractStatus !== "all") filters.status = contractStatus as ContractStatus;

    return Object.keys(filters).length > 0 ? filters : undefined;
  }, [debouncedAddress, debouncedOwner, debouncedTenant, contractStatus]);

  return {
    // Estados navegación
    activeTab,
    setActiveTab,
    
    // Filtros Propiedades
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterListingType,
    setFilterListingType,
    activeFilters,

    // Filtros Contratos
    searchAddress,
    setSearchAddress,
    searchOwner,
    setSearchOwner,
    searchTenant,
    setSearchTenant,
    contractStatus,
    setContractStatus,
    activeContractFilters,
  };
}
