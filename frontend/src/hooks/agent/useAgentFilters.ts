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
  const [activeTab, setActiveTab] = useState<
    "vencimientos" | "propiedades" | "contratos"
  >("vencimientos");

  // --- Estados de Filtros (Propiedades) ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "activa" | "pausada" | "alquilada" | "vendida"
  >("all");
  const [filterListingType, setFilterListingType] = useState<
    "all" | "venta" | "alquiler"
  >("all");

  // --- Estados de Filtros (Contratos) ---
  const [searchAddress, setSearchAddress] = useState("");
  const [searchOwner, setSearchOwner] = useState("");
  const [searchTenant, setSearchTenant] = useState("");
  const [contractStatus, setContractStatus] = useState("all");
  const [contractPage, setContractPage] = useState(1);

  // Aplicamos debounce para no saturar la API
  const debouncedSearch = useDebounce(searchTerm, 500);
  const debouncedAddress = useDebounce(searchAddress, 500);
  const debouncedOwner = useDebounce(searchOwner, 500);
  const debouncedTenant = useDebounce(searchTenant, 500);

  const [propertyPage, setPropertyPage] = useState(1);

  // Resetear página de propiedades cuando cambian los filtros
  const handlePropertyFilterChange = <T>(setter: (v: T) => void, value: T) => {
    setter(value);
    setPropertyPage(1);
  };

  // Filtros procesados para Propiedades
  const activeFilters = useMemo(() => {
    const filters: {
      search?: string;
      status?: "activa" | "pausada" | "alquilada" | "vendida";
      listingType?: "venta" | "alquiler";
      page?: number;
      limit?: number;
    } = {
      page: propertyPage,
      limit: 12, // 12 por página para mantener consistencia con el grid
    };

    if (debouncedSearch.trim()) filters.search = debouncedSearch.trim();
    if (filterStatus !== "all") filters.status = filterStatus;
    if (filterListingType !== "all") filters.listingType = filterListingType;

    return filters;
  }, [debouncedSearch, filterStatus, filterListingType, propertyPage]);

  const activeContractFilters = useMemo(() => {
    const filters: ContractFilters = {
      page: contractPage,
      limit: 6, // 6 por página para un grid de 2x3
    };

    if (debouncedAddress.trim())
      filters.propertyLocation = debouncedAddress.trim();
    if (debouncedOwner.trim()) filters.landlordName = debouncedOwner.trim();
    if (debouncedTenant.trim()) filters.tenantName = debouncedTenant.trim();
    if (contractStatus !== "all")
      filters.status = contractStatus as ContractStatus;

    return filters;
  }, [
    debouncedAddress,
    debouncedOwner,
    debouncedTenant,
    contractStatus,
    contractPage,
  ]);

  // Resetear página de contratos cuando cambian los filtros
  const handleContractFilterChange = <T>(setter: (v: T) => void, value: T) => {
    setter(value);
    setContractPage(1);
  };

  return {
    // Estados navegación
    activeTab,
    setActiveTab,

    propertyPage,
    setPropertyPage,

    // Filtros Propiedades
    searchTerm,
    setSearchTerm: (v: string) => handlePropertyFilterChange(setSearchTerm, v),
    filterStatus,
    setFilterStatus: (
      v: "all" | "activa" | "pausada" | "alquilada" | "vendida"
    ) => handlePropertyFilterChange(setFilterStatus, v),
    filterListingType,
    setFilterListingType: (v: "all" | "venta" | "alquiler") => {
      handlePropertyFilterChange(setFilterListingType, v);
      // Resetear filtro de status si no es compatible con el tipo de negocio
      if (v !== "alquiler" && filterStatus === "alquilada") {
        setFilterStatus("all");
      }
      if (v !== "venta" && filterStatus === "vendida") {
        setFilterStatus("all");
      }
    },
    activeFilters,

    // Filtros Contratos
    searchAddress,
    setSearchAddress: (v: string) =>
      handleContractFilterChange(setSearchAddress, v),
    searchOwner,
    setSearchOwner: (v: string) =>
      handleContractFilterChange(setSearchOwner, v),
    searchTenant,
    setSearchTenant: (v: string) =>
      handleContractFilterChange(setSearchTenant, v),
    contractStatus,
    setContractStatus: (v: string) =>
      handleContractFilterChange(setContractStatus, v),
    contractPage,
    setContractPage,
    activeContractFilters,

    // Acciones de limpieza
    clearPropertyFilters: () => {
      setSearchTerm("");
      setFilterStatus("all");
      setFilterListingType("all");
      setPropertyPage(1);
    },
    clearContractFilters: () => {
      setSearchAddress("");
      setSearchOwner("");
      setSearchTenant("");
      setContractStatus("all");
      setContractPage(1);
    },
  };
}
