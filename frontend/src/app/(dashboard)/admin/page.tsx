"use client";

import { ConfirmModal, Toast, Icon } from "@/components/ui";
import CreateUserModal from "@/components/dashboard/admin/CreateUserModal";
import UsersTable from "@/components/dashboard/admin/UsersTable";
import AdminStatsGrid from "@/components/dashboard/admin/AdminStatsGrid";
import AdminUsersFilters from "@/components/dashboard/admin/AdminUsersFilters";
import { useAdminUsers, DEFAULT_PASSWORD } from "@/hooks/useAdminUsers";

/**
 * AdminDashboardPage
 *
 * Página principal del dashboard de administrador.
 * Orquesta los componentes especializados y la lógica de negocio a través del hook useAdminUsers.
 */
export default function AdminDashboardPage() {
  const {
    // Datos
    users,
    stats,
    isLoading,
    error,

    // Filtros
    searchEmail,
    setSearchEmail,
    filterRole,
    setFilterRole,

    // UI State
    showModal,
    setShowModal,
    toast,
    hideToast,
    confirmReset,

    // Acciones
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
        {/* SECCIÓN: ESTADÍSTICAS */}
        <AdminStatsGrid stats={stats} />

        {/* SECCIÓN: GESTIÓN DE USUARIOS */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-(--primary)">
              Gestión de Usuarios
            </h2>
            {/*BOTON CREAR USUARIO */}
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-(--accent) text-white rounded-full hover:bg-(--accent-hover) transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:scale-95"
            >
              <Icon name="plus" className="w-5 h-5" />
              Crear usuario
            </button>
          </div>

          {/* FILTROS DE BÚSQUEDA */}
          <AdminUsersFilters
            searchEmail={searchEmail}
            setSearchEmail={setSearchEmail}
            filterRole={filterRole}
            setFilterRole={setFilterRole}
          />

          {/* ESTADOS DE CARGA Y ERROR */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--accent)"></div>
              <p className="ml-4 text-gray-600">Cargando...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => retryLoadUsers()}
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
        confirmText="Restaurar"
        isLoading={confirmReset.isLoading}
        variant="warning"
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

