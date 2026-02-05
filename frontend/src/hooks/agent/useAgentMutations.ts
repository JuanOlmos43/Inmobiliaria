import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  propertiesService,
} from "@/lib/api/services/properties";
import { Property, CreatePropertyDto } from "@/types/property";
import { CreateRentalDto } from "@/types/api";
import { contratosService } from "@/lib/api/services/contratos";

interface UseAgentMutationsProps {
  showToast: (message: string, type: "success" | "error") => void;
  onPropertySaved?: () => void;
  onRentalSaved?: () => void;
}

/**
 * useAgentMutations
 * 
 * Maneja todas las operaciones de modificación de datos (CRUD) para propiedades.
 * Incluye creación, actualización, eliminación, toggle de status y contratos de alquiler.
 * 
 * @param props - Callbacks para feedback y acciones post-mutación
 * @returns {Object} Funciones para ejecutar mutaciones
 */
export function useAgentMutations({
  showToast,
  onPropertySaved,
  onRentalSaved,
}: UseAgentMutationsProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Función para refrescar datos tras cualquier cambio
  const refreshData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["properties"] }),
      queryClient.invalidateQueries({ queryKey: ["property-stats"] }),
    ]);
  };

  // ============================================
  // CREAR O ACTUALIZAR PROPIEDAD
  // ============================================

  /**
   * Guarda una propiedad (crear o actualizar) con sus imágenes
   */
  const handleSaveProperty = async (
    propertyData: Omit<Property, "id">,
    files: File[],
    editingProperty: Property | null
  ) => {
    try {
      // Mapear datos del formulario al DTO del backend
      const baseApiData: CreatePropertyDto = {
        title: propertyData.title,
        description: propertyData.description,
        propertyType: propertyData.propertyType,
        listingType: propertyData.listingType, // Ya viene en el formato correcto
        price: Number(propertyData.price),
        bedrooms: Number(propertyData.bedrooms),
        rooms: Number(propertyData.rooms),
        bathrooms: Number(propertyData.bathrooms),
        area: Number(propertyData.area),
        // Solo enviar yearBuilt si es un valor válido (>= 1800)
        yearBuilt:
          propertyData.yearBuilt && Number(propertyData.yearBuilt) >= 1800
            ? Number(propertyData.yearBuilt)
            : undefined,
        streetNumber: propertyData.streetNumber,
        apartment: propertyData.apartment,
        location: propertyData.location,
        provinciaId: propertyData.provinciaId || undefined,
        localidadId: propertyData.localidadId || undefined,
        calleId: propertyData.calleId || undefined,
        ownerId: propertyData.ownerId || undefined,
        agentId: user?.id || undefined,
        features: propertyData.features,
        status: propertyData.status as "activa" | "pausada" | "archivada",
      };

      let savedPropertyId: string;

      if (editingProperty) {
        // ACTUALIZAR propiedad existente
        savedPropertyId = editingProperty.id!;
        await propertiesService.update(editingProperty.id!, {
          ...baseApiData,
          images: propertyData.images,
        });
      } else {
        // CREAR nueva propiedad
        const newProperty = await propertiesService.create(baseApiData);
        savedPropertyId = newProperty.id;
      }

      // Subir imágenes si existen
      if (files && files.length > 0) {
        for (const file of files) {
          try {
            const { uploadUrl, path } =
              await propertiesService.generateUploadUrl(
                savedPropertyId,
                file.name
              );
            await propertiesService.uploadFileToSupabase(uploadUrl, file);
            await propertiesService.confirmImageUpload(savedPropertyId, path);
          } catch (uploadError) {
            console.error(`Error uploading file ${file.name}:`, uploadError);
            showToast(`Error al subir la imagen ${file.name}`, "error");
          }
        }
      }

      // Invalidar queries para refrescar datos
      await refreshData();
      queryClient.invalidateQueries({
        queryKey: ["property", savedPropertyId],
      });

      // Callback de éxito
      onPropertySaved?.();

      showToast(
        editingProperty
          ? "Propiedad actualizada exitosamente"
          : "Propiedad creada exitosamente",
        "success"
      );
    } catch (error) {
      console.error("Error saving property:", error);
      showToast(
        "Hubo un error al guardar la propiedad. Por favor intente nuevamente.",
        "error"
      );
    }
  };

  // ============================================
  // ELIMINAR PROPIEDAD
  // ============================================

  /**
   * Elimina una propiedad después de confirmación
   */
  const handleDeleteProperty = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta propiedad?")) {
      try {
        await propertiesService.remove(id);
        
        // Invalidar queries
        await refreshData();
        
        showToast("Propiedad eliminada exitosamente", "success");
      } catch (error) {
        console.error("Error deleting property:", error);
        showToast("Error al eliminar la propiedad", "error");
      }
    }
  };

  // ============================================
  // TOGGLE STATUS (ACTIVA ↔ PAUSADA)
  // ============================================

  /**
   * Cambia el status de una propiedad entre activa y pausada
   */
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "activa" ? "pausada" : "activa";
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await propertiesService.update(id, { status: newStatus as any });
      
      // Invalidar queries
      await refreshData();
      
      return newStatus;
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("Error al cambiar el estado de la propiedad", "error");
      throw error;
    }
  };

  // ============================================
  // CREAR CONTRATO DE ALQUILER
  // ============================================

  /**
   * Crea un contrato de alquiler
   */
  const handleCreateRental = async (
    property: Property,
    rentalData: CreateRentalDto
  ) => {
    try {
      // Incluir el ID del agente (usuario actual)
      const finalRentalData = {
        ...rentalData,
        agentId: user?.id,
      };

      await contratosService.create(finalRentalData);

      // Invalidar queries para refrescar datos
      await refreshData();
      await queryClient.invalidateQueries({ queryKey: ["contracts"] });

      // Callback de éxito
      onRentalSaved?.();

      showToast("Contrato de alquiler creado exitosamente", "success");
    } catch (error) {
      console.error("Error creating rental:", error);
      showToast("Error al crear el contrato de alquiler", "error");
    }
  };

  /**
   * Elimina un contrato de alquiler
   */
  const handleDeleteContract = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas revocar este contrato? Esta acción volverá a poner la propiedad como activa.")) {
      try {
        await contratosService.remove(id);
        
        // Invalidar queries
        await refreshData();
        await queryClient.invalidateQueries({ queryKey: ["contracts"] });
        
        showToast("Contrato revocado exitosamente", "success");
        return true;
      } catch (error) {
        console.error("Error deleting contract:", error);
        showToast("Error al revocar el contrato", "error");
        return false;
      }
    }
    return false;
  };

  return {
    handleSaveProperty,
    handleDeleteProperty,
    handleToggleStatus,
    handleCreateRental,
    handleDeleteContract,
  };
}
