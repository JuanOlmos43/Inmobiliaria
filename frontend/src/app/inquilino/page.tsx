'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function TenantDashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [rentals, setRentals] = useState<Rental[]>([]);

  // Verificar autenticación y rol
  useEffect(() => {
    // const isAuth = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    // const role = localStorage.getItem('userRole');
    
    // if (!isAuth || isAuth !== 'true' || role !== 'tenant') {
    //   router.push('/login');
    // } else {
      setUserEmail(email || 'inquilino@demo.com');
    // }
  }, [router]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadRentals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRentals = () => {
    // Datos de ejemplo - en producción vendrían de una API
    const sampleRentals: Rental[] = [
      {
        id: '1',
        propertyName: 'Departamento Céntrico',
        address: 'Av. Principal 1234, Piso 5, Depto A',
        monthlyRent: 85000,
        bedrooms: 2,
        bathrooms: 1,
        area: 65,
        startDate: '2024-01-15',
        endDate: '2026-01-15',
        nextAdjustmentDate: '2026-01-15',
        adjustmentPercentage: 15,
        landlordName: 'María González',
        landlordPhone: '+54 11 4567-8901',
        landlordEmail: 'maria.gonzalez@email.com',
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
        endDate: '2025-12-31',
        nextAdjustmentDate: '2025-06-01',
        adjustmentPercentage: 12,
        landlordName: 'Juan Pérez',
        landlordPhone: '+54 11 5678-9012',
        landlordEmail: 'juan.perez@email.com',
        agentName: 'Ana Martínez',
        agentPhone: '+54 11 3456-7890',
        agentEmail: 'ana.martinez@inmobiliaria.com',
        status: 'expiring'
      }
    ];
    setRentals(sampleRentals);
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

  // Estadísticas
  const stats = {
    totalRentals: rentals.length,
    activeRentals: rentals.filter(r => r.status === 'active').length,
    totalMonthlyRent: rentals.reduce((sum, r) => sum + r.monthlyRent, 0),
    expiringRentals: rentals.filter(r => r.status === 'expiring').length
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <DashboardHeader
        title="Inquilino"
        userEmail={userEmail}
        icon="key"
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Rentals List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Mis Rentas</h2>
          {rentals.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes rentas activas</h3>
              <p className="text-gray-500">Comienza buscando tu próximo hogar</p>
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
      </main>
    </div>
  );
}

// Stats Card Component
function StatsCard({ 
  title, 
  value,  
  color,
  icon
}: { 
  title: string; 
  value: string | number; 
  color: string;
  icon: string;
}) {
  const icons = {
    home: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    check: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    dollar: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    alert: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )
  };

  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-start justify-end mb-3">
        <div className="opacity-80">
          {icons[icon as keyof typeof icons]}
        </div>
      </div>
      <p className="text-sm opacity-90 mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
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
      viewerRole="tenant"
      showPropertyDetails={true}
      warningBadge={{
        daysUntilExpiration,
        daysUntilAdjustment,
        showWarning: true
      }}
    />
  );
}
