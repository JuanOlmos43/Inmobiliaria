'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';

// Mock data - esto debería venir del backend
const allProperties = [
  {
    id: 1,
    title: 'Casa',
    price: 98000,
    location: 'Blas Parera 272',
    bedrooms: 4,
    bathrooms: 3,
    area: 400,
    type: 'venta' as const,
    propertyType: 'casa',
    image: '/property1.png',
  },
  {
    id: 2,
    title: 'Casa',
    price: 255000,
    location: 'López Jordán y Carlos Darwin',
    bedrooms: 3,
    bathrooms: 3,
    area: 240,
    type: 'venta' as const,
    propertyType: 'casa',
    image: '/property2.png',
  },
  {
    id: 3,
    title: 'Terreno',
    price: 39000,
    location: 'Paraná',
    bedrooms: 0,
    bathrooms: 0,
    area: 450,
    type: 'venta' as const,
    propertyType: 'terreno',
    image: '/property3.png',
  },
  {
    id: 4,
    title: 'Departamento',
    price: 850,
    location: 'Centro, Buenos Aires',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    type: 'alquiler' as const,
    propertyType: 'departamento',
    image: '/property4.png',
  },
  {
    id: 5,
    title: 'Duplex',
    price: 1200,
    location: 'Palermo, Buenos Aires',
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    type: 'alquiler' as const,
    propertyType: 'duplex',
    image: '/property5.png',
  },
  {
    id: 6,
    title: 'Terreno',
    price: 51000,
    location: 'Miguel Lanús y Cicles Tanah',
    bedrooms: 0,
    bathrooms: 0,
    area: 875,
    type: 'venta' as const,
    propertyType: 'terreno',
    image: '/property3.png',
  },
  {
    id: 7,
    title: 'Departamento',
    price: 320000,
    location: 'Guzmán 333',
    bedrooms: 2,
    bathrooms: 1,
    area: 83,
    type: 'venta' as const,
    propertyType: 'departamento',
    image: '/property4.png',
  },
  {
    id: 8,
    title: 'Casa',
    price: 64000,
    location: 'Montevideo 903',
    bedrooms: 2,
    bathrooms: 1,
    area: 161,
    type: 'venta' as const,
    propertyType: 'casa',
    image: '/property1.png',
  },
  {
    id: 9,
    title: 'Casa',
    price: 64000,
    location: 'Montevideo 1111',
    bedrooms: 2,
    bathrooms: 1,
    area: 180,
    type: 'venta' as const,
    propertyType: 'casa',
    image: '/property2.png',
  },
  {
    id: 10,
    title: 'Monoambiente',
    price: 64000,
    location: 'video 11121',
    bedrooms: 1,
    bathrooms: 1,
    area: 180,
    type: 'venta' as const,
    propertyType: 'monoambiente',
    image: '/property2.png',
  },
];

