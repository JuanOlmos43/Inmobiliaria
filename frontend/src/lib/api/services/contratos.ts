import { apiClient } from "@/lib/api/client";
import { CreateRentalDto } from "@/types/api";

export const contratosService = {
  /**
   * Crea un nuevo contrato de alquiler
   */
  async create(data: CreateRentalDto): Promise<void> {
    return apiClient.post("/contratos", data);
  },

  /**
   * Obtiene todos los contratos
   */
  async findAll(query?: any): Promise<any> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString() ? "?" + params.toString() : "";
    return apiClient.get(`/contratos${queryString}`);
  },

  /**
   * Obtiene un contrato por ID
   */
  async findOne(id: string): Promise<any> {
    return apiClient.get(`/contratos/${id}`);
  },

  /**
   * Actualiza un contrato
   */
  async update(id: string, data: any): Promise<any> {
    return apiClient.patch(`/contratos/${id}`, data);
  },

  /**
   * Elimina un contrato
   */
  async remove(id: string): Promise<any> {
    return apiClient.delete(`/contratos/${id}`);
  },

  /**
   * Obtiene estadísticas de contratos
   */
  async getStats(): Promise<unknown> {
    return apiClient.get("/contratos/stats");
  },

  /**
   * Obtiene la actividad de contratos del mes actual (vencimientos y ajustes)
   */
  async getDashboardExpirations(filters?: {
    type?: "all" | "end_contract" | "adjustment";
    search?: string;
    role?: "tenant" | "landlord";
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append("type", filters.type);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.role) params.append("role", filters.role);

    const queryString = params.toString() ? "?" + params.toString() : "";
    return apiClient.get<any[]>(`/contratos/dashboard/expirations${queryString}`);
  },
};
