import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type { LoginRequest, LoginResponse, UserProfile } from '@/types/api'

/**
 * Servicio para operaciones relacionadas con autenticación
 * Encapsula toda la lógica de comunicación con la API de auth
 */
export const authService = {
    /**
     * Inicia sesión con email y contraseña
     * El backend setea automáticamente las cookies httpOnly (access_token y refresh_token)
     */
    async login(email: string, password: string): Promise<LoginResponse> {
        // Validación del lado del cliente antes de enviar
        if (!email || email.trim().length === 0) {
            throw new Error('El email es requerido')
        }

        if (!password || password.trim().length === 0) {
            throw new Error('La contraseña es requerida')
        }

        const requestData: LoginRequest = {
            email: email.trim(),
            password: password,
        }

        return apiClient.post<LoginResponse, LoginRequest>(API_ENDPOINTS.LOGIN, requestData)
    },

    /**
     * Obtiene el perfil del usuario autenticado
     */
    async getMe(token?: string): Promise<UserProfile> {
        if (token) {
            apiClient.setToken(token)
        }

        return apiClient.get<UserProfile>(API_ENDPOINTS.ME)
    },

    /**
     * Cierra sesión del usuario
     * Invalida el refresh token en el backend
     */
    async logout(token?: string): Promise<{ message: string }> {
        if (token) {
            apiClient.setToken(token)
        }

        return apiClient.post<{ message: string }>(API_ENDPOINTS.LOGOUT)
    },
}
