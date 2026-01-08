'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBlock() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'alquilar' | 'venta'>('alquilar');
  const [propertyType, setPropertyType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('');
  const [bathrooms, setBathrooms] = useState<string>('');
  const [neighborhood, setNeighborhood] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      setMaxPrice(value);
    }
  };

  const handleSearch = () => {
    // Construir query params con los filtros seleccionados
    const params = new URLSearchParams();
    
    if (activeTab) params.append('operationType', activeTab === 'alquilar' ? 'alquiler' : 'venta');
    if (propertyType) params.append('propertyType', propertyType);
    if (location) params.append('location', location);
    if (bedrooms) params.append('bedrooms', bedrooms);
    if (bathrooms) params.append('bathrooms', bathrooms);
    if (neighborhood) params.append('neighborhood', neighborhood);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);

    router.push(`/propiedades?${params.toString()}`);
  };

  return (
    <section className="relative bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#0f172a] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-white text-4xl md:text-5xl font-bold mb-10 text-center animate-fade-in">
          Encuentra tu hogar ideal con nosotros
        </h2>

        {/* Search Container */}
        <div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20 animate-scale-in">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('alquilar')}
              className={`flex-1 py-5 px-6 text-center font-bold transition-all duration-300 ${
                activeTab === 'alquilar'
                  ? 'bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white shadow-lg'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Alquilar
            </button>
            <button
              onClick={() => setActiveTab('venta')}
              className={`flex-1 py-5 px-6 text-center font-bold transition-all duration-300 ${
                activeTab === 'venta'
                  ? 'bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white shadow-lg'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Venta
            </button>
          </div>

          {/* Search Form */}
          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Tipo de Inmueble */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de inmueble
                </label>
                <select 
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent bg-white text-gray-900 [color-scheme:light]"
                >
                  <option value="">Todos</option>
                  <option value="casa">Casa</option>
                  <option value="departamento">Departamento</option>
                  <option value="duplex">Duplex</option>
                  <option value="monoambiente">Monoambiente</option>
                </select>
              </div>

              {/* Localidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localidad
                </label>
                <input
                  type="text"
                  placeholder="Ej: Buenos Aires"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent bg-white text-gray-900 placeholder-gray-500 [color-scheme:light]"
                />
              </div>

              {/* Dormitorios */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dormitorios
                </label>
                <select 
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent bg-white text-gray-900 [color-scheme:light]"
                >
                  <option value="">Todos</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>

              {/* Baños */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Baños
                </label>
                <select 
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent bg-white text-gray-900 [color-scheme:light]"
                >
                  <option value="">Todos</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>

              {/* Barrio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barrio
                </label>
                <input
                  type="text"
                  placeholder="Ej: Palermo"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent bg-white text-gray-900 placeholder-gray-500 [color-scheme:light]"
                />
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    min="0"
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent bg-white text-gray-900 placeholder-gray-500 [color-scheme:light]"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    min="0"
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent bg-white text-gray-900 placeholder-gray-500 [color-scheme:light]"
                  />
                </div>
                {minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice) && (
                  <p className="text-red-600 text-sm mt-1">El precio mínimo no puede ser mayor al máximo</p>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-[#0f172a] to-[#334155] hover:from-[#334155] hover:to-[#0f172a] text-white font-bold px-16 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Realizar búsqueda
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
