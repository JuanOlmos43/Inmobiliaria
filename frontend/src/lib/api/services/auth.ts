import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  LoginRequest,
  LoginResponse,
  UserProfile,
  RegisterRequest,
} from "@/types/api";

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
      throw new Error("El email es requerido");
    }

    if (!password || password.trim().length === 0) {
      throw new Error("La contraseña es requerida");
    }

    const requestData: LoginRequest = {
      email: email.trim(),
      password: password,
    };
    console.log("Login request data:", requestData);
    return apiClient.post<LoginResponse, LoginRequest>(
      API_ENDPOINTS.LOGIN,
      requestData
    );
  },

  /**
   * Registra un nuevo usuario en el sistema
   * Solo disponible para usuarios con rol admin o agent
   */
  async register(data: RegisterRequest): Promise<UserProfile> {
    // Validación del lado del cliente antes de enviar
    if (!data.email || data.email.trim().length === 0) {
      throw new Error("El email es requerido");
    }

    if (!data.password || data.password.trim().length === 0) {
      throw new Error("La contraseña es requerida");
    }

    if (!data.role) {
      throw new Error("El rol es requerido");
    }

    const requestData: RegisterRequest = {
      email: data.email.trim(),
      password: data.password,
      name: data.name?.trim(),
      phone: data.phone?.trim(),
      role: data.role,
    };

    return apiClient.post<UserProfile, RegisterRequest>(
      API_ENDPOINTS.REGISTER,
      requestData
    );
  },

  /**
   * Obtiene el perfil del usuario autenticado
   */
  async getMe(): Promise<UserProfile> {
    return apiClient.get<UserProfile>(API_ENDPOINTS.ME);
  },

  /**
   * Cierra sesión del usuario
   * Invalida el refresh token en el backend
   */
  async logout(): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(API_ENDPOINTS.LOGOUT);
  },
};
