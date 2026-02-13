import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/lib/api/services/users";
import { UserProfile } from "@/types/api";

export const DEFAULT_PASSWORD = "admin123";

interface MutationStyles {
  showToast: (msg: string, type?: "success" | "error") => void;
  onSuccessClose?: () => void;
}

/**
 * useAdminMutations
 * Maneja las operaciones de escritura (crear, editar, borrar) en el servidor.
 */
export function useAdminMutations({
  showToast,
  onSuccessClose,
}: MutationStyles) {
  const queryClient = useQueryClient();

  // Función para refrescar datos tras cualquier cambio
  const refreshData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["users"] }),
      queryClient.invalidateQueries({ queryKey: ["stats"] }),
    ]);
  };

  // 1. Accion: Usuario Creado
  const handleUserCreated = async () => {
    await refreshData();
    if (onSuccessClose) onSuccessClose();
    showToast("Usuario creado correctamente");
  };

  // 2. Mutación: Editar Usuario
  const editMutation = useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: Partial<UserProfile>;
    }) => usersService.updateUser(userId, data),
    onSuccess: () => {
      showToast("Usuario actualizado correctamente");
      refreshData();
    },
    onError: (err) => {
      console.error("Error al actualizar:", err);
      showToast("Error al actualizar usuario", "error");
    },
  });

  // 3. Mutación: Resetear Contraseña
  const resetMutation = useMutation({
    mutationFn: (userId: string) =>
      usersService.updateUser(userId, { password: DEFAULT_PASSWORD }),
    onSuccess: () => {
      showToast(`Contraseña restaurada a '${DEFAULT_PASSWORD}'`);
      if (onSuccessClose) onSuccessClose();
      refreshData();
    },
    onError: (err) => {
      console.error("Error al resetear:", err);
      showToast("Error al restaurar contraseña", "error");
    },
  });

  return {
    handleUserCreated,
    executeEdit: (userId: string, data: Partial<UserProfile>) =>
      editMutation.mutateAsync({ userId, data }),
    executeReset: (userId: string) => resetMutation.mutate(userId),
    isResetting: resetMutation.isPending,
  };
}
