import { ApiRequestError } from "@/types/api";

/**
 * Configuración del cliente API
 */
interface ApiClientConfig {
  baseUrl: string;
}

/**
 * Cliente HTTP para comunicación con la API
 * Centraliza la lógica de fetch, headers y manejo de errores
 * Incluye interceptor automático para refresh de tokens
 */
export class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
  }

  /**
   * Construye los headers por defecto
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    return headers;
  }

  /**
   * Intenta refrescar el access token usando el refresh token
   */
  private async refreshAccessToken(): Promise<boolean> {
    // Si ya hay un refresh en progreso, esperar a que termine
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: "POST",
          credentials: "include", // Envía refresh_token cookie
        });

        if (response.ok) {
          // Refresh exitoso, el nuevo access_token está en las cookies
          return true;
        }

        // Refresh falló, redirigir a login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return false;
      } catch (error) {
        console.error("[ApiClient] Error refreshing token:", error);
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return false;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Maneja respuestas de error de la API con interceptor de refresh
   */
  private async handleResponse<T>(
    response: Response,
    retryRequest?: () => Promise<Response>,
    skipRefresh?: boolean,
  ): Promise<T> {
    if (response.ok) {
      if (response.status === 204) return null as T;
      return response.json();
    }

    if (!skipRefresh && response.status === 401 && retryRequest) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        const retryResponse = await retryRequest();
        return this.handleResponse<T>(retryResponse, undefined, true);
      }
    }

    // Si es 401 (Unauthorized), intentar refresh
    if (response.status === 401 && retryRequest) {
      const refreshed = await this.refreshAccessToken();

      if (refreshed) {
        // Refresh exitoso, reintentar la petición original
        const retryResponse = await retryRequest();
        return this.handleResponse<T>(retryResponse); // Sin retry para evitar loop infinito
      }
    }

    // Intentar parsear el error como JSON
    let errorData: { message?: string; error?: string } = {};
    try {
      errorData = await response.json();
    } catch {
      // Si no es JSON, usar mensaje por defecto
    }

    const errorMessage =
      errorData.message ||
      errorData.error ||
      `HTTP ${response.status}: ${response.statusText}`;

    throw new ApiRequestError(errorMessage, response.status, errorMessage);
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const makeRequest = () =>
      fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
        credentials: "include",
      });

    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  /**
   * POST request
   */
  async post<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
    const makeRequest = () =>
      fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
      });

    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  /**
   * PUT request
   */
  async put<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
    const makeRequest = () =>
      fetch(`${this.baseUrl}${endpoint}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
      });

    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  /**
   * PATCH request
   */
  async patch<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
    const makeRequest = () =>
      fetch(`${this.baseUrl}${endpoint}`, {
        method: "PATCH",
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
      });

    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const makeRequest = () =>
      fetch(`${this.baseUrl}${endpoint}`, {
        method: "DELETE",
        headers: this.getHeaders(),
        credentials: "include",
      });

    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }
}

/**
 * Instancia singleton del cliente API
 * Se inicializa con la URL base desde las variables de entorno
 */
export const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});
