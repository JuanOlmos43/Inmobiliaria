"use client";

import StatsCard from "@/components/UI/StatsCard";
import ConfirmModal from "@/components/UI/ConfirmModal";
import Toast from "@/components/UI/Toast";
import CreateUserModal from "@/components/dashboard/admin/CreateUserModal";
import UsersTable from "@/components/dashboard/admin/UsersTable";
import { UserRole } from "@/types/api";
import { useAdminUsers, DEFAULT_PASSWORD } from "@/hooks/useAdminUsers";

/**
 * AdminDashboardPage
 *
 * Página principal del dashboard de administrador.
 * Permite gestionar usuarios del sistema: crear, editar, eliminar y cambiar estado.
 * Muestra estadísticas en tiempo real sobre los usuarios.
 */
export default function AdminDashboardPage() {
  // Extraemos toda la lógica del Custom Hook
  const {
    users,
    stats,
    isLoading,
    error,
    searchEmail,
    setSearchEmail,
    filterRole,
    setFilterRole,
    showModal,
    setShowModal,
    toast,
    hideToast,
    confirmReset,
    handleUserCreated,
    handleSaveInlineEdit,
    initiateResetPassword,
    executeResetPassword,
    closeConfirmReset,
    retryLoadUsers,
  } = useAdminUsers();

  return (
    <div className="min-h-screen bg-(--background)">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ========================================
            SECCIÓN: ESTADÍSTICAS DEL SISTEMA
            ======================================== */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-(--primary) mb-6">
            Estadísticas del Sistema
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {/* Total de usuarios con estadísticas de crecimiento sutiles */}
            <StatsCard
              title="Total Usuarios"
              value={stats?.summary.total ?? 0}
              color="from-(--primary) to-(--primary-light)"
              icon="users"
              subValue={[
                { label: "Hoy", value: stats?.growth.registrationsToday ?? 0 },
                { label: "Este mes", value: stats?.growth.newThisMonth ?? 0 },
              ]}
            />

            <StatsCard
              title="Usuarios Activos"
              value={stats?.summary.active ?? 0}
              color="from-(--accent) to-(--accent-hover)"
              icon="check"
            />

            <StatsCard
              title="Inquilinos"
              value={stats?.roles.inquilino ?? 0}
              color="from-blue-500 to-blue-600"
              icon="key"
            />

            <StatsCard
              title="Propietarios"
              value={stats?.roles.propietario ?? 0}
              color="from-green-500 to-green-600"
              icon="home"
            />

            <StatsCard
              title="Agentes"
              value={stats?.roles.agente ?? 0}
              color="from-purple-500 to-purple-600"
              icon="briefcase"
            />

            <StatsCard
              title="Gerencia"
              value={stats?.roles.gerencia ?? 0}
              color="from-amber-500 to-amber-600"
              icon="star"
            />
          </div>
        </div>

        {/* ========================================
            SECCIÓN: GESTIÓN DE USUARIOS
            ======================================== */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-(--primary)">
              Gestión de Usuarios
            </h2>

            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-(--accent) text-white rounded-lg hover:bg-(--accent-hover) transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:scale-105"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Crear usuario
            </button>
          </div>

          {/* FILTROS DE BÚSQUEDA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por email
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent transition-all"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por rol
              </label>
              <select
                value={filterRole}
                onChange={(e) =>
                  setFilterRole(e.target.value as UserRole | "all")
                }
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent transition-all"
              >
                <option value="all">Todos los roles</option>
                <option value={UserRole.Inquilino}>Inquilino</option>
                <option value={UserRole.Propietario}>Propietario</option>
                <option value={UserRole.Agente}>Agente</option>
                <option value={UserRole.Gerencia}>Gerencia</option>
                <option value={UserRole.Administrador}>Administrador</option>
              </select>
            </div>
          </div>

          {/* ESTADOS DE CARGA Y ERROR */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--accent)"></div>
              <p className="ml-4 text-gray-600">Cargando usuarios...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={retryLoadUsers}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* TABLA DE USUARIOS */}
          {!isLoading && !error && (
            <UsersTable
              users={users}
              onSaveEdit={handleSaveInlineEdit}
              onResetPassword={initiateResetPassword}
            />
          )}
        </div>
      </main>

      {/* COMPONENTES DE UI (MODALES Y FEEDBACK) */}
      <CreateUserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUserCreated={handleUserCreated}
      />

      <ConfirmModal
        isOpen={confirmReset.isOpen}
        onClose={closeConfirmReset}
        onConfirm={executeResetPassword}
        title="Restaurar Contraseña"
        message={`¿Estás seguro de que deseas restaurar la contraseña de este usuario? La nueva contraseña será '${DEFAULT_PASSWORD}'.`}
        confirmLabel="Restaurar"
        isLoading={confirmReset.isLoading}
        type="warning"
      />

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onClose={hideToast}
      />
    </div>
  );
}
