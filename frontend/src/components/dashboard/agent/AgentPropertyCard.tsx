import UniversalPropertyCard from '@/components/UniversalPropertyCard';

// Tipos (should ideally be imported from a shared types file, but keeping localized for now as per extraction)
interface Property {
    id: string;
    title: string;
    type: 'Venta' | 'Alquiler';
    price: number;
    currency: 'USD' | 'ARS';
    location: string;
    bedrooms: number;
    rooms: number;
    bathrooms: number;
    area: number;
    image?: string;
    images?: string[];
    status: 'Activa' | 'Pausada';
    description: string;
    propertyType: string;
    yearBuilt?: number | null;
    features?: string[];
    landlordName?: string;
    landlordPhone?: string;
    landlordEmail?: string;
}

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
    onRent
}: AgentPropertyCardProps) {
    return (
        <UniversalPropertyCard
            property={property}
            showStatusBadge={true}
            showTypeBadge={true}
            showPropertyDetails={true}
            actions={[
                {
                    label: 'Editar',
                    onClick: () => onEdit(property),
                    variant: 'primary',
                    icon: (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    )
                },
                {
                    label: 'Alquilar',
                    onClick: () => onRent && onRent(property),
                    variant: 'info',
                    icon: (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    ),
                    show: property.type === 'Alquiler' && property.status === 'Activa' && !!onRent
                },
                {
                    label: property.status === 'Activa' ? 'Pausar' : 'Activar',
                    onClick: () => onToggleStatus(property.id),
                    variant: property.status === 'Activa' ? 'secondary' : 'warning'
                },
                {
                    label: '',
                    onClick: () => onDelete(property.id),
                    variant: 'danger',
                    icon: (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    )
                }
            ]}
        />
    );
}
