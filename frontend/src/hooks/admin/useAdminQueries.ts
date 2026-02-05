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
    data: users = [],
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: retryLoadUsers,
  } = useQuery({
    queryKey: ["users", filters],
    queryFn: () => usersService.getUsers(filters),
  });

  // Query para las estadísticas generales
  const { 
    data: stats = null, 
    isLoading: isLoadingStats,
    error: statsError 
  } = useQuery({
    queryKey: ["stats"],
    queryFn: () => usersService.getStats(),
  });

  return {
    users,
    stats,
    isLoading: isLoadingUsers || isLoadingStats,
    error: (usersError || statsError) ? "Error al sincronizar con el servidor" : null,
    retryLoadUsers,
  };
}
