import { useState, useEffect } from "react";
import { gerenciaService } from "@/lib/api/services/gerencia";
import { ManagerStats, MonthlyActivity, TopAgent } from "@/types/api";

interface UseGerenciaDataReturn {
  // Datos
  stats: ManagerStats | null;
  activity: MonthlyActivity[];
  topAgents: TopAgent[];

  // Estados
  isLoading: boolean;
  error: string | null;

  // Acciones
  refetch: () => Promise<void>;
}

/**
 * Hook principal para el dashboard de Gerencia
 * Obtiene todos los datos necesarios en una sola llamada al backend
 */
export function useGerenciaData(): UseGerenciaDataReturn {
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [activity, setActivity] = useState<MonthlyActivity[]>([]);
  const [topAgents, setTopAgents] = useState<TopAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await gerenciaService.getDashboardData();

      setStats(data.stats);
      setActivity(data.activity);
      setTopAgents(data.topAgents);
    } catch (err) {
      console.error("Error loading gerencia dashboard data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar los datos del dashboard"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    stats,
    activity,
    topAgents,
    isLoading,
    error,
    refetch: fetchData,
  };
}
