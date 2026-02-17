"use client";

import { useState, useEffect } from "react";
import GerenciaStatsGrid, {
  ManagerStats,
} from "@/components/dashboard/gerencia/GerenciaStatsGrid";
import GerenciaActivityChart from "@/components/dashboard/gerencia/GerenciaActivityChart";
import GerenciaTopAgents from "@/components/dashboard/gerencia/GerenciaTopAgents";

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
      <GerenciaStatsGrid stats={stats} isLoading={isLoading} />

      {/* Aquí irían otros componentes como gráficos o tablas de detalle */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GerenciaActivityChart />
        <GerenciaTopAgents />
      </div>
    </>
  );
}
