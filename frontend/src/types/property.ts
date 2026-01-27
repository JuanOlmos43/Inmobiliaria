export interface Property {
    id?: string;
    title: string;
    type: "Venta" | "Alquiler";
    price: number;
    currency: "USD" | "ARS";
    location: string;
    bedrooms: number;
    rooms: number;
    bathrooms: number;
    area: number;
    image?: string;
    images?: string[];
    status: "activa" | "pausada";
    description: string;
    propertyType: string;
    yearBuilt?: number | null;
    features?: string[];
    landlordName?: string;
    landlordPhone?: string;
    landlordEmail?: string;
    // Extra fields for creation/edit
    province?: string;
    city?: string;
    street?: string;
    streetNumber?: string;
    apartment?: string;
    provinciaId?: string;
    localidadId?: string;
    calleId?: string;
    ownerId?: string;
}
