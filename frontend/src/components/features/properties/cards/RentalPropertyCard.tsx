import React from "react";
import Link from "next/link";
import { BasePropertyCard } from "@/components/features/properties/cards";

// Tipos
export interface RentalPropertyData {
  id: string | number;
  title: string;
  price: number;
  currency?: "USD" | "ARS";
  location: string;

  // Opcionales
  image?: string;
  bedrooms?: number;
  rooms?: number; // Ambientes
  bathrooms?: number;
  area?: number;
  type?: "Venta" | "Alquiler";
  status?: "Activa" | "Pausada";
  description?: string;

  // Para rentas
  startDate?: string;
  endDate?: string;
  nextAdjustmentDate?: string;
  adjustmentScheduledDates?: string[]; // Fechas pre-calculadas desde backend
  adjustmentFrequency?: number;
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
  variant?: "primary" | "secondary" | "danger" | "success" | "warning" | "info";
  icon?: React.ReactNode;
  show?: boolean;
}

export interface WarningBadge {
  daysUntilExpiration?: number;
  daysUntilAdjustment?: number;
  showWarning?: boolean;
}

interface RentalPropertyCardProps {
  property: RentalPropertyData;

  // Comportamiento
  href?: string; // Si tiene href, es un Link; si no, es card estática
  onClick?: () => void; // Para cards clickeables sin link

  // Badges
  showTypeBadge?: boolean;
  showStatusBadge?: boolean;
  warningBadge?: WarningBadge;

  // Acciones (para dashboards)
  actions?: PropertyAction[];

  // Configuración visual
  showPropertyDetails?: boolean;
}

export default function RentalPropertyCard({
  property,
  href,
  onClick,
  showTypeBadge = true,
  showStatusBadge = false,
  warningBadge,
  actions = [],
  showPropertyDetails = true,
}: RentalPropertyCardProps) {
  const getActionStyles = (
    actionVariant: PropertyAction["variant"] = "primary",
  ) => {
    const styles = {
      primary: "bg-(--primary) text-white hover:bg-(--primary-light)",
      secondary: "bg-(--accent) text-white hover:bg-(--accent-hover)",
      danger: "bg-red-500 text-white hover:bg-red-600",
      success: "bg-green-500 text-white hover:bg-green-600",
      warning: "bg-amber-500 text-white hover:bg-amber-600",
      info: "bg-blue-500 text-white hover:bg-blue-600",
    };
    return styles[actionVariant];
  };

  // Renderizar warning badge dinámicamente
  const renderWarningBadge = () => {
    if (
      !warningBadge?.showWarning ||
      !property.nextAdjustmentDate ||
      !property.endDate
    ) {
      return null;
    }

    const adjustmentDate = new Date(property.nextAdjustmentDate);
    const expirationDate = new Date(property.endDate);

    // Determinar cuál evento ocurre primero
    const nextEvent =
      adjustmentDate < expirationDate ? "adjustment" : "expiration";
    const daysUntilEvent =
      nextEvent === "adjustment"
        ? warningBadge.daysUntilAdjustment
        : warningBadge.daysUntilExpiration;

    // Solo mostrar si el evento está dentro de 60 días
    if (daysUntilEvent !== undefined && daysUntilEvent < 60) {
      return (
        <span
          className={`px-3 py-1 ${nextEvent === "adjustment" ? "bg-amber-500" : "bg-red-500"} text-white rounded-full text-xs font-semibold flex items-center gap-1`}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {nextEvent === "adjustment"
            ? "Próximo mes: Ajuste de precio"
            : "Próximo mes: Vence contrato"}
        </span>
      );
    }
    return null;
  };

  // Preparar contenido de acciones (Footer Slot)
  const renderActionsSlot = () => {
    const hasActions = actions.length > 0;

    if (!hasActions) return null;

    return (
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        {actions.map((action, index) => {
          if (action.show === false) return null;
          return (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                action.onClick();
              }}
              className={`flex-1 px-3 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm font-semibold flex items-center justify-center gap-2 ${getActionStyles(action.variant)}`}
            >
              {action.icon}
              {action.label}
            </button>
          );
        })}
      </div>
    );
  };

  // Renderizar la card base
  const BaseCard = (
    <BasePropertyCard
      title={property.title}
      price={property.price}
      currency={property.currency}
      location={property.location}
      image={property.image}
      type={property.type}
      status={property.status}
      bedrooms={property.bedrooms}
      bathrooms={property.bathrooms}
      area={property.area}
      showTypeBadge={showTypeBadge}
      showStatusBadge={showStatusBadge}
      showDetails={showPropertyDetails}
      headerSlot={renderWarningBadge()}
      footerSlot={renderActionsSlot()}
      onClick={!href && onClick ? onClick : undefined}
      className={!href && onClick ? "cursor-pointer" : ""}
    />
  );

  return (
    <>
      {href ? (
        <Link href={href} className="block group">
          {BaseCard}
        </Link>
      ) : (
        <div className="block group">{BaseCard}</div>
      )}
    </>
  );
}

