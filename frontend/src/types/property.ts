export interface Property {
    id?: string;
    title: string;
    listingType: "venta" | "alquiler";
    price: number;
    currency: "USD" | "ARS";
    location: string;
    bedrooms: number;
    rooms: number;
    bathrooms: number;
    area: number;
    mainImage?: string;
    images?: string[];
    status: "activa" | "pausada" | "alquilada";
    description: string;
    propertyType: string;
    yearBuilt?: number | null;
    features?: string[];
    landlordName?: string;
    landlordPhone?: string;
    landlordEmail?: string;
    // Campos adicionales para creación/edición
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

export interface PropertyStats {
    total: number;
    status: {
        activa: number;
        pausada: number;
        alquilada: number;
    };
    monthly: {
        new: number;
    };
    listingType: {
        venta: number;
        alquiler: number;
    };
}
