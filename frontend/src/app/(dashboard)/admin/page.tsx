'use client';

import { useState } from 'react';

import StatsCard from '@/components/UI/StatsCard';
import UserFormModal from '@/components/UserFormModal';
import UsersTable from '@/components/UsersTable';

// Tipos
interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  phone?: string;
  role: 'tenant' | 'landlord' | 'agent' | 'owner';
  createdAt: string;
  status: 'active' | 'inactive';
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);


  const handleCreateUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
    }
  };

  const handleToggleStatus = (userId: string) => {
    const updatedUsers = users.map(u =>
      u.id === userId
        ? { ...u, status: u.status === 'active' ? 'inactive' as const : 'active' as const }
        : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
  };

  const handleUserCreated = (newUser: User) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
  };

  const handleUserUpdated = (updatedUser: User) => {
    const updatedUsers = users.map(u =>
      u.id === updatedUser.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
  };

  // Estadísticas
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    tenants: users.filter(u => u.role === 'tenant').length,
    landlords: users.filter(u => u.role === 'landlord').length,
    agents: users.filter(u => u.role === 'agent').length,
    owners: users.filter(u => u.role === 'owner').length
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Estadísticas del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <StatsCard
              title="Total Usuarios"
              value={stats.total}
              color="from-[#0f172a] to-[#334155]"
              icon="users"
            />
            <StatsCard
              title="Usuarios Activos"
              value={stats.active}
              color="from-[#14b8a6] to-[#0d9488]"
              icon="check"
            />
            <StatsCard
              title="Inquilinos"
              value={stats.tenants}
              color="from-blue-500 to-blue-600"
              icon="key"
            />
            <StatsCard
              title="Propietarios"
              value={stats.landlords}
              color="from-green-500 to-green-600"
              icon="home"
            />
            <StatsCard
              title="Agentes"
              value={stats.agents}
              color="from-purple-500 to-purple-600"
              icon="briefcase"
            />
            <StatsCard
              title="Gerencia"
              value={stats.owners}
              color="from-amber-500 to-amber-600"
              icon="star"
            />
          </div>
        </div>

        {/* Gestión de Usuarios */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-[#0f172a]">Gestión de Usuarios</h2>
            <button
              onClick={handleCreateUser}
              className="px-6 py-3 bg-[#14b8a6] text-white rounded-lg hover:bg-[#0d9488] transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Usuario
            </button>
          </div>

          <UsersTable
            users={users}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </main>

      {/* Modal de Usuario */}
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

