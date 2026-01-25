/**
 * API Type Definitions for Authentication
 */

// ============================================
// Request Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  role: UserRole;
}

// ============================================
// Response Types
// ============================================

export interface LoginResponse {
  access_token: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Enums
// ============================================

export enum UserRole {
  Administrador = "Administrador",
  Agente = "Agente",
  Propietario = "Propietario",
  Inquilino = "Inquilino",
  Gerencia = "Gerencia",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

// ============================================
// Error Handling
// ============================================

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorDetail: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}
