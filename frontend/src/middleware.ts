import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isPublicRoute, canAccessRoute, getDefaultRouteForRole } from '@/lib/route-config'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1) Permitir acceso a rutas públicas
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // 2) Verificar si existe access_token cookie
  const accessToken = request.cookies.get('access_token')?.value
  if (!accessToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Header con cookies del request original (clave para que el backend autentique)
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const cookieHeader = request.headers.get('cookie') ?? ''

  // Helper para mandar requests al backend con cookies
  const fetchWithCookies = (url: string, init?: RequestInit) =>
    fetch(url, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        cookie: cookieHeader,
      },
    })

  try {
    // 3) Intentar obtener el usuario con /auth/me usando cookies
    let meResponse = await fetchWithCookies(`${backendUrl}/auth/me`, {
      method: 'GET',
    })

    // 4) Si el access token expiró, intentar refresh y reintentar /auth/me
    if (meResponse.status === 401) {
      const refreshResponse = await fetchWithCookies(`${backendUrl}/auth/refresh`, {
        method: 'POST',
      })

      if (!refreshResponse.ok) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Reintentar /auth/me luego de refresh
      meResponse = await fetchWithCookies(`${backendUrl}/auth/me`, {
        method: 'GET',
      })
    }

    if (!meResponse.ok) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const user = await meResponse.json()
    const userRole = user.role

    // 5) Autorización por rol y ruta
    if (!canAccessRoute(userRole, pathname)) {
      const defaultRoute = getDefaultRouteForRole(userRole)
      return NextResponse.redirect(new URL(defaultRoute, request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('[Middleware] Error verificando autenticación:', error)
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
