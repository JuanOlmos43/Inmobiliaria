'use client';

import { useState } from 'react';

import StatsCard from '@/components/UI/StatsCard';
import UserFormModal from '@/components/UserFormModal';
import UsersTable from '@/components/UsersTable';

// ============================================
// TIPOS DE DATOS
// ============================================

/**
 * Interfaz que define la estructura de un usuario en el sistema
 * Representa tanto usuarios del frontend como del backend
 */
interface User {
  id: string;                                    // ID único del usuario
  email: string;                                 // Email para login
  password: string;                              // Contraseña (solo para mostrar en admin)
  name?: string;                                 // Nombre completo (opcional)
  phone?: string;                                // Teléfono de contacto (opcional)
  role: 'tenant' | 'landlord' | 'agent' | 'owner'; // Rol del usuario en el sistema
  createdAt: string;                             // Fecha de creación (ISO string)
  status: 'active' | 'inactive';                 // Estado del usuario
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
   * Se almacena en localStorage como persistencia temporal
   * TODO: Reemplazar con llamada a API cuando exista endpoint GET /users
   */
  const [users, setUsers] = useState<User[]>([]);
  
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
   * Actualiza tanto el estado como localStorage
   * 
   * @param userId - ID del usuario a eliminar
   */
  const handleDeleteUser = (userId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      // Filtra el usuario a eliminar
      const updatedUsers = users.filter(u => u.id !== userId);
      
      // Actualiza el estado
      setUsers(updatedUsers);
      
      // Persiste en localStorage
      localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
    }
  };

  /**
   * Alterna el estado de un usuario entre 'active' e 'inactive'
   * Útil para desactivar usuarios sin eliminarlos
   * 
   * @param userId - ID del usuario a cambiar estado
   */
  const handleToggleStatus = (userId: string) => {
    const updatedUsers = users.map(u =>
      u.id === userId
        ? { ...u, status: u.status === 'active' ? 'inactive' as const : 'active' as const }
        : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
  };

  /**
   * Callback ejecutado cuando se crea un nuevo usuario exitosamente
   * Agrega el nuevo usuario a la lista y persiste en localStorage
   * 
   * @param newUser - Usuario recién creado desde el backend
   */
  const handleUserCreated = (newUser: User) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
  };

  /**
   * Callback ejecutado cuando se actualiza un usuario existente
   * Reemplaza el usuario antiguo con los nuevos datos
   * 
   * @param updatedUser - Usuario con los datos actualizados
   */
  const handleUserUpdated = (updatedUser: User) => {
    const updatedUsers = users.map(u =>
      u.id === updatedUser.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
  };

  // ============================================
  // CÁLCULO DE ESTADÍSTICAS
  // ============================================

  /**
   * Calcula estadísticas en tiempo real basadas en la lista de usuarios
   * Se recalcula automáticamente cuando cambia el array 'users'
   */
  const stats = {
    total: users.length,                                      // Total de usuarios
    active: users.filter(u => u.status === 'active').length,  // Usuarios activos
    tenants: users.filter(u => u.role === 'tenant').length,   // Inquilinos
    landlords: users.filter(u => u.role === 'landlord').length, // Propietarios
    agents: users.filter(u => u.role === 'agent').length,     // Agentes
    owners: users.filter(u => u.role === 'owner').length      // Gerencia
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
          <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Estadísticas del Sistema</h2>
          
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
            <h2 className="text-2xl font-bold text-[#0f172a]">Gestión de Usuarios</h2>
            
            {/* Botón para crear nuevo usuario */}
            <button
              onClick={handleCreateUser}
              className="px-6 py-3 bg-[#14b8a6] text-white rounded-lg hover:bg-[#0d9488] transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:scale-105"
            >
              {/* Icono de "+" */}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Usuario
            </button>
          </div>

          {/* Tabla de usuarios con filtros */}
          <UsersTable
            users={users}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onToggleStatus={handleToggleStatus}
          />
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
