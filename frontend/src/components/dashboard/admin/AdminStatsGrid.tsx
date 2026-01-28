import StatsCard from "@/components/UI/StatsCard";
import Icon from "@/components/UI/Icon";
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
      <h2 className="text-2xl font-bold text-(--primary) mb-6">
        Estadísticas del Sistema
      </h2>

      <div className="space-y-8">
        {/* Bloque Unificado de Resumen */}
        <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl overflow-hidden text-white border border-white/10">
          <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Lado Izquierdo: Total y Crecimiento */}
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                <Icon name="users" className="w-10 h-10 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-10">
                  {/* Columna Total */}
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Total Usuarios
                    </p>
                    <h3 className="text-5xl font-black tracking-tight leading-none">
                      {stats?.summary.total ?? 0}
                    </h3>
                  </div>

                  {/* Columna Hoy */}
                  <div className="flex flex-col pt-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                      Hoy
                    </span>
                    <span className="text-xl font-bold text-emerald-400 leading-none">
                      +{stats?.growth.registrationsToday ?? 0}
                    </span>
                  </div>

                  {/* Columna Mes */}
                  <div className="flex flex-col pt-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                      Mes
                    </span>
                    <span className="text-xl font-bold text-emerald-400 leading-none">
                      +{stats?.growth.newThisMonth ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divisor Vertical (solo en LG) */}
            <div className="hidden lg:block h-16 w-px bg-white/10" />

            {/* Lado Derecho: Desglose de Estados */}
            <div className="grid grid-cols-3 gap-6 sm:gap-12">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
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
                  <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
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
                  <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
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
          <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">
            Distribución por Roles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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
