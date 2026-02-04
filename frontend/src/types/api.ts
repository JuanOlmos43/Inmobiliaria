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

export enum ContractStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  TERMINATED = "terminated",
}

/**
 * DTO para la creación de un contrato de alquiler (Coincide con el Backend)
 */
export interface CreateRentalDto {
  propertyId: string;
  tenantId: string;
  landlordId: string;
  agentId?: string;
  monthlyRent: number;
  deposit?: number;
  adjustmentFrequency?: number; // En meses
  startDate: string;
  endDate: string;
  status?: ContractStatus;
}

/**
 * Datos del formulario local (UI)
 */
export interface RentalFormData {
  tenantId: string;
  tenantEmail: string;
  tenantName: string;
  startDate: string;
  endDate: string;
  adjustmentFrequency: number;
  deposit: number;
  status: ContractStatus;
}

export interface Contract {
  id: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  agentId?: string;
  monthlyRent: number;
  deposit?: number;
  adjustmentFrequency?: number;
  startDate: string;
  endDate: string;
  nextAdjustmentDate?: string;
  status: ContractStatus;
  property: {
    title: string;
    location: string;
    mainImage?: string;
    currency?: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
  };
  tenant: { id: string; name: string; email: string; phone?: string };
  landlord: { id: string; name: string; email: string; phone?: string };
  agent?: { id: string; name: string; email: string; phone?: string };
}

export interface ContractActivity extends Contract {
  eventType: "end_contract" | "adjustment" | "both";
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
