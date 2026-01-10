'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/Icon';

// Tipos
interface Rental {
  id: string;
  propertyName: string;
  address: string;
  monthlyRent: number;
  startDate: string;
  endDate: string;
  nextAdjustmentDate: string;
  adjustmentPercentage: number;
  landlordName: string;
  landlordPhone: string;
  landlordEmail: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  status: 'active' | 'expiring' | 'expired';
}

interface Property {
  id: string;
  title: string;
  type: 'Venta' | 'Alquiler';
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  status: 'Activa' | 'Pausada';
  description: string;
}

export default function LandlordDashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'rentals' | 'properties'>('rentals');

  // Verificar autenticación y rol
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    
    if (!isAuth || isAuth !== 'true' || role !== 'landlord') {
      router.push('/login');
    } else {
      setUserEmail(email || '');
      loadRentals();
      loadProperties();
    }
  }, [router]);

  const loadRentals = () => {
    // Datos de ejemplo - rentas donde el propietario es inquilino
    const sampleRentals: Rental[] = [
      {
        id: '1',
        propertyName: 'Oficina Comercial Centro',
        address: 'Av. Comercio 890, Piso 3',
        monthlyRent: 150000,
        startDate: '2024-03-01',
        endDate: '2026-03-01',
        nextAdjustmentDate: '2025-03-01',
        adjustmentPercentage: 18,
        landlordName: 'Roberto Sánchez',
        landlordPhone: '+54 11 6789-0123',
        landlordEmail: 'roberto.sanchez@email.com',
        agentName: 'Laura Fernández',
        agentPhone: '+54 11 4567-8901',
        agentEmail: 'laura.fernandez@inmobiliaria.com',
        status: 'active'
      }
    ];
    setRentals(sampleRentals);
  };

  const loadProperties = () => {
    // Datos de ejemplo - propiedades que el propietario tiene publicadas
    const sampleProperties: Property[] = [
      {
        id: '1',
        title: 'Casa Familiar en Suburbios',
        type: 'Venta',
        price: 320000,
        location: 'Barrio Residencial, Zona Oeste',
        bedrooms: 4,
        bathrooms: 3,
        area: 220,
        image: '/placeholder-house.jpg',
        status: 'Activa',
        description: 'Hermosa casa familiar con jardín amplio'
      },
      {
        id: '2',
        title: 'Departamento 2 Ambientes',
        type: 'Alquiler',
        price: 95000,
        location: 'Centro, Ciudad',
        bedrooms: 1,
        bathrooms: 1,
        area: 55,
        image: '/placeholder-apartment.jpg',
        status: 'Activa',
        description: 'Departamento moderno ideal para pareja'
      },
      {
        id: '3',
        title: 'Local Comercial Esquina',
        type: 'Alquiler',
        price: 180000,
        location: 'Zona Comercial Norte',
        bedrooms: 0,
        bathrooms: 2,
        area: 120,
        image: '/placeholder-commercial.jpg',
        status: 'Activa',
        description: 'Local comercial en ubicación estratégica'
      }
    ];
    setProperties(sampleProperties);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  const handleViewRentalDetails = (rental: Rental) => {
    setSelectedRental(rental);
    setShowRentalModal(true);
  };

  const getDaysUntilExpiration = (endDate: string) => {
    const today = new Date();
    const expiration = new Date(endDate);
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysUntilAdjustment = (adjustmentDate: string) => {
    const today = new Date();
    const adjustment = new Date(adjustmentDate);
    const diffTime = adjustment.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Icon name="home" className="w-8 h-8 text-[#14b8a6]" />
              <div>
                <h1 className="text-2xl font-bold text-[#14b8a6]">Propietario</h1>
                <p className="text-sm text-gray-300">Bienvenido, {userEmail}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Icon name="logout" className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('rentals')}
                className={`${
                  activeTab === 'rentals'
                    ? 'border-[#14b8a6] text-[#14b8a6]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-5 px-2 border-b-2 font-semibold text-xl transition-colors`}
              >
                Mis Rentas
              </button>
              <button
                onClick={() => setActiveTab('properties')}
                className={`${
                  activeTab === 'properties'
                    ? 'border-[#14b8a6] text-[#14b8a6]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-5 px-2 border-b-2 font-semibold text-xl transition-colors`}
              >
                Mis Propiedades Publicadas
              </button>
            </nav>
          </div>
        </div>

        {/* Rentals Tab */}
        {activeTab === 'rentals' && (
          <div className="mb-8">
            {rentals.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes rentas activas</h3>
                <p className="text-gray-500">No estás alquilando ninguna propiedad actualmente</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentals.map(rental => (
                  <RentalCard
                    key={rental.id}
                    rental={rental}
                    onViewDetails={handleViewRentalDetails}
                    daysUntilExpiration={getDaysUntilExpiration(rental.endDate)}
                    daysUntilAdjustment={getDaysUntilAdjustment(rental.nextAdjustmentDate)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="mb-8">
            {properties.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes propiedades publicadas</h3>
                <p className="text-gray-500">Comienza publicando tu primera propiedad</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de Detalles de Renta */}
      {showRentalModal && selectedRental && (
        <RentalModal
          rental={selectedRental}
          onClose={() => setShowRentalModal(false)}
          getDaysUntilExpiration={getDaysUntilExpiration}
        />
      )}
    </div>
  );
}

// Rental Card Component (igual que en inquilino)
function RentalCard({ 
  rental, 
  onViewDetails,
  daysUntilExpiration,
  daysUntilAdjustment
}: { 
  rental: Rental; 
  onViewDetails: (rental: Rental) => void;
  daysUntilExpiration: number;
  daysUntilAdjustment: number;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image Header */}
      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
        <svg className="absolute inset-0 m-auto w-24 h-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>

        {/* Expiration Warning */}
        {(() => {
          const adjustmentDate = new Date(rental.nextAdjustmentDate);
          const expirationDate = new Date(rental.endDate);
          
          const nextEvent = adjustmentDate < expirationDate ? 'adjustment' : 'expiration';
          const daysUntilEvent = nextEvent === 'adjustment' ? daysUntilAdjustment : daysUntilExpiration;
          
          if (daysUntilEvent < 60) {
            return (
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 ${nextEvent === 'adjustment' ? 'bg-amber-500' : 'bg-red-500'} text-white rounded-full text-xs font-semibold flex items-center gap-1`}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {nextEvent === 'adjustment' 
                    ? 'Próximo mes: Ajuste' 
                    : 'Próximo mes: Vence contrato'
                  }
                </span>
              </div>
            );
          }
          return null;
        })()}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-[#0f172a] mb-2 line-clamp-1">{rental.propertyName}</h3>
        <div className="flex items-center text-gray-600 mb-4">
          <svg className="w-5 h-5 mr-2 text-[#14b8a6]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{rental.address}</span>
        </div>

        <p className="text-2xl font-bold text-[#0f172a] mb-4">
          ${rental.monthlyRent.toLocaleString()}
          <span className="text-sm text-gray-500 font-normal">/mes</span>
        </p>

        <button
          onClick={() => onViewDetails(rental)}
          className="w-full px-4 py-3 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-semibold rounded-lg hover:from-[#0d9488] hover:to-[#0f766e] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Ver Detalles Completos
        </button>
      </div>
    </div>
  );
}

// Property Card Component
function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image Header */}
      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
        <svg className="absolute inset-0 m-auto w-24 h-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        
        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-[#0f172a] text-white rounded-full text-xs font-semibold">
            {property.type}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            property.status === 'Activa' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
          }`}>
            {property.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-[#0f172a] mb-2 line-clamp-1">{property.title}</h3>
        <div className="flex items-center text-gray-600 mb-4">
          <svg className="w-5 h-5 mr-2 text-[#14b8a6]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{property.location}</span>
        </div>

        <p className="text-2xl font-bold text-[#0f172a] mb-4">
          ${property.price.toLocaleString()}
          {property.type === 'Alquiler' && <span className="text-sm text-gray-500 font-normal">/mes</span>}
        </p>

        {/* Property Details */}
        <div className="flex gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-[#0f172a]" fill="currentColor" viewBox="0 0 640 512">
              <path d="M32 32c17.7 0 32 14.3 32 32V320H288V160c0-17.7 14.3-32 32-32H544c53 0 96 43 96 96V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V416H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zm144 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"/>
            </svg>
            {property.bedrooms} hab
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-[#0f172a]" fill="currentColor" viewBox="0 0 512 512">
              <path d="M64 131.9C64 112.1 80.1 96 99.9 96c9.5 0 18.6 3.8 25.4 10.5l16.2 16.2c-21 38.9-17.4 87.5 10.9 123L151 247c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0L345 121c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-1.3 1.3c-35.5-28.3-84.2-31.9-123-10.9L170.5 61.3C151.8 42.5 126.4 32 99.9 32C44.7 32 0 76.7 0 131.9V448c0 17.7 14.3 32 32 32s32-14.3 32-32V131.9zM256 352a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-128a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-128a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm32-32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
            </svg>
            {property.bathrooms} baños
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {property.area}m²
          </div>
        </div>
      </div>
    </div>
  );
}

// Rental Modal Component (igual que en inquilino)
function RentalModal({ 
  rental, 
  onClose,
  getDaysUntilExpiration
}: { 
  rental: Rental; 
  onClose: () => void;
  getDaysUntilExpiration: (endDate: string) => number;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex-1"></div>
          <h2 className="text-2xl font-bold text-[#0f172a]">Detalles de la Renta</h2>
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

        <div className="p-6 space-y-6">
          {/* Información de la Propiedad */}
          <div>
            <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Propiedad</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-gray-700"><span className="font-medium">Nombre:</span> {rental.propertyName}</p>
              <p className="text-gray-700"><span className="font-medium">Dirección:</span> {rental.address}</p>
              <p className="text-gray-700"><span className="font-medium">Renta Mensual:</span> ${rental.monthlyRent.toLocaleString()}</p>
            </div>
          </div>

          {/* Información del Contrato */}
          <div>
            <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Contrato</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-gray-700"><span className="font-medium">Inicio:</span> {new Date(rental.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="text-gray-700"><span className="font-medium">Vencimiento:</span> {new Date(rental.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <div className="flex items-start gap-2">
                <span className="text-gray-700 font-medium whitespace-nowrap">Meses de Ajuste:</span>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const start = new Date(rental.startDate);
                    const end = new Date(rental.endDate);
                    const adjustmentMonths = [];
                    let current = new Date(start);
                    current.setFullYear(current.getFullYear() + 1);
                    
                    while (current <= end) {
                      adjustmentMonths.push(new Date(current));
                      current.setFullYear(current.getFullYear() + 1);
                    }
                    
                    return adjustmentMonths.map((date, index) => (
                      <span key={index} className="px-3 py-1 bg-[#14b8a6] text-white rounded-full text-xs font-medium">
                        {date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                      </span>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Información del Propietario */}
          <div>
            <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Contacto del Propietario</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-gray-700"><span className="font-medium">Nombre:</span> {rental.landlordName}</p>
              <p className="text-gray-700"><span className="font-medium">Teléfono:</span> {rental.landlordPhone}</p>
              <p className="text-gray-700"><span className="font-medium">Email:</span> {rental.landlordEmail}</p>
            </div>
          </div>

          {/* Información del Agente */}
          <div>
            <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Contacto del Agente</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-gray-700"><span className="font-medium">Nombre:</span> {rental.agentName}</p>
              <p className="text-gray-700"><span className="font-medium">Teléfono:</span> {rental.agentPhone}</p>
              <p className="text-gray-700"><span className="font-medium">Email:</span> {rental.agentEmail}</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-semibold rounded-lg hover:from-[#0d9488] hover:to-[#0f766e] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
