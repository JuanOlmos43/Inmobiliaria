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

export default function TenantDashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Verificar autenticación y rol
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    
    if (!isAuth || isAuth !== 'true' || role !== 'tenant') {
      router.push('/login');
    } else {
      setUserEmail(email || '');
      loadRentals();
    }
  }, [router]);

  const loadRentals = () => {
    // Datos de ejemplo - en producción vendrían de una API
    const sampleRentals: Rental[] = [
      {
        id: '1',
        propertyName: 'Departamento Céntrico',
        address: 'Av. Principal 1234, Piso 5, Depto A',
        monthlyRent: 85000,
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

  const handleViewDetails = (rental: Rental) => {
    setSelectedRental(rental);
    setShowModal(true);
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
      <header className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Icon name="key" className="w-8 h-8 text-[#14b8a6]" />
              <div>
                <h1 className="text-2xl font-bold text-[#14b8a6]">Inquilino</h1>
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
                <RentalCard
                  key={rental.id}
                  rental={rental}
                  onViewDetails={handleViewDetails}
                  daysUntilExpiration={getDaysUntilExpiration(rental.endDate)}
                  daysUntilAdjustment={getDaysUntilAdjustment(rental.nextAdjustmentDate)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Detalles */}
      {showModal && selectedRental && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div className="flex-1"></div>
              <h2 className="text-2xl font-bold text-[#0f172a]">Detalles de la Renta</h2>
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
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
                  <p className="text-gray-700"><span className="font-medium">Nombre:</span> {selectedRental.propertyName}</p>
                  <p className="text-gray-700"><span className="font-medium">Dirección:</span> {selectedRental.address}</p>
                  <p className="text-gray-700"><span className="font-medium">Renta Mensual:</span> ${selectedRental.monthlyRent.toLocaleString()}</p>
                </div>
              </div>

              {/* Información del Contrato */}
              <div>
                <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Contrato</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-gray-700"><span className="font-medium">Inicio:</span> {new Date(selectedRental.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-gray-700"><span className="font-medium">Vencimiento:</span> {new Date(selectedRental.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-700 font-medium whitespace-nowrap">Meses de Ajuste:</span>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const start = new Date(selectedRental.startDate);
                        const end = new Date(selectedRental.endDate);
                        const adjustmentMonths = [];
                        let current = new Date(start);
                        current.setFullYear(current.getFullYear() + 1); // Primer ajuste al año
                        
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
                  <p className="text-gray-700"><span className="font-medium">Nombre:</span> {selectedRental.landlordName}</p>
                  <p className="text-gray-700"><span className="font-medium">Teléfono:</span> {selectedRental.landlordPhone}</p>
                  <p className="text-gray-700"><span className="font-medium">Email:</span> {selectedRental.landlordEmail}</p>
                </div>
              </div>

              {/* Información del Agente */}
              <div>
                <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Contacto del Agente</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-gray-700"><span className="font-medium">Nombre:</span> {selectedRental.agentName}</p>
                  <p className="text-gray-700"><span className="font-medium">Teléfono:</span> {selectedRental.agentPhone}</p>
                  <p className="text-gray-700"><span className="font-medium">Email:</span> {selectedRental.agentEmail}</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-semibold rounded-lg hover:from-[#0d9488] hover:to-[#0f766e] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Cerrar
              </button>
            </div>
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

// Rental Card Component
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
          const today = new Date();
          
          // Determinar cuál evento ocurre primero
          const nextEvent = adjustmentDate < expirationDate ? 'adjustment' : 'expiration';
          const daysUntilEvent = nextEvent === 'adjustment' ? daysUntilAdjustment : daysUntilExpiration;
          
          // Solo mostrar si el evento está dentro de 60 días
          if (daysUntilEvent < 60) {
            return (
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 ${nextEvent === 'adjustment' ? 'bg-amber-500' : 'bg-red-500'} text-white rounded-full text-xs font-semibold flex items-center gap-1`}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {nextEvent === 'adjustment' 
                    ? 'Próximo mes: Ajuste de precio' 
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
        {/* Title and Address */}
        <h3 className="text-lg font-bold text-[#0f172a] mb-2 line-clamp-1">{rental.propertyName}</h3>
        <div className="flex items-center text-gray-600 mb-4">
          <svg className="w-5 h-5 mr-2 text-[#14b8a6]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{rental.address}</span>
        </div>

        {/* Price */}
        <p className="text-2xl font-bold text-[#0f172a] mb-4">
          ${rental.monthlyRent.toLocaleString()}
          <span className="text-sm text-gray-500 font-normal">/mes</span>
        </p>

        {/* Action Button */}
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
