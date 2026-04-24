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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Aplicamos debounce para no saturar la API en cada pulsación
  const debouncedSearch = useDebounce(searchEmail, 500);

  // Memorizamos el objeto de filtros para pasarlo a las queries
  const activeFilters = useMemo(() => {
    const filters: {
      role?: UserRole;
      email?: string;
      page: number;
      limit: number;
    } = { page, limit };

    if (filterRole !== "all") filters.role = filterRole;
    if (debouncedSearch.trim()) filters.email = debouncedSearch.trim();

    return filters;
  }, [debouncedSearch, filterRole, page, limit]);

  const clearFilters = () => {
    setSearchEmail("");
    setFilterRole("all");
    setPage(1);
  };

  return {
    searchEmail,
    setSearchEmail: (val: string) => {
      setSearchEmail(val);
      setPage(1); // Reset page on search
    },
    filterRole,
    setFilterRole: (val: UserRole | "all") => {
      setFilterRole(val);
      setPage(1); // Reset page on filter change
    },
    page,
    setPage,
    limit,
    setLimit,
    activeFilters,
    clearFilters,
  };
}
