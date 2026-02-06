import React, { useState } from "react";
import Link from "next/link";
import BasePropertyCard from "@/components/BasePropertyCard";

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

  // Modal de rentas
  viewerRole?: "tenant" | "landlord" | "agent";
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
  viewerRole,
}: RentalPropertyCardProps) {
  const [showModal, setShowModal] = useState(false);

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

  const handleCardClick = () => {
    if (viewerRole) {
      setShowModal(true);
    } else if (onClick) {
      onClick();
    }
  };

  // Preparar contenido de acciones (Footer Slot)
  const renderActionsSlot = () => {
    const hasActions = actions.length > 0;
    const hasViewDetailsBtn = viewerRole && actions.length === 0;

    if (!hasActions && !hasViewDetailsBtn) return null;

    return (
      <div
        className={
          hasActions ? "flex gap-2 pt-4 border-t border-gray-200" : "mt-4"
        }
      >
        {hasActions &&
          actions.map((action, index) => {
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

        {hasViewDetailsBtn && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCardClick();
            }}
            className="w-full px-4 py-3 bg-(--accent) text-white font-semibold rounded-lg hover:bg-(--accent-hover) transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Ver Detalles Completos
          </button>
        )}
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
      onClick={!href && !viewerRole && onClick ? onClick : undefined}
      className={!href && !viewerRole && onClick ? "cursor-pointer" : ""}
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

      {/* Modal de Detalles de Renta */}
      {showModal && viewerRole && property.startDate && property.endDate && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div className="flex-1"></div>
              <h2 className="text-2xl font-bold text-(--primary)">
                Detalles de la Renta
              </h2>
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Información de la Propiedad */}
              <div>
                <h3 className="text-lg font-semibold text-(--primary) mb-3">
                  Propiedad
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Nombre:</span>{" "}
                    {property.title}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Dirección:</span>{" "}
                    {property.location}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Renta Mensual Inicial:</span>{" "}
                    {property.currency || "USD"}{" "}
                    {property.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Información del Contrato */}
              <div>
                <h3 className="text-lg font-semibold text-(--primary) mb-3">
                  Contrato
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Inicio:</span>{" "}
                    {new Date(property.startDate).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Vencimiento:</span>{" "}
                    {new Date(property.endDate).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </p>
                  {property.adjustmentFrequency && (
                    <p className="text-gray-700">
                      <span className="font-medium">Frecuencia de Ajuste:</span>{" "}
                      Cada {property.adjustmentFrequency} meses
                    </p>
                  )}
                  {(() => {
                    const adjustmentDates = property.adjustmentScheduledDates || [];

                    if (adjustmentDates.length === 0) {
                      return (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 font-medium whitespace-nowrap">
                            Meses de Ajuste:
                          </span>
                          <span className="text-gray-500 italic">Ninguno</span>
                        </div>
                      );
                    }

                    return (
                      <div className="flex items-start gap-2">
                        <span className="text-gray-700 font-medium whitespace-nowrap">
                          Meses de Ajuste:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {adjustmentDates.map((dateStr, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-(--accent) text-white rounded-full text-xs font-medium"
                            >
                              {new Date(dateStr).toLocaleDateString("es-ES", {
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Contactos según el rol */}
              {viewerRole === "agent" ? (
                // Para agentes: mostrar ambos contactos
                <>
                  {/* Contacto del Propietario */}
                  {property.landlordName && (
                    <div>
                      <h3 className="text-lg font-semibold text-(--primary) mb-3">
                        Contacto del Propietario
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="text-gray-700">
                          <span className="font-medium">Nombre:</span>{" "}
                          {property.landlordName}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Teléfono:</span>{" "}
                          <span className="font-mono">
                            {property.landlordPhone}
                          </span>
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Email:</span>{" "}
                          <span className="font-mono">
                            {property.landlordEmail}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Contacto del Inquilino */}
                  {property.tenantName && (
                    <div>
                      <h3 className="text-lg font-semibold text-(--primary) mb-3">
                        Contacto del Inquilino
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="text-gray-700">
                          <span className="font-medium">Nombre:</span>{" "}
                          {property.tenantName}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Teléfono:</span>{" "}
                          <span className="font-mono">
                            {property.tenantPhone}
                          </span>
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Email:</span>{" "}
                          <span className="font-mono">
                            {property.tenantEmail}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Para inquilinos y propietarios: mostrar solo un contacto
                <div>
                  <h3 className="text-lg font-semibold text-(--primary) mb-3">
                    {viewerRole === "tenant"
                      ? "Contacto del Propietario"
                      : "Contacto del Inquilino"}
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Nombre:</span>{" "}
                      {viewerRole === "tenant"
                        ? property.landlordName
                        : property.tenantName || property.landlordName}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Teléfono:</span>{" "}
                      <span className="font-mono">
                        {viewerRole === "tenant"
                          ? property.landlordPhone
                          : property.tenantPhone || property.landlordPhone}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span>{" "}
                      <span className="font-mono">
                        {viewerRole === "tenant"
                          ? property.landlordEmail
                          : property.tenantEmail || property.landlordEmail}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Información del Agente - Siempre mostrar si está disponible */}
              {property.agentName && (
                <div>
                  <h3 className="text-lg font-semibold text-(--primary) mb-3">
                    Contacto del Agente
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Nombre:</span>{" "}
                      {property.agentName}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Teléfono:</span>{" "}
                      <span className="font-mono">{property.agentPhone}</span>
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span>{" "}
                      <span className="font-mono">{property.agentEmail}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
