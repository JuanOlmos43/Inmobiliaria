'use client';

import { useState } from 'react';
import PropertyCard from './PropertyCard';

const properties = [
  {
    id: 1,
    title: 'Casa + Local Comercial',
    price: 98000,
    location: 'Blas Parera 272',
    bedrooms: 4,
    bathrooms: 3,
    area: 400,
    type: 'venta' as const,
    image: '/property1.png',
  },
  {
    id: 2,
    title: 'Casa premium a estrenar',
    price: 255000,
    location: 'López Jordán y Carlos Darwin',
    bedrooms: 3,
    bathrooms: 3,
    area: 240,
    type: 'venta' as const,
    image: '/property2.png',
  },
  {
    id: 3,
    title: 'Terreno vista del Norte',
    price: 39000,
    location: 'Paraná',
    bedrooms: 0,
    bathrooms: 0,
    area: 450,
    type: 'venta' as const,
    image: '/property3.png',
  },
  {
    id: 4,
    title: 'Departamento 2 ambientes',
    price: 850,
    location: 'Centro, Buenos Aires',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    type: 'alquiler' as const,
    image: '/property4.png',
  },
  {
    id: 5,
    title: 'Duplex moderno amoblado',
    price: 1200,
    location: 'Palermo, Buenos Aires',
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    type: 'alquiler' as const,
    image: '/property5.png',
  },
];

export default function FeaturedProperties() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const maxIndex = Math.max(0, properties.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const visibleProperties = properties.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="py-12 bg-[#F4F6F8]">
      {/* Header */}
      <div className="bg-[#0A2647] py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-white text-2xl md:text-3xl font-bold text-center">
            Propiedades Destacadas
          </h2>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Navigation Arrows */}
          {properties.length > itemsPerPage && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-[#0A2647] hover:bg-[#C69B56] text-white p-3 rounded-full shadow-lg transition-colors hidden lg:block"
                aria-label="Anterior"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-[#0A2647] hover:bg-[#C69B56] text-white p-3 rounded-full shadow-lg transition-colors hidden lg:block"
                aria-label="Siguiente"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center gap-2 mt-6 lg:hidden">
          {properties.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-[#C69B56]' : 'bg-gray-400'
              }`}
              aria-label={`Ir a propiedad ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
