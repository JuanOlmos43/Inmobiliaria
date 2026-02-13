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
  statusBadge?: {
    text: string;
    variant: "default" | "success" | "warning" | "danger";
  };
}

export default function RentalPropertyCard({
  property,
  href,
  onClick,
  showTypeBadge = true,
  showStatusBadge = false,
  warningBadge,
  statusBadge,
  actions = [],
  showPropertyDetails = true,
}: RentalPropertyCardProps) {
  const getActionStyles = (
    actionVariant: PropertyAction["variant"] = "primary"
  ) => {
    const styles = {
      primary: "bg-(--primary) text-white hover:bg-(--primary-light)",
      secondary: "bg-(--accent) text-white hover:bg-(--accent-hover)",
      danger: "bg-(--danger) text-white hover:bg-red-600",
      success: "bg-(--success) text-white hover:bg-green-600",
      warning: "bg-(--warning) text-white hover:bg-amber-600",
      info: "bg-blue-500 text-white hover:bg-blue-600",
    };
    return styles[actionVariant];
  };

  // Renderizar warning badge dinámicamente
  const renderWarningBadge = () => {
    // 1. Intentar mostrar Warning Badge (si corresponde)
    if (
      warningBadge?.showWarning &&
      property.nextAdjustmentDate &&
      property.endDate
    ) {
      const adjustmentDate = new Date(property.nextAdjustmentDate);
      const expirationDate = new Date(property.endDate);

      // Determinar cuál evento ocurre primero
      const nextEvent =
        adjustmentDate < expirationDate ? "adjustment" : "expiration";
      const daysUntilEvent =
        nextEvent === "adjustment"
          ? warningBadge.daysUntilAdjustment
          : warningBadge.daysUntilExpiration;

      // Validar si el evento es en el mes actual o el próximo
      const dateToCheck =
        nextEvent === "adjustment" ? adjustmentDate : expirationDate;
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const eventMonth = dateToCheck.getMonth();
      const eventYear = dateToCheck.getFullYear();

      // Diferencia en meses (contemplando cambio de año)
      const monthDiff =
        (eventYear - currentYear) * 12 + (eventMonth - currentMonth);

      // Solo mostrar si es el mes actual (0) o el próximo (1) y no es pasado
      if (
        daysUntilEvent !== undefined &&
        daysUntilEvent >= 0 &&
        monthDiff >= 0 &&
        monthDiff <= 1
      ) {
        const monthValid = new Date(dateToCheck);
        const monthName = new Intl.DateTimeFormat("es-ES", {
          month: "long",
        }).format(monthValid);
        const capitalizedMonth =
          monthName.charAt(0).toUpperCase() + monthName.slice(1);

        let alertText = "";
        // Si es el mes actual
        if (monthDiff === 0) {
          alertText =
            nextEvent === "adjustment" ? "Ajuste este mes" : "Vence este mes";

          // Si faltan pocos días, ser más específico
          if (daysUntilEvent <= 30) {
            alertText =
              nextEvent === "adjustment"
                ? `Ajuste en ${daysUntilEvent} días`
                : `Vence en ${daysUntilEvent} días`;
          }
        }
        // Si es el próximo mes
        else {
          alertText =
            nextEvent === "adjustment"
              ? `Ajuste en ${capitalizedMonth}`
              : `Vence en ${capitalizedMonth}`;
        }

        return (
          <span
            className={`px-3 py-1 ${nextEvent === "adjustment" ? "bg-(--warning)" : "bg-(--danger)"} flex items-center gap-1 rounded-full text-xs font-semibold text-white`}
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {alertText}
          </span>
        );
      }
    }

    // 2. Si no se mostró Warning, verificar si hay statusBadge explícito
    if (statusBadge) {
      const badgeColors = {
        default: "bg-gray-500",
        success: "bg-(--success)",
        warning: "bg-(--warning)",
        danger: "bg-(--danger)",
      };

      return (
        <span
          className={`px-3 py-1 ${badgeColors[statusBadge.variant]} flex items-center gap-1 rounded-full text-xs font-semibold text-white`}
        >
          {statusBadge.text}
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
      <div className="flex gap-2 border-t border-gray-200 pt-4">
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
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold shadow-md transition-all duration-300 hover:shadow-lg ${getActionStyles(action.variant)}`}
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
        <Link href={href} className="group block">
          {BaseCard}
        </Link>
      ) : (
        <div className="group block">{BaseCard}</div>
      )}
    </>
  );
}
