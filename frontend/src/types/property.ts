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
  images?: string[] | Array<{ id: string; url: string; order: number }>;
  features?: string[] | Array<{ id: string; name: string }>;
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
  localidad?: {
    id: string;
    nombre: string;
    provinciaId: string;
    provincia?: {
      id: string;
      nombre: string;
    };
  };
  calle?: {
    id: string;
    nombre: string;
    localidadId: string;
  };

  // Helper fields for UI/Forms
  province?: string;
  city?: string;
  street?: string;
  landlordName?: string;
  landlordEmail?: string;
  landlordPhone?: string;

  rentalContracts?: {
    id: string;
    startDate: string;
    endDate: string;
    tenant: {
      name: string;
    };
  }[];
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
  // Helper fields for UI/Forms
  province?: string;
  city?: string;
  street?: string;
  landlordName?: string;
  landlordEmail?: string;
  landlordPhone?: string;
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
  operationType?: "venta" | "alquiler"; // UI-friendly, optional (undefined = all)
  propertyType?: string;
  province?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number; // Exact match
  bathrooms?: number; // Exact match
  minBedrooms?: number;
  minBathrooms?: number;
  ownerId?: string;
  contractStatus?: string;
  page?: number;
  limit?: number;
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
