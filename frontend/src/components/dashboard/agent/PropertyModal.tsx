import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/components/UI/Modal";
import FormInput from "@/components/UI/FormInput";
import FormSelect from "@/components/UI/FormSelect";
import { propertiesService } from "@/lib/api/services/properties";
import { Property } from "@/types/property";

// Sub-componentes refactorizados
import LocationSection from "./PropertyModal/LocationSection";
import LandlordSection from "./PropertyModal/LandlordSection";
import ImageSection from "./PropertyModal/ImageSection";

interface PropertyModalProps {
  property: Property | null;
  onSave: (property: Omit<Property, "id">, files: File[]) => void;
  onClose: () => void;
}

export default function PropertyModal({
  property,
  onSave,
  onClose,
}: PropertyModalProps) {
  const [formData, setFormData] = useState<Omit<Property, "id">>({
    title: property?.title || "",
    type: property?.type || "Venta",
    price: property?.price || 0,
    currency: property?.currency || "USD",
    location: property?.location || "",
    bedrooms: property?.bedrooms || 1,
    rooms: property?.rooms || 1,
    bathrooms: property?.bathrooms || 1,
    area: property?.area || 0,
    status: property?.status || "activa",
    description: property?.description || "",
    propertyType: property?.propertyType || "casa",
    yearBuilt: property?.yearBuilt || null,
    features: property?.features || [],
    provinciaId: property?.provinciaId || "",
    localidadId: property?.localidadId || "",
    calleId: property?.calleId || "",
    ownerId: property?.ownerId || "",
    province: property?.province || "",
    city: property?.city || "",
    street: property?.street || "",
    streetNumber: property?.streetNumber || "",
    apartment: property?.apartment || "",
  });

  const [inputModes, setInputModes] = useState<{
    city: "select" | "input";
    street: "select" | "input";
  }>({ city: "select", street: "select" });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  // Carga de datos completos (si estamos editando)
  const { data: fullProperty, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["property", property?.id],
    queryFn: () => propertiesService.findOne(property!.id!),
    enabled: !!property?.id,
  });

  useEffect(() => {
    if (fullProperty) {
      const { id, owner, features, images, localidad, calle, ...rest } =
        fullProperty;

      setFormData((prev) => ({
        ...prev,
        ...rest,
        // Map location names from nested objects if available
        province: localidad?.provincia?.nombre || prev.province,
        city: localidad?.nombre || prev.city,
        street: calle?.nombre || prev.street,

        // Ensure IDs are consistent
        localidadId: localidad?.id || rest.localidadId || prev.localidadId,
        calleId: calle?.id || rest.calleId || prev.calleId,
        provinciaId:
          localidad?.provinciaId || rest.provinciaId || prev.provinciaId,

        features:
          features?.map((f: any) => (typeof f === "string" ? f : f.name)) || [],
        images:
          images?.map((img: any) =>
            typeof img === "string" ? img : img.url,
          ) || [],
        landlordName: owner?.name || prev.landlordName,
        landlordEmail: owner?.email || prev.landlordEmail,
        landlordPhone: owner?.phone || prev.landlordPhone,
        ownerId: owner?.id || prev.ownerId,
      }));
    }
  }, [fullProperty]);

  // Handler memoizado para evitar ciclos infinitos de renderizado
  const handleExistingImagesChange = useCallback((urls: string[]) => {
    setFormData((prev) => {
      // Simple comparison to avoid unnecessary updates if needed, though SetState optimization often handles primitives/references.
      // Since we create a new object, React will re-render.
      // We rely on ImageSection not firing this on every render unless props change.
      // But the issue was the function identity changing.
      return { ...prev, images: urls };
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let currentLocalidadId = formData.localidadId;
      let currentCalleId = formData.calleId;

      // Lógica de creación de ubicación manual (extraída de la UI)
      if (
        inputModes.city === "input" &&
        formData.city &&
        formData.provinciaId
      ) {
        const newLoc = await propertiesService.createLocalidad({
          nombre: formData.city,
          provinciaId: formData.provinciaId,
        });
        currentLocalidadId = newLoc.id;
      }

      if (
        inputModes.street === "input" &&
        formData.street &&
        currentLocalidadId
      ) {
        try {
          const newCalle = await propertiesService.createCalle({
            nombre: formData.street,
            localidadId: currentLocalidadId,
          });
          currentCalleId = newCalle.id;
        } catch (error: any) {
          if (error.status === 409) {
            const list = await propertiesService.getCalles(currentLocalidadId);
            currentCalleId = list.find(
              (c) => c.nombre.toLowerCase() === formData.street?.toLowerCase(),
            )?.id;
          }
        }
      }

      const fullLocation = `${formData.street} ${formData.streetNumber}, ${formData.city}, ${formData.province}${formData.apartment ? " Dpto " + formData.apartment : ""}`;

      onSave(
        {
          ...formData,
          location: fullLocation,
          localidadId: currentLocalidadId,
          calleId: currentCalleId,
        },
        selectedFiles,
      );
    } catch (error) {
      console.error("Error en submit:", error);
    }
  };

  const isLoading = !!property?.id && isLoadingDetails;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={property ? "Editar" : "Nueva Propiedad"}
      maxWidth="lg"
    >
      {isLoading ? (
        <div className="py-12 text-center">Cargando...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {/* Título */}
            <div className="grid grid-cols-1">
              <FormInput
                label="Título"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ej: Hermosa casa en el centro"
              />
            </div>

            {/* Detalles Principales: Tipo Op + Precio / Tipo Prop + Estado */}
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                label="Tipo Op."
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as any })
                }
              >
                <option value="Venta">Venta</option>
                <option value="Alquiler">Alquiler</option>
              </FormSelect>

              <FormInput
                label={`Precio (${formData.currency})`}
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
              />

              <FormSelect
                label="Tipo Prop."
                value={formData.propertyType}
                required
                onChange={(e) =>
                  setFormData({ ...formData, propertyType: e.target.value })
                }
              >
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="terreno">Terreno</option>
                <option value="duplex">Duplex</option>
                <option value="monoambiente">Monoambiente</option>
                <option value="local">Local</option>
                <option value="oficina">Oficina</option>
                <option value="deposito">Depósito</option>
              </FormSelect>

              <FormSelect
                label="Estado"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
              >
                <option value="activa">Activa</option>
                <option value="pausada">Pausada</option>
              </FormSelect>
            </div>

            {/* Ubicación */}
            <div className="pt-2">
              <LocationSection
                formData={formData}
                setFormData={setFormData}
                inputModes={inputModes}
                setInputModes={setInputModes}
              />
            </div>

            {/* Propietario (Movido arriba según diseño) */}
            <LandlordSection
              formData={formData}
              setFormData={setFormData}
              initialSearchName={formData.landlordName}
            />

            {/* Detalles de Superficie y Ambientes */}
            <div className="space-y-4">
              {/* Row 1: Ambientes, Dormitorios, Baños */}
              <div className="grid grid-cols-3 gap-4">
                <FormInput
                  label="Ambientes"
                  type="number"
                  min="0"
                  required
                  value={formData.rooms}
                  onChange={(e) =>
                    setFormData({ ...formData, rooms: Number(e.target.value) })
                  }
                />
                <FormInput
                  label="Dormitorios"
                  type="number"
                  min="0"
                  required
                  value={formData.bedrooms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bedrooms: Number(e.target.value),
                    })
                  }
                />
                <FormInput
                  label="Baños"
                  type="number"
                  min="0"
                  required
                  value={formData.bathrooms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bathrooms: Number(e.target.value),
                    })
                  }
                />
              </div>

              {/* Row 2: Superficie, Año */}
              <div className="grid grid-cols-3 gap-4">
                <FormInput
                  label="Superficie (m²)"
                  type="number"
                  min="0"
                  required
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: Number(e.target.value) })
                  }
                />
                <FormInput
                  label="Año Constr."
                  type="number"
                  min="0"
                  value={formData.yearBuilt || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      yearBuilt: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
                {/* Espacio vacío para mantener alineación o se puede estirar los otros dos */}
                <div />
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent transition-all duration-300 resize-y min-h-[100px]"
                rows={4}
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Detalles sobre la propiedad..."
              />
            </div>

            {/* Características */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Características
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent transition-all duration-300"
                  placeholder="Ej: Aire Acondicionado, Patio, Cochera..."
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (featureInput.trim()) {
                        setFormData({
                          ...formData,
                          features: [
                            ...(formData.features || []),
                            featureInput.trim(),
                          ],
                        });
                        setFeatureInput("");
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (featureInput.trim()) {
                      setFormData({
                        ...formData,
                        features: [
                          ...(formData.features || []),
                          featureInput.trim(),
                        ],
                      });
                      setFeatureInput("");
                    }
                  }}
                  className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Agregar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features?.map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-(--accent)/10 text-(--accent) rounded-full text-sm flex items-center gap-2"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          features: formData.features?.filter(
                            (_, i) => i !== idx,
                          ),
                        })
                      }
                      className="hover:text-red-500 w-4 h-4 flex items-center justify-center rounded-full hover:bg-black/5"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Imágenes */}
            <ImageSection
              key={property?.id || "new-property"}
              initialUrls={fullProperty?.images?.map((img: any) => img.url)}
              onFilesChange={setSelectedFiles}
              onExistingImagesChange={handleExistingImagesChange}
            />

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium hover:bg-red-600 hover:text-white hover:border-red-600 rounded-lg transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-(--accent) text-white font-medium rounded-lg hover:bg-(--accent-hover) shadow-sm shadow-(--accent)/30 transition-all"
              >
                Guardar Propiedad
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
