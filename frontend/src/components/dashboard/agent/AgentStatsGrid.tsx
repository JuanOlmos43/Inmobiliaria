import StatsCard from "@/components/UI/StatsCard";
import Icon from "@/components/UI/Icon";
import { PropertyStats } from "@/types/property";

interface AgentStatsGridProps {
  stats?: PropertyStats;
  isLoading?: boolean;
}

/**
 * AgentStatsGrid
 * Muestra el resumen de estadísticas de propiedades para el agente.
 * Replica el diseño de AdminStatsGrid pero adaptado a propiedades.
 */
export default function AgentStatsGrid({
  stats,
  isLoading,
}: AgentStatsGridProps) {
  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-(--primary) mb-6">
          Resumen de Propiedades
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
  const rented = stats?.status.alquilada ?? 0;
  const forSale = stats?.listingType.venta ?? 0;
  const forRent = stats?.listingType.alquiler ?? 0;
  const newThisMonth = stats?.monthly.new ?? 0;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-(--primary) mb-6">
        Resumen de Propiedades
      </h2>

      <div className="space-y-8">
        {/* Bloque Unificado de Resumen */}
        <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl overflow-hidden text-white border border-white/10">
          <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Lado Izquierdo: Total y Crecimiento */}
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                <Icon name="building" className="w-10 h-10 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-10">
                  {/* Columna Total */}
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Total Propiedades
                    </p>
                    <h3 className="text-5xl font-black tracking-tight leading-none">
                      {total}
                    </h3>
                  </div>

                  {/* Columna Mes */}
                  <div className="flex flex-col pt-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                      Mes
                    </span>
                    <span className="text-xl font-bold text-emerald-400 leading-none">
                      +{newThisMonth}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divisor Vertical (solo en LG) */}
            <div className="hidden lg:block h-16 w-px bg-white/10" />

            {/* Lado Derecho: Desglose de Estados */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    Activas
                  </span>
                </div>
                <p className="text-2xl font-bold">{active}</p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    Alquiladas
                  </span>
                </div>
                <p className="text-2xl font-bold">{rented}</p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    Pausadas
                  </span>
                </div>
                <p className="text-2xl font-bold">{paused}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fila 2: Tipos de Listado */}
        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">
            Distribución por Tipo
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="En Venta"
              value={forSale}
              color="from-(--primary) to-(--primary)"
              icon="tag"
            />

            <StatsCard
              title="En Alquiler"
              value={forRent}
              color="from-(--accent) to-(--accent)"
              icon="key"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
