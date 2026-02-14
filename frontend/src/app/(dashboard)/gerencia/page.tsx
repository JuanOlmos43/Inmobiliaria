"use client";

import { useState, useEffect } from "react";
import GerenciaStatsGrid, {
  ManagerStats,
} from "@/components/dashboard/gerencia/GerenciaStatsGrid";

// --- Mock Data Service ---
const fetchManagerData = async (): Promise<ManagerStats> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    inventory: {
      total: 142,
      newMonth: 12,
      active: 89,
      paused: 15,
      reserved: 24,
      totalValue: 45000000,
    },
    sales: {
      total: 78,
      available: 45,
      reserved: 18,
      soldMonth: 6,
      avgTimeMarket: 124,
      totalValue: 12500000,
    },
    rentals: {
      total: 64,
      available: 8,
      activeContracts: 45,
      newContractsMonth: 4,
      expiringContractsMonth: 2,
      avgTimeMarket: 28,
      totalValue: 28000,
    },
  };
};

export default function DashboardOwnerPage() {
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchManagerData();
        if (isMounted) {
          setStats(data);
        }
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-(--primary)">
            Panel de Gerencia
          </h2>
          <p className="text-slate-500">
            Vista global de rendimiento y operaciones.
          </p>
        </div>
        <div className="text-sm text-slate-400">
          Última actualización: {new Date().toLocaleDateString()}
        </div>
      </div>

      <GerenciaStatsGrid stats={stats} isLoading={isLoading} />

      {/* Aquí irían otros componentes como gráficos o tablas de detalle */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-lg font-bold text-(--primary)">
            Actividad Reciente
          </h3>
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-slate-400">
            Gráfico de Actividad (Placeholder)
          </div>
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-1">
          <h3 className="mb-4 text-lg font-bold text-(--primary)">
            Top Agentes (Mes)
          </h3>
          <ul className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                  <span className="text-sm font-medium">Agente {i}</span>
                </div>
                <span className="text-sm font-bold text-(--accent)">
                  ${10000 * (6 - i)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
