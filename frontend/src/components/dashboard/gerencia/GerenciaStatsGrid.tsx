import { Icon } from "@/components/ui";
import { StatsSummaryCard } from "../common/StatsSummaryCard";

// Mismas interfaces o mapeo directo para mantener consistencia
export interface ManagerStats {
  inventory: {
    total: number;
    newMonth: number;
    active: number;
    paused: number;
    reserved: number;
    totalValue: number;
  };
  sales: {
    total: number;
    available: number;
    reserved: number;
    soldMonth: number;
    avgTimeMarket: number;
    totalValue: number;
  };
  rentals: {
    total: number;
    available: number;
    activeContracts: number;
    newContractsMonth: number;
    expiringContractsMonth: number;
    avgTimeMarket: number;
    totalValue: number;
  };
}

interface GerenciaStatsGridProps {
  stats: ManagerStats | null;
  isLoading?: boolean;
}

/**
 * GerenciaStatsGrid
 * Diseño idéntico al Dashboard de Agente (AgentStatsGrid)
 * Adaptado para mostrar métricas globales de Gerencia con sumatorias de valor.
 */
export default function GerenciaStatsGrid({
  stats,
  isLoading,
}: GerenciaStatsGridProps) {
  if (isLoading) {
    return (
      <div className="mb-8 animate-pulse">
        <div className="mb-6 h-8 w-64 rounded bg-gray-200"></div>
        <div className="space-y-8">
          <div className="h-48 w-full rounded-2xl bg-gray-200"></div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-40 rounded-xl bg-gray-200 lg:col-span-1"></div>
            <div className="h-40 rounded-xl bg-gray-200 lg:col-span-2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Valores default seguros
  const s = stats || {
    inventory: {
      total: 0,
      newMonth: 0,
      active: 0,
      paused: 0,
      reserved: 0,
      totalValue: 0,
    },
    sales: {
      total: 0,
      available: 0,
      reserved: 0,
      soldMonth: 0,
      avgTimeMarket: 0,
      totalValue: 0,
    },
    rentals: {
      total: 0,
      available: 0,
      activeContracts: 0,
      newContractsMonth: 0,
      expiringContractsMonth: 0,
      avgTimeMarket: 0,
      totalValue: 0,
    },
  };

  const formatCurrencySimple = (val: number) => {
    // Si es mayor a 1 millón, mostrar en M
    if (val >= 1000000) {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(val);
    }
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="mb-8">
      <h2 className="mb-6 text-2xl font-bold text-(--primary)">
        Resumen Global
      </h2>

      <div className="space-y-8">
        {/* 1. BLOQUE SUPERIOR*/}
        <StatsSummaryCard
          title="Total Propiedades"
          icon="building"
          total={s.inventory.total}
          newThisMonth={s.inventory.newMonth}
          active={s.inventory.active}
          activeLabel="Activas"
          paused={s.inventory.paused}
          pausedLabel="Pausadas"
        />

        {/* 2. FILA INFERIOR: VENTAS y ALQUILERES */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card: EN VENTA */}
          <div className="flex flex-col justify-between rounded-2xl bg-linear-to-br from-(--primary) to-(--primary-light) p-6 text-white shadow-lg lg:col-span-1">
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="inline-flex rounded-lg border border-white/20 bg-white/20 p-2 opacity-90 backdrop-blur-sm">
                  <Icon name="tag" className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wider text-white/80 uppercase">
                    En Venta
                  </p>
                  <h3 className="text-4xl leading-none font-black tracking-tight">
                    {s.sales.total}
                  </h3>
                </div>
              </div>

              <div className="flex flex-col items-end pt-1">
                <span className="mb-1 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                  Este mes
                </span>
                <span className="text-xl leading-none font-bold text-emerald-200">
                  +{s.sales.soldMonth}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-px w-full bg-white/20" />
              <div className="relative flex items-center justify-center">
                <span className="absolute left-0 text-[10px] font-bold tracking-widest text-white/80 uppercase">
                  Valor
                </span>
                <span className="text-lg font-bold text-white">
                  {formatCurrencySimple(s.sales.totalValue)}
                </span>
              </div>
            </div>
          </div>

          {/* Bloque Expandido: En Alquiler + Gestión de Contratos */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-linear-to-br from-(--accent) to-(--accent-hover) text-white shadow-xl sm:flex-row lg:col-span-2">
            {/* Lado A: Propiedades en Alquiler */}
            <div className="flex flex-1 flex-col justify-between p-6">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="inline-flex rounded-lg border border-white/20 bg-white/20 p-3 backdrop-blur-sm">
                    <Icon name="key" className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold tracking-wider text-white uppercase">
                      En Alquiler
                    </p>
                    <h4 className="text-3xl leading-none font-black">
                      {s.rentals.total}
                    </h4>
                  </div>
                </div>

                <div className="flex flex-col items-end pt-1">
                  <span className="mb-1 text-[10px] font-semibold tracking-widest text-white/80 uppercase">
                    Este mes
                  </span>
                  <span className="text-xl leading-none font-bold text-emerald-200">
                    +{s.rentals.newContractsMonth}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3 sm:mt-0">
                <div className="h-px w-full bg-white/20" />
                <div className="relative flex items-center justify-center">
                  <span className="absolute left-0 text-[10px] font-bold tracking-widest text-white/80 uppercase">
                    Valor
                  </span>
                  <span className="text-lg font-bold text-white">
                    {formatCurrencySimple(s.rentals.totalValue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Divisor Vertical */}
            <div className="hidden w-px bg-white/20 sm:block" />
            <div className="block h-px bg-white/20 sm:hidden" />

            {/* Lado B: Métricas de Contratos (RESTANTES) */}
            <div className="flex flex-1 flex-col justify-between bg-black/5 p-6">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="inline-flex rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                    <Icon name="document" className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <span className="mb-1 block text-[10px] font-bold tracking-tighter text-white/80 uppercase">
                      Activos
                    </span>
                    <span className="text-2xl leading-none font-black">
                      {s.rentals.activeContracts}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="mb-1 text-[10px] font-bold tracking-tighter text-white/80 uppercase">
                    Este mes
                  </span>
                  <span className="text-xl text-emerald-300">
                    +{s.rentals.newContractsMonth}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <span className="mb-1 text-[10px] font-bold tracking-tighter text-white/80 uppercase">
                    Vencen Mes
                  </span>
                  <span className="text-2xl text-amber-200">
                    {s.rentals.expiringContractsMonth}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3 sm:mt-0">
                <div className="h-px w-full bg-white/10" />
                <div className="relative flex items-center justify-center">
                  <span className="absolute left-0 text-[10px] font-bold tracking-widest text-white/80 uppercase">
                    Valor
                  </span>
                  <span className="text-lg font-bold text-white">
                    {formatCurrencySimple(s.rentals.totalValue)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
