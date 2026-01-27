"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/UI/Icon";

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-(--primary) mb-6">
            Estadísticas de la Organización
          </h2>
          <div className="flex flex-col gap-6 max-w-2xl mx-auto">
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
      className={`bg-linear-to-br ${color} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`text-xs px-2 py-1 rounded-full ${trendUp ? "bg-green-500/30" : "bg-red-500/30"}`}
        >
          {trend}
        </div>
        <div className="opacity-80">
          <Icon name={icon as any} className="w-8 h-8" />
        </div>
      </div>
      <p className="text-sm opacity-90 mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
