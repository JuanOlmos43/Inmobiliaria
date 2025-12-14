'use client';

import { useState } from 'react';

export default function SearchBlock() {
  const [activeTab, setActiveTab] = useState<'alquilar' | 'venta'>('alquilar');
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

  return (
    <section className="relative bg-gradient-to-r from-[#0A2647] to-[#061829] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-8 text-center">
          Encuentra tu hogar ideal con nosotros
        </h2>

        {/* Search Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('alquilar')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'alquilar'
                  ? 'bg-[#C69B56] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alquilar
            </button>
            <button
              onClick={() => setActiveTab('venta')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'venta'
                  ? 'bg-[#C69B56] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Venta
            </button>
          </div>

          {/* Search Form */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Tipo de Inmueble */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de inmueble
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C69B56] focus:border-transparent">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C69B56] focus:border-transparent"
                />
              </div>

              {/* Dormitorios */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dormitorios
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C69B56] focus:border-transparent">
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
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C69B56] focus:border-transparent">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C69B56] focus:border-transparent"
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
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C69B56] focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    min="0"
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C69B56] focus:border-transparent"
                  />
                </div>
                {minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice) && (
                  <p className="text-red-600 text-sm mt-1">El precio mínimo no puede ser mayor al máximo</p>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <button className="bg-[#C69B56] hover:bg-[#B38A45] text-white font-semibold px-12 py-3 rounded-lg transition-colors shadow-lg">
                Realizar búsqueda
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
