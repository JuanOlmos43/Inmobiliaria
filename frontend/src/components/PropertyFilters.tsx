'use client';

import { useState, useEffect } from 'react';
import FormSelect from '@/components/UI/FormSelect';
import FormInput from '@/components/UI/FormInput';

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
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20 border-l-4 border-teal-500">
        <h2 className="text-xl font-bold text-[#0f172a] mb-6">Filtros</h2>

        {/* Tipo de operación */}
        <FormSelect
          label="Tipo de operación"
          value={tempOperationType}
          onChange={(e) => setTempOperationType(e.target.value as 'todos' | 'venta' | 'alquiler')}
        >
          <option value="todos">Todos</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </FormSelect>

        {/* Tipo de inmueble */}
        <FormSelect
          label="Tipo de inmueble"
          value={tempPropertyType}
          onChange={(e) => setTempPropertyType(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="casa">Casa</option>
          <option value="departamento">Departamento</option>
          <option value="duplex">Duplex</option>
          <option value="terreno">Terreno</option>
          <option value="monoambiente">Monoambiente</option>
        </FormSelect>

        {/* Dormitorios */}
        <FormSelect
          label="Dormitorios"
          value={tempBedrooms}
          onChange={(e) => setTempBedrooms(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </FormSelect>

        {/* Baños */}
        <FormSelect
          label="Baños"
          value={tempBathrooms}
          onChange={(e) => setTempBathrooms(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </FormSelect>

        {/* Precio */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio {appliedOperationType === 'alquiler' ? '(ARS)' : appliedOperationType === 'venta' ? '(USD)' : ''}
          </label>
          <div className="space-y-2">
            <FormInput
              label=""
              type="number"
              placeholder="Mín"
              value={tempMinPrice}
              onChange={(e) => setTempMinPrice(e.target.value)}
            />
            <FormInput
              label=""
              type="number"
              placeholder="Máx"
              value={tempMaxPrice}
              onChange={(e) => setTempMaxPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Botón Buscar */}
        <button
          onClick={handleSearch}
          className="w-full bg-[#0f172a] hover:bg-[#334155] text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 mb-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Buscar
        </button>

        {/* Botón Limpiar filtros */}
        <button
          onClick={handleReset}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
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
