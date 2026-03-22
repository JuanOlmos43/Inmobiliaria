import { useQuery } from "@tanstack/react-query";
import { usersService } from "@/lib/api/services/users";
import { UserFilters } from "@/types/api";

/**
 * useAdminQueries
 * Maneja la obtención de datos (usuarios y estadísticas) del servidor.
 */
export function useAdminQueries(filters?: UserFilters) {
  // Query para la lista de usuarios (re-ejecuta si cambian los filtros)
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: retryLoadUsers,
  } = useQuery({
    queryKey: ["users", filters],
    queryFn: () => usersService.getUsers(filters),
  });

  // Manejo seguro de la respuesta, soportando tanto array (legacy) como paginada
  const users = Array.isArray(usersData) ? usersData : usersData?.data || [];

  // Si es array, simulamos meta. Si es objeto, usamos su meta.
  const pagination =
    !Array.isArray(usersData) && usersData?.meta
      ? usersData.meta
      : { total: users.length, page: 1, totalPages: 1, limit: 10 };

  // Query para las estadísticas generales
  const {
    data: stats = null,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: () => usersService.getStats(),
  });

  return {
    users,
    pagination,
    stats,
    isLoading: isLoadingUsers || isLoadingStats,
    error:
      usersError || statsError ? "Error al sincronizar con el servidor" : null,
    retryLoadUsers,
  };
}
