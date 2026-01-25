'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import UniversalPropertyCard from '@/components/UniversalPropertyCard';
import PropertyFilters, { PropertyFiltersState } from '@/components/PropertyFilters';
import EmptyState from '@/components/UI/EmptyState';
import Pagination from '@/components/UI/Pagination';
import HeroSection from '@/components/HeroSection';
import { allProperties } from '@/data/properties';

function PropiedadesContent() {
  const searchParams = useSearchParams();

  // Estados para los filtros aplicados (los que realmente filtran)
  const [appliedFilters, setAppliedFilters] = useState<PropertyFiltersState>({
    operationType: 'todos',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    minPrice: '',
    maxPrice: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Leer parámetros de URL al cargar la página
  useEffect(() => {
    const urlOperationType = searchParams.get('operationType');
    const urlPropertyType = searchParams.get('propertyType');
    const urlBedrooms = searchParams.get('bedrooms');
    const urlBathrooms = searchParams.get('bathrooms');
    const urlMinPrice = searchParams.get('minPrice');
    const urlMaxPrice = searchParams.get('maxPrice');

    // Validar que el tipo de operación sea válido
    const isValidOperationType = (value: string | null): value is 'todos' | 'venta' | 'alquiler' => {
      return value === 'todos' || value === 'venta' || value === 'alquiler';
    };

    setAppliedFilters({
      operationType: isValidOperationType(urlOperationType) ? urlOperationType : 'todos',
      propertyType: urlPropertyType || '',
      bedrooms: urlBedrooms || '',
      bathrooms: urlBathrooms || '',
      minPrice: urlMinPrice || '',
      maxPrice: urlMaxPrice || '',
    });
  }, [searchParams]);

  // Resetear a página 1 cuando cambian los filtros aplicados
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  // Scroll hacia arriba cuando cambia la página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Filtrar propiedades con los filtros aplicados
  const filteredProperties = allProperties.filter((property) => {
    // Filtro por tipo de operación (venta/alquiler)
    if (appliedFilters.operationType !== 'todos' && property.type !== appliedFilters.operationType) return false;

    // Filtro por tipo de propiedad (casa/departamento/etc)
    if (appliedFilters.propertyType && property.propertyType !== appliedFilters.propertyType) return false;

    // Filtro por dormitorios (exacto)
    if (appliedFilters.bedrooms && property.bedrooms !== parseInt(appliedFilters.bedrooms)) return false;

    // Filtro por baños (exacto)
    if (appliedFilters.bathrooms && property.bathrooms !== parseInt(appliedFilters.bathrooms)) return false;

    // Filtro por precio mínimo
    if (appliedFilters.minPrice && property.price < parseFloat(appliedFilters.minPrice)) return false;

    // Filtro por precio máximo
    if (appliedFilters.maxPrice && property.price > parseFloat(appliedFilters.maxPrice)) return false;

    return true;
  });

  // Paginación
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  // Aplicar los filtros
  const handleSearch = (filters: PropertyFiltersState) => {
    setAppliedFilters(filters);
  };

  const handleReset = () => {
    setAppliedFilters({
      operationType: 'todos',
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      minPrice: '',
      maxPrice: '',
    });
    setCurrentPage(1);
  };

  return (
    <main className="flex-grow bg-[#f8fafc]">
      {/* Header */}
      <HeroSection
        title="Propiedades"
        subtitle={`Encontramos ${filteredProperties.length} propiedades disponibles`}
      />



      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filtros */}
          <PropertyFilters
            initialFilters={appliedFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            appliedOperationType={appliedFilters.operationType}
          />

          {/* Main Content - Grid de propiedades */}
          <div className="flex-1">
            {currentProperties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {currentProperties.map((property) => (
                    <UniversalPropertyCard
                      key={property.id}
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <PropiedadesContent />
    </Suspense>
  );
}
