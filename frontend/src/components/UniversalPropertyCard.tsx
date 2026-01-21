import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/UI/Icon';

// Tipos
export interface UniversalPropertyData {
  id: string | number;
  title: string;
  price: number;
  currency?: 'USD' | 'ARS'; // Moneda del precio (opcional, por defecto USD)
  location: string;
  
  // Opcionales
  image?: string;
  bedrooms?: number;
  rooms?: number; // Ambientes
  bathrooms?: number;
  area?: number;
  type?: 'Venta' | 'Alquiler';
  status?: 'Activa' | 'Pausada';
  description?: string;
  
  // Para rentas
  startDate?: string;
  endDate?: string;
  nextAdjustmentDate?: string;
  landlordName?: string;
  landlordPhone?: string;
  landlordEmail?: string;
  tenantName?: string;
  tenantPhone?: string;
  tenantEmail?: string;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
}

export interface PropertyAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  icon?: React.ReactNode;
  show?: boolean;
}

export interface WarningBadge {
  daysUntilExpiration?: number;
  daysUntilAdjustment?: number;
  showWarning?: boolean;
}

interface UniversalPropertyCardProps {
  property: UniversalPropertyData;
  
  // Comportamiento
  href?: string;  // Si tiene href, es un Link; si no, es card estática
  onClick?: () => void;  // Para cards clickeables sin link
  
  // Badges
  showTypeBadge?: boolean;  // Badge de Venta/Alquiler
  showStatusBadge?: boolean;  // Badge de Activa/Pausada
  warningBadge?: WarningBadge;  // Badge de advertencia (vencimiento/ajuste)
  
  // Acciones (para dashboards)
  actions?: PropertyAction[];
  
  // Configuración visual
  showPropertyDetails?: boolean;  // Mostrar hab, baños, área
  variant?: 'default' | 'compact';  // Variantes de diseño
  
  // Modal de rentas
  viewerRole?: 'tenant' | 'landlord' | 'agent';  // Para modal de detalles de renta
}

