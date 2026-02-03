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
  password?: string; // Agregado para permitir actualizaciones (reset)
  name: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  summary: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  };
  growth: {
    newThisMonth: number;
    registrationsToday: number;
  };
  roles: {
    administrador: number;
    agente: number;
    gerencia: number;
    inquilino: number;
    propietario: number;
  };
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
// Tipos de Contratos de Alquiler
// ============================================

/**
 * Datos base del formulario de alquiler
 */
export interface RentalData {
  tenantEmail: string;
  startDate: string;
  endDate: string;
  adjustmentPeriod: "trimestral" | "semestral" | "anual";
  adjustmentPercentage: number;
  status: "active" | "expiring" | "expired";
}

/**
 * Datos completos del contrato de alquiler incluyendo información del propietario
 * Este es el tipo que se pasa a la mutación de creación de contratos
 */
export interface CreateRentalDto extends RentalData {
  landlordName: string;
  landlordPhone: string;
  landlordEmail: string;
  nextAdjustmentDate: string;
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
