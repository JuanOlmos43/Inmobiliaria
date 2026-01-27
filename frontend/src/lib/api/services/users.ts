import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { UserProfile, UserRole, UserStats } from "@/types/api";

/**
 * Servicio para operaciones relacionadas con usuarios
 */
export const usersService = {
  /**
   * Obtiene la lista de usuarios, opcionalmente filtrada por rol y/o email
   */
  async getUsers(filters?: { role?: UserRole; email?: string; search?: string }): Promise<UserProfile[]> {
    const params = new URLSearchParams();
    if (filters?.role) params.append("role", filters.role);
    if (filters?.email) params.append("email", filters.email);
    if (filters?.search) params.append("search", filters.search);

    const queryString = params.toString();
    const url = queryString ? `${API_ENDPOINTS.USERS}?${queryString}` : API_ENDPOINTS.USERS;

    return apiClient.get<UserProfile[]>(url);
  },

  /**
   * Obtiene estadísticas de usuarios del sistema
   */
  async getStats(): Promise<UserStats> {
    return apiClient.get<UserStats>(`${API_ENDPOINTS.USERS}/stats`);
  },

  /**
   * Elimina un usuario del sistema
   */
  async deleteUser(userId: string): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.USERS}/${userId}`);
  },

  /**
   * Actualiza un usuario existente
   */
  async updateUser(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    return apiClient.patch<UserProfile>(`${API_ENDPOINTS.USERS}/${userId}`, data);
  },
};
