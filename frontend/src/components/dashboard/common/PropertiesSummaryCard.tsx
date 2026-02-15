import { Icon } from "@/components/ui/icons/Icon";
import type { IconName } from "@/components/ui/icons/Icon";

interface PropertiesSummaryCardProps {
  // Datos Principales
  total: number;
  title?: string;

  // Stats: Modo Admin (Usuarios)
  today?: number;
  month?: number;

  // Stats: Modo Propiedades
  newThisMonth?: number;

  // Estados Base
  active: number;
  paused: number;
}

export function PropertiesSummaryCard({
  total,
  title,
  today,
  month,
  newThisMonth,
  active,
  paused,
}: PropertiesSummaryCardProps) {
  // 1. DETECCIÓN DE MODO
  // Si se pasan stats de admin (today/month) o el título contiene "Usuario", asumimos contexto de Usuarios/Admin.
  const isAdminContext =
    today !== undefined 

  // 2. VALORES POR DEFECTO INTELIGENTES
  // Título automático: Total Usuarios para Admin, Total Propiedades para Propiedades
  const finalTitle =
    title || (isAdminContext ? "Total Usuarios" : "Total Propiedades");
  // Icono automático: user para Admin, building para Propiedades
  const finalIcon = isAdminContext ? "user" : "building";

  // 3. ETIQUETAS ADAPTATIVAS (Género)
  const activeLabel = isAdminContext ? "Activos" : "Activas";
  const pausedLabel = isAdminContext ? "Pausados" : "Pausadas";

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-(--primary) to-(--primary-light) text-white shadow-xl">
      <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:flex-row lg:items-center">
        {/* Lado Izquierdo: Icono + Total + Stats Secundarios */}
        <div className="flex items-center gap-6">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
            <Icon
              name={finalIcon as IconName}
              className="h-10 w-10 text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-10">
              {/* Columna Principal: Total */}
              <div className="flex flex-col">
                <p className="mb-1 text-xs font-semibold tracking-wider text-slate-200 uppercase">
                  {finalTitle}
                </p>
                <h3 className="text-5xl leading-none font-black tracking-tight">
                  {total}
                </h3>
              </div>

              {/* COLUMNAS SECUNDARIAS DINÁMICAS */}
              {isAdminContext ? (
                <>
                  {/* ADMIN: Hoy y Mes */}
                  <div className="flex flex-col pt-1">
                    <span className="mb-2 text-[10px] font-semibold tracking-widest text-slate-300 uppercase">
                      Hoy
                    </span>
                    <span className="text-xl leading-none font-bold text-emerald-300">
                      +{today ?? 0}
                    </span>
                  </div>
                  <div className="flex flex-col pt-1">
                    <span className="mb-2 text-[10px] font-semibold tracking-widest text-slate-300 uppercase">
                      Mes
                    </span>
                    <span className="text-xl leading-none font-bold text-emerald-300">
                      +{month ?? 0}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {/* PROPIEDADES: Solo 'Este mes' si está definido */}
                  {newThisMonth !== undefined && (
                    <div className="flex flex-col pt-1">
                      <span className="mb-2 text-xs font-semibold tracking-widest text-slate-300 uppercase">
                        Este mes
                      </span>
                      <span className="text-xl leading-none font-bold text-emerald-300">
                        +{newThisMonth}
                      </span>
                    </div>
                  )}
                </>
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
