'use client';

import { useState, useEffect } from 'react';
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
  const [isPaused, setIsPaused] = useState(false);
  const itemsPerPage = 3; // Mostrar 3 propiedades a la vez
  const maxIndex = Math.max(0, properties.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Auto-play: avanzar automáticamente cada 5 segundos
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000); // Cambia cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [currentIndex, isPaused]);

  const visibleProperties = properties.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="py-12 bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f172a] to-[#334155] py-6 mb-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-white text-3xl md:text-4xl font-bold text-center">
            Propiedades Destacadas
          </h2>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          {properties.length > itemsPerPage && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-gradient-to-r from-[#0f172a] to-[#334155] hover:from-[#14b8a6] hover:to-[#0d9488] text-white p-4 rounded-full shadow-xl transition-all duration-300 hidden lg:block transform hover:scale-110"
                aria-label="Anterior"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-gradient-to-r from-[#0f172a] to-[#334155] hover:from-[#14b8a6] hover:to-[#0d9488] text-white p-4 rounded-full shadow-xl transition-all duration-300 hidden lg:block transform hover:scale-110"
                aria-label="Siguiente"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Cards Grid con animación de deslizamiento */}
          <div className="overflow-hidden">
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${properties.length}, minmax(0, 1fr))`,
                width: `${(properties.length / itemsPerPage) * 100}%`
              }}
            >
              {properties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center gap-2 mt-6 lg:hidden">
          {properties.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-gradient-to-r from-[#14b8a6] to-[#0d9488] w-8' : 'bg-gray-300'
              }`}
              aria-label={`Ir a propiedad ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
