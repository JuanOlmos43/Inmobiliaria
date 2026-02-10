"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import BasePropertyCard from "@/components/BasePropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import { EmptyState, Pagination } from "@/components/UI";
import HeroSection from "@/components/HeroSection";
import { propertiesService } from "@/lib/api/services/properties";
import type {
  Property,
  PropertyFilters as PropertyFiltersType,
} from "@/types/property";

function PropiedadesContent() {
  const searchParams = useSearchParams();

  // Estados para los filtros aplicados (los que realmente filtran)
  const [appliedFilters, setAppliedFilters] = useState<PropertyFiltersType>({
    operationType: "alquiler",
    propertyType: "",
    province: "",
    city: "",
    minBedrooms: undefined,
    minBathrooms: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Leer parámetros de URL al cargar la página
  useEffect(() => {
    const urlOperationType = searchParams.get("operationType");
    const urlPropertyType = searchParams.get("propertyType");
    const urlProvince = searchParams.get("province");
    const urlCity = searchParams.get("city");
    const urlBedrooms = searchParams.get("bedrooms");
    const urlBathrooms = searchParams.get("bathrooms");
    const urlMinPrice = searchParams.get("minPrice");
    const urlMaxPrice = searchParams.get("maxPrice");

    // Validar que el tipo de operación sea válido
    const isValidOperationType = (
      value: string | null,
    ): value is "venta" | "alquiler" => {
      return value === "venta" || value === "alquiler";
    };

    setAppliedFilters({
      operationType: isValidOperationType(urlOperationType)
        ? urlOperationType
        : "alquiler",
      propertyType: urlPropertyType || "",
      province: urlProvince || "",
      city: urlCity || "",
      minBedrooms: urlBedrooms ? parseInt(urlBedrooms) : undefined,
      minBathrooms: urlBathrooms ? parseInt(urlBathrooms) : undefined,
      minPrice: urlMinPrice ? parseFloat(urlMinPrice) : undefined,
      maxPrice: urlMaxPrice ? parseFloat(urlMaxPrice) : undefined,
    });
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
          Object.entries(filters).filter(([_, value]) => {
            // Mantener valores que no sean undefined, null, o strings vacíos
            return value !== undefined && value !== null && value !== "";
          }),
        ) as PropertyFiltersType;

        console.log("Filters being sent to backend:", cleanFilters);

        const response =
          await propertiesService.getPublicProperties(cleanFilters);
        setProperties(response.data);
        setTotalPages(response.meta.totalPages);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Error al cargar propiedades. Por favor intenta nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
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
      <main className="grow bg-(--background) flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-(--primary) text-white rounded hover:bg-(--primary-light) transition-colors"
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
            : `Encontramos ${properties.length} propiedades disponibles`
        }
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filtros */}
          <PropertyFilters
            initialFilters={appliedFilters}
            onSearch={handleSearch}
            onReset={handleReset}
          />

          {/* Main Content - Grid de propiedades */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-[400px] bg-gray-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {properties.map((property) => (
                    <Link
                      key={property.id}
                      href={`/propiedades/${property.id}`}
                      className="block group"
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
                actionLabel="Limpiar filtros"
                onAction={handleReset}
                actionIcon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                }
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
        <div className="min-h-screen flex items-center justify-center">
          Cargando...
        </div>
      }
    >
      <PropiedadesContent />
    </Suspense>
  );
}
