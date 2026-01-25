import { useState, useEffect } from 'react';
import Modal from '@/components/UI/Modal';

// Tipos
interface Property {
    id: string;
    title: string;
    price: number;
    location: string;
    landlordName?: string;
    landlordPhone?: string;
    landlordEmail?: string;
}

interface RentalData {
    tenantEmail: string;
    startDate: string;
    endDate: string;
    adjustmentPeriod: 'trimestral' | 'semestral' | 'anual';
    adjustmentPercentage: number;
    status: 'active' | 'expiring' | 'expired';
}

interface SystemUser {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    role: 'admin' | 'agent' | 'landlord' | 'tenant';
    status: 'active' | 'inactive';
}

interface RentalModalProps {
    property: Property;
    onClose: () => void;
    onSave: (data: RentalData & { landlordName: string; landlordPhone: string; landlordEmail: string; nextAdjustmentDate: string }) => void;
}

export default function RentalModal({
    property,
    onClose,
    onSave
}: RentalModalProps) {
    const [formData, setFormData] = useState<RentalData>({
        tenantEmail: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        adjustmentPeriod: 'anual',
        adjustmentPercentage: 0,
        status: 'active'
    });

    const [tenants, setTenants] = useState<SystemUser[]>([]);
    const [tenantSearch, setTenantSearch] = useState('');
    const [showTenantDropdown, setShowTenantDropdown] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<SystemUser | null>(null);

    useEffect(() => {
        // Mock fetch for now
        const storedUsers = localStorage.getItem('systemUsers');
        if (storedUsers) {
            const users = JSON.parse(storedUsers);
            const tenantUsers = users.filter((u: SystemUser) => u.role === 'tenant' && u.status === 'active');
            setTenants(tenantUsers);
        }
    }, []);

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
            setFormData({ ...formData, tenantEmail: '' });
        }
    };

    const filteredTenants = tenants.filter(tenant => {
        const searchLower = tenantSearch.toLowerCase();
        const name = (tenant.name || '').toLowerCase();
        const email = tenant.email.toLowerCase();
        return name.includes(searchLower) || email.includes(searchLower);
    });

    const calculateAdjustmentMonths = () => {
        if (!formData.startDate || !formData.endDate) return [];

        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const adjustmentMonths = [];
        const current = new Date(start);

        const incrementMonths = formData.adjustmentPeriod === 'trimestral' ? 3
            : formData.adjustmentPeriod === 'semestral' ? 6
                : 12;

        current.setMonth(current.getMonth() + incrementMonths);

        while (current <= end) {
            adjustmentMonths.push(new Date(current));
            current.setMonth(current.getMonth() + incrementMonths);
        }

        return adjustmentMonths;
    };

    const adjustmentMonths = calculateAdjustmentMonths();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const nextAdjustmentDate = new Date(formData.startDate);
        const incrementMonths = formData.adjustmentPeriod === 'trimestral' ? 3
            : formData.adjustmentPeriod === 'semestral' ? 6
                : 12;
        nextAdjustmentDate.setMonth(nextAdjustmentDate.getMonth() + incrementMonths);

        const landlordInfo = {
            landlordName: property.landlordName || 'Propietario de ' + property.title,
            landlordPhone: property.landlordPhone || '+54 11 0000-0000',
            landlordEmail: property.landlordEmail || 'propietario@email.com',
            nextAdjustmentDate: nextAdjustmentDate.toISOString().split('T')[0]
        };

        onSave({ ...formData, ...landlordInfo });
    };

    const periodLabels = {
        trimestral: 'Trimestral (cada 3 meses)',
        semestral: 'Semestral (cada 6 meses)',
        anual: 'Anual (cada año)'
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
                    <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Propiedad</h3>
                    <div className="space-y-2">
                        <p className="text-gray-700"><span className="font-medium">Título:</span> {property.title}</p>
                        <p className="text-gray-700"><span className="font-medium">Ubicación:</span> {property.location}</p>
                        <p className="text-gray-700"><span className="font-medium">Renta Mensual:</span> ${property.price.toLocaleString()}</p>
                    </div>

                    {/* Información del Propietario */}
                    {property.landlordName && (
                        <div className="mt-4 pt-4 border-t border-gray-300">
                            <h4 className="text-md font-semibold text-[#0f172a] mb-2">Propietario</h4>
                            <div className="space-y-1">
                                <p className="text-gray-700"><span className="font-medium">Nombre:</span> {property.landlordName}</p>
                                <p className="text-gray-700"><span className="font-medium">Teléfono:</span> <span className="font-mono">{property.landlordPhone}</span></p>
                                <p className="text-gray-700"><span className="font-medium">Email:</span> <span className="font-mono">{property.landlordEmail}</span></p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Búsqueda de Inquilino */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inquilino *</label>
                    <div className="relative">
                        <input
                            type="text"
                            required
                            value={tenantSearch}
                            onChange={(e) => handleTenantSearchChange(e.target.value)}
                            onFocus={() => setShowTenantDropdown(true)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                            placeholder="Buscar inquilino por nombre o email..."
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Dropdown de resultados */}
                    {showTenantDropdown && tenantSearch && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredTenants.length > 0 ? (
                                filteredTenants.map(tenant => (
                                    <button
                                        key={tenant.email}
                                        type="button"
                                        onClick={() => handleTenantSelect(tenant)}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                    >
                                        <div className="font-medium text-gray-900">{tenant.name || tenant.email}</div>
                                        <div className="text-sm text-gray-500">{tenant.email}</div>
                                        {tenant.phone && (
                                            <div className="text-xs text-gray-400">{tenant.phone}</div>
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
                        <p className="text-sm text-amber-600 mt-1">No hay inquilinos disponibles. El administrador debe crear usuarios con rol: Inquilino.</p>
                    )}

                    {selectedTenant && (
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-900">Inquilino seleccionado</p>
                                    <p className="text-xs text-blue-700 mt-1">
                                        <span className="font-medium">Nombre:</span> {selectedTenant.name || selectedTenant.email}
                                    </p>
                                    <p className="text-xs text-blue-700">
                                        <span className="font-medium">Email:</span> {selectedTenant.email}
                                    </p>
                                    {selectedTenant.phone && (
                                        <p className="text-xs text-blue-700">
                                            <span className="font-medium">Teléfono:</span> {selectedTenant.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Fechas del Contrato */}
                <div>
                    <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Fechas del Contrato</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio *</label>
                            <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Vencimiento *</label>
                            <input
                                type="date"
                                required
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Meses de Ajuste de Precio */}
                <div>
                    <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Meses de Ajuste</h3>
                    <div className="mb-4">
                        <select
                            required
                            value={formData.adjustmentPeriod}
                            onChange={(e) => setFormData({ ...formData, adjustmentPeriod: e.target.value as 'trimestral' | 'semestral' | 'anual' })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                        >
                            <option value="trimestral">Trimestral (cada 3 meses)</option>
                            <option value="semestral">Semestral (cada 6 meses)</option>
                            <option value="anual">Anual (cada año)</option>
                        </select>
                    </div>

                    {/* Mostrar meses de ajuste calculados */}
                    {adjustmentMonths.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Meses en que se ajustará el precio:</p>
                            <div className="flex flex-wrap gap-2">
                                {adjustmentMonths.map((date, index) => (
                                    <span key={index} className="px-3 py-1 bg-[#14b8a6] text-white rounded-full text-xs font-medium">
                                        {date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                El ajuste se aplicará {periodLabels[formData.adjustmentPeriod].toLowerCase()}.
                            </p>
                        </div>
                    )}

                    {adjustmentMonths.length === 0 && formData.startDate && formData.endDate && (
                        <p className="text-sm text-gray-500">
                            No hay ajustes programados para el periodo seleccionado.
                        </p>
                    )}
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-[#14b8a6] text-white font-semibold rounded-lg hover:bg-[#0d9488] transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Crear Contrato
                    </button>
                </div>
            </form>
        </Modal>
    );
}
