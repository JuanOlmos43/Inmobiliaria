import { Icon } from "@/components/ui";
import { UserStats } from "@/types/api";
import { PropertiesSummaryCard } from "../common/PropertiesSummaryCard";

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
        {/* Bloque Unificado de Resumen (Smart Component) */}
        <PropertiesSummaryCard
          // Al pasar stats de admin, el componente activa "Modo Admin" (Título Usuarios, Icono user, masculino, columnas hoy/mes)
          total={stats?.summary.total ?? 0}
          today={stats?.growth.registrationsToday ?? 0}
          month={stats?.growth.newThisMonth ?? 0}
          active={stats?.summary.active ?? 0}
          paused={stats?.summary.inactive ?? 0}
        />

        {/* Fila 2: Roles del Sistema */}
        <div>
          <h3 className="mb-4 text-sm font-medium tracking-wider text-slate-500 uppercase">
            Distribución por Roles
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {(
              [
                {
                  title: "Administradores",
                  value: stats?.roles.administrador ?? 0,
                  color: "from-(--primary) to-(--primary-light)",
                  icon: "settings",
                },
                {
                  title: "Gerencia",
                  value: stats?.roles.gerencia ?? 0,
                  color: "from-amber-500 to-amber-600",
                  icon: "star",
                },
                {
                  title: "Agentes",
                  value: stats?.roles.agente ?? 0,
                  color: "from-purple-500 to-purple-600",
                  icon: "briefcase",
                },
                {
                  title: "Propietarios",
                  value: stats?.roles.propietario ?? 0,
                  color: "from-green-500 to-green-600",
                  icon: "home",
                },
                {
                  title: "Inquilinos",
                  value: stats?.roles.inquilino ?? 0,
                  color: "from-blue-500 to-blue-600",
                  icon: "key",
                },
              ] as const
            ).map((role) => (
              <div
                key={role.title}
                className={`flex items-center gap-4 rounded-xl bg-linear-to-br p-5 text-white shadow-lg ${role.color}`}
              >
                <div className="shrink-0 rounded-lg bg-white/20 p-3 backdrop-blur-sm">
                  <Icon name={role.icon} className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase opacity-80">
                    {role.title}
                  </p>
                  <p className="text-3xl font-bold tracking-tight">
                    {role.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
