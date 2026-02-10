import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { Modal, FormInput, FormSelect } from "@/components/ui";
import {
  UserProfile,
  UserStatus,
  RentalFormData,
  CreateRentalDto,
  ContractStatus,
  UserRole,
  Contract,
} from "@/types/api";
import { usersService } from "@/lib/api/services/users";
import { Property } from "@/types/property";

interface RentalModalProps {
  property: Property;
  contract?: Contract | null;
  onClose: () => void;
  onSave: (data: CreateRentalDto) => void;
}

export default function RentalModal({
  property,
  contract,
  onClose,
  onSave,
}: RentalModalProps) {
  const isEditing = !!contract;

  // Inicializar estado usando una función de fábrica para evitar el lint de useEffect
  const [formData, setFormData] = useState<RentalFormData>(() => {
    if (contract) {
      return {
        tenantId: contract.tenantId,
        tenantEmail: contract.tenant.email,
        tenantName: contract.tenant.name,
        startDate: contract.startDate.split("T")[0],
        endDate: contract.endDate.split("T")[0],
        adjustmentFrequency: contract.adjustmentFrequency || 1,
        deposit: contract.deposit || 0,
        status: contract.status,
      };
    }
    return {
      tenantId: "",
      tenantEmail: "",
      tenantName: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      adjustmentFrequency: 1,
      deposit: 0,
      status: ContractStatus.ACTIVE,
    };
  });

  const [tenantSearch, setTenantSearch] = useState(() =>
    contract ? contract.tenant.name || contract.tenant.email : "",
  );

  const [selectedTenant, setSelectedTenant] = useState<UserProfile | null>(
    () => (contract ? (contract.tenant as unknown as UserProfile) : null),
  );

  const debouncedTenantSearch = useDebounce(tenantSearch, 500);

  const { data: tenants = [] } = useQuery({
    queryKey: ["users", "tenants", debouncedTenantSearch],
    queryFn: async (): Promise<UserProfile[]> => {
      if (isEditing) return [];
      const users = await usersService.getUsers({
        role: UserRole.Inquilino,
        search: debouncedTenantSearch,
      });

      return users.filter((u: UserProfile) => u.status === UserStatus.ACTIVE);
    },
    enabled: !isEditing && !!debouncedTenantSearch,
  });

  const [showTenantDropdown, setShowTenantDropdown] = useState(false);

  const handleTenantSelect = (tenant: UserProfile) => {
    setSelectedTenant(tenant);
    setFormData({
      ...formData,
      tenantId: tenant.id,
      tenantEmail: tenant.email,
      tenantName: tenant.name || tenant.email,
    });
    setTenantSearch(tenant.name || tenant.email);
    setShowTenantDropdown(false);
  };

  const handleTenantSearchChange = (value: string) => {
    if (isEditing) return;
    setTenantSearch(value);
    setShowTenantDropdown(true);
    if (!value) {
      setSelectedTenant(null);
      setFormData({
        ...formData,
        tenantId: "",
        tenantEmail: "",
        tenantName: "",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTenant && !isEditing) {
      alert("Por favor seleccione un inquilino");
      return;
    }

    const landlordId = property.owner?.id || contract?.landlordId;
    if (!landlordId) {
      alert("No se pudo identificar al propietario");
      return;
    }

    onSave({
      propertyId: property.id!,
      tenantId: selectedTenant?.id || contract!.tenantId,
      landlordId: landlordId,
      monthlyRent: property.price,
      deposit: formData.deposit,
      adjustmentFrequency: formData.adjustmentFrequency,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
    });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={
        isEditing ? "Editar Contrato de Alquiler" : "Crear Contrato de Alquiler"
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información de la Propiedad y Propietario */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-(--primary) mb-3">
            Propiedad
          </h3>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Título:</span> {property.title}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Ubicación: </span>
              {property.location}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Renta Mensual:</span> $
              {property.price.toLocaleString()}
            </p>
          </div>

          {/* Información del Propietario */}
          <div className="mt-4 pt-4 border-t border-(--border)">
            <h4 className="text-lg font-semibold text-(--primary) mb-3">
              Propietario
            </h4>
            <div className="space-y-1">
              <p className="text-gray-700">
                <span className="font-medium">Nombre: </span>
                {property.owner?.name ||
                  contract?.landlord.name ||
                  "No especificado"}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email: </span>
                <span className="font-mono">
                  {property.owner?.email ||
                    contract?.landlord.email ||
                    "No especificado"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Búsqueda de Inquilino */}
        <div className="relative">
          <div className="relative flex-1">
            <FormInput
              label="Inquilino *"
              type="text"
              value={tenantSearch}
              onChange={(e) => handleTenantSearchChange(e.target.value)}
              onFocus={() => !isEditing && setShowTenantDropdown(true)}
              maxLength={100}
              icon="user"
              readOnly={isEditing}
              className={isEditing ? "bg-gray-100 cursor-not-allowed" : ""}
            />
          </div>

          {/* Dropdown de resultados */}
          {!isEditing && showTenantDropdown && tenantSearch && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-(--border) rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {tenants.length > 0 ? (
                tenants.map((tenant: UserProfile) => (
                  <button
                    key={tenant.email}
                    type="button"
                    onClick={() => handleTenantSelect(tenant)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-gray-900">
                      {tenant.name || tenant.email}
                    </div>
                    <div className="text-sm text-gray-500">{tenant.email}</div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No se encontraron inquilinos
                </div>
              )}
            </div>
          )}

          {isEditing && (
            <p className="text-xs text-blue-600 mt-1">
              El inquilino no se puede cambiar en un contrato establecido.
            </p>
          )}

          {!isEditing && tenants.length === 0 && tenantSearch.length > 0 && (
            <p className="text-sm text-amber-600 mt-1">
              No se encontraron inquilinos. Verifique el nombre o email.
            </p>
          )}
        </div>

        {/* Fechas del Contrato */}
        <div>
          <h3 className="text-lg font-semibold text-(--primary) mb-3">
            Fechas del Contrato
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Fecha de Inicio"
              type="date"
              required
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
            <FormInput
              label="Fecha de Vencimiento"
              type="date"
              required
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
          </div>
        </div>

        {/* Ajuste de Precio y Depósito */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-(--primary) mb-3">
              Meses de Ajuste
            </h3>
            <FormSelect
              label="Período de Ajuste"
              required
              value={formData.adjustmentFrequency.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  adjustmentFrequency: parseInt(e.target.value),
                })
              }
            >
              <option value="1">Mensual (cada mes)</option>
              <option value="2">Bimestral (cada 2 meses)</option>
              <option value="3">Trimestral (cada 3 meses)</option>
              <option value="4">Cuatrimestral (cada 4 meses)</option>
              <option value="6">Semestral (cada 6 meses)</option>
              <option value="12">Anual (cada año)</option>
            </FormSelect>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-(--primary) mb-3">
              Garantía
            </h3>
            <FormInput
              label="Depósito ($)"
              type="number"
              required
              min={0}
              value={formData.deposit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deposit: parseFloat(e.target.value),
                })
              }
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-(--accent) text-white rounded-lg font-medium hover:bg-(--accent-hover) transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isEditing ? "Guardar Cambios" : "Crear Contrato"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

