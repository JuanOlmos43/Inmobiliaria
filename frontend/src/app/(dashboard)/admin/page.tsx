"use client";

import { useState, useEffect } from "react";

import StatsCard from "@/components/UI/StatsCard";
import UserFormModal from "@/components/UserFormModal";
import UsersTable from "@/components/UsersTable";
import { usersService } from "@/lib/api/services/users";
import { UserProfile, UserRole } from "@/types/api";

// ============================================
// TIPOS DE DATOS
// ============================================

/**
 * Interfaz que define la estructura de un usuario en el sistema
 * Representa tanto usuarios del frontend como del backend
 */
interface User {
  id: string; // ID único del usuario
  email: string; // Email para login
  password: string; // Contraseña (solo para mostrar en admin)
  name?: string; // Nombre completo (opcional)
  phone?: string; // Teléfono de contacto (opcional)
  role: UserRole; // Rol del usuario en el sistema
  createdAt: string; // Fecha de creación (ISO string)
  status: "active" | "inactive"; // Estado del usuario
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

/**
 * AdminDashboardPage
 *
 * Página principal del dashboard de administrador.
 * Permite gestionar usuarios del sistema: crear, editar, eliminar y cambiar estado.
 * Muestra estadísticas en tiempo real sobre los usuarios.
 */
export default function AdminDashboardPage() {
  // ============================================
  // ESTADOS DEL COMPONENTE
  // ============================================

  /**
   * Lista de todos los usuarios del sistema
   * Se carga desde el backend mediante usersService.getUsers()
   */
  const [users, setUsers] = useState<User[]>([]);

  /**
   * Indica si se están cargando los usuarios desde el backend
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Almacena errores de carga de usuarios
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * Controla la visibilidad del modal de crear/editar usuario
   */
  const [showModal, setShowModal] = useState(false);

  /**
   * Usuario que se está editando actualmente
   * - null: Modo crear (nuevo usuario)
   * - User: Modo editar (usuario existente)
   */
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // ============================================
  // EFECTOS - CARGA DE DATOS
  // ============================================

  /**
   * Carga la lista de usuarios desde el backend al montar el componente
   */
  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Función para cargar usuarios desde el backend
   * Puede ser llamada para refrescar la lista
   */
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtiene todos los usuarios (sin filtro de rol)
      const usersData = await usersService.getUsers();

      // Mapea UserProfile del backend a User del frontend
      const mappedUsers: User[] = usersData.map((user: UserProfile) => ({
        id: user.id,
        email: user.email,
        password: "********", // No mostramos la contraseña real
        name: user.name,
        phone: user.phone || undefined, // Convierte null a undefined
        role: user.role, // Los roles ya vienen en español del backend
        createdAt: user.createdAt,
        status: user.status === "active" ? "active" : "inactive", // Mapea status del backend
      }));

      setUsers(mappedUsers);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("Error al cargar usuarios. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // HANDLERS - GESTIÓN DE USUARIOS
  // ============================================

  /**
   * Abre el modal en modo "crear usuario"
   * Limpia editingUser para indicar que es un nuevo usuario
   */
  const handleCreateUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  /**
   * Abre el modal en modo "editar usuario"
   * @param user - Usuario a editar
   */
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  /**
   * Elimina un usuario del sistema
   * Muestra confirmación antes de eliminar
   *
   * @param userId - ID del usuario a eliminar
   * TODO: Implementar endpoint DELETE /users/:id en el backend
   */
  const handleDeleteUser = async (userId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        // TODO: Llamar a usersService.deleteUser(userId) cuando exista el endpoint
        // Por ahora solo actualizamos el estado local
        const updatedUsers = users.filter((u) => u.id !== userId);
        setUsers(updatedUsers);

        // Opcional: Refrescar desde el backend
        // await loadUsers();
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
        alert("Error al eliminar usuario. Por favor, intenta de nuevo.");
      }
    }
  };

  /**
   * Alterna el estado de un usuario entre 'active' e 'inactive'
   * Útil para desactivar usuarios sin eliminarlos
   *
   * @param userId - ID del usuario a cambiar estado
   * TODO: Implementar endpoint PATCH /users/:id/status en el backend
   */
  const handleToggleStatus = async (userId: string) => {
    try {
      // TODO: Llamar a usersService.updateStatus(userId, newStatus) cuando exista el endpoint
      // Por ahora solo actualizamos el estado local
      const updatedUsers = users.map((u) =>
        u.id === userId
          ? {
              ...u,
              status:
                u.status === "active"
                  ? ("inactive" as const)
                  : ("active" as const),
            }
          : u,
      );
      setUsers(updatedUsers);
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("Error al cambiar estado del usuario.");
    }
  };

