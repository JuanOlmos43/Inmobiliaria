import { BasePropertyCard } from "@/components/features/properties/cards";
import { Icon } from "@/components/ui";
import { Property } from "@/types/property";

interface AgentPropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  onRent?: (property: Property) => void;
}

export default function AgentPropertyCard({
  property,
  onEdit,
  onDelete,
  onRent,
}: AgentPropertyCardProps) {
  // Definir acciones
  const actions = [
    {
      label: "Editar",
      onClick: () => onEdit(property),
      variant: "primary" as const,
      icon: <Icon name="edit" className="w-4 h-4" />,
      show: true,
    },
    {
      label: "Alquilar",
      onClick: () => onRent && onRent(property),
      variant: "info" as const,
      icon: <Icon name="document" className="w-4 h-4" />,
      show:
        property.listingType === "alquiler" &&
        property.status === "activa" &&
        !!onRent,
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
      danger: "bg-red-500 text-white hover:bg-red-700",
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
      type={property.listingType === "venta" ? "Venta" : "Alquiler"}
      status={
        {
          activa: "Activa",
          pausada: "Pausada",
          alquilada: "Alquilada",
          archivada: "Archivada",
        }[property.status]
      }
      bedrooms={property.bedrooms}
      bathrooms={property.bathrooms}
      area={property.area}
      image={property.mainImage}
      showStatusBadge={true}
      showTypeBadge={true}
      showDetails={false}
      footerSlot={renderActions()}
    />
  );
}

