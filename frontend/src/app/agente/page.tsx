'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/Icon';
import DashboardHeader from '@/components/DashboardHeader';
import UniversalPropertyCard from '@/components/UniversalPropertyCard';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';

// Tipos
interface Property {
  id: string;
  title: string;
  type: 'Venta' | 'Alquiler';
  price: number;
  currency: 'USD' | 'ARS'; // Moneda del precio
  location: string;
  bedrooms: number;
  rooms: number; // Ambientes
  bathrooms: number;
  area: number;
  image?: string;
  status: 'Activa' | 'Pausada';
  description: string;
  propertyType: string; // casa, departamento, terreno, duplex, monoambiente
  yearBuilt?: number | null;
  features?: string[];
  landlordName?: string;
  landlordPhone?: string;
  landlordEmail?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [rentingProperty, setRentingProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Activa' | 'Pausada'>('all');
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'vencimientos' | 'propiedades'>('vencimientos');

  // Verificar autenticación
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    
    if (!isAuth || isAuth !== 'true') {
      router.push('/login');
    } else {
      setUserEmail(email || '');
      // Cargar propiedades de ejemplo
      loadSampleProperties();
    }
  }, [router]);

  const loadSampleProperties = () => {
    const sampleProperties: Property[] = [
      {
        id: '1',
        title: 'Casa Moderna en Zona Norte',
        type: 'Venta',
        price: 250000,
        currency: 'USD',
        location: 'Zona Norte, Ciudad',
        bedrooms: 3,
        rooms: 5,
        bathrooms: 2,
        area: 180,

        status: 'Activa',
        description: 'Hermosa casa moderna con acabados de lujo',
        propertyType: 'casa',
        yearBuilt: 2020,
        features: ['Cochera', 'Patio', 'Cocina integrada', 'Calefacción central'],
        landlordName: 'Carlos Rodríguez',
        landlordPhone: '+54 11 2345-6789',
        landlordEmail: 'carlos.rodriguez@email.com'
      },
      {
        id: '2',
        title: 'Departamento Céntrico',
        type: 'Alquiler',
        price: 800000,
        currency: 'ARS',
        location: 'Centro, Ciudad',
        bedrooms: 2,
        rooms: 3,
        bathrooms: 1,
        area: 85,
        status: 'Activa',
        description: 'Departamento amoblado en zona céntrica',
        propertyType: 'departamento',
        yearBuilt: 2015,
        features: ['Balcón', 'Cocina equipada', 'Calefacción', 'Portero eléctrico'],
        landlordName: 'María González',
        landlordPhone: '+54 11 3456-7890',
        landlordEmail: 'maria.gonzalez@email.com'
      }
    ];
    setProperties(sampleProperties);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  const handleAddProperty = () => {
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleDeleteProperty = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setProperties(properties.map(p => 
      p.id === id 
        ? { ...p, status: p.status === 'Activa' ? 'Pausada' : 'Activa' } 
        : p
    ));
  };

  const handleRentProperty = (property: Property) => {
    setRentingProperty(property);
    setIsRentalModalOpen(true);
  };

  const handleSaveProperty = (property: Omit<Property, 'id'>) => {
    // Asignar moneda automáticamente según el tipo
    const propertyWithCurrency: Property = {
      ...property,
      id: editingProperty?.id || Date.now().toString(),
      currency: property.type === 'Alquiler' ? 'ARS' : 'USD'
    };

    if (editingProperty) {
      // Editar propiedad existente
      setProperties(properties.map(p => 
        p.id === editingProperty.id ? propertyWithCurrency : p
      ));
    } else {
      // Agregar nueva propiedad
      setProperties([...properties, propertyWithCurrency]);
    }
    setIsModalOpen(false);
  };

  // Filtrar propiedades
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <DashboardHeader
        title="Agente"
        userEmail={userEmail}
        icon="briefcase"
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Resumen de Propiedades</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <StatsCard
              title="Total Propiedades"
              value={properties.length}
              color="from-[#0f172a] to-[#334155]"
              icon="building"
            />
            <StatsCard
              title="En Venta"
              value={properties.filter(p => p.type === 'Venta').length}
              color="from-[#334155] to-[#0f172a]"
              icon="tag"
            />
            <StatsCard
              title="En Alquiler"
              value={properties.filter(p => p.type === 'Alquiler').length}
              color="from-[#475569] to-[#334155]"
              icon="key"
            />
            <StatsCard
              title="Activas"
              value={properties.filter(p => p.status === 'Activa').length}
              color="from-[#14b8a6] to-[#0d9488]"
              icon="check"
            />
            <StatsCard
              title="Pausadas"
              value={properties.filter(p => p.status === 'Pausada').length}
              color="from-amber-500 to-amber-600"
              icon="pause"
            />
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('vencimientos')}
                className={`pb-4 px-2 font-semibold transition-colors relative ${
                  activeTab === 'vencimientos'
                    ? 'text-[#14b8a6]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Próximos Vencimientos
                {activeTab === 'vencimientos' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14b8a6]"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('propiedades')}
                className={`pb-4 px-2 font-semibold transition-colors relative ${
                  activeTab === 'propiedades'
                    ? 'text-[#14b8a6]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Gestión de Propiedades
                {activeTab === 'propiedades' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14b8a6]"></div>
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'vencimientos' ? (
            <UpcomingExpirations />
          ) : (
            <>
              {/* Toolbar */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex-1 w-full md:w-auto">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar propiedades..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                      />
                      <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 w-full md:w-auto">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="Activa">Activas</option>
                      <option value="Pausada">Pausadas</option>
                    </select>
                    
                    <button
                      onClick={handleAddProperty}
                      className="px-6 py-3 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-semibold rounded-lg hover:from-[#0d9488] hover:to-[#0f766e] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Nueva Propiedad
                    </button>
                  </div>
                </div>
              </div>

              {/* Properties Grid */}
              {filteredProperties.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay propiedades</h3>
                  <p className="text-gray-500 mb-6">Comienza agregando tu primera propiedad</p>
                  <button
                    onClick={handleAddProperty}
                    className="px-6 py-3 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-semibold rounded-lg hover:from-[#0d9488] hover:to-[#0f766e] transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Agregar Propiedad
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map(property => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onEdit={handleEditProperty}
                      onDelete={handleDeleteProperty}
                      onToggleStatus={handleToggleStatus}
                      onRent={handleRentProperty}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <PropertyModal
          property={editingProperty}
          onSave={handleSaveProperty}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Rental Modal */}
      {isRentalModalOpen && rentingProperty && (
        <RentalModal
          property={rentingProperty}
          onClose={() => setIsRentalModalOpen(false)}
          onSave={(rentalData) => {
            // Pausar la propiedad
            handleToggleStatus(rentingProperty.id);
            // Guardar el contrato en localStorage
            const existingRentals = JSON.parse(localStorage.getItem('rentalContracts') || '[]');
            const newRental = {
              id: Date.now().toString(),
              propertyId: rentingProperty.id,
              propertyName: rentingProperty.title,
              address: rentingProperty.location,
              monthlyRent: rentingProperty.price,
              ...rentalData,
              agentName: userEmail,
              agentPhone: '+54 11 2345-6789',
              agentEmail: userEmail
            };
            localStorage.setItem('rentalContracts', JSON.stringify([...existingRentals, newRental]));
            setIsRentalModalOpen(false);
            alert('Contrato de alquiler creado exitosamente');
          }}
        />
      )}
    </div>
  );
}

// Upcoming Expirations Component
function UpcomingExpirations() {
  const [expiringContracts, setExpiringContracts] = useState<any[]>([]);
  const [adjustmentContracts, setAdjustmentContracts] = useState<any[]>([]);

  useEffect(() => {
    // Cargar contratos de alquiler del localStorage o usar datos de ejemplo
    const storedContracts = localStorage.getItem('rentalContracts');
    let contracts = [];
    
    if (storedContracts) {
      contracts = JSON.parse(storedContracts);
    } else {
      // Datos de ejemplo si no hay contratos en localStorage
      const today = new Date();
      const sampleContracts = [
        {
          id: '1',
          propertyName: 'Departamento Céntrico',
          address: 'Av. Principal 1234, Piso 5, Depto A',
          monthlyRent: 85000,
          bedrooms: 2,
          bathrooms: 1,
          area: 65,
          startDate: '2024-01-15',
          endDate: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Vence en 25 días
          nextAdjustmentDate: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          adjustmentPercentage: 15,
          landlordName: 'María González',
          landlordPhone: '+54 11 4567-8901',
          landlordEmail: 'maria.gonzalez@email.com',
          tenantName: 'Juan Pérez',
          tenantPhone: '+54 11 9876-5432',
          tenantEmail: 'juan.perez@email.com',
          agentName: 'Carlos Rodríguez',
          agentPhone: '+54 11 2345-6789',
          agentEmail: 'carlos.rodriguez@inmobiliaria.com',
          status: 'active'
        },
        {
          id: '2',
          propertyName: 'Casa en Barrio Residencial',
          address: 'Calle Los Aromos 567',
          monthlyRent: 120000,
          bedrooms: 3,
          bathrooms: 2,
          area: 180,
          startDate: '2023-06-01',
          endDate: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Vence en 45 días
          nextAdjustmentDate: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Ajuste en 15 días
          adjustmentPercentage: 12,
          landlordName: 'Roberto Sánchez',
          landlordPhone: '+54 11 5678-9012',
          landlordEmail: 'roberto.sanchez@email.com',
          tenantName: 'Ana Martínez',
          tenantPhone: '+54 11 3456-7890',
          tenantEmail: 'ana.martinez@email.com',
          agentName: 'Carlos Rodríguez',
          agentPhone: '+54 11 2345-6789',
          agentEmail: 'carlos.rodriguez@inmobiliaria.com',
          status: 'active'
        },
        {
          id: '3',
          propertyName: 'Oficina Comercial Centro',
          address: 'Av. Comercio 890, Piso 3',
          monthlyRent: 150000,
          bedrooms: 0,
          bathrooms: 2,
          area: 120,
          startDate: '2024-03-01',
          endDate: new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          nextAdjustmentDate: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Ajuste en 20 días
          adjustmentPercentage: 18,
          landlordName: 'Laura Fernández',
          landlordPhone: '+54 11 6789-0123',
          landlordEmail: 'laura.fernandez@email.com',
          tenantName: 'Empresa Tech SRL',
          tenantPhone: '+54 11 4567-8901',
          tenantEmail: 'contacto@empresatech.com',
          agentName: 'Carlos Rodríguez',
          agentPhone: '+54 11 2345-6789',
          agentEmail: 'carlos.rodriguez@inmobiliaria.com',
          status: 'active'
        }
      ];
      contracts = sampleContracts;
    }

    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // Filtrar contratos que vencen en los próximos 30 días
    const expiring = contracts.filter((contract: any) => {
      const endDate = new Date(contract.endDate);
      return endDate >= today && endDate <= thirtyDaysFromNow && contract.status === 'active';
    });

    // Filtrar contratos que requieren ajuste de precio en los próximos 30 días
    const adjustments = contracts.filter((contract: any) => {
      if (!contract.nextAdjustmentDate || contract.status !== 'active') return false;
      const adjustmentDate = new Date(contract.nextAdjustmentDate);
      return adjustmentDate >= today && adjustmentDate <= thirtyDaysFromNow;
    });

    setExpiringContracts(expiring);
    setAdjustmentContracts(adjustments);
  }, []);

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (expiringContracts.length === 0 && adjustmentContracts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <Icon name="check" className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay vencimientos próximos</h3>
        <p className="text-gray-500">No hay contratos que venzan o requieran ajuste en los próximos 30 días</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Contratos que vencen */}
      {expiringContracts.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-[#0f172a] mb-4 flex items-center gap-2">
            <Icon name="calendar" className="w-5 h-5 text-red-500" />
            Contratos por Vencer ({expiringContracts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expiringContracts.map((contract) => (
              <UniversalPropertyCard
                key={contract.id}
                property={{
                  id: contract.id,
                  title: contract.propertyName,
                  price: contract.monthlyRent,
                  location: contract.address,
                  type: 'Alquiler',
                  bedrooms: contract.bedrooms,
                  bathrooms: contract.bathrooms,
                  area: contract.area,
                  startDate: contract.startDate,
                  endDate: contract.endDate,
                  nextAdjustmentDate: contract.nextAdjustmentDate,
                  landlordName: contract.landlordName,
                  landlordPhone: contract.landlordPhone,
                  landlordEmail: contract.landlordEmail,
                  tenantName: contract.tenantName,
                  tenantPhone: contract.tenantPhone,
                  tenantEmail: contract.tenantEmail,
                  agentName: contract.agentName,
                  agentPhone: contract.agentPhone,
                  agentEmail: contract.agentEmail
                }}
                viewerRole="agent"
                showPropertyDetails={true}
                warningBadge={{
                  daysUntilExpiration: getDaysUntil(contract.endDate),
                  daysUntilAdjustment: getDaysUntil(contract.nextAdjustmentDate),
                  showWarning: true
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ajustes de precio próximos */}
      {adjustmentContracts.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-[#0f172a] mb-4 flex items-center gap-2">
            <Icon name="trending-up" className="w-5 h-5 text-amber-500" />
            Ajustes de Precio Próximos ({adjustmentContracts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adjustmentContracts.map((contract) => (
              <UniversalPropertyCard
                key={contract.id}
                property={{
                  id: contract.id,
                  title: contract.propertyName,
                  price: contract.monthlyRent,
                  location: contract.address,
                  type: 'Alquiler',
                  bedrooms: contract.bedrooms,
                  bathrooms: contract.bathrooms,
                  area: contract.area,
                  startDate: contract.startDate,
                  endDate: contract.endDate,
                  nextAdjustmentDate: contract.nextAdjustmentDate,
                  landlordName: contract.landlordName,
                  landlordPhone: contract.landlordPhone,
                  landlordEmail: contract.landlordEmail,
                  tenantName: contract.tenantName,
                  tenantPhone: contract.tenantPhone,
                  tenantEmail: contract.tenantEmail,
                  agentName: contract.agentName,
                  agentPhone: contract.agentPhone,
                  agentEmail: contract.agentEmail
                }}
                viewerRole="agent"
                showPropertyDetails={true}
                warningBadge={{
                  daysUntilExpiration: getDaysUntil(contract.endDate),
                  daysUntilAdjustment: getDaysUntil(contract.nextAdjustmentDate),
                  showWarning: true
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Stats Card Component
function StatsCard({ 
  title, 
  value,  
  color, 
  trend, 
  trendUp,
  icon
}: { 
  title: string; 
  value: string | number; 
  color: string;
  trend?: string;
  trendUp?: boolean;
  icon: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300`}>
      <div className={`flex items-start ${trend ? 'justify-between' : 'justify-end'} mb-3`}>
        {trend && (
          <div className={`text-xs px-2 py-1 rounded-full ${trendUp ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
            {trend}
          </div>
        )}
        <div className="opacity-80">
          <Icon name={icon as any} className="w-8 h-8" />
        </div>
      </div>
      <p className="text-sm opacity-90 mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

// Property Card Component - Using shared component
function PropertyCard({ 
  property, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onRent
}: { 
  property: Property; 
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onRent?: (property: Property) => void;
}) {
  return (
    <UniversalPropertyCard
      property={property}
      showStatusBadge={true}
      showTypeBadge={true}
      showPropertyDetails={true}
      actions={[
        {
          label: 'Editar',
          onClick: () => onEdit(property),
          variant: 'primary',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          )
        },
        {
          label: 'Alquilar',
          onClick: () => onRent && onRent(property),
          variant: 'info',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          show: property.type === 'Alquiler' && property.status === 'Activa' && !!onRent
        },
        {
          label: property.status === 'Activa' ? 'Pausar' : 'Activar',
          onClick: () => onToggleStatus(property.id),
          variant: property.status === 'Activa' ? 'secondary' : 'warning'
        },
        {
          label: '',
          onClick: () => onDelete(property.id),
          variant: 'danger',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )
        }
      ]}
    />
  );
}

// Property Modal Component
function PropertyModal({ 
  property, 
  onSave, 
  onClose 
}: { 
  property: Property | null;
  onSave: (property: Omit<Property, 'id'>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Omit<Property, 'id'>>({
    title: property?.title || '',
    type: property?.type || 'Venta',
    price: property?.price || 0,
    currency: property?.currency || 'USD',
    location: property?.location || '',
    bedrooms: property?.bedrooms || 1,
    rooms: property?.rooms || 1,
    bathrooms: property?.bathrooms || 1,
    area: property?.area || 0,
    image: property?.image || undefined,
    status: property?.status || 'Activa',
    description: property?.description || '',
    propertyType: property?.propertyType || 'casa',
    yearBuilt: property?.yearBuilt || null,
    features: property?.features || [],
    landlordName: property?.landlordName || '',
    landlordPhone: property?.landlordPhone || '',
    landlordEmail: property?.landlordEmail || ''
  });

  const [landlords, setLandlords] = useState<any[]>([]);
  const [landlordSearch, setLandlordSearch] = useState('');
  const [showLandlordDropdown, setShowLandlordDropdown] = useState(false);
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    // Cargar propietarios del localStorage (creados por el admin)
    const storedUsers = localStorage.getItem('systemUsers');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const landlordUsers = users.filter((u: any) => u.role === 'landlord' && u.status === 'active');
      setLandlords(landlordUsers);
    }
  }, []);

  // Inicializar el campo de búsqueda con el nombre del propietario si existe
  useEffect(() => {
    if (property?.landlordName) {
      setLandlordSearch(property.landlordName);
    }
  }, [property]);

  const handleLandlordSelect = (landlord: any) => {
    setFormData({
      ...formData,
      landlordEmail: landlord.email,
      landlordName: landlord.name || landlord.email,
      landlordPhone: landlord.phone || 'No especificado'
    });
    setLandlordSearch(landlord.name || landlord.email);
    setShowLandlordDropdown(false);
  };

  const handleLandlordSearchChange = (value: string) => {
    setLandlordSearch(value);
    setShowLandlordDropdown(true);
    // Si se borra el campo, limpiar la selección
    if (!value) {
      setFormData({
        ...formData,
        landlordEmail: '',
        landlordName: '',
        landlordPhone: ''
      });
    }
  };

  const filteredLandlords = landlords.filter(landlord => {
    const searchLower = landlordSearch.toLowerCase();
    const name = (landlord.name || '').toLowerCase();
    const email = landlord.email.toLowerCase();
    return name.includes(searchLower) || email.includes(searchLower);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#0f172a]">
            {property ? 'Editar Propiedad' : 'Nueva Propiedad'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormInput
            label="Título"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ej: Casa Moderna en Zona Norte"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Tipo"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Venta' | 'Alquiler' })}
            >
              <option value="Venta">Venta</option>
              <option value="Alquiler">Alquiler</option>
            </FormSelect>

            <FormSelect
              label="Estado"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Activa' | 'Pausada' })}
            >
              <option value="Activa">Activa</option>
              <option value="Pausada">Pausada</option>
            </FormSelect>
          </div>

          <FormInput
            label={`Precio ${formData.type === 'Alquiler' ? '(mensual)' : ''} - ${formData.type === 'Alquiler' ? 'ARS' : 'USD'}`}
            type="number"
            required
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            placeholder="Ingrese el precio"
          />

          <FormInput
            label="Ubicación"
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Ej: Zona Norte, Ciudad"
          />

          {/* Búsqueda de Propietario con Autocompletado */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Propietario *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={landlordSearch}
                onChange={(e) => handleLandlordSearchChange(e.target.value)}
                onFocus={() => setShowLandlordDropdown(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                placeholder="Buscar propietario por nombre o email..."
              />
              <svg className="w-5 h-5 text-gray-400 absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Dropdown de resultados */}
            {showLandlordDropdown && landlordSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredLandlords.length > 0 ? (
                  filteredLandlords.map(landlord => (
                    <button
                      key={landlord.email}
                      type="button"
                      onClick={() => handleLandlordSelect(landlord)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{landlord.name || landlord.email}</div>
                      <div className="text-sm text-gray-500">{landlord.email}</div>
                      {landlord.phone && (
                        <div className="text-xs text-gray-400">{landlord.phone}</div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No se encontraron propietarios
                  </div>
                )}
              </div>
            )}
            
            {landlords.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">No hay propietarios disponibles. El administrador debe crear usuarios con rol "Propietario".</p>
            )}
            
            {formData.landlordEmail && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">Propietario seleccionado</p>
                    <p className="text-xs text-green-700 mt-1">
                      <span className="font-medium">Nombre:</span> {formData.landlordName}
                    </p>
                    <p className="text-xs text-green-700">
                      <span className="font-medium">Email:</span> {formData.landlordEmail}
                    </p>
                    <p className="text-xs text-green-700">
                      <span className="font-medium">Teléfono:</span> {formData.landlordPhone}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Dormitorios"
              type="number"
              required
              min="0"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
              placeholder="Ej: 3"
            />

            <FormInput
              label="Ambientes"
              type="number"
              required
              min="0"
              value={formData.rooms}
              onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) })}
              placeholder="Ej: 4"
            />

            <FormInput
              label="Baños"
              type="number"
              required
              min="1"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
              placeholder="Ej: 2"
            />

            <FormInput
              label="Área (m²)"
              type="number"
              required
              min="1"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
              placeholder="Ej: 120"
            />
          </div>

          {/* Tipo de Propiedad y Año */}
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Tipo de Propiedad *"
              required
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
            >
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
              <option value="duplex">Duplex</option>
              <option value="monoambiente">Monoambiente</option>
            </FormSelect>

            <FormInput
              label="Año de Construcción"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.yearBuilt || ''}
              onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value ? Number(e.target.value) : null })}
              placeholder="Ej: 2020"
            />
          </div>

          {/* Características */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Características</label>
            <div className="space-y-2">
              {/* Input para agregar características */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (featureInput.trim()) {
                        setFormData({ ...formData, features: [...(formData.features || []), featureInput.trim()] });
                        setFeatureInput('');
                      }
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                  placeholder="Ej: Cochera, Patio, Piscina..."
                />
                <button
                  type="button"
                  onClick={() => {
                    if (featureInput.trim()) {
                      setFormData({ ...formData, features: [...(formData.features || []), featureInput.trim()] });
                      setFeatureInput('');
                    }
                  }}
                  className="px-4 py-2 bg-[#14b8a6] text-white rounded-lg hover:bg-[#0d9488] transition-colors"
                >
                  Agregar
                </button>
              </div>

              {/* Lista de características */}
              {formData.features && formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                    >
                      <span className="text-sm text-gray-700">{feature}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newFeatures = formData.features?.filter((_, i) => i !== index);
                          setFormData({ ...formData, features: newFeatures });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              placeholder="Describe las características principales de la propiedad..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-semibold rounded-lg hover:from-[#0d9488] hover:to-[#0f766e] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {property ? 'Guardar Cambios' : 'Crear Propiedad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Rental Modal Component
interface RentalData {
  tenantEmail: string;
  startDate: string;
  endDate: string;
  adjustmentPeriod: 'trimestral' | 'semestral' | 'anual';
  adjustmentPercentage: number;
  status: 'active' | 'expiring' | 'expired';
}

function RentalModal({
  property,
  onClose,
  onSave
}: {
  property: Property;
  onClose: () => void;
  onSave: (data: RentalData & { landlordName: string; landlordPhone: string; landlordEmail: string; nextAdjustmentDate: string }) => void;
}) {
  const [formData, setFormData] = useState<RentalData>({
    tenantEmail: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    adjustmentPeriod: 'anual',
    adjustmentPercentage: 0,
    status: 'active'
  });

  const [tenants, setTenants] = useState<any[]>([]);
  const [tenantSearch, setTenantSearch] = useState('');
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);

  useEffect(() => {
    // Cargar inquilinos del localStorage (creados por el admin)
    const storedUsers = localStorage.getItem('systemUsers');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const tenantUsers = users.filter((u: any) => u.role === 'tenant' && u.status === 'active');
      setTenants(tenantUsers);
    }
  }, []);

  const handleTenantSelect = (tenant: any) => {
    setSelectedTenant(tenant);
    setFormData({ ...formData, tenantEmail: tenant.email });
    setTenantSearch(tenant.name || tenant.email);
    setShowTenantDropdown(false);
  };

  const handleTenantSearchChange = (value: string) => {
    setTenantSearch(value);
    setShowTenantDropdown(true);
    // Si se borra el campo, limpiar la selección
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

  // Calcular meses de ajuste automáticamente según el periodo
  const calculateAdjustmentMonths = () => {
    if (!formData.startDate || !formData.endDate) return [];
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const adjustmentMonths = [];
    let current = new Date(start);
    
    // Determinar el incremento según el periodo
    const incrementMonths = formData.adjustmentPeriod === 'trimestral' ? 3 
                          : formData.adjustmentPeriod === 'semestral' ? 6 
                          : 12; // anual
    
    // Primer ajuste
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
    
    // Calcular la fecha del próximo ajuste según el periodo
    const nextAdjustmentDate = new Date(formData.startDate);
    const incrementMonths = formData.adjustmentPeriod === 'trimestral' ? 3 
                          : formData.adjustmentPeriod === 'semestral' ? 6 
                          : 12;
    nextAdjustmentDate.setMonth(nextAdjustmentDate.getMonth() + incrementMonths);
    
    // Información del propietario (de la propiedad)
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex-1"></div>
          <h2 className="text-2xl font-bold text-[#0f172a]">Crear Contrato de Alquiler</h2>
          <div className="flex-1 flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                  <p className="text-gray-700"><span className="font-medium">Teléfono:</span> {property.landlordPhone}</p>
                  <p className="text-gray-700"><span className="font-medium">Email:</span> {property.landlordEmail}</p>
                </div>
              </div>
            )}
          </div>

          {/* Búsqueda de Inquilino con Autocompletado */}
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
              <p className="text-sm text-amber-600 mt-1">No hay inquilinos disponibles. El administrador debe crear usuarios con rol "Inquilino".</p>
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-semibold rounded-lg hover:from-[#0d9488] hover:to-[#0f766e] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Crear Contrato
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
