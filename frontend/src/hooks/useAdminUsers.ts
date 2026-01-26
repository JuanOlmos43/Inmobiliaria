import { useState, useEffect, useCallback } from "react";
import { usersService } from "@/lib/api/services/users";
import { UserProfile, UserRole, UserStats, UserStatus } from "@/types/api";
import { useDebounce } from "@/hooks/useDebounce";

// ============================================
// CONSTANTES Y TIPOS LOCALES
// ============================================

export const DEFAULT_PASSWORD = "admin123";

/**
 * Interfaz que define la estructura de un usuario formateada para la UI
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  status: "active" | "inactive";
}

/**
 * useAdminUsers - Custom Hook
 *
 * Centraliza toda la lógica de negocio para el dashboard de administrador.
 * Maneja la carga de usuarios, estadísticas, filtrado con debounce y acciones
 * como crear, editar y resetear contraseñas.
 */
export function useAdminUsers() {
  // ============================================
  // ESTADOS PRINCIPALES
  // ============================================
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);

  // Estados de Filtros
  const [searchEmail, setSearchEmail] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
  const debouncedSearch = useDebounce(searchEmail, 500);

  // Estados de UI (Modales, Toasts)
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error",
    duration: 3000,
  });

  const [confirmReset, setConfirmReset] = useState({
    isOpen: false,
    userId: "",
    isLoading: false,
  });

  // ============================================
  // ACCIONES SUTILES (HELPERS)
  // ============================================

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      const duration = type === "error" ? 6000 : 3000;
      setToast({ isVisible: true, message, type, duration });
    },
    [],
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  // ============================================
  // CARGA DE DATOS (API)
  // ============================================

  /**
   * Mapeo defensivo de UserProfile (API) -> User (UI)
   */
  const mapApiUserToUI = useCallback(
    (user: UserProfile): User => ({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone || undefined,
      role: user.role,
      createdAt: user.createdAt,
      status: user.status === UserStatus.ACTIVE ? "active" : "inactive",
    }),
    [],
  );

  const loadStats = useCallback(async () => {
    try {
      const statsData = await usersService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    }
  }, []);

  const loadUsersData = useCallback(
    async (filters?: { role?: UserRole; email?: string }) => {
      try {
        setIsLoading(true);
        setError(null);
        const usersData = await usersService.getUsers(filters);
        setUsers(usersData.map(mapApiUserToUI));
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setError("Error al cargar usuarios. Por favor, intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    },
    [mapApiUserToUI],
  );

  // ============================================
  // EFECTOS
  // ============================================

  // Carga inicial de estadísticas
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Recarga automática al cambiar filtros (con debounce)
  useEffect(() => {
    const filters: { role?: UserRole; email?: string } = {};
    if (filterRole !== "all") filters.role = filterRole;
    if (debouncedSearch.trim()) filters.email = debouncedSearch.trim();

    loadUsersData(Object.keys(filters).length > 0 ? filters : undefined);
  }, [debouncedSearch, filterRole, loadUsersData]);

  // ============================================
  // HANDLERS (OPERACIONES)
  // ============================================

  const handleUserCreated = async () => {
    await Promise.all([loadUsersData(), loadStats()]);
    setShowModal(false);
  };

  const handleSaveInlineEdit = async (userId: string, data: Partial<User>) => {
    try {
      // Nota: Convertimos de vuelta a lo que espera la API si es necesario
      await usersService.updateUser(userId, data as Partial<UserProfile>);
      showToast("Usuario actualizado correctamente");

      // Actualización local (Optimistic Update)
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...data } : u)),
      );

      // Refrescamos estadísticas por si cambió estado/rol
      loadStats();
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      showToast("Error al actualizar usuario", "error");
      throw err;
    }
  };

  const initiateResetPassword = (userId: string) => {
    setConfirmReset({ isOpen: true, userId, isLoading: false });
  };

  const executeResetPassword = async () => {
    const { userId } = confirmReset;
    if (!userId) return;

    try {
      setConfirmReset((prev) => ({ ...prev, isLoading: true }));
      await usersService.updateUser(userId, { password: DEFAULT_PASSWORD });

      showToast(`Contraseña restaurada a '${DEFAULT_PASSWORD}' correctamente`);
      setConfirmReset({ isOpen: false, userId: "", isLoading: false });
    } catch (err) {
      console.error("Error al resetear contraseña:", err);
      showToast("Error al restaurar la contraseña", "error");
      setConfirmReset((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const closeConfirmReset = () => {
    setConfirmReset({ isOpen: false, userId: "", isLoading: false });
  };

  return {
    // Datos
    users,
    stats,
    isLoading,
    error,

    // Filtros
    searchEmail,
    setSearchEmail,
    filterRole,
    setFilterRole,

    // UI
    showModal,
    setShowModal,
    toast,
    hideToast,
    confirmReset,

    // Acciones
    handleUserCreated,
    handleSaveInlineEdit,
    initiateResetPassword,
    executeResetPassword,
    closeConfirmReset,
    retryLoadUsers: () => loadUsersData(),
  };
}
