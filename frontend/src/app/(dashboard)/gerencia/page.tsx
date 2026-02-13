"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui";

import { useAuth } from "@/hooks/useAuth";

// Tipos
interface OrganizationStats {
  totalProperties: number;
  occupancyRate: number;
  avgMarketTime: number;
  activeContracts: number;
  completedContracts: number;
}

export default function DashboardOwnerPage() {
  const router = useRouter();
  const { user } = useAuth(); // Usar hook de auth
  const [stats, setStats] = useState<OrganizationStats>({
    totalProperties: 127,
    occupancyRate: 78.5,
    avgMarketTime: 45,
    activeContracts: 89,
    completedContracts: 234,
  });

  return (
    <div className="min-h-screen bg-(--background)">
      {/* Header */}

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Overview Stats */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-(--primary)">
            Estadísticas de la Organización
          </h2>
          <div className="mx-auto flex max-w-2xl flex-col gap-6">
            <StatsCard
              title="Total Propiedades"
              value={stats.totalProperties}
              color="from-(--primary) to-(--primary-light)"
              trend="+8 este mes"
              trendUp={true}
              icon="building"
            />
            <StatsCard
              title="En Venta"
              value={`${stats.avgMarketTime} días`}
              color="from-(--primary-light) to-(--primary)"
              trend="Tiempo Promedio en Mercado"
              trendUp={true}
              icon="tag"
            />
            <StatsCard
              title="En Alquiler"
              value={`${stats.avgMarketTime} días`}
              color="from-slate-600 to-(--primary-light)"
              trend="Tiempo Promedio en Mercado"
              trendUp={true}
              icon="key"
            />
            <StatsCard
              title="Contratos Activos"
              value={stats.activeContracts}
              color="from-(--accent) to-(--accent-hover)"
              trend="+12 este mes"
              trendUp={true}
              icon="document"
            />
            <StatsCard
              title="Contratos Finalizados"
              value={stats.completedContracts}
              color="from-amber-500 to-amber-600"
              trend="Total histórico"
              trendUp={true}
              icon="check"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// Stats Card Component
function StatsCard({
  title,
  value,
  color,
  trend,
  trendUp,
  icon,
}: {
  title: string;
  value: string | number;
  color: string;
  trend: string;
  trendUp: boolean;
  icon: string;
}) {
  return (
    <div
      className={`bg-linear-to-br ${color} transform rounded-xl p-6 text-white shadow-lg transition-transform duration-300 hover:scale-105`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div
          className={`rounded-full px-2 py-1 text-xs ${trendUp ? "bg-green-500/30" : "bg-red-500/30"}`}
        >
          {trend}
        </div>
        <div className="opacity-80">
          <Icon name={icon as any} className="h-8 w-8" />
        </div>
      </div>
      <p className="mb-1 text-sm opacity-90">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
