import { useState, useMemo } from "react";
import { UserRole } from "@/types/api";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * useAdminFilters
 * Maneja el estado local de los filtros de búsqueda y rol para el dashboard de admin.
 */
export function useAdminFilters() {
  const [searchEmail, setSearchEmail] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");

  // Aplicamos debounce para no saturar la API en cada pulsación
  const debouncedSearch = useDebounce(searchEmail, 500);

  // Memorizamos el objeto de filtros para pasarlo a las queries
  const activeFilters = useMemo(() => {
    const filters: { role?: UserRole; email?: string } = {};
    if (filterRole !== "all") filters.role = filterRole;
    if (debouncedSearch.trim()) filters.email = debouncedSearch.trim();
    return Object.keys(filters).length > 0 ? filters : undefined;
  }, [debouncedSearch, filterRole]);

  return {
    searchEmail,
    setSearchEmail,
    filterRole,
    setFilterRole,
    activeFilters,
  };
}
