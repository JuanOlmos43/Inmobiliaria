"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BasePropertyCard } from "@/components/features/properties/cards";
import { propertiesService } from "@/lib/api/services/properties";
import type { Property } from "@/types/property";

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const itemsPerPage = 3; // Mostrar 3 propiedades a la vez

  // Fetch featured properties from API
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const data = await propertiesService.getFeaturedProperties();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching featured properties:", error);
        // No hacer nada más - la sección se ocultará
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  // Calcular el número de páginas (grupos de 3 propiedades)
  const totalPages = Math.ceil(properties.length / itemsPerPage);
  const maxIndex = Math.max(0, totalPages - 1);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Auto-play: avanzar automáticamente cada 5 segundos
  useEffect(() => {
    if (!isPaused && properties.length > itemsPerPage) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 5000); // Cambia cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [isPaused, maxIndex, properties.length, itemsPerPage]);

  // Loading state
  if (isLoading) {
    return (
      <section className="bg-linear-to-b from-(--primary) via-(--primary) to-(--primary-light) pb-12">
        {/* Header */}
        <div className="pt-8 pb-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="animate-slide-in-right text-left text-3xl font-bold text-white md:text-4xl">
              Propiedades Destacadas
            </h2>
          </div>
        </div>

        {/* Loading Skeleton */}
        <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-lg"
              >
                <div className="h-64 bg-gray-300"></div>
                <div className="space-y-4 p-6">
                  <div className="h-6 w-3/4 rounded bg-gray-300"></div>
                  <div className="h-4 w-1/2 rounded bg-gray-300"></div>
                  <div className="h-4 w-full rounded bg-gray-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Si no hay propiedades, ocultar la sección completamente
  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="bg-linear-to-b from-(--primary) via-(--primary) to-(--primary-light) pb-12">
      {/* Header */}
      <div className="pt-8 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="animate-slide-in-right text-left text-3xl font-bold text-white md:text-4xl">
            Propiedades Destacadas
          </h2>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows - Solo mostrar si hay más de 3 propiedades */}
          {properties.length > itemsPerPage && (
            <>
              <button
                onClick={handlePrev}
                className="absolute top-1/2 left-0 z-10 hidden -translate-x-4 -translate-y-1/2 transform rounded-full bg-(--accent) p-4 text-white shadow-xl transition-all duration-300 hover:scale-95 hover:brightness-90 lg:block"
                aria-label="Anterior"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="absolute top-1/2 right-0 z-10 hidden translate-x-4 -translate-y-1/2 transform rounded-full bg-(--accent) p-4 text-white shadow-xl transition-all duration-300 hover:scale-95 hover:brightness-90 lg:block"
                aria-label="Siguiente"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Cards Grid con animación de deslizamiento */}
          <div className="-mt-3 -mb-1 overflow-hidden pt-3 pb-1">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {/* Agrupar propiedades en páginas de 3 */}
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="grid w-full shrink-0 grid-cols-1 gap-6 lg:grid-cols-3"
                >
                  {properties
                    .slice(
                      pageIndex * itemsPerPage,
                      (pageIndex + 1) * itemsPerPage
                    )
                    .map((property) => (
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
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dots - Solo mostrar si hay más de 1 página */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2 lg:hidden">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-linear-to-r from-(--accent) to-(--accent-hover)"
                    : "bg-gray-300"
                }`}
                aria-label={`Ir a página ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
