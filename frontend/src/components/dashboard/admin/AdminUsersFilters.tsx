import { UserRole } from "@/types/api";
import { FormInput, FormSelect, Button, Icon } from "@/components/ui";

interface AdminUsersFiltersProps {
  searchEmail: string;
  setSearchEmail: (val: string) => void;
  filterRole: UserRole | "all";
  setFilterRole: (val: UserRole | "all") => void;
  onClearFilters: () => void;
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
  onClearFilters,
}: AdminUsersFiltersProps) {
  const hasFilters = searchEmail.trim() !== "" || filterRole !== "all";

  return (
    <div className="mb-8 grid grid-cols-1 font-sans gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-4">
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

      <div className="flex items-end pb-1 md:col-span-2">
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            icon={<Icon name="close" className="h-4 w-4" />}
            className="animate-in fade-in slide-in-from-left-2 duration-300"
          >
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
