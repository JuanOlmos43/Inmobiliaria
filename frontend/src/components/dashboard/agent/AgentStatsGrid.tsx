import { Icon } from "@/components/ui";
import { PropertyStats } from "@/types/property";
import { ContractStats } from "@/types/api";
import { StatsSummaryCard } from "../common/StatsSummaryCard";

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

  return (
    <div className="mb-8">
      <h2 className="mb-6 text-2xl font-bold text-(--primary)">
        Resumen General
      </h2>

      <div className="space-y-8">
        {/* BLOQUE SUPERIOR*/}
        <StatsSummaryCard
          title="Total Propiedades"
          icon="building"
          total={stats?.total ?? 0}
          active={stats?.status.activa ?? 0}
          activeLabel="Activas"
          paused={stats?.status.pausada ?? 0}
          pausedLabel="Pausadas"
        />

        {/* Fila Inferior: Venta y Bloque Expandido de Alquiler/Contratos */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card Simple: En Venta */}
          <div className="rounded-2xl bg-linear-to-br from-(--primary) to-(--primary-light) p-6 text-white shadow-xl lg:col-span-1">
            <div className="flex items-center gap-4">
              <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                <Icon name="tag" className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wider text-white/80 uppercase">
                  En Venta
                </p>
                <h4 className="text-3xl font-black">
                  {stats?.listingType.venta ?? 0}
                </h4>
              </div>
            </div>
          </div>

          {/* Bloque Expandido: En Alquiler + Gestión de Contratos (Todo en Accent Gradient) */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-linear-to-br from-(--accent) to-(--accent-hover) text-white shadow-xl sm:flex-row lg:col-span-2">
            {/* Lado A: Propiedades en Alquiler */}
            <div className="flex flex-1 items-center gap-4 p-6">
              <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                <Icon name="key" className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wider text-white uppercase">
                  En Alquiler
                </p>
                <h4 className="text-3xl font-black">
                  {stats?.listingType.alquiler ?? 0}
                </h4>
              </div>
            </div>

            {/* Divisor Vertical */}
            <div className="my-6 hidden w-px bg-white/20 sm:block" />
            <div className="mx-6 block h-px bg-white/20 sm:hidden" />

            {/* Lado B: Métricas de Contratos */}
            <div className="flex flex-2 flex-col justify-center bg-black/5 p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3 border-r border-white/10 pr-4">
                  <div className="inline-flex rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                    <Icon name="document" className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <span className="mb-1 block text-xs font-bold tracking-tighter text-white uppercase">
                      Activos
                    </span>
                    <span className="text-2xl leading-none font-black">
                      {contractStats?.status.active ?? 0}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col border-r border-white/10 px-4">
                  <span className="mb-1 text-[10px] font-bold tracking-tighter whitespace-nowrap text-white/60 uppercase">
                    Ajustes este mes
                  </span>
                  <span className="text-2xl font-black text-yellow-500">
                    {contractStats?.monthly.adjustments ?? 0}
                  </span>
                </div>
                <div className="flex flex-col pl-4">
                  <span className="mb-1 text-[10px] font-bold tracking-tighter whitespace-nowrap text-white/60 uppercase">
                    Vencen este Mes
                  </span>
                  <span className="text-2xl font-black text-red-500">
                    {contractStats?.monthly.expiring ?? 0}
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
