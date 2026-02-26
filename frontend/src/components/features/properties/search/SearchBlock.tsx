"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormSelect, Icon, Button } from "@/components/ui";
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
        (p) => p.nombre.toLowerCase() === province.toLowerCase()
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
        activeTab === "alquilar" ? "alquiler" : "venta"
      );
    if (propertyType) params.append("propertyType", propertyType);
    if (province) params.append("province", province);
    if (city) params.append("city", city);

    // Lógica para Dormitorios (Exacto vs Rango)
    if (bedrooms) {
      if (bedrooms.endsWith("+")) {
        // Es un rango (ej: "5+")
        params.append("minBedrooms", bedrooms.replace("+", ""));
      } else {
        // Es exacto
        params.append("bedrooms", bedrooms);
      }
    }

    // Lógica para Baños (Exacto vs Rango)
    if (bathrooms) {
      if (bathrooms.endsWith("+")) {
        // Es un rango (ej: "4+")
        params.append("minBathrooms", bathrooms.replace("+", ""));
      } else {
        // Es exacto
        params.append("bathrooms", bathrooms);
      }
    }

    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    router.push(`/propiedades?${params.toString()}`);
  };

  return (
    <section className="relative bg-linear-to-b from-(--primary-light) via-(--primary) to-(--primary) pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="animate-fade-in mb-10 text-center text-4xl font-bold text-white md:text-5xl">
          Encuentra tu hogar ideal con nosotros
        </h2>

        {/* Search Container */}
        <div className="animate-scale-in overflow-hidden rounded-2xl border border-white/20 bg-white/98 shadow-2xl backdrop-blur-md">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("alquilar")}
              className={`flex-1 px-6 py-5 text-center font-bold transition-all duration-300 ${
                activeTab === "alquilar"
                  ? "bg-(--accent) text-white shadow-lg"
                  : "bg-gray-50 text-gray-700 hover:bg-(--accent) hover:text-white"
              }`}
            >
              Alquilar
            </button>
            <button
              onClick={() => setActiveTab("venta")}
              className={`flex-1 px-6 py-5 text-center font-bold transition-all duration-300 ${
                activeTab === "venta"
                  ? "bg-(--primary) text-white shadow-lg"
                  : "bg-gray-50 text-gray-700 hover:bg-(--primary) hover:text-white"
              }`}
            >
              Venta
            </button>
          </div>

          {/* Search Form */}
          <div className="p-8 md:p-10">
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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

              {/* Dormitorios - Exactos */}
              <FormSelect
                label="Dormitorios"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="0">0 (Monoambiente)</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4+">4 o más</option>
              </FormSelect>

              {/* Baños - Exactos hasta 2, luego 3+ */}
              <FormSelect
                label="Baños"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3+">3 o más</option>
              </FormSelect>

              {/* Precio */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Precio {activeTab === "alquilar" ? "(ARS)" : "(USD)"}
                </label>
                <div className="flex gap-2">
                  <input
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-(--accent) focus:outline-none"
                    type="number"
                    placeholder="Mín"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    min="0"
                    max="999999999"
                  />
                  <input
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-(--accent) focus:outline-none"
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
                    <p className="mt-1 text-sm text-(--danger)">
                      El precio mínimo no puede ser mayor al máximo
                    </p>
                  )}
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <Button
                variant="secondary"
                size="lg"
                icon={<Icon name="search" className="h-5 w-5" />}
                onClick={handleSearch}
                className="px-16 py-4 font-bold"
              >
                Realizar búsqueda
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
