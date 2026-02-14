"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BasePropertyCard } from "@/components/features/properties/cards";
import { PropertyFilters } from "@/components/features/properties/filters";
import { EmptyState, Pagination } from "@/components/ui";
import { HeroSection } from "@/components/features/home";
import { propertiesService } from "@/lib/api/services/properties";
import type {
  Property,
  PropertyFilters as PropertyFiltersType,
} from "@/types/property";

function PropiedadesContent() {
  const searchParams = useSearchParams();

  // Función auxiliar para parsear filtros desde URL
  const getFiltersFromURL = (params: URLSearchParams): PropertyFiltersType => {
    const urlOperationType = params.get("operationType");
    const urlPropertyType = params.get("propertyType");
    const urlProvince = params.get("province");
    const urlCity = params.get("city");
    const urlBedrooms = params.get("bedrooms");
    const urlMinBedrooms = params.get("minBedrooms");
    const urlBathrooms = params.get("bathrooms");
    const urlMinBathrooms = params.get("minBathrooms");
    const urlMinPrice = params.get("minPrice");
    const urlMaxPrice = params.get("maxPrice");

    const isValidOperationType = (
      value: string | null
    ): value is "venta" | "alquiler" => {
      return value === "venta" || value === "alquiler";
    };

    return {
      operationType: isValidOperationType(urlOperationType)
        ? urlOperationType
        : "alquiler",
      propertyType: urlPropertyType || "",
      province: urlProvince || "",
      city: urlCity || "",
      bedrooms: urlBedrooms ? parseInt(urlBedrooms) : undefined,
      minBedrooms: urlMinBedrooms ? parseInt(urlMinBedrooms) : undefined,
      bathrooms: urlBathrooms ? parseInt(urlBathrooms) : undefined,
      minBathrooms: urlMinBathrooms ? parseInt(urlMinBathrooms) : undefined,
      minPrice: urlMinPrice ? parseFloat(urlMinPrice) : undefined,
      maxPrice: urlMaxPrice ? parseFloat(urlMaxPrice) : undefined,
    };
  };

  // Inicializar estado directamente desde URL para evitar doble render/fetch
  const [appliedFilters, setAppliedFilters] = useState<PropertyFiltersType>(
    () => {
      // Nota: searchParams es ReadonlyURLSearchParams, compatible con URLSearchParams
      // Convertimos a string para asegurar compatibilidad si es necesario o pasamos directo
      const params = new URLSearchParams(searchParams.toString());
      return getFiltersFromURL(params);
    }
  );

  const [properties, setProperties] = useState<Property[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Actualizar filtros si cambia la URL (navegación atrás/adelante o nueva búsqueda)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const newFilters = getFiltersFromURL(params);
    // Comparación simple para evitar loops si el objeto es "nuevo" pero idéntico
    if (JSON.stringify(newFilters) !== JSON.stringify(appliedFilters)) {
      setAppliedFilters(newFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Resetear a página 1 cuando cambian los filtros aplicados
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  // Scroll hacia arriba cuando cambia la página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Fetch properties from backend
  useEffect(() => {
    let isMounted = true; // Flag para cancelar efecto si el componente se desmonta o re-ejecuta

    const fetchProperties = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Los filtros ya vienen en el formato correcto desde PropertyFilters
        const filters: PropertyFiltersType = {
          ...appliedFilters,
          page: currentPage,
          limit: itemsPerPage,
        };

        // Limpiar campos vacíos antes de enviar al backend
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([, value]) => {
            // Mantener valores que no sean undefined, null, o strings vacíos
            return value !== undefined && value !== null && value !== "";
          })
        ) as PropertyFiltersType;

        console.log("Filters being sent to backend:", cleanFilters);

        const response =
          await propertiesService.getPublicProperties(cleanFilters);

        // Solo actualizar estado si el efecto sigue activo (es la solicitud más reciente)
        if (isMounted) {
          setProperties(response.data);
          setTotalPages(response.meta.totalPages);
          setTotalProperties(response.meta.total);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching properties:", err);
          setError(
            "Error al cargar propiedades. Por favor intenta nuevamente."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProperties();

    // Cleanup: marcar como desmontado para ignorar resultados de esta ejecución
    return () => {
      isMounted = false;
    };
  }, [appliedFilters, currentPage]);

  // Aplicar los filtros
  const handleSearch = (filters: PropertyFiltersType) => {
    setAppliedFilters(filters);
  };

  const handleReset = () => {
    setAppliedFilters({
      operationType: "alquiler",
      propertyType: "",
      province: "",
      city: "",
      minBedrooms: undefined,
      minBathrooms: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
    setCurrentPage(1);
  };

  if (error) {
    return (
      <main className="flex grow items-center justify-center bg-(--background)">
        <div className="text-center">
          <p className="mb-4 text-(--danger)">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-(--primary) px-4 py-2 text-white transition-colors hover:bg-(--primary-light)"
          >
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="grow bg-(--background)">
      {/* Header */}
      <HeroSection
        title="Propiedades"
        subtitle={
          isLoading
            ? "Buscando propiedades..."
            : `Encontramos ${totalProperties} ${totalProperties === 1 ? "propiedad disponible" : "propiedades disponibles"}`
        }
      />

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar - Filtros */}
          <PropertyFilters
            initialFilters={appliedFilters}
            onSearch={handleSearch}
            onReset={handleReset}
          />

          {/* Main Content - Grid de propiedades */}
          <div className="flex-1">
            {isLoading ? (
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                  <div
                    key={i}
                    className="h-[400px] animate-pulse rounded-lg bg-gray-100"
                  />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <>
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {properties.map((property) => (
                    <Link
                      key={property.id}
                      href={`/propiedades/${property.id}`}
                      className="group block"
                    >
                      <BasePropertyCard
                        title={property.title}
                        price={property.price}
                        currency={property.currency}
                        location={
                          property.location ||
                          (property.localidad
                            ? `${property.localidad.nombre}, ${property.localidad.provincia?.nombre}`
                            : "Ubicación no disponible")
                        }
                        bedrooms={property.bedrooms}
                        bathrooms={property.bathrooms}
                        area={property.area}
                        type={
                          property.listingType === "venta"
                            ? "Venta"
                            : "Alquiler"
                        }
                        image={property.mainImage}
                        showTypeBadge={true}
                        showDetails={true}
                        className="cursor-pointer"
                      />
                    </Link>
                  ))}
                </div>

                {/* Paginación */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <EmptyState
                title="No se encontraron propiedades"
                description="Intenta ajustar los filtros para ver más resultados"
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PropiedadesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Cargando...
        </div>
      }
    >
      <PropiedadesContent />
    </Suspense>
  );
}
