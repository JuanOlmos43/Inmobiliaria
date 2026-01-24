'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import StatsCard from '@/components/UI/StatsCard';
import Modal from '@/components/UI/Modal';
import FormInput from '@/components/UI/FormInput';
import FormSelect from '@/components/UI/FormSelect';
import { authService } from '@/lib/api/services/auth';
import { UserRole } from '@/types/api';
import { useAuth } from '@/hooks/useAuth';

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

const roleLabels = {
  tenant: 'Inquilino',
  landlord: 'Propietario',
  agent: 'Agente Inmobiliario',
  owner: 'Gerencia'
};

const roleColors = {
  tenant: 'from-blue-500 to-blue-600',
  landlord: 'from-green-500 to-green-600',
  agent: 'from-purple-500 to-purple-600',
  owner: 'from-amber-500 to-amber-600'
};

// Mapeo de roles del frontend al backend
const roleMapping: Record<string, UserRole> = {
  tenant: UserRole.TENANT,
  landlord: UserRole.LANDLORD,
  agent: UserRole.AGENT,
  owner: UserRole.MANAGER
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuth(); // Usar hook de auth
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  // Estados del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'tenant' as 'tenant' | 'landlord' | 'agent' | 'owner'
  });



  // Cargar usuarios desde localStorage (Simulado hasta que exista endpoint de lista de usuarios)
  const loadUsers = () => {
    const storedUsers = localStorage.getItem('systemUsers');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Iniciar con lista vacía
      setUsers([]);
      localStorage.setItem('systemUsers', JSON.stringify([]));
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);



  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({ email: '', password: '', name: '', phone: '', role: 'tenant' });
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({ email: user.email, password: user.password, name: user.name || '', phone: user.phone || '', role: user.role });
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

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      // Editar usuario existente (aún en localStorage)
      const updatedUsers = users.map(u =>
        u.id === editingUser.id
          ? { ...u, email: formData.email, password: formData.password, name: formData.name, phone: formData.phone, role: formData.role }
          : u
      );
      setUsers(updatedUsers);
      localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
      setShowModal(false);
      setFormData({ email: '', password: '', name: '', phone: '', role: 'tenant' });
    } else {
      // Crear nuevo usuario usando el servicio del backend
      try {
        const backendRole = roleMapping[formData.role];

        const newUser = await authService.register({
          email: formData.email,
          password: formData.password,
          name: formData.name || undefined,
          phone: formData.phone || undefined,
          role: backendRole
        });

        // Agregar el usuario creado a la lista local
        const userForList: User = {
          id: newUser.id,
          email: newUser.email,
          password: formData.password, // El backend no devuelve la contraseña
          name: newUser.name,
          phone: newUser.phone || undefined,
          role: formData.role,
          createdAt: newUser.createdAt,
          status: 'active'
        };

        const updatedUsers = [...users, userForList];
        setUsers(updatedUsers);
        localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));

        setShowModal(false);
        setFormData({ email: '', password: '', name: '', phone: '', role: 'tenant' });

        alert('Usuario creado exitosamente');
      } catch (error) {
        console.error('Error al crear usuario:', error);
        alert(`Error al crear usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

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

        {/* User Management Section */}
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

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar por email</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar usuario..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por rol</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              >
                <option value="all">Todos los roles</option>
                <option value="tenant">Inquilino</option>
                <option value="landlord">Propietario</option>
                <option value="agent">Agente Inmobiliario</option>
                <option value="owner">Gerencia</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0f172a] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Contraseña</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Rol</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Fecha Creación</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      <span className="bg-gray-100 px-2 py-1 rounded">{user.password}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${roleColors[user.role]}`}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {user.status === 'active' ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No se encontraron usuarios
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <FormInput
            label="Correo Electrónico"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="usuario@email.com"
          />

          <FormInput
            label="Contraseña"
            type="text"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            placeholder="Contraseña"
          />

          <FormInput
            label="Nombre Completo"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nombre completo del usuario"
          />

          <FormInput
            label="Teléfono"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+54 11 1234-5678"
          />

          <FormSelect
            label="Rol"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'tenant' | 'landlord' | 'agent' | 'owner' })}
          >
            <option value="tenant">Inquilino</option>
            <option value="landlord">Propietario</option>
            <option value="agent">Agente Inmobiliario</option>
            <option value="owner">Gerencia</option>
          </FormSelect>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#14b8a6] text-white rounded-lg hover:bg-[#0d9488] transition-all shadow-md hover:shadow-lg"
            >
              {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

