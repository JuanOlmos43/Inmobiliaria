import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import { UserProfile, UserRole } from '@/types/api'

/**
 * Servicio para operaciones relacionadas con usuarios
 */
export const usersService = {
    /**
     * Obtiene la lista de usuarios, opcionalmente filtrada por rol
     */
    async getUsers(role?: UserRole): Promise<UserProfile[]> {
        const queryParams = role ? `?role=${role}` : ''
        return apiClient.get<UserProfile[]>(`${API_ENDPOINTS.USERS}${queryParams}`)
    },
}
