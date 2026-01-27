import BasePropertyCard from "@/components/BasePropertyCard";

import { Property } from "@/types/property";

interface AgentPropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onRent?: (property: Property) => void;
}

export default function AgentPropertyCard({
  property,
  onEdit,
  onDelete,
  onToggleStatus,
  onRent,
}: AgentPropertyCardProps) {
  // Definir acciones
  const actions = [
    {
      label: "Editar",
      onClick: () => onEdit(property),
      variant: "primary" as const,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      show: true,
    },
    {
      label: "Alquilar",
      onClick: () => onRent && onRent(property),
      variant: "info" as const,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      show:
        property.type === "Alquiler" &&
        property.status === "activa" &&
        !!onRent,
    },
    {
      label: property.status === "activa" ? "Pausar" : "Activar",
      onClick: () => onToggleStatus(property.id!),
      variant: (property.status === "activa" ? "secondary" : "warning") as
        | "secondary"
        | "warning",
      show: true,
    },
    {
      label: "",
      onClick: () => onDelete(property.id!),
      variant: "danger" as const,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      show: true,
    },
  ];

  const getActionStyles = (variant: string) => {
    const styles: Record<string, string> = {
      primary: "bg-(--primary) text-white hover:bg-(--primary-light)",
      secondary: "bg-(--accent) text-white hover:bg-(--accent-hover)",
      danger: "bg-red-500 text-white hover:bg-red-600",
      success: "bg-green-500 text-white hover:bg-green-600",
      warning: "bg-amber-500 text-white hover:bg-amber-600",
      info: "bg-blue-500 text-white hover:bg-blue-600",
    };
    return styles[variant] || styles.primary;
  };

  const renderActions = () => (
    <div className="flex gap-2 pt-4 border-t border-gray-200">
      {actions.map((action, index) => {
        if (!action.show) return null;
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
            }}
            className={`flex-1 px-3 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm font-semibold flex items-center justify-center gap-2 ${getActionStyles(action.variant)}`}
            title={action.label || undefined}
          >
            {action.icon}
            {action.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <BasePropertyCard
      title={property.title}
      price={property.price}
      currency={property.currency}
      location={property.location}
      type={property.type}
      status={property.status === "activa" ? "Activa" : "Pausada"}
      bedrooms={property.bedrooms}
      bathrooms={property.bathrooms}
      area={property.area}
      image={property.image}
      showStatusBadge={true}
      showTypeBadge={true}
      showDetails={true}
      footerSlot={renderActions()}
    />
  );
}
