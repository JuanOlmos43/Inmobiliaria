import { RoleCard } from "./RoleCard";
import { UserStats } from "@/types/api";
import { StatsSummaryCard } from "../common/StatsSummaryCard";

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
      <div className="space-y-8">
        {/* Bloque Unificado de Resumen */}
        <StatsSummaryCard
          title="Total Usuarios"
          icon="user"
          total={stats?.summary.total ?? 0}
          newToday={stats?.growth.registrationsToday ?? 0}
          newThisMonth={stats?.growth.newThisMonth ?? 0}
          active={stats?.summary.active ?? 0}
          activeLabel="Activos"
          paused={stats?.summary.inactive ?? 0}
          pausedLabel="Pausados"
        />

        {/* Fila 2: Roles del Sistema */}
        <div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {/* Role Cards */}
            <RoleCard
              title="Administradores"
              value={stats?.roles.administrador ?? 0}
              color="from-(--primary) to-(--primary-light)"
              icon="settings"
            />
            <RoleCard
              title="Gerencia"
              value={stats?.roles.gerencia ?? 0}
              color="from-amber-500 to-amber-600"
              icon="star"
            />
            <RoleCard
              title="Agentes"
              value={stats?.roles.agente ?? 0}
              color="from-purple-500 to-purple-600"
              icon="briefcase"
            />
            <RoleCard
              title="Propietarios"
              value={stats?.roles.propietario ?? 0}
              color="from-green-500 to-green-600"
              icon="home"
            />
            <RoleCard
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
