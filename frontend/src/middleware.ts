import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isPublicRoute, canAccessRoute, getDefaultRouteForRole } from '@/lib/route-config'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Helper para mandar requests al backend con cookies
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const cookieHeader = request.headers.get('cookie') ?? ''

  const fetchWithCookies = (url: string, init?: RequestInit) =>
    fetch(url, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        cookie: cookieHeader,
      },
    })

  // Función para validar sesión (usada tanto en rutas protegidas como en login)
  const validateSession = async () => {
    try {
      // 3) Intentar obtener el usuario con /auth/me usando cookies originales
      let meResponse = await fetchWithCookies(`${backendUrl}/auth/me`, {
        method: 'GET',
      })

      let newCookies: string | null = null;
      let refreshResponse: Response | null = null;

      // 4) Si el access token expiró (401), intentar refresh
      if (meResponse.status === 401) {
        refreshResponse = await fetchWithCookies(`${backendUrl}/auth/refresh`, {
          method: 'POST',
        })

        if (!refreshResponse.ok) {
          return null // Refresh falló, sesión inválida
        }

        // Extraer las nuevas cookies del response del refresh
        // Nota: En Edge/Node headers.get('set-cookie') puede combinar múltiples cookies con comas,
        // o usar getSetCookie() si está disponible.
        // Para simplificar y asegurar que funcione, asumiremos que recibimos access_token y refresh_token.
        // Fetch API en Next Middleware maneja cookies un poco manual.
        const setCookieHeader = refreshResponse.headers.get('set-cookie')

        if (setCookieHeader) {
          newCookies = setCookieHeader

          // Reintentar /auth/me CON LAS NUEVAS COOKIES
          // Necesitamos pasar el header 'cookie' actualizado manualmente.
          // set-cookie viene como: "access_token=...; Path=/, refresh_token=...; Path=/"
          // Request cookie espera: "access_token=...; refresh_token=..."
          // Hacemos una conversión simple (aunque imperfecta, suele funcionar para este caso)
          const cookieForRequest = setCookieHeader.split(',')
            .map(c => c.split(';')[0])
            .join('; ')

          meResponse = await fetch(`${backendUrl}/auth/me`, {
            method: 'GET',
            headers: {
              cookie: cookieForRequest
            }
          })
        }
      }

      if (!meResponse.ok) {
        return null
      }

      const user = await meResponse.json()

      // Devolvemos el usuario y, si hubo refresh, las cookies nuevas para setear en el navegador
      return { user, newCookiesResponse: refreshResponse }
    } catch (error) {
      console.error('[Middleware] Error validando sesión:', error)
      return null
    }
  }

  // 1) Logica para rutas públicas (incluyendo Login)
  if (isPublicRoute(pathname)) {
    // Si es Login y tiene cookie, verificar si ya está autenticado para redirigir
    if (pathname === '/login' && (request.cookies.has('access_token') || request.cookies.has('refresh_token'))) {
      const session = await validateSession()
      if (session) {
        // Usuario autenticado intentando entrar a login -> Redirigir al dashboard (o home de su rol)
        const defaultRoute = getDefaultRouteForRole(session.user.role)
        const response = NextResponse.redirect(new URL(defaultRoute, request.url))

        // Si hubo refresh, propagar cookies al navegador
        if (session.newCookiesResponse) {
          const setCookieHeader = session.newCookiesResponse.headers.get('set-cookie')
          if (setCookieHeader) {
            // Nota: respuesta simple copiando el header tal cual.
            // Next.js maneja esto mejor con cookies.set() pero set-cookie raw funciona en headers.
            response.headers.set('set-cookie', setCookieHeader)
          }
        }
        return response
      }
      // Si la sesión no es válida, dejamos pasar al login (NextResponse.next())
    }
    return NextResponse.next()
  }

  // 2) Rutas Protegidas - Verificar si existe access_token o refresh_token cookie
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  if (!accessToken && !refreshToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 3) Validar sesión en rutas protegidas
  const session = await validateSession()

  if (!session) {
    // Token inválido o expirado y no refrescable
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const { user } = session

  // 5) Autorización por rol y ruta
  // 5) Autorización por rol y ruta
  if (!canAccessRoute(user.role, pathname)) {
    const defaultRoute = getDefaultRouteForRole(user.role)
    const response = NextResponse.redirect(new URL(defaultRoute, request.url))
    if (session.newCookiesResponse) {
      const setCookieHeader = session.newCookiesResponse.headers.get('set-cookie')
      if (setCookieHeader) {
        response.headers.set('set-cookie', setCookieHeader)
      }
    }
    return response
  }

  const response = NextResponse.next()
  if (session.newCookiesResponse) {
    const setCookieHeader = session.newCookiesResponse.headers.get('set-cookie')
    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader)
    }
  }
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
