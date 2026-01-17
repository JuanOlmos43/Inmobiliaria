'use client';

import { useState, useEffect } from 'react';
import UniversalPropertyCard from './UniversalPropertyCard';
import { featuredProperties } from '@/data/properties';

export default function FeaturedProperties() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const itemsPerPage = 3; // Mostrar 3 propiedades a la vez
  const maxIndex = Math.max(0, featuredProperties.length - itemsPerPage);

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

  return (
    <section className="pb-12 bg-gradient-to-b from-[#0f172a] via-[#0f172a] to-[#1e293b]">
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
          {/* Navigation Arrows */}
          {featuredProperties.length > itemsPerPage && (
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
          <div className="overflow-hidden pt-3 pb-1 -mt-3 -mb-1">
            <div 
              className="flex gap-6 transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 1.5}rem))`
              }}
            >
              {featuredProperties.map((property) => (
                <div key={property.id} className="flex-shrink-0 w-full lg:w-[calc(33.333%-1rem)]">
                  <UniversalPropertyCard
                    property={{
                      id: property.id,
                      title: property.title,
                      price: property.price,
                      currency: property.currency,
                      location: property.location,
                      bedrooms: property.bedrooms,
                      bathrooms: property.bathrooms,
                      area: property.area,
                      type: property.type === 'venta' ? 'Venta' : 'Alquiler',
                      image: property.image
                    }}
                    href={`/propiedades/${property.id}`}
                    showTypeBadge={true}
                    showPropertyDetails={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center gap-2 mt-6 lg:hidden">
          {featuredProperties.map((_, index) => (
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
