import React, { useState } from 'react';

// Tipos
export interface RentalData {
  id: string;
  propertyName: string;
  address: string;
  monthlyRent: number;
  startDate?: string;
  endDate?: string;
  nextAdjustmentDate?: string;
  adjustmentPercentage?: number;
  landlordName?: string;
  landlordPhone?: string;
  landlordEmail?: string;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  status?: 'active' | 'expiring' | 'expired';
  tenantName?: string;
  tenantPhone?: string;
  tenantEmail?: string;
}

export interface RentalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  icon?: React.ReactNode;
  show?: boolean;
}

interface RentalCardProps {
  rental: RentalData;
  // Opciones de visualización
  showExpirationWarning?: boolean;
  daysUntilExpiration?: number;
  daysUntilAdjustment?: number;
  // Rol del usuario que visualiza (para mostrar contacto correcto en modal)
  viewerRole?: 'tenant' | 'landlord' | 'agent';
  // Acciones personalizables (opcional, si no se usa el modal integrado)
  actions?: RentalAction[];
  // Callback personalizado (opcional, si no se usa el modal integrado)
  onViewDetails?: () => void;
}

export default function RentalCard({
  rental,
  showExpirationWarning = true,
  daysUntilExpiration,
  daysUntilAdjustment,
  viewerRole,
  actions = [],
  onViewDetails
}: RentalCardProps) {
  const [showModal, setShowModal] = useState(false);
  
  const getActionStyles = (actionVariant: RentalAction['variant'] = 'primary') => {
    const styles = {
      primary: 'bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white hover:from-[#0d9488] hover:to-[#0f766e]',
      secondary: 'bg-[#0f172a] text-white hover:bg-[#334155]',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      success: 'bg-green-500 text-white hover:bg-green-600',
      warning: 'bg-amber-500 text-white hover:bg-amber-600',
      info: 'bg-blue-500 text-white hover:bg-blue-600'
    };
    return styles[actionVariant];
  };

  // Determinar si mostrar advertencia de vencimiento o ajuste
  const renderWarningBadge = () => {
    if (!showExpirationWarning || !rental.nextAdjustmentDate || !rental.endDate) {
      return null;
    }

    const adjustmentDate = new Date(rental.nextAdjustmentDate);
    const expirationDate = new Date(rental.endDate);
    
    // Determinar cuál evento ocurre primero
    const nextEvent = adjustmentDate < expirationDate ? 'adjustment' : 'expiration';
    const daysUntilEvent = nextEvent === 'adjustment' ? daysUntilAdjustment : daysUntilExpiration;
    
    // Solo mostrar si el evento está dentro de 60 días
    if (daysUntilEvent !== undefined && daysUntilEvent < 60) {
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
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      // Si hay callback personalizado, usarlo
      onViewDetails();
    } else if (viewerRole) {
      // Si hay viewerRole, usar modal integrado
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Image Header */}
        <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
          <svg 
            className="absolute inset-0 m-auto w-24 h-24 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
            />
          </svg>

          {/* Expiration/Adjustment Warning */}
          {renderWarningBadge()}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="text-lg font-bold text-[#0f172a] mb-2 line-clamp-1">
            {rental.propertyName}
          </h3>

          {/* Address */}
          <div className="flex items-center text-gray-600 mb-4">
            <svg 
              className="w-5 h-5 mr-2 text-[#14b8a6]" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" 
                clipRule="evenodd" 
              />
            </svg>
            <span className="text-sm font-medium">{rental.address}</span>
          </div>

          {/* Price */}
          <p className="text-2xl font-bold text-[#0f172a] mb-4">
            ${rental.monthlyRent.toLocaleString()}
            <span className="text-sm text-gray-500 font-normal">/mes</span>
          </p>

          {/* Actions */}
          {(actions.length > 0 || onViewDetails || viewerRole) && (
            <div className="flex gap-2">
              {/* Default "Ver Detalles" button */}
              {(onViewDetails || viewerRole) && actions.length === 0 && (
                <button
                  onClick={handleViewDetails}
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-semibold rounded-lg hover:from-[#0d9488] hover:to-[#0f766e] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ver Detalles Completos
                </button>
              )}

              {/* Custom actions */}
              {actions.map((action, index) => {
                if (action.show === false) return null;
                
                return (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`flex-1 px-3 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm font-semibold flex items-center justify-center gap-2 ${getActionStyles(action.variant)}`}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles - Integrado */}
      {showModal && viewerRole && rental.startDate && rental.endDate && (
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

              {/* Contacto del Propietario o Inquilino según el rol */}
              {viewerRole === 'agent' ? (
                // Para agentes: mostrar ambos contactos
                <>
                  {/* Contacto del Propietario */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Contacto del Propietario</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Nombre:</span> {rental.landlordName}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Teléfono:</span> {rental.landlordPhone}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Email:</span> {rental.landlordEmail}
                      </p>
                    </div>
                  </div>

                  {/* Contacto del Inquilino */}
                  {rental.tenantName && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Contacto del Inquilino</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="text-gray-700">
                          <span className="font-medium">Nombre:</span> {rental.tenantName}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Teléfono:</span> {rental.tenantPhone}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Email:</span> {rental.tenantEmail}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Para inquilinos y propietarios: mostrar solo un contacto
                <div>
                  <h3 className="text-lg font-semibold text-[#0f172a] mb-3">
                    {viewerRole === 'tenant' ? 'Contacto del Propietario' : 'Contacto del Inquilino'}
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Nombre:</span> {viewerRole === 'tenant' ? rental.landlordName : rental.tenantName || rental.landlordName}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Teléfono:</span> {viewerRole === 'tenant' ? rental.landlordPhone : rental.tenantPhone || rental.landlordPhone}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span> {viewerRole === 'tenant' ? rental.landlordEmail : rental.tenantEmail || rental.landlordEmail}
                    </p>
                  </div>
                </div>
              )}

              {/* Información del Agente - Siempre mostrar si está disponible */}
              {rental.agentName && (
                <div>
                  <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Contacto del Agente</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-gray-700"><span className="font-medium">Nombre:</span> {rental.agentName}</p>
                    <p className="text-gray-700"><span className="font-medium">Teléfono:</span> {rental.agentPhone}</p>
                    <p className="text-gray-700"><span className="font-medium">Email:</span> {rental.agentEmail}</p>
                  </div>
                </div>
              )}
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
    </>
  );
}
