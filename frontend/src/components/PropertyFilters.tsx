'use client';

import { useState, useEffect } from 'react';

export interface PropertyFiltersState {
  operationType: 'todos' | 'venta' | 'alquiler';
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  minPrice: string;
  maxPrice: string;
}

interface PropertyFiltersProps {
  initialFilters?: Partial<PropertyFiltersState>;
  onSearch: (filters: PropertyFiltersState) => void;
  onReset: () => void;
  appliedOperationType?: 'todos' | 'venta' | 'alquiler';
}

export default function PropertyFilters({ 
  initialFilters = {},
  onSearch,
  onReset,
  appliedOperationType = 'todos'
}: PropertyFiltersProps) {
  // Estados temporales para los inputs (los que el usuario está editando)
  const [tempOperationType, setTempOperationType] = useState<'todos' | 'venta' | 'alquiler'>(
    initialFilters.operationType || 'todos'
  );
  const [tempPropertyType, setTempPropertyType] = useState(initialFilters.propertyType || '');
  const [tempBedrooms, setTempBedrooms] = useState(initialFilters.bedrooms || '');
  const [tempBathrooms, setTempBathrooms] = useState(initialFilters.bathrooms || '');
  const [tempMinPrice, setTempMinPrice] = useState(initialFilters.minPrice || '');
  const [tempMaxPrice, setTempMaxPrice] = useState(initialFilters.maxPrice || '');

  // Actualizar estados cuando cambien los filtros iniciales
  useEffect(() => {
    if (initialFilters.operationType !== undefined) setTempOperationType(initialFilters.operationType);
    if (initialFilters.propertyType !== undefined) setTempPropertyType(initialFilters.propertyType);
    if (initialFilters.bedrooms !== undefined) setTempBedrooms(initialFilters.bedrooms);
    if (initialFilters.bathrooms !== undefined) setTempBathrooms(initialFilters.bathrooms);
    if (initialFilters.minPrice !== undefined) setTempMinPrice(initialFilters.minPrice);
    if (initialFilters.maxPrice !== undefined) setTempMaxPrice(initialFilters.maxPrice);
  }, [initialFilters]);

  const handleSearch = () => {
    onSearch({
      operationType: tempOperationType,
      propertyType: tempPropertyType,
      bedrooms: tempBedrooms,
      bathrooms: tempBathrooms,
      minPrice: tempMinPrice,
      maxPrice: tempMaxPrice,
    });
  };

  const handleReset = () => {
    setTempOperationType('todos');
    setTempPropertyType('');
    setTempBedrooms('');
    setTempBathrooms('');
    setTempMinPrice('');
    setTempMaxPrice('');
    onReset();
  };

  return (
    <aside className="lg:w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
        <h2 className="text-xl font-bold text-[#0f172a] mb-6">Filtros</h2>

        {/* Tipo de operación */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de operación
          </label>
          <select
            value={tempOperationType}
            onChange={(e) => setTempOperationType(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent bg-white text-gray-900"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent bg-white text-gray-900"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent bg-white text-gray-900"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent bg-white text-gray-900"
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
            Precio {appliedOperationType === 'alquiler' ? '(ARS)' : appliedOperationType === 'venta' ? '(USD)' : ''}
          </label>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Precio mínimo"
              value={tempMinPrice}
              onChange={(e) => setTempMinPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent bg-white text-gray-900"
            />
            <input
              type="number"
              placeholder="Precio máximo"
              value={tempMaxPrice}
              onChange={(e) => setTempMaxPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent bg-white text-gray-900"
            />
          </div>
        </div>

        {/* Botón Buscar */}
        <button
          onClick={handleSearch}
          className="w-full bg-gradient-to-r from-[#0f172a] to-[#334155] hover:from-[#334155] hover:to-[#0f172a] text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 mb-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Buscar
        </button>

        {/* Botón Limpiar filtros */}
        <button
          onClick={handleReset}
          className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Limpiar filtros
        </button>
      </div>
    </aside>
  );
}
