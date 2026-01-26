"use client";

import { useState, useEffect } from "react";

import StatsCard from "@/components/UI/StatsCard";
import ConfirmModal from "@/components/UI/ConfirmModal";
import Toast from "@/components/UI/Toast";
import CreateUserModal from "@/components/dashboard/admin/CreateUserModal";
import UsersTable from "@/components/dashboard/admin/UsersTable";
import { usersService } from "@/lib/api/services/users";
import { UserProfile, UserRole, UserStats } from "@/types/api";

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
   * Estadísticas de usuarios obtenidas del backend
   */
  const [stats, setStats] = useState<UserStats | null>(null);

  /**
   * Filtro de búsqueda por email
   */
  const [searchEmail, setSearchEmail] = useState("");

  /**
   * Filtro por rol de usuario
   */
  const [filterRole, setFilterRole] = useState<string>("all");

  /**
   * Estados para el Toast (feedback)
   */
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error",
    duration: 3000,
  });

  /**
   * Estados para el ConfirmModal
   */


  /**
   * Estados para el ConfirmModal de Reset Password
   */
  const [confirmReset, setConfirmReset] = useState({
    isOpen: false,
    userId: "",
    isLoading: false,
  });

  // ============================================
  // EFECTOS - CARGA DE DATOS
  // ============================================

  /**
   * Carga las estadísticas iniciales desde el backend al montar el componente
   */
  useEffect(() => {
    loadStats();
  }, []);

  /**
   * Recargar usuarios cuando cambian los filtros
   */
  useEffect(() => {
    const filters: { role?: UserRole; email?: string } = {};
    
    if (filterRole !== "all") {
      filters.role = filterRole as UserRole;
    }
    
    if (searchEmail.trim()) {
      filters.email = searchEmail.trim();
    }

    loadUsers(Object.keys(filters).length > 0 ? filters : undefined);
  }, [searchEmail, filterRole]);

  /**
   * Función para cargar usuarios desde el backend
   * Puede ser llamada para refrescar la lista
   * @param filters - Filtros opcionales para la búsqueda
   */
  const loadUsers = async (filters?: { role?: UserRole; email?: string }) => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtiene usuarios con filtros opcionales
      const usersData = await usersService.getUsers(filters);

      // Mapea UserProfile del backend a User del frontend
      const mappedUsers: User[] = usersData.map((user: UserProfile) => ({
        id: user.id,
        email: user.email,
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

  /**
   * Función para cargar estadísticas desde el backend
   * Puede ser llamada para refrescar las estadísticas
   */
  const loadStats = async () => {
    try {
      const statsData = await usersService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
      // No bloqueamos la UI si fallan las estadísticas
    }
  };

  /**
   * Función para mostrar feedback visual
   */
  const showToast = (message: string, type: "success" | "error" = "success") => {
    // Si es error, dura 6 segundos (6000ms), si es éxito 3 segundos (3000ms)
    const duration = type === "error" ? 6000 : 3000;
    setToast({ isVisible: true, message, type, duration });
  };

  // ============================================
  // HANDLERS - GESTIÓN DE USUARIOS
  // ============================================

  /**
   * Abre el modal en modo "crear usuario"
   * Limpia editingUser para indicar que es un nuevo usuario
   */
  const handleCreateUser = () => {
    setShowModal(true);
  };







  /**
   * Inicia el proceso de restauración de contraseña
   */
  const handleResetPassword = (userId: string) => {
    setConfirmReset({ isOpen: true, userId, isLoading: false });
  };

  /**
   * Ejecuta el reset de la contraseña volviéndola a 'admin123'
   */
  const executeResetPassword = async () => {
    const { userId } = confirmReset;
    if (!userId) return;

    try {
      setConfirmReset((prev) => ({ ...prev, isLoading: true }));
      await usersService.updateUser(userId, { password: "admin123" });

      showToast("Contraseña restaurada a 'admin123' correctamente");
      setConfirmReset({ isOpen: false, userId: "", isLoading: false });
    } catch (err) {
      console.error("Error al resetear contraseña:", err);
      showToast("Error al restaurar la contraseña", "error");
      setConfirmReset((prev) => ({ ...prev, isLoading: false }));
    }
  };

  /**
   * Callback ejecutado cuando se crea un nuevo usuario exitosamente
   * Refresca la lista completa y las estadísticas desde el backend
   */
  const handleUserCreated = async () => {
    // Refrescar la lista completa y estadísticas desde el backend
    await loadUsers();
    await loadStats();
  };

  /**
   * Callback ejecutado cuando se guarda una edición en línea desde la tabla
   */
  const handleSaveInlineEdit = async (userId: string, data: Partial<User>) => {
    try {
      await usersService.updateUser(userId, data as Partial<UserProfile>);
      showToast("Usuario actualizado correctamente");
      await loadUsers();
      await loadStats();
    } catch (err) {
      console.error("Error al guardar edición en línea:", err);
      showToast("Error al actualizar usuario", "error");
      throw err; // Re-lanzar para que la tabla sepa que falló
    }
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
              value={stats?.summary.total ?? 0}
              color="from-[#0f172a] to-[#334155]"
              icon="users"
            />

            {/* Usuarios activos */}
            <StatsCard
              title="Usuarios Activos"
              value={stats?.summary.active ?? 0}
              color="from-[#14b8a6] to-[#0d9488]"
              icon="check"
            />

            {/* Inquilinos */}
            <StatsCard
              title="Inquilinos"
              value={stats?.roles.inquilino ?? 0}
              color="from-blue-500 to-blue-600"
              icon="key"
            />

            {/* Propietarios */}
            <StatsCard
              title="Propietarios"
              value={stats?.roles.propietario ?? 0}
              color="from-green-500 to-green-600"
              icon="home"
            />

            {/* Agentes inmobiliarios */}
            <StatsCard
              title="Agentes"
              value={stats?.roles.agente ?? 0}
              color="from-purple-500 to-purple-600"
              icon="briefcase"
            />

            {/* Gerencia */}
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
              Crear usuario
            </button>
          </div>

          {/* ========================================
              SECCIÓN: FILTROS DE BÚSQUEDA
              ======================================== */}
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
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent transition-all"
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
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent transition-all"
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
                onClick={() => loadUsers()}
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
              onSaveEdit={handleSaveInlineEdit}
              onResetPassword={handleResetPassword}
            />
          )}
        </div>
      </main>

      {/* ========================================
          MODAL: CREAR/EDITAR USUARIO
          ======================================== */}
      <CreateUserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUserCreated={handleUserCreated}
      />



      {/* Confirmación de reseteo de contraseña */}
      <ConfirmModal
        isOpen={confirmReset.isOpen}
        onClose={() =>
          setConfirmReset({ isOpen: false, userId: "", isLoading: false })
        }
        onConfirm={executeResetPassword}
        title="Restaurar Contraseña"
        message="¿Estás seguro de que deseas restaurar la contraseña de este usuario? La nueva contraseña será 'admin123'."
        confirmLabel="Restaurar"
        isLoading={confirmReset.isLoading}
        type="warning"
      />

      {/* Feedback visual */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
