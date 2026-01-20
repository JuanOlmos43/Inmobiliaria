/**
 * Definición centralizada de endpoints de la API
 * Facilita el mantenimiento y evita hardcoding de URLs
 */

export const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: '/auth/login',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
} as const
