import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type { Provincia, Localidad, Calle } from '@/types/location'

/**
 * Service for property-related operations, including location data.
 */
export const propertiesService = {
    /**
     * Retrieves the list of available provinces.
     */
    async getProvincias(): Promise<Provincia[]> {
        return apiClient.get<Provincia[]>(API_ENDPOINTS.PROVINCIAS)
    },

    /**
     * Retrieves the list of localities for a specific province.
     * @param provinciaId The ID of the province.
     */
    async getLocalidades(provinciaId: string): Promise<Localidad[]> {
        return apiClient.get<Localidad[]>(`/ubicaciones/provincias/${provinciaId}/localidades`)
    },

    /**
     * Retrieves the list of streets for a specific locality.
     * @param localidadId The ID of the locality.
     */
    async getCalles(localidadId: string): Promise<Calle[]> {
        return apiClient.get<Calle[]>(`/ubicaciones/localidades/${localidadId}/calles`)
    },

    /**
     * Creates a new locality.
     */
    async createLocalidad(data: { nombre: string; provinciaId: string }): Promise<Localidad> {
        return apiClient.post<Localidad>('/ubicaciones/localidades', data);
    },

    /**
     * Creates a new street.
     */
    async createCalle(data: { nombre: string; localidadId: string }): Promise<Calle> {
        return apiClient.post<Calle>('/ubicaciones/calles', data);
    },
}
