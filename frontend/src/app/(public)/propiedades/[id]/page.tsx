"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { propertiesService } from "@/lib/api/services/properties";
import type { Property } from "@/types/property";
import { Icon } from "@/components/ui";

export default function PropertyDetailPage() {
  const params = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Estados para datos del backend
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch property from backend
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await propertiesService.getPublicProperty(
          params.id as string
        );
        setProperty(data);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Error al cargar la propiedad");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  // Loading state
  if (isLoading) {
    return (
      <main className="flex min-h-screen grow items-center justify-center bg-(--background)">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-(--accent)"></div>
          <p className="font-medium text-gray-500">Cargando propiedad...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <main className="flex grow items-center justify-center bg-(--background)">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-(--primary)">
            Propiedad no encontrada
          </h1>
          <Link
            href="/propiedades"
            className="font-semibold text-(--accent) hover:text-(--accent-hover)"
          >
            Volver a propiedades
          </Link>
        </div>
      </main>
    );
  }

  // Extract image URLs from PropertyImage objects
  const propertyImages =
    property.images && property.images.length > 0
      ? property.images.map((img) => (typeof img === "string" ? img : img.url))
      : property.mainImage
        ? [property.mainImage]
        : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + propertyImages.length) % propertyImages.length
    );
  };

  return (
    <>
      {/* Property Details */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Image Carousel */}
            <div className="group relative mb-6 aspect-video w-full overflow-hidden rounded-2xl bg-gray-200 shadow-xl">
              {propertyImages.length > 0 ? (
                <Image
                  src={propertyImages[currentImageIndex]}
                  alt={`${property.title} - Imagen ${currentImageIndex + 1}`}
                  fill
                  className="object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-300">
                  <p className="text-lg text-gray-500">
                    Sin imágenes disponibles
                  </p>
                </div>
              )}
              <div className="absolute top-4 right-4 z-10">
                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold shadow-sm backdrop-blur-sm ${
                    property.listingType === "venta"
                      ? "bg-(--primary) text-white"
                      : "bg-(--accent) text-white"
                  }`}
                >
                  {property.listingType === "venta" ? "Venta" : "Alquiler"}
                </span>
              </div>

              {/* Navigation Arrows - Only show if there are multiple images */}
              {propertyImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 text-gray-800 opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:bg-white"
                    aria-label="Imagen anterior"
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
                    onClick={nextImage}
                    className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 text-gray-800 opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:bg-white"
                    aria-label="Imagen siguiente"
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

                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                    {propertyImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 w-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "w-8 bg-white"
                            : "bg-white/60 hover:bg-white/80"
                        }`}
                        aria-label={`Ir a imagen ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Title and Location */}
            <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
              <h1 className="mb-3 text-3xl font-bold text-(--primary)">
                {property.title}
              </h1>
              <div className="mb-4 flex items-center">
                <Icon
                  name="location"
                  className="mr-2 h-5 w-5 text-(--accent)"
                  fill="currentColor"
                />
                <span className="text-lg text-gray-600">
                  {property.location}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 border-t pt-4 text-gray-700">
                {property.bedrooms > 0 && (
                  <div className="flex items-center">
                    <Icon
                      name="bed"
                      className="mr-2 h-6 w-6"
                      fill="currentColor"
                    />
                    <span>{property.bedrooms} Dormitorios</span>
                  </div>
                )}
                {property.rooms > 0 && (
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                    </svg>
                    <span>{property.rooms} Ambientes</span>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex items-center">
                    <Icon
                      name="bath"
                      className="mr-2 h-6 w-6"
                      fill="currentColor"
                    />
                    <span>{property.bathrooms} Baños</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Icon name="area" className="mr-2 h-6 w-6" />
                  <span>{property.area} m²</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="mr-2 h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span className="capitalize">{property.propertyType}</span>
                </div>
                {property.yearBuilt && (
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                    </svg>
                    <span>{property.yearBuilt}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
              <h2 className="mb-4 text-2xl font-bold text-(--primary)">
                Descripción
              </h2>
              <p className="leading-relaxed text-gray-700">
                {property.description}
              </p>
            </div>

            {/* Features */}
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
              <h2 className="mb-4 text-2xl font-bold text-(--primary)">
                Características
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {property.features?.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg
                      className="mr-2 h-5 w-5 text-(--accent)"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      {typeof feature === "string" ? feature : feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="sticky top-20 mb-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
              <div className="mb-6">
                <p className="mb-2 text-sm text-gray-600">Precio</p>
                <p className="text-4xl font-bold text-(--primary)">
                  {property.currency} {property.price.toLocaleString("es-AR")}
                </p>
                {property.listingType === "alquiler" && (
                  <p className="mt-1 text-sm text-(--primary)">por mes</p>
                )}
              </div>

              {/* Contact Button */}
              <div className="flex justify-center">
                <Link
                  href="/contacto"
                  className="inline-block transform rounded-full bg-(--accent) px-8 py-3 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:scale-95 hover:bg-(--accent-hover) hover:shadow-xl"
                >
                  Contactar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
