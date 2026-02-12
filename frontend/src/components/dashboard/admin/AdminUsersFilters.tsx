import { UserRole } from "@/types/api";
import { FormInput, FormSelect } from "@/components/ui";

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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
      <FormInput
        label="Buscar por email"
        type="text"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        placeholder="ejemplo@correo.com"
        maxLength={255}
        icon="user"
      />

        <FormSelect
          label="Filtrar por rol"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as UserRole | "all")}
        >
          <option value="all">Todos los roles</option>
          <option value={UserRole.Inquilino}>Inquilino</option>
          <option value={UserRole.Propietario}>Propietario</option>
          <option value={UserRole.Agente}>Agente</option>
          <option value={UserRole.Gerencia}>Gerencia</option>
          <option value={UserRole.Administrador}>Administrador</option>
        </FormSelect>
    </div>
  );
}