export default function UniversalPropertyCard({
  property,
  href,
  onClick,
  showTypeBadge = true,  // Siempre mostrar por defecto
  showStatusBadge = false,
  warningBadge,
  actions = [],
  showPropertyDetails = true,
  variant = 'default',
  viewerRole
}: UniversalPropertyCardProps) {
  const [showModal, setShowModal] = useState(false);
  
  const getActionStyles = (actionVariant: PropertyAction['variant'] = 'primary') => {
    const styles = {
      primary: 'bg-[#0f172a] text-white hover:bg-[#334155]',
      secondary: 'bg-[#14b8a6] text-white hover:bg-[#0d9488]',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      success: 'bg-green-500 text-white hover:bg-green-600',
      warning: 'bg-amber-500 text-white hover:bg-amber-600',
      info: 'bg-blue-500 text-white hover:bg-blue-600'
    };
    return styles[actionVariant];
  };

  const getStatusBadgeStyles = () => {
    if (property.status === 'Activa') {
      return 'bg-green-500 text-white';
    }
    return 'bg-yellow-500 text-white';
  };

  // Renderizar warning badge dinámicamente
  const renderWarningBadge = () => {
    if (!warningBadge?.showWarning || !property.nextAdjustmentDate || !property.endDate) {
      return null;
    }

    const adjustmentDate = new Date(property.nextAdjustmentDate);
    const expirationDate = new Date(property.endDate);
    
    // Determinar cuál evento ocurre primero
    const nextEvent = adjustmentDate < expirationDate ? 'adjustment' : 'expiration';
    const daysUntilEvent = nextEvent === 'adjustment' ? warningBadge.daysUntilAdjustment : warningBadge.daysUntilExpiration;
    
    // Solo mostrar si el evento está dentro de 60 días
    if (daysUntilEvent !== undefined && daysUntilEvent < 60) {
      return (
        <div className="absolute top-4 left-4">
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

  const handleCardClick = () => {
    if (viewerRole) {
      setShowModal(true);
    } else if (onClick) {
      onClick();
    }
  };

  // Contenido de la card
  const CardContent = (
    <>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#14b8a6] transform hover:-translate-y-2 animate-scale-in">
        {/* Image */}
        <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {property.image ? (
            <>
              <Image
                src={property.image}
                alt={property.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </>
          ) : (
            // Icono de casa cuando no hay imagen
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                className="w-32 h-32 text-gray-300" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
          )}
          
          {/* Badges - Top Right */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {/* Type Badge (Venta/Alquiler) */}
            {showTypeBadge && property.type && (
              <span className="bg-[#14b8a6] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
                {property.type}
              </span>
            )}
            
            {/* Status Badge (Activa/Pausada) */}
            {showStatusBadge && property.status && (
              <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm ${getStatusBadgeStyles()}`}>
                {property.status}
              </span>
            )}
          </div>

          {/* Warning Badge - Top Left */}
          {renderWarningBadge()}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-[#0f172a] mb-3 line-clamp-2 group-hover:text-[#0f172a] transition-colors">
            {property.title}
          </h3>

          {/* Price */}
          <p className="text-2xl font-bold text-[#0f172a] mb-4">
            {property.currency || 'USD'} {property.price.toLocaleString('es-AR')}
            {property.type === 'Alquiler' && (
              <span className="text-sm text-gray-500 font-normal ml-1">/mes</span>
            )}
          </p>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-5">
            <Icon name="location" className="w-5 h-5 mr-2 text-[#14b8a6]" />
            <span className="text-sm font-medium">{property.location}</span>
          </div>

          {/* Property Details */}
          {showPropertyDetails && (property.bedrooms !== undefined || property.bathrooms !== undefined || property.area !== undefined) && (
            <div className="flex items-center justify-between text-gray-700 border-t border-gray-100 pt-4 mb-4">
              {/* Bedrooms */}
              {property.bedrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg className="w-4 h-4 text-[#0f172a]" fill="currentColor" viewBox="0 0 640 512">
                      <path d="M32 32c17.7 0 32 14.3 32 32V320H288V160c0-17.7 14.3-32 32-32H544c53 0 96 43 96 96V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V416H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zm144 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">{property.bedrooms}</span>
                </div>
              )}

              {/* Bathrooms */}
              {property.bathrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg className="w-4 h-4 text-[#0f172a]" fill="currentColor" viewBox="0 0 512 512">
                      <path d="M64 131.9C64 112.1 80.1 96 99.9 96c9.5 0 18.6 3.8 25.4 10.5l16.2 16.2c-21 38.9-17.4 87.5 10.9 123L151 247c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0L345 121c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-1.3 1.3c-35.5-28.3-84.2-31.9-123-10.9L170.5 61.3C151.8 42.5 126.4 32 99.9 32C44.7 32 0 76.7 0 131.9V448c0 17.7 14.3 32 32 32s32-14.3 32-32V131.9zM256 352a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-128a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-128a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm32-32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">{property.bathrooms}</span>
                </div>
              )}

              {/* Area */}
              {property.area !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg className="w-4 h-4 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">{property.area} m²</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex gap-2 pt-4 border-t border-gray-200">
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

          {/* View Details Button (for rentals with modal) */}
          {viewerRole && actions.length === 0 && (
            <button
              onClick={handleCardClick}
              className="w-full px-4 py-3 bg-[#14b8a6] text-white font-semibold rounded-lg hover:bg-[#0d9488] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-4"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ver Detalles Completos
            </button>
          )}
        </div>
      </div>

      {/* Modal de Detalles de Renta */}
      {showModal && viewerRole && property.startDate && property.endDate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
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
                  <p className="text-gray-700"><span className="font-medium">Nombre:</span> {property.title}</p>
                  <p className="text-gray-700"><span className="font-medium">Dirección:</span> {property.location}</p>
                  <p className="text-gray-700"><span className="font-medium">Renta Mensual:</span> {property.currency || 'USD'} {property.price.toLocaleString()}</p>
                </div>
              </div>

              {/* Información del Contrato */}
              <div>
                <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Contrato</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-gray-700"><span className="font-medium">Inicio:</span> {new Date(property.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-gray-700"><span className="font-medium">Vencimiento:</span> {new Date(property.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  {property.nextAdjustmentDate && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-700 font-medium whitespace-nowrap">Meses de Ajuste:</span>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          const start = new Date(property.startDate!);
                          const end = new Date(property.endDate!);
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
                  )}
                </div>
              </div>

              {/* Contactos según el rol */}
              {viewerRole === 'agent' ? (
                // Para agentes: mostrar ambos contactos
                <>
                  {/* Contacto del Propietario */}
                  {property.landlordName && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Contacto del Propietario</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="text-gray-700"><span className="font-medium">Nombre:</span> {property.landlordName}</p>
                        <p className="text-gray-700"><span className="font-medium">Teléfono:</span> {property.landlordPhone}</p>
                        <p className="text-gray-700"><span className="font-medium">Email:</span> {property.landlordEmail}</p>
                      </div>
                    </div>
                  )}

                  {/* Contacto del Inquilino */}
                  {property.tenantName && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Contacto del Inquilino</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="text-gray-700"><span className="font-medium">Nombre:</span> {property.tenantName}</p>
                        <p className="text-gray-700"><span className="font-medium">Teléfono:</span> {property.tenantPhone}</p>
                        <p className="text-gray-700"><span className="font-medium">Email:</span> {property.tenantEmail}</p>
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
                      <span className="font-medium">Nombre:</span> {viewerRole === 'tenant' ? property.landlordName : property.tenantName || property.landlordName}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Teléfono:</span> {viewerRole === 'tenant' ? property.landlordPhone : property.tenantPhone || property.landlordPhone}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span> {viewerRole === 'tenant' ? property.landlordEmail : property.tenantEmail || property.landlordEmail}
                    </p>
                  </div>
                </div>
              )}

              {/* Información del Agente - Siempre mostrar si está disponible */}
              {property.agentName && (
                <div>
                  <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Contacto del Agente</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-gray-700"><span className="font-medium">Nombre:</span> {property.agentName}</p>
                    <p className="text-gray-700"><span className="font-medium">Teléfono:</span> {property.agentPhone}</p>
                    <p className="text-gray-700"><span className="font-medium">Email:</span> {property.agentEmail}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Si tiene href, envolver en Link
  if (href) {
    return (
      <Link href={href} className="block group">
        {CardContent}
      </Link>
    );
  }

  // Si tiene onClick (sin viewerRole), envolver en div clickeable
  if (onClick && !viewerRole) {
    return (
      <div onClick={onClick} className="block group cursor-pointer">
        {CardContent}
      </div>
    );
  }

  // Si no, retornar card estática
  return <div className="block group">{CardContent}</div>;
}
