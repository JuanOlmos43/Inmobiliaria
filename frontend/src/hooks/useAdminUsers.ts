import { useAdminFilters } from "./admin/useAdminFilters";
import { useAdminQueries } from "./admin/useAdminQueries";
import { useAdminUI } from "./admin/useAdminUI";
import { useAdminMutations, DEFAULT_PASSWORD } from "./admin/useAdminMutations";
import { UserProfile } from "@/types/api";

export { DEFAULT_PASSWORD };

/**
 * useAdminUsers - Orchestrator Hook
 *
 * Este hook ahora actúa como una "fachada" que combina hooks especializados.
 * Mantiene la compatibilidad con los componentes existentes pero con una
 * estructura interna mucho más limpia y mantenible.
 */
export function useAdminUsers() {
  // 1. Capa de Filtros
  const {
    searchEmail,
    setSearchEmail,
    filterRole,
    setFilterRole,
    activeFilters,
  } = useAdminFilters();

  // 2. Capa de UI (Modales, Toasts)
  const {
    showModal,
    setShowModal,
    toast,
    showToast,
    hideToast,
    confirmReset,
    initiateResetPassword,
    closeConfirmReset,
  } = useAdminUI();

  // 3. Capa de Datos (Queries)
  const { users, stats, isLoading, error, retryLoadUsers } =
    useAdminQueries(activeFilters);

  // 4. Capa de Acciones (Mutations)
  const { handleUserCreated, executeEdit, executeReset, isResetting } =
    useAdminMutations({
      showToast,
      onSuccessClose: () => {
        setShowModal(false);
        closeConfirmReset();
      },
    });

  // Retornamos todo lo que la Page necesita (misma firma que antes)
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

    // UI State
    showModal,
    setShowModal,
    toast,
    hideToast,
    confirmReset: {
      ...confirmReset,
      isLoading: isResetting,
    },

    // Acciones y Handlers
    handleUserCreated,
    handleSaveInlineEdit: async (
      userId: string,
      data: Partial<UserProfile>,
    ) => {
      await executeEdit(userId, data);
    },
    initiateResetPassword,
    executeResetPassword: () => executeReset(confirmReset.userId),
    closeConfirmReset,
    retryLoadUsers,
  };
}
