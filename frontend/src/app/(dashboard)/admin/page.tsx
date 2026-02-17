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
    pagination,
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
    <>
      {/* SECCIÓN: ESTADÍSTICAS */}
      <AdminStatsGrid stats={stats} />

      {/* SECCIÓN: GESTIÓN DE USUARIOS */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h2 className="text-2xl font-bold text-(--primary)">
            Gestión de Usuarios
          </h2>
          {/*BOTON CREAR USUARIO */}
          <button
            onClick={() => setShowModal(true)}
            className="flex transform items-center gap-2 rounded-full bg-(--accent) px-6 py-3 text-white shadow-md transition-all hover:scale-95 hover:bg-(--accent-hover) hover:shadow-lg"
          >
            <Icon name="plus" className="h-5 w-5" />
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
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-(--accent)"></div>
            <p className="ml-4 text-gray-600">Cargando...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="mb-4 text-red-600">{error}</p>
            <button
              onClick={() => retryLoadUsers()}
              className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
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
            pagination={pagination}
          />
        )}
      </div>

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
    </>
  );
}
