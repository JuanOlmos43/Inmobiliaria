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
            <svg
              className="w-32 h-32 text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
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
                    <svg
                      className="w-4 h-4 text-(--primary)"
                      fill="currentColor"
                      viewBox="0 0 640 512"
                    >
                      <path d="M32 32c17.7 0 32 14.3 32 32V320H288V160c0-17.7 14.3-32 32-32H544c53 0 96 43 96 96V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V416H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zm144 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">{bedrooms}</span>
                </div>
              )}

              {/* Bathrooms */}
              {bathrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg
                      className="w-4 h-4 text-(--primary)"
                      fill="currentColor"
                      viewBox="0 0 512 512"
                    >
                      <path d="M64 131.9C64 112.1 80.1 96 99.9 96c9.5 0 18.6 3.8 25.4 10.5l16.2 16.2c-21 38.9-17.4 87.5 10.9 123L151 247c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0L345 121c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-1.3 1.3c-35.5-28.3-84.2-31.9-123-10.9L170.5 61.3C151.8 42.5 126.4 32 99.9 32C44.7 32 0 76.7 0 131.9V448c0 17.7 14.3 32 32 32s32-14.3 32-32V131.9zM256 352a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-128a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-128a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm32-32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">{bathrooms}</span>
                </div>
              )}

              {/* Area */}
              {area !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg
                      className="w-4 h-4 text-(--primary)"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
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
