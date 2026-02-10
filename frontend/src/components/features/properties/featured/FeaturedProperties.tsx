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
      <section className="pb-12 bg-linear-to-b from-(--primary) via-(--primary) to-(--primary-light)">
        {/* Header */}
        <div className="pt-8 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-white text-3xl md:text-4xl font-bold text-left animate-slide-in-right">
              Propiedades Destacadas
            </h2>
          </div>
        </div>

        {/* Loading Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-64 bg-gray-300"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
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
    <section className="pb-12 bg-linear-to-b from-(--primary) via-(--primary) to-(--primary-light)">
      {/* Header */}
      <div className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-white text-3xl md:text-4xl font-bold text-left animate-slide-in-right">
            Propiedades Destacadas
          </h2>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
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
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-linear-to-r from-(--primary) to-(--primary-light) hover:from-(--accent) hover:to-(--accent-hover) text-white p-4 rounded-full shadow-xl transition-all duration-300 hidden lg:block transform hover:scale-110"
                aria-label="Anterior"
              >
                <svg
                  className="w-6 h-6"
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
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-linear-to-r from-(--primary) to-(--primary-light) hover:from-(--accent) hover:to-(--accent-hover) text-white p-4 rounded-full shadow-xl transition-all duration-300 hidden lg:block transform hover:scale-110"
                aria-label="Siguiente"
              >
                <svg
                  className="w-6 h-6"
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
          <div className="overflow-hidden pt-3 pb-1 -mt-3 -mb-1">
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
                  className="shrink-0 w-full grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                  {properties
                    .slice(
                      pageIndex * itemsPerPage,
                      (pageIndex + 1) * itemsPerPage,
                    )
                    .map((property) => (
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
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dots - Solo mostrar si hay más de 1 página */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6 lg:hidden">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-linear-to-r from-(--accent) to-(--accent-hover) w-8"
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

