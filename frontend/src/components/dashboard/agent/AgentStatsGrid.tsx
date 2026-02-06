import { StatsCard, Icon } from "@/components/UI";
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
        <h2 className="text-2xl font-bold text-(--primary) mb-6">
          Resumen de Gestión
        </h2>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
      <h2 className="text-2xl font-bold text-(--primary) mb-6">
        Resumen General
      </h2>

      <div className="space-y-8">
        {/* Bloque Unificado de Resumen de Propiedades (Superior) */}
        <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl overflow-hidden text-white border border-white/10">
          <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Lado Izquierdo: Total y Crecimiento */}
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                <Icon name="building" className="w-10 h-10 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-10">
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Total Propiedades
                    </p>
                    <h3 className="text-5xl font-black tracking-tight leading-none">
                      {total}
                    </h3>
                  </div>
                  <div className="flex flex-col pt-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 text-(--accent)">
                      Nuevas Mes
                    </span>
                    <span className="text-xl font-bold text-(--accent) leading-none">
                      +{newThisMonth}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block h-16 w-px bg-white/10" />

            {/* Lado Derecho: Desglose de Estados de Propiedades */}
            <div className="grid grid-cols-2 gap-6 sm:gap-12">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Activas
                  </span>
                </div>
                <p className="text-2xl font-bold">{active}</p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Pausadas
                  </span>
                </div>
                <p className="text-2xl font-bold">{paused}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fila Inferior: Venta y Bloque Expandido de Alquiler/Contratos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <div className="lg:col-span-2 bg-linear-to-br from-(--accent) to-(--accent-hover) rounded-2xl shadow-xl border border-white/20 overflow-hidden text-white flex flex-col sm:flex-row">
            {/* Lado A: Propiedades en Alquiler */}
            <div className="flex-1 p-6 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                <Icon name="key" className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                  En Alquiler
                </p>
                <h4 className="text-3xl font-black">{forRent}</h4>
              </div>
            </div>

            {/* Divisor Vertical */}
            <div className="hidden sm:block w-px bg-white/20 my-6" />
            <div className="block sm:hidden h-px bg-white/20 mx-6" />

            {/* Lado B: Métricas de Contratos */}
            <div className="flex-2 p-6 flex flex-col justify-center bg-black/5">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/60 uppercase mb-1 tracking-tighter">
                    Contratos Activos
                  </span>
                  <span className="text-2xl font-black">{activeContracts}</span>
                </div>
                <div className="flex flex-col border-x border-white/10 px-4">
                  <span className="text-[10px] font-bold text-white/60 uppercase mb-1 tracking-tighter">
                    Nuevos Mes
                  </span>
                  <span className="text-2xl font-black text-white">
                    +{newContractsMonth}
                  </span>
                </div>
                <div className="flex flex-col pl-4">
                  <span className="text-[10px] font-bold text-white/60 uppercase mb-1 tracking-tighter">
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
