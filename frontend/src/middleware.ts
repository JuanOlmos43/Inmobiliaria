import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isPublicRoute, canAccessRoute, getDefaultRouteForRole } from '@/lib/route-config'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 1. Permitir acceso a rutas públicas sin verificación
    if (isPublicRoute(pathname)) {
        return NextResponse.next()
    }

    // 2. Verificar si existe access_token
    const accessToken = request.cookies.get('access_token')?.value

    if (!accessToken) {
        // No hay token, redirigir a login
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // 3. Obtener el rol del usuario llamando a auth/me
    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const response = await fetch(`${backendUrl}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        })

        if (!response.ok) {
            // Token inválido o expirado, redirigir a login
            const loginUrl = new URL('/login', request.url)
            return NextResponse.redirect(loginUrl)
        }

        const user = await response.json()
        const userRole = user.role

        // 4. Verificar si el usuario puede acceder a esta ruta
        if (!canAccessRoute(userRole, pathname)) {
            // No tiene permiso, redirigir a su ruta por defecto
            const defaultRoute = getDefaultRouteForRole(userRole)
            return NextResponse.redirect(new URL(defaultRoute, request.url))
        }

        // 5. Usuario autenticado y con permisos, permitir acceso
        return NextResponse.next()

    } catch (error) {
        console.error('[Middleware] Error verificando autenticación:', error)
        // En caso de error, redirigir a login por seguridad
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: [
        /*
         * Aplicar middleware a todas las rutas excepto:
         * - api (API routes)
         * - _next/static (archivos estáticos)
         * - _next/image (optimización de imágenes)
         * - favicon.ico
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
