'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';

// Components
import StatsCard from '@/components/UI/StatsCard';
import AgentPropertyCard from '@/components/dashboard/agent/AgentPropertyCard';
import PropertyModal from '@/components/dashboard/agent/PropertyModal';
import RentalModal from '@/components/dashboard/agent/RentalModal';
import UpcomingExpirations from '@/components/dashboard/agent/UpcomingExpirations';

// Tipos
interface Property {
  id: string;
  title: string;
  type: 'Venta' | 'Alquiler';
  price: number;
  currency: 'USD' | 'ARS';
  location: string;
  bedrooms: number;
  rooms: number; // Ambientes
  bathrooms: number;
  area: number;
  image?: string;
  images?: string[]; // Array de imágenes de la propiedad
  status: 'Activa' | 'Pausada';
  description: string;
  propertyType: string;
  yearBuilt?: number | null;
  features?: string[];
  landlordName?: string;
  landlordPhone?: string;
  landlordEmail?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [rentingProperty, setRentingProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Activa' | 'Pausada'>('all');
  const [activeTab, setActiveTab] = useState<'vencimientos' | 'propiedades'>('vencimientos');

  // Cargar propiedades desde la API
  useEffect(() => {
    // TODO: Implementar carga de propiedades desde la API real
    // Por ahora, el estado se inicializa vacío
  }, []);

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
                className={`pb-4 px-2 font-semibold transition-colors relative ${activeTab === 'vencimientos'
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
                className={`pb-4 px-2 font-semibold transition-colors relative ${activeTab === 'propiedades'
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
                      onChange={(e) => setFilterStatus(e.target.value as 'all' | 'Activa' | 'Pausada')}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="Activa">Activas</option>
                      <option value="Pausada">Pausadas</option>
                    </select>

                    <button
                      onClick={handleAddProperty}
                      className="px-6 py-3 bg-[#14b8a6] text-white font-semibold rounded-lg hover:bg-[#0d9488] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
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
                    className="px-6 py-3 bg-[#14b8a6] text-white font-semibold rounded-lg hover:bg-[#0d9488] transition-all duration-300 flex items-center gap-2 mx-auto"
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
                    <AgentPropertyCard
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
            // Mock Save to localStorage (to be replaced by API)
            const existingRentals = JSON.parse(localStorage.getItem('rentalContracts') || '[]');
            const newRental = {
              id: Date.now().toString(),
              propertyId: rentingProperty.id,
              propertyName: rentingProperty.title,
              address: rentingProperty.location,
              monthlyRent: rentingProperty.price,
              ...rentalData,
              agentName: user?.name || user?.email || 'Agente',
              agentPhone: user?.phone || '+54 11 2345-6789',
              agentEmail: user?.email || 'agente@inmobiliaria.com'
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
