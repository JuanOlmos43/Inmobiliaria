import React from 'react';

// Tipos
export interface DashboardPropertyData {
  id: string;
  title: string;
  type?: 'Venta' | 'Alquiler';
  price: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  image?: string;
  status?: 'Activa' | 'Pausada';
  description?: string;
}

export interface PropertyAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  icon?: React.ReactNode;
  show?: boolean;
}

interface DashboardPropertyCardProps {
  property: DashboardPropertyData;
  // Badges opcionales
  showStatusBadge?: boolean;
  showTypeBadge?: boolean;
  // Detalles opcionales
  showPropertyDetails?: boolean; // habitaciones, baños, área
  // Acciones personalizables
  actions?: PropertyAction[];
}

export default function DashboardPropertyCard({
  property,
  showStatusBadge = false,
  showTypeBadge = false,
  showPropertyDetails = true,
  actions = [],
}: DashboardPropertyCardProps) {
  
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

  return (
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

        {/* Badges */}
        {(showStatusBadge || showTypeBadge) && (
          <div className="absolute top-3 right-3 flex gap-2">
            {showStatusBadge && property.status && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeStyles()}`}>
                {property.status}
              </span>
            )}
            {showTypeBadge && property.type && (
              <span className="px-3 py-1 bg-[#0f172a] text-white rounded-full text-xs font-semibold">
                {property.type}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-[#0f172a] mb-2 line-clamp-1">
          {property.title}
        </h3>

        {/* Price */}
        <p className="text-2xl font-bold text-[#0f172a] mb-3">
          ${property.price.toLocaleString()}
          {property.type === 'Alquiler' && (
            <span className="text-sm text-gray-500 font-normal">/mes</span>
          )}
        </p>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
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
          <span className="text-sm font-medium">{property.location}</span>
        </div>

        {/* Property Details (bedrooms, bathrooms, area) */}
        {showPropertyDetails && (property.bedrooms !== undefined || property.bathrooms !== undefined || property.area !== undefined) && (
          <div className="flex gap-4 text-sm text-gray-600 mb-4">
            {property.bedrooms !== undefined && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-[#0f172a]" fill="currentColor" viewBox="0 0 640 512">
                  <path d="M32 32c17.7 0 32 14.3 32 32V320H288V160c0-17.7 14.3-32 32-32H544c53 0 96 43 96 96V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V416H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zm144 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"/>
                </svg>
                {property.bedrooms} hab
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-[#0f172a]" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M64 131.9C64 112.1 80.1 96 99.9 96c9.5 0 18.6 3.8 25.4 10.5l16.2 16.2c-21 38.9-17.4 87.5 10.9 123L151 247c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0L345 121c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-1.3 1.3c-35.5-28.3-84.2-31.9-123-10.9L170.5 61.3C151.8 42.5 126.4 32 99.9 32C44.7 32 0 76.7 0 131.9V448c0 17.7 14.3 32 32 32s32-14.3 32-32V131.9zM256 352a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-128a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-128a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm32-32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
                </svg>
                {property.bathrooms} baños
              </div>
            )}
            {property.area !== undefined && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                {property.area}m²
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            {actions.map((action, index) => {
              // Si show está definido y es false, no mostrar el botón
              if (action.show === false) return null;
              
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`flex-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-1 ${getActionStyles(action.variant)}`}
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
  );
}
