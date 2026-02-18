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

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ============================================
// Response Types
// ============================================

export interface LoginResponse {
  access_token: string;
  mustChangePassword: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  password?: string; // Agregado para permitir actualizaciones (reset)
  name: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  mustChangePassword: boolean; // true si el usuario debe cambiar su contraseña
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

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export interface ContractStats {
  monthly: {
    new: number;
    expiring: number;
    adjustments: number;
  };
  status: {
    active: number;
    expired: number;
  };
}

export interface ContractFilters {
  status?: ContractStatus;
  propertyId?: string;
  tenantId?: string;
  landlordId?: string;
  agentId?: string;
  tenantName?: string;
  landlordName?: string;
  propertyLocation?: string;
  page?: number;
  limit?: number;
}

export interface UserFilters {
  role?: UserRole;
  email?: string;
  search?: string;
  page?: number;
  limit?: number;
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

export type UpdateRentalDto = Partial<CreateRentalDto>;

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
  adjustmentScheduledDates?: string[]; // Date ISO strings
  status: ContractStatus;
  property: {
    id: string; // Add id
    title: string;
    location: string;
    mainImage?: string;
    images?: { url: string; order: number }[]; // Add images array
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
// Gerencia Dashboard Types
// ============================================

export interface ManagerInventoryStats {
  total: number;
  newMonth: number;
  active: number;
  paused: number;
  reserved: number;
  totalValue: number;
}

export interface ManagerSalesStats {
  total: number;
  available: number;
  reserved: number;
  soldMonth: number;
  avgTimeMarket: number; // días promedio en el mercado
  totalValue: number;
}

export interface ManagerRentalsStats {
  total: number;
  available: number;
  activeContracts: number;
  newContractsMonth: number;
  expiringContractsMonth: number;
  avgTimeMarket: number; // días promedio en el mercado
  totalValue: number;
}

export interface ManagerStats {
  inventory: ManagerInventoryStats;
  sales: ManagerSalesStats;
  rentals: ManagerRentalsStats;
}

export interface MonthlyActivity {
  month: string; // "Ene", "Feb", etc.
  venta: number;
  alquiler: number;
}

export interface TopAgent {
  id: string;
  name: string;
  contracts: number;
}

/**
 * Respuesta completa del endpoint /gerencia/dashboard
 * Contiene todas las estadísticas, actividad y top agentes
 */
export interface GerenciaDashboardResponse {
  stats: ManagerStats;
  activity: MonthlyActivity[]; // 12 meses de actividad
  topAgents: TopAgent[]; // Top 5 agentes
}

// ============================================
// Error Handling
// ============================================

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorDetail: string
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}
