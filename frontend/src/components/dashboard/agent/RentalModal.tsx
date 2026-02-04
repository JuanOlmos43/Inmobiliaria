import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import Modal from "@/components/UI/Modal";
import Icon from "@/components/UI/Icon";
import FormInput from "@/components/UI/FormInput";
import FormSelect from "@/components/UI/FormSelect";
import {
  UserRole,
  UserProfile,
  UserStatus,
  RentalData,
  CreateRentalDto,
} from "@/types/api";
import { usersService } from "@/lib/api/services/users";

import { Property } from "@/types/property";

interface SystemUser {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: UserRole;
  status: "active" | "inactive";
}

// Extend Property type to include owner from backend
interface PropertyWithOwner extends Property {
  owner?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

interface RentalModalProps {
  property: PropertyWithOwner;
  onClose: () => void;
  onSave: (data: CreateRentalDto) => void;
}

export default function RentalModal({
  property,
  onClose,
  onSave,
}: RentalModalProps) {
  const [formData, setFormData] = useState<RentalData>({
    tenantEmail: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    adjustmentPeriod: "mensual",
    adjustmentPercentage: 0,
    status: "active",
  });

  const [tenantSearch, setTenantSearch] = useState("");
  const debouncedTenantSearch = useDebounce(tenantSearch, 500);

  // Use TanStack Query instead of manual fetch/effect
  const { data: tenants = [] } = useQuery({
    queryKey: ["users", "tenants", debouncedTenantSearch],
    queryFn: async (): Promise<SystemUser[]> => {
      const users = await usersService.getUsers({
        role: UserRole.Inquilino,
        search: debouncedTenantSearch,
      });

      return users
        .filter((u: UserProfile) => u.status === UserStatus.ACTIVE)
        .map((u: UserProfile) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          phone: u.phone || undefined,
          role: u.role,
          status: u.status === UserStatus.ACTIVE ? "active" : "inactive",
        }));
    },
  });
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<SystemUser | null>(null);

  const handleTenantSelect = (tenant: SystemUser) => {
    setSelectedTenant(tenant);
    setFormData({ ...formData, tenantEmail: tenant.email });
    setTenantSearch(tenant.name || tenant.email);
    setShowTenantDropdown(false);
  };

  const handleTenantSearchChange = (value: string) => {
    setTenantSearch(value);
    setShowTenantDropdown(true);
    if (!value) {
      setSelectedTenant(null);
      setFormData({ ...formData, tenantEmail: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextAdjustmentDate = new Date(formData.startDate);
    const periodMonths: Record<string, number> = {
      mensual: 1,
      bimestral: 2,
      trimestral: 3,
      cuatrimestral: 4,
      semestral: 6,
      anual: 12,
    };
    const incrementMonths = periodMonths[formData.adjustmentPeriod] || 1;
    nextAdjustmentDate.setMonth(
      nextAdjustmentDate.getMonth() + incrementMonths,
    );

    onSave({
      ...formData,
      landlordName: property.owner?.name || "No especificado",
      landlordPhone: property.owner?.phone || "No especificado",
      landlordEmail: property.owner?.email || "No especificado",
      nextAdjustmentDate: nextAdjustmentDate.toISOString().split("T")[0],
    });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Crear Contrato de Alquiler"
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
                {property.owner?.name || "No especificado"}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Teléfono: </span>
                <span className="font-mono">
                  {property.owner?.phone || "No especificado"}
                </span>
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email: </span>
                <span className="font-mono">
                  {property.owner?.email || "No especificado"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Búsqueda de Inquilino */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inquilino *
          </label>
          <div className="relative flex-1">
            <Icon
              name="user"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              type="text"
              required
              value={tenantSearch}
              onChange={(e) => handleTenantSearchChange(e.target.value)}
              onFocus={() => setShowTenantDropdown(true)}
              maxLength={100}
              className="w-full pl-10 px-4 py-2 border rounded-lg transition-all duration-300 border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              placeholder="Buscar inquilino por nombre o email..."
            />
          </div>

          {/* Dropdown de resultados */}
          {showTenantDropdown && tenantSearch && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-(--border) rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {tenants.length > 0 ? (
                tenants.map((tenant: SystemUser) => (
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
                    {tenant.phone && (
                      <div className="text-xs text-gray-400">
                        {tenant.phone}
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No se encontraron inquilinos
                </div>
              )}
            </div>
          )}

          {tenants.length === 0 && (
            <p className="text-sm text-amber-600 mt-1">
              No hay inquilinos disponibles. El administrador debe crear
              usuarios con rol: Inquilino.
            </p>
          )}

          {selectedTenant && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Inquilino seleccionado
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    <span className="font-medium">Nombre:</span>{" "}
                    {selectedTenant.name || selectedTenant.email}
                  </p>
                  <p className="text-xs text-blue-700">
                    <span className="font-medium">Email:</span>{" "}
                    {selectedTenant.email}
                  </p>
                  {selectedTenant.phone && (
                    <p className="text-xs text-blue-700">
                      <span className="font-medium">Teléfono:</span>{" "}
                      {selectedTenant.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
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

        {/* Meses de Ajuste de Precio */}
        <div>
          <h3 className="text-lg font-semibold text-(--primary) mb-3">
            Meses de Ajuste
          </h3>
          <FormSelect
            label="Período de Ajuste"
            required
            value={formData.adjustmentPeriod}
            onChange={(e) =>
              setFormData({
                ...formData,
                adjustmentPeriod: e.target.value as
                  | "mensual"
                  | "bimestral"
                  | "trimestral"
                  | "cuatrimestral"
                  | "semestral"
                  | "anual",
              })
            }
          >
            <option value="mensual">Mensual (cada mes)</option>
            <option value="bimestral">Bimestral (cada 2 meses)</option>
            <option value="trimestral">Trimestral (cada 3 meses)</option>
            <option value="cuatrimestral">Cuatrimestral (cada 4 meses)</option>
            <option value="semestral">Semestral (cada 6 meses)</option>
            <option value="anual">Anual (cada año)</option>
          </FormSelect>
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
            Crear Contrato
          </button>
        </div>
      </form>
    </Modal>
  );
}
