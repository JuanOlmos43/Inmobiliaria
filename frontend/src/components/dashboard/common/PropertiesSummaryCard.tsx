import { Icon } from "@/components/ui";

interface PropertiesSummaryCardProps {
  total: number;
  newThisMonth: number;
  active: number;
  paused: number;
}

export function PropertiesSummaryCard({
  total,
  newThisMonth,
  active,
  paused,
}: PropertiesSummaryCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-(--primary) to-(--primary-light) text-white shadow-xl">
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
                <span className="mb-2 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                  Este mes
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
  );
}