export default function PropiedadesPage() {
  const searchParams = useSearchParams();
  
  // Estados para los filtros aplicados (los que realmente filtran)
  const [appliedOperationType, setAppliedOperationType] = useState<'todos' | 'venta' | 'alquiler'>('todos');
  const [appliedPropertyType, setAppliedPropertyType] = useState('');
  const [appliedBedrooms, setAppliedBedrooms] = useState('');
  const [appliedBathrooms, setAppliedBathrooms] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState('');
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('');
  
  // Estados temporales para los inputs (los que el usuario está editando)
  const [tempOperationType, setTempOperationType] = useState<'todos' | 'venta' | 'alquiler'>('todos');
  const [tempPropertyType, setTempPropertyType] = useState('');
  const [tempBedrooms, setTempBedrooms] = useState('');
  const [tempBathrooms, setTempBathrooms] = useState('');
  const [tempMinPrice, setTempMinPrice] = useState('');
  const [tempMaxPrice, setTempMaxPrice] = useState('');
  
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

    if (urlOperationType) {
      setAppliedOperationType(urlOperationType as any);
      setTempOperationType(urlOperationType as any);
    }
    if (urlPropertyType) {
      setAppliedPropertyType(urlPropertyType);
      setTempPropertyType(urlPropertyType);
    }
    if (urlBedrooms) {
      setAppliedBedrooms(urlBedrooms);
      setTempBedrooms(urlBedrooms);
    }
    if (urlBathrooms) {
      setAppliedBathrooms(urlBathrooms);
      setTempBathrooms(urlBathrooms);
    }
    if (urlMinPrice) {
      setAppliedMinPrice(urlMinPrice);
      setTempMinPrice(urlMinPrice);
    }
    if (urlMaxPrice) {
      setAppliedMaxPrice(urlMaxPrice);
      setTempMaxPrice(urlMaxPrice);
    }
  }, [searchParams]);

  // Resetear a página 1 cuando cambian los filtros aplicados
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedOperationType, appliedPropertyType, appliedBedrooms, appliedBathrooms, appliedMinPrice, appliedMaxPrice]);

  // Filtrar propiedades con los filtros aplicados
  const filteredProperties = allProperties.filter((property) => {
    // Filtro por tipo de operación (venta/alquiler)
    if (appliedOperationType !== 'todos' && property.type !== appliedOperationType) return false;
    
    // Filtro por tipo de propiedad (casa/departamento/etc)
    if (appliedPropertyType && property.propertyType !== appliedPropertyType) return false;
    
    // Filtro por dormitorios (exacto)
    if (appliedBedrooms && property.bedrooms !== parseInt(appliedBedrooms)) return false;
    
    // Filtro por baños (exacto)
    if (appliedBathrooms && property.bathrooms !== parseInt(appliedBathrooms)) return false;
    
    // Filtro por precio mínimo
    if (appliedMinPrice && property.price < parseFloat(appliedMinPrice)) return false;
    
    // Filtro por precio máximo
    if (appliedMaxPrice && property.price > parseFloat(appliedMaxPrice)) return false;
    
    return true;
  });

  // Paginación
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  // Aplicar los filtros temporales
  const handleSearch = () => {
    setAppliedOperationType(tempOperationType);
    setAppliedPropertyType(tempPropertyType);
    setAppliedBedrooms(tempBedrooms);
    setAppliedBathrooms(tempBathrooms);
    setAppliedMinPrice(tempMinPrice);
    setAppliedMaxPrice(tempMaxPrice);
  };

  const handleReset = () => {
    setTempOperationType('todos');
    setTempPropertyType('');
    setTempBedrooms('');
    setTempBathrooms('');
    setTempMinPrice('');
    setTempMaxPrice('');
    setAppliedOperationType('todos');
    setAppliedPropertyType('');
    setAppliedBedrooms('');
    setAppliedBathrooms('');
    setAppliedMinPrice('');
    setAppliedMaxPrice('');
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-[#F4F6F8]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A2647] to-[#061829] text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold">Propiedades</h1>
            <p className="text-gray-200 mt-2">
              Encontramos {filteredProperties.length} propiedades disponibles
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Filtros */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
                <h2 className="text-xl font-bold text-[#0A2647] mb-6">Filtros</h2>

                {/* Tipo de operación */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de operación
                  </label>
                  <select
                    value={tempOperationType}
                    onChange={(e) => setTempOperationType(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C69B56] focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="todos">Todos</option>
                    <option value="venta">Venta</option>
                    <option value="alquiler">Alquiler</option>
                  </select>
                </div>

                {/* Tipo de inmueble */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de inmueble
                  </label>
                  <select
                    value={tempPropertyType}
                    onChange={(e) => setTempPropertyType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C69B56] focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="">Todos</option>
                    <option value="casa">Casa</option>
                    <option value="departamento">Departamento</option>
                    <option value="duplex">Duplex</option>
                    <option value="terreno">Terreno</option>
                    <option value="monoambiente">Monoambiente</option>
                  </select>
                </div>

                {/* Dormitorios */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dormitorios
                  </label>
                  <select
                    value={tempBedrooms}
                    onChange={(e) => setTempBedrooms(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C69B56] focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="">Todos</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                {/* Baños */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Baños
                  </label>
                  <select
                    value={tempBathrooms}
                    onChange={(e) => setTempBathrooms(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C69B56] focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="">Todos</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>

                {/* Precio */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Precio mínimo"
                      value={tempMinPrice}
                      onChange={(e) => setTempMinPrice(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C69B56] focus:border-transparent bg-white text-gray-900"
                    />
                    <input
                      type="number"
                      placeholder="Precio máximo"
                      value={tempMaxPrice}
                      onChange={(e) => setTempMaxPrice(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C69B56] focus:border-transparent bg-white text-gray-900"
                    />
                  </div>
                </div>

                {/* Botón Buscar */}
                <button
                  onClick={handleSearch}
                  className="w-full bg-[#C69B56] hover:bg-[#B08A4A] text-white font-semibold py-2 px-4 rounded-lg transition-colors mb-3"
                >
                  Buscar
                </button>

                {/* Botón Limpiar filtros */}
                <button
                  onClick={handleReset}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            </aside>

            {/* Main Content - Grid de propiedades */}
            <div className="flex-1">
              {currentProperties.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {currentProperties.map((property) => (
                      <PropertyCard key={property.id} {...property} />
                    ))}
                  </div>

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Anterior
                      </button>

                      <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              currentPage === page
                                ? 'bg-[#C69B56] text-white'
                                : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Siguiente
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No se encontraron propiedades
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Intenta ajustar los filtros para ver más resultados
                  </p>
                  <button
                    onClick={handleReset}
                    className="bg-[#C69B56] hover:bg-[#B38A45] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
