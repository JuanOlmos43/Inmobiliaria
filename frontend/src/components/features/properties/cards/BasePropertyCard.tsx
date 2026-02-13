import React from "react";
import Image from "next/image";
import { Icon } from "@/components/ui";

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
  currency,
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
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "activa":
      case "activo":
      case "active":
        return "bg-(--success) text-white";
      case "vencido":
      case "vencida":
      case "expired":
        return "bg-(--warning) text-white";
      case "terminado":
      case "terminada":
      case "terminated":
      case "revocado":
        return "bg-(--danger) text-white";
      case "archivada":
      case "archivado":
        return "bg-gray-500 text-white";
      case "alquilada":
      case "alquilado":
      case "rented":
        return "bg-blue-500 text-white";
      case "pausada":
      case "pausado":
      case "paused":
        return "bg-(--warning) text-white";
      default:
        return "bg-(--warning) text-white";
    }
  };

  const getStatusText = () => {
    if (!status) return "";
    const normalizedStatus = status.toLowerCase();
    const statusMap: Record<string, string> = {
      activa: "Activa",
      activo: "Activo",
      active: "Activo",
      vencido: "Vencido",
      vencida: "Vencida",
      expired: "Vencido",
      terminado: "Terminado",
      terminada: "Terminada",
      terminated: "Terminado",
      revocado: "Revocado",
      archivada: "Archivada",
      archivado: "Archivado",
      alquilada: "Alquilada",
      alquilado: "Alquilado",
      rented: "Alquilado",
      pausada: "Pausada",
      pausado: "Pausado",
      paused: "Pausado",
    };
    return (
      statusMap[normalizedStatus] ||
      status.charAt(0).toUpperCase() + status.slice(1)
    );
  };

  const getTypeBadgeStyles = () => {
    if (type === "Venta") {
      return "bg-(--primary) text-white";
    }
    return "bg-(--accent) text-white";
  };

  return (
    <div
      className={`group animate-scale-in transform overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-(--accent) hover:shadow-2xl ${className}`}
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
        {image ? (
          <>
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          </>
        ) : (
          // Icono de casa cuando no hay imagen
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon
              name="home"
              className="h-24 w-24 text-(--accent)"
              strokeWidth={1.5}
            />
          </div>
        )}

        {/* Overlay Content Container */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-4">
          {/* Left Side (Header Slot) */}
          <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
            {headerSlot}
          </div>

          {/* Right Side (Badges) */}
          <div className="flex shrink-0 flex-col items-end gap-2">
            {showTypeBadge && type && (
              <span
                className={`rounded-full px-4 py-2 text-sm font-bold shadow-sm backdrop-blur-sm ${getTypeBadgeStyles()}`}
              >
                {type}
              </span>
            )}
            {showStatusBadge && status && (
              <span
                className={`rounded-full px-4 py-2 text-sm font-bold shadow-sm backdrop-blur-sm ${getStatusBadgeStyles()}`}
              >
                {getStatusText()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="mb-3 line-clamp-3 text-xl font-bold text-(--primary) transition-colors group-hover:text-(--primary)">
          {title}
        </h3>

        {/* Price */}
        <p className="mb-4 text-2xl font-bold text-(--primary)">
          {currency === "USD" ? "USD" : "$"} {price.toLocaleString("es-AR")}
          {type === "Alquiler" && (
            <span className="ml-1 text-sm font-normal text-gray-500">/mes</span>
          )}
        </p>

        {/* Location */}
        <div className="mb-5 flex items-center text-gray-600">
          <Icon name="location" className="mr-2 h-5 w-5 text-(--accent)" />
          <span className="text-sm font-medium">{location}</span>
        </div>

        {/* Property Details */}
        {showDetails &&
          (bedrooms !== undefined ||
            bathrooms !== undefined ||
            area !== undefined) && (
            <div className="mb-4 flex items-center justify-between border-t border-gray-100 pt-4 text-gray-700">
              {/* Bedrooms */}
              {bedrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200">
                    <Icon name="bed" className="h-4 w-4 text-(--primary)" />
                  </div>
                  <span className="text-sm font-semibold">{bedrooms}</span>
                </div>
              )}

              {/* Bathrooms */}
              {bathrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200">
                    <Icon name="bath" className="h-4 w-4 text-(--primary)" />
                  </div>
                  <span className="text-sm font-semibold">{bathrooms}</span>
                </div>
              )}

              {/* Area */}
              {area !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200">
                    <Icon name="area" className="h-4 w-4 text-(--primary)" />
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
