import { ApiRequestError } from '@/types/api'

/**
 * Configuración del cliente API
 */
interface ApiClientConfig {
    baseUrl: string
    token?: string
}

/**
 * Cliente HTTP para comunicación con la API
 * Centraliza la lógica de fetch, headers y manejo de errores
 */
export class ApiClient {
    private baseUrl: string
    private token?: string

    constructor(config: ApiClientConfig) {
        this.baseUrl = config.baseUrl
        this.token = config.token
    }

    /**
     * Actualiza el token de autenticación
     */
    setToken(token: string | undefined) {
        this.token = token
    }

    /**
     * Construye los headers por defecto
     */
    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`
        }

        return headers
    }

    /**
     * Maneja respuestas de error de la API
     */
    private async handleResponse<T>(response: Response): Promise<T> {
        // Si la respuesta es exitosa (2xx)
        if (response.ok) {
            return response.json()
        }

        // Intentar parsear el error como JSON
        let errorData: { message?: string; error?: string } = {}
        try {
            errorData = await response.json()
        } catch {
            // Si no es JSON, usar mensaje por defecto
        }

        const errorMessage =
            errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`

        throw new ApiRequestError(errorMessage, response.status, errorMessage)
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`

        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders(),
            credentials: 'include', // Importante para enviar/recibir cookies
        })

        return this.handleResponse<T>(response)
    }

    /**
     * POST request
     */
    async post<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
            credentials: 'include', // Importante para enviar/recibir cookies
        })

        return this.handleResponse<T>(response)
    }

    /**
     * PUT request
     */
    async put<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
            credentials: 'include',
        })

        return this.handleResponse<T>(response)
    }

    /**
     * PATCH request
     */
    async patch<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
            credentials: 'include',
        })

        return this.handleResponse<T>(response)
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
            credentials: 'include',
        })

        return this.handleResponse<T>(response)
    }
}

/**
 * Instancia singleton del cliente API
 * Se inicializa con la URL base desde las variables de entorno
 */
export const apiClient = new ApiClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
})
