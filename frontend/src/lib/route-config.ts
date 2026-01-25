import { UserRole } from '@/types/api'

/**
 * Mapeo de roles a sus rutas por defecto
 */
export const ROLE_DEFAULT_ROUTES: Record<string, string> = {
    [UserRole.Administrador]: '/admin',
    [UserRole.Agente]: '/agente',
    [UserRole.Propietario]: '/propietario',
    [UserRole.Inquilino]: '/inquilino',
    [UserRole.Gerencia]: '/gerencia',
}

/**
 * Rutas públicas que no requieren autenticación
 */
export const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/contacto',
    '/nosotros',
    '/propiedades',
]

/**
 * Patrones de rutas públicas (para rutas dinámicas)
 */
export const PUBLIC_ROUTE_PATTERNS = [
    /^\/propiedades\/[^/]+$/, // /propiedades/[id]
]

/**
 * Obtiene la ruta por defecto para un rol dado
 */
export function getDefaultRouteForRole(role: string): string {
    return ROLE_DEFAULT_ROUTES[role] || '/login'
}

/**
 * Verifica si una ruta es pública
 */
export function isPublicRoute(pathname: string): boolean {
    // Verificar rutas exactas
    if (PUBLIC_ROUTES.includes(pathname)) {
        return true
    }

    // Verificar patrones
    return PUBLIC_ROUTE_PATTERNS.some(pattern => pattern.test(pathname))
}

/**
 * Verifica si un usuario tiene acceso a una ruta
 */
export function canAccessRoute(userRole: string, pathname: string): boolean {
    // Rutas públicas son accesibles para todos
    if (isPublicRoute(pathname)) {
        return true
    }

    // Obtener la ruta base del usuario (ej: /admin, /agente)
    const userBaseRoute = ROLE_DEFAULT_ROUTES[userRole]

    if (!userBaseRoute) {
        return false
    }

    // El usuario puede acceder a su ruta base y subrutas
    return pathname.startsWith(userBaseRoute)
}
