"use client";

import GerenciaStatsGrid from "@/components/dashboard/gerencia/GerenciaStatsGrid";
import GerenciaActivityChart from "@/components/dashboard/gerencia/GerenciaActivityChart";
import GerenciaTopAgents from "@/components/dashboard/gerencia/GerenciaTopAgents";
import { useGerenciaData } from "@/hooks/useGerenciaData";

export default function DashboardOwnerPage() {
  const { stats, activity, topAgents, isLoading, error, refetch } =
    useGerenciaData();

  // Manejo de errores
  if (error && !isLoading) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="mb-4 text-red-600">{error}</p>
        <button
          onClick={() => refetch()}
          className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <GerenciaStatsGrid stats={stats} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GerenciaActivityChart data={activity} isLoading={isLoading} />
        <GerenciaTopAgents agents={topAgents} isLoading={isLoading} />
      </div>
    </>
  );
}
