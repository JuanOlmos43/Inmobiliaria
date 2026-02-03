import { useQuery } from "@tanstack/react-query";
import { propertiesService } from "@/lib/api/services/properties";
import { Property } from "@/types/property";

interface Filters {
  search?: string;
  status?: "activa" | "pausada";
}

/**
 * useAgentQueries
 * 
 * Maneja la obtención de datos (propiedades) del servidor.
 * Transforma los datos del backend al formato esperado por el frontend.
 * 
 * @param filters - Filtros opcionales para búsqueda y status
 * @returns {Object} Propiedades, estado de carga y funciones de retry
 */
export function useAgentQueries(filters?: Filters) {
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
