import { useQuery } from "@tanstack/react-query";
import { propertiesService } from "@/lib/api/services/properties";
import { contratosService } from "@/lib/api/services/contratos";
import { Property, PropertyStats, PropertyFilters } from "@/types/property";
import { Contract, ContractFilters } from "@/types/api";

/**
 * useAgentQueries
 * 
 * Maneja la obtención de datos (propiedades) del servidor.
 * Transforma los datos del backend al formato esperado por el frontend.
 * 
 * @param filters - Filtros opcionales para búsqueda y status
 * @returns {Object} Propiedades, estado de carga y funciones de retry
 */
export function useAgentQueries(filters?: PropertyFilters) {
  // Query para la lista de propiedades (re-ejecuta si cambian los filtros)
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["properties", filters],
    queryFn: async () => {
      const response = await propertiesService.findAll({
        search: filters?.search,
        status: filters?.status,
        listingType: filters?.listingType,
      });

      // Ya no necesitamos transformar datos, Property ahora coincide con el backend
      return response;
    },
  });

  // Extraer las propiedades del response
  const properties: Property[] = data?.data || [];

  return {
    properties,
    isLoading,
    error: error ? "Error al cargar las propiedades" : null,
    refetch,
  };
}

/**
 * usePropertyStats
 * 
 * Obtiene las estadísticas de propiedades desde el backend.
 * Incluye totales, distribución por estado y tipo de listado.
 * 
 * @returns {Object} Estadísticas, estado de carga y funciones de retry
 */
export function usePropertyStats(): {
  stats: PropertyStats | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["property-stats"],
    queryFn: async () => {
      return await propertiesService.getStats();
    },
  });

  return {
    stats,
    isLoading,
    error: error ? "Error al cargar las estadísticas" : null,
    refetch,
  };
}

/**
 * useAgentContracts
 * 
 * Obtiene la lista de contratos de alquiler con filtros opcionales.
 * 
 * @param filters - Filtros de búsqueda (dirección, nombres, status)
 */
export function useAgentContracts(filters?: ContractFilters) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["contracts", filters],
    queryFn: async () => {
      return await contratosService.findAll(filters);
    },
    // Mantener los datos anteriores mientras se carga el filtro mejora la UX
    placeholderData: (previousData) => previousData,
  });

  const contracts: Contract[] = data?.data || [];
  const meta = data?.meta;

  return {
    contracts,
    meta,
    isLoading,
    error: error ? "Error al cargar los contratos" : null,
    refetch,
  };
}

/**
 * useContractStats
 * 
 * Obtiene estadísticas específicas de contratos (activos, vencimientos del mes, etc)
 */
export function useContractStats() {
  const { data: contractStats, isLoading, error, refetch } = useQuery({
    queryKey: ["contract-stats"],
    queryFn: () => contratosService.getStats(),
  });

  return {
    contractStats,
    isLoading,
    error: error ? "Error al cargar estadísticas de contratos" : null,
    refetch,
  };
}
