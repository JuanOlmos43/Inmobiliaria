// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isPublicRoute,
  canAccessRoute,
  getDefaultRouteForRole,
} from "@/lib/route-config";
import { UserProfile, UserRole } from "@/types/api";

/**
 * ✅ Helper: aplica cookies del backend (Set-Cookie) a la respuesta de Next
 * - Soporta múltiples Set-Cookie (cuando el runtime expone getSetCookie())
 * - Fallback: usa el string único si solo viene uno
 */
function applySetCookies(from: Response, to: NextResponse) {
  // En algunos runtimes (Node/Undici), existe getSetCookie()
  // En Edge puede no estar disponible.
  const headers = from.headers as Headers & { getSetCookie?: () => string[] };

  if (typeof headers.getSetCookie === "function") {
    const cookies: string[] = headers.getSetCookie();
    for (const c of cookies) {
      to.headers.append("set-cookie", c);
    }
    return;
  }

  const setCookie = from.headers.get("set-cookie");
  if (setCookie) {
    // Si viene un solo header (una cookie o string combinado), lo mandamos tal cual.
    // IMPORTANTE: no hacemos split(",") porque puede romper Expires=Wed, ...
    to.headers.append("set-cookie", setCookie);
  }
}

/**
 * ✅ Middleware principal
 * Arquitectura: session-proxy
 * - Usa /auth/me para validar
 * - Si /auth/me da 401 => intenta /auth/refresh
 * - Propaga Set-Cookie del refresh al navegador
 *
 * 📌 Cambio clave vs tu versión:
 * - NO intenta reconstruir "Cookie" desde "Set-Cookie" (evitamos split(','))
 * - Después de refresh, NO reintenta /auth/me (mucho más robusto)
 *   => Si necesitás user luego del refresh, lo ideal es que /auth/refresh devuelva { user }
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const cookieHeader = request.headers.get("cookie") ?? "";

  const fetchWithCookies = (url: string, init?: RequestInit) =>
    fetch(url, {
      ...init,
      cache: "no-store",
      headers: {
        ...(init?.headers || {}),
        cookie: cookieHeader,
      },
    });

  /**
   * ✅ validateSession:
   * Retorna:
   * - null: no hay sesión válida
   * - { user, refreshResponse? }: sesión válida, y si refrescó, devuelve response para aplicar cookies
   */
  const validateSession = async (): Promise<null | {
    user: UserProfile | { role: UserRole | string };
    refreshResponse?: Response;
  }> => {
    try {
      // 1) Intentar sesión actual
      const meResponse = await fetchWithCookies(`${backendUrl}/auth/me`, {
        method: "GET",
      });

      if (meResponse.ok) {
        const user = await meResponse.json();
        return { user };
      }

      // 2) Si el access token expiró, intentar refresh
      if (meResponse.status !== 401) {
        return null;
      }

      const refreshResponse = await fetchWithCookies(
        `${backendUrl}/auth/refresh`,
        {
          method: "POST",
        }
      );

      if (!refreshResponse.ok) {
        return null;
      }

      /**
       * ✅ CAMBIO CLAVE:
       * No intentamos reconstruir Cookie desde Set-Cookie para reintentar /auth/me.
       *
       * Lo más robusto es que tu endpoint /auth/refresh devuelva el user:
       *   return { user: {...} }
       *
       * Si hoy tu /auth/refresh no devuelve user, tenés dos opciones:
       * - (Recomendado) cambiar Nest para que lo devuelva
       * - (Fallback) reintentar /auth/me pero SIN parse manual (difícil en Edge)
       */
      let data: { user?: UserProfile } | null = null;
      try {
        data = await refreshResponse.clone().json();
      } catch {
        // si /auth/refresh no devuelve JSON, data queda null
      }

      if (data?.user) {
        return { user: data.user, refreshResponse };
      }

      // Si tu refresh todavía NO devuelve user, al menos consideramos sesión válida
      // y dejamos que la navegación continúe, propagando cookies nuevas.
      // (Podés ajustar esto si necesitás sí o sí el rol acá)
      return { user: { role: "user" }, refreshResponse };
    } catch (error) {
      console.error("[Middleware] Error validando sesión:", error);
      return null;
    }
  };

  // 1) Rutas públicas
  if (isPublicRoute(pathname)) {
    // Si es login y ya hay cookies, validar y redirigir
    if (
      pathname === "/login" &&
      (request.cookies.has("access_token") ||
        request.cookies.has("refresh_token"))
    ) {
      const session = await validateSession();

      if (session) {
        const defaultRoute = getDefaultRouteForRole(session.user.role);
        const response = NextResponse.redirect(
          new URL(defaultRoute, request.url)
        );

        if (session.refreshResponse) {
          applySetCookies(session.refreshResponse, response);
        }
        return response;
      }
    }

    // Para todas las demás rutas públicas, permitir acceso sin autenticación
    return NextResponse.next();
  }

  // 2) Rutas protegidas - validar presencia de cookies
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3) Validar sesión real
  const session = await validateSession();

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { user } = session;

  // 4) Autorización por rol
  if (!canAccessRoute(user.role, pathname)) {
    const defaultRoute = getDefaultRouteForRole(user.role);
    const response = NextResponse.redirect(new URL(defaultRoute, request.url));

    if (session.refreshResponse) {
      applySetCookies(session.refreshResponse, response);
    }
    return response;
  }

  const response = NextResponse.next();

  if (session.refreshResponse) {
    applySetCookies(session.refreshResponse, response);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
