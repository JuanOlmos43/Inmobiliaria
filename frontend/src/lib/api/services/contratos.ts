import { apiClient } from "@/lib/api/client";
import {
  CreateRentalDto,
  Contract,
  ContractFilters,
  PaginatedResponse,
  UpdateRentalDto,
  ContractStats,
  ContractActivity,
} from "@/types/api";

export const contratosService = {
  /**
   * Crea un nuevo contrato de alquiler
   */
  async create(data: CreateRentalDto): Promise<Contract> {
    return apiClient.post<Contract, CreateRentalDto>("/contratos", data);
  },

  /**
   * Obtiene todos los contratos
   */
  async findAll(query?: ContractFilters): Promise<PaginatedResponse<Contract>> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString() ? "?" + params.toString() : "";
    return apiClient.get<PaginatedResponse<Contract>>(`/contratos${queryString}`);
  },

  /**
   * Obtiene un contrato por ID
   */
  async findOne(id: string): Promise<Contract> {
    return apiClient.get<Contract>(`/contratos/${id}`);
  },

  /**
   * Actualiza un contrato
   */
  async update(id: string, data: UpdateRentalDto): Promise<Contract> {
    return apiClient.patch<Contract, UpdateRentalDto>(
      `/contratos/${id}`,
      data,
    );
  },

  /**
   * Elimina un contrato
   */
  async remove(id: string): Promise<void> {
    return apiClient.delete<void>(`/contratos/${id}`);
  },

  /**
   * Obtiene estadísticas de contratos
   */
  async getStats(): Promise<ContractStats> {
    return apiClient.get<ContractStats>("/contratos/stats");
  },

  /**
   * Obtiene la actividad de contratos del mes actual (vencimientos y ajustes)
   */
  async getDashboardExpirations(filters?: {
    type?: "all" | "end_contract" | "adjustment";
    search?: string;
    role?: "tenant" | "landlord";
  }): Promise<ContractActivity[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append("type", filters.type);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.role) params.append("role", filters.role);

    const queryString = params.toString() ? "?" + params.toString() : "";
    return apiClient.get<ContractActivity[]>(
      `/contratos/dashboard/expirations${queryString}`,
    );
  },
  async getLandlordRentedProperties(): Promise<Contract[]> {
    return apiClient.get<Contract[]>("/contratos/landlord/rented");
  },

  async getTenantRentals(): Promise<Contract[]> {
    return apiClient.get<Contract[]>("/contratos/tenant/rented");
  },
};
