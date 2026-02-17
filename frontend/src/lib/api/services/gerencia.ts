import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { GerenciaDashboardResponse } from "@/types/api";

/**
 * Servicio para operaciones del dashboard de Gerencia
 */
export const gerenciaService = {
  /**
   * Obtiene todos los datos del dashboard de gerencia en una sola llamada
   * Incluye: estadísticas, actividad mensual (12 meses) y top 5 agentes
   */
  async getDashboardData(): Promise<GerenciaDashboardResponse> {
    return apiClient.get<GerenciaDashboardResponse>(
      API_ENDPOINTS.GERENCIA_DASHBOARD
    );
  },
};