  /**
   * Callback ejecutado cuando se crea un nuevo usuario exitosamente
   * Refresca la lista completa desde el backend
   */
  const handleUserCreated = async () => {
    // Refrescar la lista completa desde el backend
    await loadUsers();
  };

  /**
   * Callback ejecutado cuando se actualiza un usuario existente
   *
   * @param updatedUser - Usuario con los datos actualizados
   * TODO: Implementar endpoint PATCH /users/:id en el backend
   */
  const handleUserUpdated = async (updatedUser: User) => {
    // Por ahora actualizamos localmente
    const updatedUsers = users.map((u) =>
      u.id === updatedUser.id ? updatedUser : u,
    );
    setUsers(updatedUsers);

    // Opcional: Refrescar desde el backend
    // await loadUsers();
  };

  // ============================================
  // CÁLCULO DE ESTADÍSTICAS
  // ============================================

  /**
   * Calcula estadísticas en tiempo real basadas en la lista de usuarios
   * Se recalcula automáticamente cuando cambia el array 'users'
   */
  const stats = {
    total: users.length, // Total de usuarios
    active: users.filter((u) => u.status === "active").length, // Usuarios activos
    tenants: users.filter((u) => u.role === UserRole.Inquilino).length, // Inquilinos
    landlords: users.filter((u) => u.role === UserRole.Propietario).length, // Propietarios
    agents: users.filter((u) => u.role === UserRole.Agente).length, // Agentes
    owners: users.filter((u) => u.role === UserRole.Gerencia).length, // Gerencia
  };

  // ============================================
  // RENDERIZADO
  // ============================================

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Contenedor principal con padding y ancho máximo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ========================================
            SECCIÓN: ESTADÍSTICAS DEL SISTEMA
            ======================================== */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0f172a] mb-6">
            Estadísticas del Sistema
          </h2>

          {/* Grid responsive de tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {/* Total de usuarios */}
            <StatsCard
              title="Total Usuarios"
              value={stats.total}
              color="from-[#0f172a] to-[#334155]"
              icon="users"
            />

            {/* Usuarios activos */}
            <StatsCard
              title="Usuarios Activos"
              value={stats.active}
              color="from-[#14b8a6] to-[#0d9488]"
              icon="check"
            />

            {/* Inquilinos */}
            <StatsCard
              title="Inquilinos"
              value={stats.tenants}
              color="from-blue-500 to-blue-600"
              icon="key"
            />

            {/* Propietarios */}
            <StatsCard
              title="Propietarios"
              value={stats.landlords}
              color="from-green-500 to-green-600"
              icon="home"
            />

            {/* Agentes inmobiliarios */}
            <StatsCard
              title="Agentes"
              value={stats.agents}
              color="from-purple-500 to-purple-600"
              icon="briefcase"
            />

            {/* Gerencia */}
            <StatsCard
              title="Gerencia"
              value={stats.owners}
              color="from-amber-500 to-amber-600"
              icon="star"
            />
          </div>
        </div>

        {/* ========================================
            SECCIÓN: GESTIÓN DE USUARIOS
            ======================================== */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Header con título y botón crear */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-[#0f172a]">
              Gestión de Usuarios
            </h2>

            {/* Botón para crear nuevo usuario */}
            <button
              onClick={handleCreateUser}
              className="px-6 py-3 bg-[#14b8a6] text-white rounded-lg hover:bg-[#0d9488] transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:scale-105"
            >
              {/* Icono de "+" */}
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
              Crear Usuario
            </button>
          </div>

          {/* Estado de carga */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14b8a6]"></div>
              <p className="ml-4 text-gray-600">Cargando usuarios...</p>
            </div>
          )}

          {/* Estado de error */}
          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadUsers}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Tabla de usuarios (solo si no hay error ni está cargando) */}
          {!isLoading && !error && (
            <UsersTable
              users={users}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </div>
      </main>

      {/* ========================================
          MODAL: CREAR/EDITAR USUARIO
          ======================================== */}
      <UserFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editingUser={editingUser}
        onUserCreated={handleUserCreated}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
}
