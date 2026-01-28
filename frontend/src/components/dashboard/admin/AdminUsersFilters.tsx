import { UserRole } from "@/types/api";

interface AdminUsersFiltersProps {
  searchEmail: string;
  setSearchEmail: (val: string) => void;
  filterRole: UserRole | "all";
  setFilterRole: (val: UserRole | "all") => void;
}

/**
 * AdminUsersFilters
 * Componente de barra de herramientas para buscar y filtrar usuarios.
 */
export default function AdminUsersFilters({
  searchEmail,
  setSearchEmail,
  filterRole,
  setFilterRole,
}: AdminUsersFiltersProps) {
  return (
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
          onChange={(e) => setFilterRole(e.target.value as UserRole | "all")}
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
  );
}
