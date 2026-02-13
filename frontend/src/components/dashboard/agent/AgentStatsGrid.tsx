import { StatsCard, Icon } from "@/components/ui";
import { PropertyStats } from "@/types/property";
import { ContractStats } from "@/types/api";

interface AgentStatsGridProps {
  stats?: PropertyStats;
  contractStats?: ContractStats;
  isLoading?: boolean;
}

/**
 * AgentStatsGrid
 * Muestra el resumen de estadísticas de propiedades para el agente.
 * Replica el diseño de AdminStatsGrid pero adaptado a propiedades.
 */
export default function AgentStatsGrid({
  stats,
  contractStats,
  isLoading,
}: AgentStatsGridProps) {
  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-bold text-(--primary)">
          Resumen de Gestión
        </h2>
        <div className="flex justify-center py-12">
          <div className="border-primary-600 h-12 w-12 animate-spin rounded-full border-b-2"></div>
        </div>
      </div>
    );
  }

  // Si no hay estadísticas, mostrar valores por defecto
  const total = stats?.total ?? 0;
  const active = stats?.status.activa ?? 0;
  const paused = stats?.status.pausada ?? 0;
  const forSale = stats?.listingType.venta ?? 0;
  const forRent = stats?.listingType.alquiler ?? 0;
  const newThisMonth = stats?.monthly.new ?? 0;

  // Estadísticas de contratos
  const activeContracts = contractStats?.status.active ?? 0;
  const newContractsMonth = contractStats?.monthly.new ?? 0;
  const expiringContractsMonth = contractStats?.monthly.expiring ?? 0;

  return (
    <div className="mb-8">
      <h2 className="mb-6 text-2xl font-bold text-(--primary)">
        Resumen General
      </h2>

      <div className="space-y-8">
        {/* Bloque Unificado de Resumen de Propiedades (Superior) */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-slate-800 to-slate-900 text-white shadow-xl">
          <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:flex-row lg:items-center">
            {/* Lado Izquierdo: Total y Crecimiento */}
            <div className="flex items-center gap-6">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <Icon name="building" className="h-10 w-10 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-10">
                  <div className="flex flex-col">
                    <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                      Total Propiedades
                    </p>
                    <h3 className="text-5xl leading-none font-black tracking-tight">
                      {total}
                    </h3>
                  </div>
                  <div className="flex flex-col pt-1">
                    <span className="mb-2 text-[10px] font-semibold tracking-widest text-(--accent) text-slate-500 uppercase">
                      Nuevas Mes
                    </span>
                    <span className="text-xl leading-none font-bold text-(--accent)">
                      +{newThisMonth}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden h-16 w-px bg-white/10 lg:block" />

            {/* Lado Derecho: Desglose de Estados de Propiedades */}
            <div className="grid grid-cols-2 gap-6 sm:gap-12">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    Activas
                  </span>
                </div>
                <p className="text-2xl font-bold">{active}</p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    Pausadas
                  </span>
                </div>
                <p className="text-2xl font-bold">{paused}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fila Inferior: Venta y Bloque Expandido de Alquiler/Contratos */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card Simple: En Venta */}
          <div className="lg:col-span-1">
            <StatsCard
              title="En Venta"
              value={forSale}
              color="from-(--primary) to-(--primary)"
              icon="tag"
            />
          </div>

          {/* Bloque Expandido: En Alquiler + Gestión de Contratos (Todo en Accent Gradient) */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-linear-to-br from-(--accent) to-(--accent-hover) text-white shadow-xl sm:flex-row lg:col-span-2">
            {/* Lado A: Propiedades en Alquiler */}
            <div className="flex flex-1 items-center gap-4 p-6">
              <div className="rounded-xl border border-white/30 bg-white/20 p-3 backdrop-blur-sm">
                <Icon name="key" className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wider text-white/80 uppercase">
                  En Alquiler
                </p>
                <h4 className="text-3xl font-black">{forRent}</h4>
              </div>
            </div>

            {/* Divisor Vertical */}
            <div className="my-6 hidden w-px bg-white/20 sm:block" />
            <div className="mx-6 block h-px bg-white/20 sm:hidden" />

            {/* Lado B: Métricas de Contratos */}
            <div className="flex flex-2 flex-col justify-center bg-black/5 p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="mb-1 text-[10px] font-bold tracking-tighter text-white/60 uppercase">
                    Contratos Activos
                  </span>
                  <span className="text-2xl font-black">{activeContracts}</span>
                </div>
                <div className="flex flex-col border-x border-white/10 px-4">
                  <span className="mb-1 text-[10px] font-bold tracking-tighter text-white/60 uppercase">
                    Nuevos Mes
                  </span>
                  <span className="text-2xl font-black text-white">
                    +{newContractsMonth}
                  </span>
                </div>
                <div className="flex flex-col pl-4">
                  <span className="mb-1 text-[10px] font-bold tracking-tighter text-white/60 uppercase">
                    Vencen Mes
                  </span>
                  <span className="text-2xl font-black text-white">
                    {expiringContractsMonth}
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
