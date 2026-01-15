'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/Icon';
import DashboardHeader from '@/components/DashboardHeader';

import UniversalPropertyCard from '@/components/UniversalPropertyCard';

// Tipos
interface Rental {
  id: string;
  propertyName: string;
  address: string;
  monthlyRent: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
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
  image?: string;
  status: 'Activa' | 'Pausada';
  description: string;
}

export default function LandlordDashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
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
        bedrooms: 0,
        bathrooms: 2,
        area: 120,
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
      <DashboardHeader
        title="Propietario"
        userEmail={userEmail}
        icon="home"
        onLogout={handleLogout}
      />

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
                  <RentalCardWrapper
                    key={rental.id}
                    rental={rental}
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
                  <PropertyCardWrapper
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Rental Card Component - Using UniversalPropertyCard with integrated modal
function RentalCardWrapper({ 
  rental, 
  daysUntilExpiration,
  daysUntilAdjustment
}: { 
  rental: Rental; 
  daysUntilExpiration: number;
  daysUntilAdjustment: number;
}) {
  return (
    <UniversalPropertyCard
      property={{
        id: rental.id,
        title: rental.propertyName,
        price: rental.monthlyRent,
        location: rental.address,
        type: 'Alquiler',
        bedrooms: rental.bedrooms,
        bathrooms: rental.bathrooms,
        area: rental.area,
        startDate: rental.startDate,
        endDate: rental.endDate,
        nextAdjustmentDate: rental.nextAdjustmentDate,
        landlordName: rental.landlordName,
        landlordPhone: rental.landlordPhone,
        landlordEmail: rental.landlordEmail,
        agentName: rental.agentName,
        agentPhone: rental.agentPhone,
        agentEmail: rental.agentEmail
      }}
      viewerRole="landlord"
      showPropertyDetails={true}
      warningBadge={{
        daysUntilExpiration,
        daysUntilAdjustment,
        showWarning: true
      }}
    />
  );
}

// Property Card Component - Using shared component
function PropertyCardWrapper({ property }: { property: Property }) {
  return (
    <UniversalPropertyCard
      property={property}
      showStatusBadge={true}
      showTypeBadge={true}
      showPropertyDetails={true}
    />
  );
}

