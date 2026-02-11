"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormSelect, Icon } from "@/components/ui";
import { useLocationLogic } from "@/hooks/useLocationLogic";
import type { Provincia, Localidad } from "@/types/location";

export default function SearchBlock() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"alquilar" | "venta">("alquilar");
  const [propertyType, setPropertyType] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [selectedProvinciaId, setSelectedProvinciaId] = useState<string>("");

  // Hook personalizado para cargar datos de ubicación
  const { provincias, localidades, isLoadingLocalidades } =
    useLocationLogic(selectedProvinciaId);

  // Sincronizar ID de provincia cuando cargan las provincias o cambia el filtro de nombre
  useEffect(() => {
    // Si tenemos un nombre de provincia seleccionado pero no su ID correspondiente
    if (province && provincias.length > 0) {
      const provinciaEncontrada = provincias.find(
        (p) => p.nombre.toLowerCase() === province.toLowerCase(),
      );

      // Solo actualizamos si encontramos la provincia y el ID es diferente
      if (
        provinciaEncontrada &&
        provinciaEncontrada.id !== selectedProvinciaId
      ) {
        setSelectedProvinciaId(provinciaEncontrada.id);
      }
    } else if (!province && selectedProvinciaId) {
      // Si se limpió el nombre de la provincia, limpiamos el ID
      setSelectedProvinciaId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    province,
    provincias /* selectedProvinciaId excluido intencionalmente para evitar ciclos */,
  ]);
  const [bedrooms, setBedrooms] = useState<string>("");
  const [bathrooms, setBathrooms] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || parseFloat(value) >= 0) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || parseFloat(value) >= 0) {
      setMaxPrice(value);
    }
  };

  const handleSearch = () => {
    // Construir query params con los filtros seleccionados
    const params = new URLSearchParams();

    if (activeTab)
      params.append(
        "operationType",
        activeTab === "alquilar" ? "alquiler" : "venta",
      );
    if (propertyType) params.append("propertyType", propertyType);
    if (province) params.append("province", province);
    if (city) params.append("city", city);
    if (bedrooms) params.append("bedrooms", bedrooms);
    if (bathrooms) params.append("bathrooms", bathrooms);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    router.push(`/propiedades?${params.toString()}`);
  };

  return (
    <section className="relative bg-linear-to-b from-(--primary-light) via-(--primary) to-(--primary) pt-16">
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
              onClick={() => setActiveTab("alquilar")}
              className={`flex-1 py-5 px-6 text-center font-bold transition-all duration-300 ${
                activeTab === "alquilar"
                  ? "bg-(--accent) text-white shadow-lg"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Alquilar
            </button>
            <button
              onClick={() => setActiveTab("venta")}
              className={`flex-1 py-5 px-6 text-center font-bold transition-all duration-300 ${
                activeTab === "venta"
                  ? "bg-(--primary) text-white shadow-lg"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Venta
            </button>
          </div>

          {/* Search Form */}
          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Tipo de Inmueble */}
              <FormSelect
                label="Tipo de inmueble"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="duplex">Duplex</option>
                <option value="monoambiente">Monoambiente</option>
              </FormSelect>

              {/* Provincia */}
              <FormSelect
                label="Provincia"
                value={province}
                onChange={(e) => {
                  const nombre = e.target.value;
                  setProvince(nombre);
                  // Buscar ID para cargar localidades
                  const prov = provincias.find((p) => p.nombre === nombre);
                  setSelectedProvinciaId(prov?.id || "");
                  // Limpiar localidad al cambiar provincia
                  setCity("");
                }}
              >
                <option value="">Todas</option>
                {provincias.map((prov: Provincia) => (
                  <option key={prov.id} value={prov.nombre}>
                    {prov.nombre}
                  </option>
                ))}
              </FormSelect>

              {/* Localidad */}
              <FormSelect
                label="Localidad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!province || isLoadingLocalidades}
              >
                <option value="">Todas</option>
                {localidades.map((loc: Localidad) => (
                  <option key={loc.id} value={loc.nombre}>
                    {loc.nombre}
                  </option>
                ))}
              </FormSelect>

              {/* Dormitorios */}
              <FormSelect
                label="Dormitorios"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
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
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </FormSelect>

              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio {activeTab === "alquilar" ? "(ARS)" : "(USD)"}
                </label>
                <div className="flex gap-2">
                  <input
                    className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent"
                    type="number"
                    placeholder="Mín"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    min="0"
                    max="999999999"
                  />
                  <input
                    className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent"
                    type="number"
                    placeholder="Máx"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    min="0"
                    max="999999999"
                  />
                </div>
                {minPrice &&
                  maxPrice &&
                  parseFloat(minPrice) > parseFloat(maxPrice) && (
                    <p className="text-(--danger) text-sm mt-1">
                      El precio mínimo no puede ser mayor al máximo
                    </p>
                  )}
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSearch}
                className="bg-(--primary) hover:bg-(--primary-light) text-white font-bold px-16 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Icon name="search" className="w-5 h-5" />
                Realizar búsqueda
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
