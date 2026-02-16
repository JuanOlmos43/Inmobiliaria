import { Icon } from "@/components/ui/icons/Icon";
import type { IconName } from "@/components/ui/icons/Icon";

interface StatsSummaryCardProps {
  // Configuración Principal
  title: string;
  icon: IconName;
  total: number;

  // Columnas Dinámicas (Opcionales)
  newToday?: number; // Label: "HOY"
  newThisMonth?: number; // Label: "ESTE MES"

  // Estados Base
  active: number;
  activeLabel?: string; // Default: "Activas"
  paused: number;
  pausedLabel?: string; // Default: "Pausadas"
}

export function StatsSummaryCard({
  title,
  icon,
  total,
  newToday,
  newThisMonth,
  active,
  activeLabel = "Activas",
  paused,
  pausedLabel = "Pausadas",
}: StatsSummaryCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-(--primary) to-(--primary-light) text-white shadow-xl">
      <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:flex-row lg:items-center">
        {/* Lado Izquierdo: Icono + Total + Stats Secundarios */}
        <div className="flex items-center gap-6">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
            <Icon name={icon} className="h-10 w-10 text-white" />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-10">
              {/* Columna Principal: Total */}
              <div className="flex flex-col">
                <p className="mb-1 text-xs font-semibold tracking-wider text-slate-200 uppercase">
                  {title}
                </p>
                <h3 className="text-5xl leading-none font-black tracking-tight">
                  {total}
                </h3>
              </div>

              {/* Columna: HOY (Opcional) */}
              {newToday !== undefined && (
                <div className="flex flex-col pt-1">
                  <span className="mb-2 text-[10px] font-semibold tracking-widest text-slate-300 uppercase">
                    Hoy
                  </span>
                  <span className="text-xl leading-none font-bold text-emerald-300">
                    +{newToday}
                  </span>
                </div>
              )}

              {/* Columna: ESTE MES (Opcional) */}
              {newThisMonth !== undefined && (
                <div className="flex flex-col pt-1">
                  <span className="mb-2 text-[10px] font-semibold tracking-widest text-slate-300 uppercase">
                    Este mes
                  </span>
                  <span className="text-xl leading-none font-bold text-emerald-300">
                    +{newThisMonth}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divisor Visual */}
        <div className="h-px w-full bg-white/10 lg:h-16 lg:w-px" />

        {/* Lado Derecho: Desglose de Estados */}
        <div className="grid grid-cols-2 gap-6 sm:gap-12">
          {/* Activos/as */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-xs font-semibold tracking-wide text-slate-200 uppercase">
                {activeLabel}
              </span>
            </div>
            <p className="text-2xl font-bold">{active}</p>
          </div>

          {/* Pausados/as */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              <span className="text-xs font-semibold tracking-wide text-slate-200 uppercase">
                {pausedLabel}
              </span>
            </div>
            <p className="text-2xl font-bold">{paused}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
