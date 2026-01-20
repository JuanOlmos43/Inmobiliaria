'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { allProperties } from '@/data/properties';

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = parseInt(params.id as string);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const property = allProperties.find(p => p.id === propertyId);

  if (!property) {
    return (
      <main className="flex-grow bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#0f172a] mb-4">Propiedad no encontrada</h1>
          <Link 
            href="/propiedades"
            className="text-[#14b8a6] hover:text-[#0d9488] font-semibold"
          >
            Volver a propiedades
          </Link>
        </div>
      </main>
    );
  }

  // Use images array if available, otherwise fallback to single image
  const propertyImages = property.images && property.images.length > 0 
    ? property.images 
    : [property.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  return (
    <main className="flex-grow bg-[#f8fafc]">
        {/* Property Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Carousel */}
              <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-6 group">
                <Image
                  src={propertyImages[currentImageIndex]}
                  alt={`${property.title} - Imagen ${currentImageIndex + 1}`}
                  fill
                  className="object-cover transition-opacity duration-300"
                />
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-[#14b8a6] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                    {property.type === 'venta' ? 'Venta' : 'Alquiler'}
                  </span>
                </div>

                {/* Navigation Arrows - Only show if there are multiple images */}
                {propertyImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                      aria-label="Imagen anterior"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                      aria-label="Imagen siguiente"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {propertyImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex 
                              ? 'bg-white w-8' 
                              : 'bg-white/60 hover:bg-white/80'
                          }`}
                          aria-label={`Ir a imagen ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Title and Location */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h1 className="text-3xl font-bold text-[#0f172a] mb-3">
                  {property.title}
                </h1>
                <div className="flex items-center mb-4">
                  <svg className="w-5 h-5 mr-2 text-[#14b8a6]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg text-gray-600">{property.location}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-gray-700 border-t pt-4">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 640 512">
                        <path d="M32 32c17.7 0 32 14.3 32 32V320H288V160c0-17.7 14.3-32 32-32H544c53 0 96 43 96 96V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V416H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zm144 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"/>
                      </svg>
                      <span>{property.bedrooms} Dormitorios</span>
                    </div>
                  )}
                  {property.rooms > 0 && (
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
                      </svg>
                      <span>{property.rooms} Ambientes</span>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 512 512">
                        <path d="M64 131.9C64 112.1 80.1 96 99.9 96c9.5 0 18.6 3.8 25.4 10.5l16.2 16.2c-21 38.9-17.4 87.5 10.9 123L151 247c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0L345 121c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-1.3 1.3c-35.5-28.3-84.2-31.9-123-10.9L170.5 61.3C151.8 42.5 126.4 32 99.9 32C44.7 32 0 76.7 0 131.9V448c0 17.7 14.3 32 32 32s32-14.3 32-32V131.9zM256 352a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-128a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-128a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm32-32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
                      </svg>
                      <span>{property.bathrooms} Baños</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span>{property.area} m²</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span className="capitalize">{property.propertyType}</span>
                  </div>
                  {property.yearBuilt && (
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                      </svg>
                      <span>{property.yearBuilt}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Descripción</h2>
                <p className="text-gray-700 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Características</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.features?.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-[#14b8a6] mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Price Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20 mb-6">
                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-2">Precio</p>
                  <p className="text-4xl font-bold text-[#0f172a]">
                    {property.currency} {property.price.toLocaleString('es-AR')}
                  </p>
                  {property.type === 'alquiler' && (
                    <p className="text-[#0f172a] text-sm mt-1">por mes</p>
                  )}
                </div>

                {/* Contact Button */}
                <Link
                  href="/contacto"
                  className="block w-full bg-[#14b8a6] hover:bg-[#0d9488] text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
                >
                  Contactar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
