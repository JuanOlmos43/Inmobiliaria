import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Provincia, Localidad, Calle } from "@/types/location";

// Definir interfaces aquí o importar de un archivo de tipos
export interface CreatePropertyDto {
  title: string;
  description?: string;
  propertyType: string; // 'casa', 'departamento', etc.
  listingType: "venta" | "alquiler";
  price: number;
  bedrooms: number;
  rooms: number;
  bathrooms: number;
  area: number;
  yearBuilt?: number | null;
  streetNumber?: string;
  calleId?: string;
  localidadId?: string;
  provinciaId?: string;
  locationText?: string;
  ownerId?: string;
  agentId?: string;
  status?: "activa" | "pausada" | "archivada";
}

export interface UploadUrlResponse {
  uploadUrl: string;
  path: string;
  token: string;
  order: number;
  filename: string;
}

/**
 * Service for property-related operations, including location data.
 */
export const propertiesService = {
  // --- Ubicaciones ---
  async getProvincias(): Promise<Provincia[]> {
    return apiClient.get<Provincia[]>(API_ENDPOINTS.PROVINCIAS);
  },

  async getLocalidades(provinciaId: string): Promise<Localidad[]> {
    return apiClient.get<Localidad[]>(
      `/ubicaciones/provincias/${provinciaId}/localidades`,
    );
  },

  async getCalles(localidadId: string): Promise<Calle[]> {
    return apiClient.get<Calle[]>(
      `/ubicaciones/localidades/${localidadId}/calles`,
    );
  },

  async createLocalidad(data: {
    nombre: string;
    provinciaId: string;
  }): Promise<Localidad> {
    return apiClient.post<Localidad>("/ubicaciones/localidades", data);
  },

  async createCalle(data: {
    nombre: string;
    localidadId: string;
  }): Promise<Calle> {
    return apiClient.post<Calle>("/ubicaciones/calles", data);
  },

  // --- Propiedades ---
  /**
   * Create a new property
   */
  async create(data: CreatePropertyDto): Promise<any> {
    return apiClient.post("/propiedades", data);
  },

  /**
   * Get all properties
   */
  async findAll(query?: any): Promise<any> {
    const queryString = query
      ? "?" + new URLSearchParams(query).toString()
      : "";
    return apiClient.get(`/propiedades${queryString}`);
  },

  /**
   * Get one property by ID
   */
  async findOne(id: string): Promise<any> {
    return apiClient.get(`/propiedades/${id}`);
  },

  /**
   * Update a property
   */
  async update(id: string, data: Partial<CreatePropertyDto>): Promise<any> {
    return apiClient.patch(`/propiedades/${id}`, data);
  },

  /**
   * Delete a property
   */
  async remove(id: string): Promise<any> {
    return apiClient.delete(`/propiedades/${id}`);
  },

  // --- Imágenes ---
  async generateUploadUrl(
    id: string,
    filename: string,
  ): Promise<UploadUrlResponse> {
    return apiClient.post<UploadUrlResponse, { filename: string }>(
      `/propiedades/${id}/upload-url`,
      { filename },
    );
  },

  async confirmImageUpload(id: string, path: string): Promise<any> {
    return apiClient.post(`/propiedades/${id}/images`, { path });
  },

  /**
   * Sube el archivo directamente a Supabase usando la URL firmada.
   * Nota: Esto usa fetch directamente porque es una URL externa, no la API nuestra.
   */
  async uploadFileToSupabase(uploadUrl: string, file: File): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new Error("Error uploading file to storage");
    }
  },
};
