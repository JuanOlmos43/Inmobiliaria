import React from "react";
import Image from "next/image";
import Icon from "@/components/UI/Icon";

export interface BasePropertyCardProps {
  // Datos principales
  title: string;
  price: number;
  currency?: string;
  location: string;
  image?: string;

  // Detalles
  type?: string;
  status?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;

  // Configuración de visualización
  showTypeBadge?: boolean;
  showStatusBadge?: boolean;
  showDetails?: boolean;

  // Slots para contenido personalizado
  headerSlot?: React.ReactNode; // Para badges extra como el de advertencia (top-left)
  footerSlot?: React.ReactNode; // Para botones de acción (bottom)

  // Eventos
  onClick?: () => void;
  className?: string;
}

export default function BasePropertyCard({
  title,
  price,
  currency = "USD",
  location,
  image,
  type,
  status,
  bedrooms,
  bathrooms,
  area,
  showTypeBadge = true,
  showStatusBadge = false,
  showDetails = true,
  headerSlot,
  footerSlot,
  onClick,
  className = "",
}: BasePropertyCardProps) {
  const getStatusBadgeStyles = () => {
    if (status === "Activa") {
      return "bg-green-500 text-white";
    }
    return "bg-yellow-500 text-white";
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-(--accent) transform hover:-translate-y-2 animate-scale-in ${className}`}
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-56 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden group">
        {image ? (
          <>
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </>
        ) : (
          // Icono de casa cuando no hay imagen
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon
              name="home"
              className="w-24 h-24 text-(--accent)"
              strokeWidth={1.5}
            />
          </div>
        )}

        {/* Badges - Top Right */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {/* Type Badge (Venta/Alquiler) */}
          {showTypeBadge && type && (
            <span className="bg-(--accent) text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
              {type}
            </span>
          )}

          {/* Status Badge (Activa/Pausada) */}
          {showStatusBadge && status && (
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm ${getStatusBadgeStyles()}`}
            >
              {status}
            </span>
          )}
        </div>

        {/* Header Slot (e.g. Warning Badge) - Top Left */}
        {headerSlot && (
          <div className="absolute top-4 left-4">{headerSlot}</div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-(--primary) mb-3 line-clamp-2 group-hover:text-(--primary) transition-colors">
          {title}
        </h3>

        {/* Price */}
        <p className="text-2xl font-bold text-(--primary) mb-4">
          {currency} {price.toLocaleString("es-AR")}
          {type === "Alquiler" && (
            <span className="text-sm text-gray-500 font-normal ml-1">/mes</span>
          )}
        </p>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-5">
          <Icon name="location" className="w-5 h-5 mr-2 text-(--accent)" />
          <span className="text-sm font-medium">{location}</span>
        </div>

        {/* Property Details */}
        {showDetails &&
          (bedrooms !== undefined ||
            bathrooms !== undefined ||
            area !== undefined) && (
            <div className="flex items-center justify-between text-gray-700 border-t border-gray-100 pt-4 mb-4">
              {/* Bedrooms */}
              {bedrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Icon name="bed" className="w-4 h-4 text-(--primary)" />
                  </div>
                  <span className="text-sm font-semibold">{bedrooms}</span>
                </div>
              )}

              {/* Bathrooms */}
              {bathrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Icon name="bath" className="w-4 h-4 text-(--primary)" />
                  </div>
                  <span className="text-sm font-semibold">{bathrooms}</span>
                </div>
              )}

              {/* Area */}
              {area !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Icon name="area" className="w-4 h-4 text-(--primary)" />
                  </div>
                  <span className="text-sm font-semibold">{area} m²</span>
                </div>
              )}
            </div>
          )}

        {/* Footer Slot (Actions) */}
        {footerSlot && <div className="mt-auto">{footerSlot}</div>}
      </div>
    </div>
  );
}
