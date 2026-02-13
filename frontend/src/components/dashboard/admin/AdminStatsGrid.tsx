import { StatsCard } from "@/components/ui";
import { UserStats } from "@/types/api";

interface AdminStatsGridProps {
  stats: UserStats | null;
}

/**
 * AdminStatsGrid
 * Muestra el resumen de estadísticas de usuarios en formato cuadrícula.
 */
export default function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  return (
    <div className="mb-8">
      <h2 className="mb-6 text-2xl font-bold text-(--primary)">
        Estadísticas del Sistema
      </h2>

      <div className="space-y-8">
        {/* Bloque Unificado de Resumen */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-slate-800 to-slate-900 text-white shadow-xl">
          <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:flex-row lg:items-center">
            {/* Lado Izquierdo: Total y Crecimiento */}
            <div className="flex items-center gap-6">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-10">
                  {/* Columna Total */}
                  <div className="flex flex-col">
                    <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                      Total Usuarios
                    </p>
                    <h3 className="text-5xl leading-none font-black tracking-tight">
                      {stats?.summary.total ?? 0}
                    </h3>
                  </div>

                  {/* Columna Hoy */}
                  <div className="flex flex-col pt-1">
                    <span className="mb-2 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                      Hoy
                    </span>
                    <span className="text-xl leading-none font-bold text-emerald-400">
                      +{stats?.growth.registrationsToday ?? 0}
                    </span>
                  </div>

                  {/* Columna Mes */}
                  <div className="flex flex-col pt-1">
                    <span className="mb-2 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                      Mes
                    </span>
                    <span className="text-xl leading-none font-bold text-emerald-400">
                      +{stats?.growth.newThisMonth ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divisor Vertical (solo en LG) */}
            <div className="hidden h-16 w-px bg-white/10 lg:block" />

            {/* Lado Derecho: Desglose de Estados */}
            <div className="grid grid-cols-3 gap-6 sm:gap-12">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    Activos
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {stats?.summary.active ?? 0}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    Pausados
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {stats?.summary.inactive ?? 0}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    Suspendidos
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {stats?.summary.suspended ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fila 2: Roles del Sistema */}
        <div>
          <h3 className="mb-4 text-sm font-medium tracking-wider text-slate-500 uppercase">
            Distribución por Roles
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <StatsCard
              title="Administradores"
              value={stats?.roles.administrador ?? 0}
              color="from-(--primary) to-(--primary-light)"
              icon="settings"
            />

            <StatsCard
              title="Gerencia"
              value={stats?.roles.gerencia ?? 0}
              color="from-amber-500 to-amber-600"
              icon="star"
            />

            <StatsCard
              title="Agentes"
              value={stats?.roles.agente ?? 0}
              color="from-purple-500 to-purple-600"
              icon="briefcase"
            />

            <StatsCard
              title="Propietarios"
              value={stats?.roles.propietario ?? 0}
              color="from-green-500 to-green-600"
              icon="home"
            />

            <StatsCard
              title="Inquilinos"
              value={stats?.roles.inquilino ?? 0}
              color="from-blue-500 to-blue-600"
              icon="key"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
