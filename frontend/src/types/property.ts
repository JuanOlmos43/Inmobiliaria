export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  listingType: "venta" | "alquiler";
  price: number;
  currency: "ARS" | "USD";
  bedrooms: number;
  rooms: number;
  bathrooms: number;
  area: number;
  yearBuilt?: number | null;
  location: string;
  streetNumber?: string;
  apartment?: string;
  mainImage?: string;
  images?: string[];
  features?: string[];
  status: "activa" | "pausada" | "alquilada" | "archivada";
  createdAt?: string;
  updatedAt?: string;

  // Relational data
  provinciaId?: string;
  localidadId?: string;
  calleId?: string;
  ownerId?: string;
  agentId?: string;

  // Detailed owner/landlord info (optional depending on view)
  owner?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

export interface CreatePropertyDto {
  title: string;
  description?: string;
  propertyType: string;
  listingType: "venta" | "alquiler";
  price: number;
  bedrooms: number;
  rooms: number;
  bathrooms: number;
  area: number;
  yearBuilt?: number | null;
  streetNumber?: string;
  apartment?: string;
  calleId?: string;
  localidadId?: string;
  provinciaId?: string;
  location?: string;
  ownerId?: string;
  agentId?: string;
  status?: "activa" | "pausada" | "archivada";
  features?: string[];
  images?: string[];
}

export type UpdatePropertyDto = Partial<CreatePropertyDto>;

export interface UploadUrlResponse {
  uploadUrl: string;
  path: string;
  token: string;
  order: number;
  filename: string;
}

export interface PropertyFilters {
  search?: string;
  status?: "activa" | "pausada" | "alquilada" | "archivada";
  listingType?: "venta" | "alquiler";
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
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
