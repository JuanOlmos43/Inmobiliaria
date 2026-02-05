import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Provincia, Localidad, Calle } from "@/types/location";
import type {
  PropertyStats,
  CreatePropertyDto,
  UpdatePropertyDto,
  UploadUrlResponse,
  PropertyFilters,
  Property,
} from "@/types/property";
import type { PaginatedResponse } from "@/types/api";

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

  // --- Estadísticas ---
  /**
   * Get property statistics
   */
  async getStats(): Promise<PropertyStats> {
    return apiClient.get<PropertyStats>("/propiedades/stats");
  },

  // --- Propiedades ---
  /**
   * Create a new property
   */
  async create(data: CreatePropertyDto): Promise<Property> {
    return apiClient.post("/propiedades", data);
  },

  /**
   * Get all properties
   */
  async findAll(query?: PropertyFilters): Promise<PaginatedResponse<Property>> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString() ? "?" + params.toString() : "";
    return apiClient.get<PaginatedResponse<Property>>(`/propiedades${queryString}`);
  },

  /**
   * Get one property by ID
   */
  async findOne(id: string): Promise<Property> {
    return apiClient.get(`/propiedades/${id}`);
  },

  async update(id: string, data: UpdatePropertyDto): Promise<Property> {
    return apiClient.patch(`/propiedades/${id}`, data);
  },

  /**
   * Delete a property
   */
  async remove(id: string): Promise<void> {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
