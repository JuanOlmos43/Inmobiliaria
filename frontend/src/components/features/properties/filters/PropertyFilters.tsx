import { useState, useEffect } from "react";
import { FormSelect, FormInput, Icon, Button } from "@/components/ui";
import { scrollToTop } from "@/components/ui/navigation/ScrollToTop";
import { useLocationLogic } from "@/hooks/useLocationLogic";
import type { PropertyFilters } from "@/types/property";
import type { Provincia, Localidad } from "@/types/location";

interface PropertyFiltersProps {
  initialFilters?: Partial<PropertyFilters>;
  onSearch: (filters: PropertyFilters) => void;
  onReset: () => void;
}

export default function PropertyFilters({
  initialFilters = {},
  onSearch,
  onReset,
}: PropertyFiltersProps) {
  // Estados temporales para los inputs (strings para los form inputs)
  const [tempOperationType, setTempOperationType] = useState<
    "venta" | "alquiler"
  >(initialFilters.operationType || "alquiler");
  const [tempPropertyType, setTempPropertyType] = useState(
    initialFilters.propertyType || ""
  );
  const [tempProvince, setTempProvince] = useState(
    initialFilters.province || ""
  );
  const [tempCity, setTempCity] = useState(initialFilters.city || "");
  const [tempBedrooms, setTempBedrooms] = useState(
    initialFilters.minBedrooms?.toString() || ""
  );
  const [tempBathrooms, setTempBathrooms] = useState(
    initialFilters.minBathrooms?.toString() || ""
  );
  const [tempMinPrice, setTempMinPrice] = useState(
    initialFilters.minPrice?.toString() || ""
  );
  const [tempMaxPrice, setTempMaxPrice] = useState(
    initialFilters.maxPrice?.toString() || ""
  );

  // Estados para manejo de lógica de ubicaciones (IDs necesarios para la API)
  const [selectedProvinciaId, setSelectedProvinciaId] = useState<string>("");

  // Hook personalizado para cargar datos de ubicación
  const { provincias, localidades, isLoadingLocalidades } =
    useLocationLogic(selectedProvinciaId);

  // Sincronizar ID de provincia cuando cargan las provincias o cambia el filtro de nombre
  useEffect(() => {
    // Si tenemos un nombre de provincia seleccionado pero no su ID correspondiente
    if (tempProvince && provincias.length > 0) {
      const provinciaEncontrada = provincias.find(
        (p) => p.nombre.toLowerCase() === tempProvince.toLowerCase()
      );

      // Solo actualizamos si encontramos la provincia y el ID es diferente
      if (
        provinciaEncontrada &&
        provinciaEncontrada.id !== selectedProvinciaId
      ) {
        setSelectedProvinciaId(provinciaEncontrada.id);
      }
    } else if (!tempProvince && selectedProvinciaId) {
      // Si se limpió el nombre de la provincia, limpiamos el ID
      setSelectedProvinciaId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tempProvince,
    provincias /* selectedProvinciaId excluido intencionalmente para evitar ciclos */,
  ]);

  // Actualizar estados cuando cambien los filtros iniciales
  useEffect(() => {
    if (
      initialFilters.operationType !== undefined &&
      initialFilters.operationType !== tempOperationType
    )
      setTempOperationType(initialFilters.operationType);
    if (
      initialFilters.propertyType !== undefined &&
      initialFilters.propertyType !== tempPropertyType
    )
      setTempPropertyType(initialFilters.propertyType);
    if (
      initialFilters.province !== undefined &&
      initialFilters.province !== tempProvince
    )
      setTempProvince(initialFilters.province);
    if (initialFilters.city !== undefined && initialFilters.city !== tempCity)
      setTempCity(initialFilters.city);
    if (
      initialFilters.minBedrooms !== undefined &&
      initialFilters.minBedrooms > 0
    ) {
      // Si viene minBedrooms, asumimos que es un rango (ej: 5+)
      setTempBedrooms(`${initialFilters.minBedrooms}+`);
    } else if (initialFilters.bedrooms !== undefined) {
      // Si viene bedrooms, es exacto
      setTempBedrooms(initialFilters.bedrooms.toString());
    } else {
      setTempBedrooms("");
    }

    if (
      initialFilters.minBathrooms !== undefined &&
      initialFilters.minBathrooms > 0
    ) {
      setTempBathrooms(`${initialFilters.minBathrooms}+`);
    } else if (initialFilters.bathrooms !== undefined) {
      setTempBathrooms(initialFilters.bathrooms.toString());
    } else {
      setTempBathrooms("");
    }

    if (
      initialFilters.minPrice !== undefined &&
      initialFilters.minPrice.toString() !== tempMinPrice
    )
      setTempMinPrice(initialFilters.minPrice.toString());
    if (
      initialFilters.maxPrice !== undefined &&
      initialFilters.maxPrice.toString() !== tempMaxPrice
    )
      setTempMaxPrice(initialFilters.maxPrice.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters]);

  const handleSearch = () => {
    // Definir objetos base
    const filters: PropertyFilters = {
      operationType: tempOperationType,
      listingType: tempOperationType,
      propertyType: tempPropertyType || undefined,
      province: tempProvince || undefined,
      city: tempCity || undefined,
      minPrice: tempMinPrice ? parseFloat(tempMinPrice) : undefined,
      maxPrice: tempMaxPrice ? parseFloat(tempMaxPrice) : undefined,
    };

    // Lógica para Dormitorios
    if (tempBedrooms) {
      if (tempBedrooms.endsWith("+")) {
        filters.minBedrooms = parseInt(tempBedrooms.replace("+", ""));
        filters.bedrooms = undefined;
      } else {
        filters.bedrooms = parseInt(tempBedrooms);
        filters.minBedrooms = undefined;
      }
    } else {
      filters.bedrooms = undefined;
      filters.minBedrooms = undefined;
    }

    // Lógica para Baños
    if (tempBathrooms) {
      if (tempBathrooms.endsWith("+")) {
        filters.minBathrooms = parseInt(tempBathrooms.replace("+", ""));
        filters.bathrooms = undefined;
      } else {
        filters.bathrooms = parseInt(tempBathrooms);
        filters.minBathrooms = undefined;
      }
    } else {
      filters.bathrooms = undefined;
      filters.minBathrooms = undefined;
    }

    onSearch(filters);
    scrollToTop();
  };

  const handleReset = () => {
    setTempOperationType("alquiler");
    setTempPropertyType("");
    setTempProvince("");
    setTempCity("");
    setTempBedrooms("");
    setTempBathrooms("");
    setTempMinPrice("");
    setTempMaxPrice("");
    onReset();
    scrollToTop();
  };

  return (
    <aside className="shrink-0 lg:w-64">
      <div className="sticky top-20 rounded-2xl border-l-4 border-(--accent) bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-xl font-bold text-(--primary)">Filtros</h2>

        {/* Tipo de operación - Tabs */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Tipo de operación
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTempOperationType("alquiler")}
              className={`flex-1 rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
                tempOperationType === "alquiler"
                  ? "bg-(--accent) text-white shadow-md"
                  : "bg-gray-300 text-gray-700 hover:bg-(--accent) hover:text-white"
              }`}
            >
              Alquiler
            </button>
            <button
              type="button"
              onClick={() => setTempOperationType("venta")}
              className={`flex-1 rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
                tempOperationType === "venta"
                  ? "bg-(--primary) text-white shadow-md"
                  : "bg-gray-300 text-gray-700 hover:bg-(--primary) hover:text-white"
              }`}
            >
              Venta
            </button>
          </div>
        </div>

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

        {/* Provincia */}
        <FormSelect
          label="Provincia"
          value={tempProvince}
          onChange={(e) => {
            const nombre = e.target.value;
            setTempProvince(nombre);
            // Buscar ID para cargar localidades
            const prov = provincias.find((p) => p.nombre === nombre);
            setSelectedProvinciaId(prov?.id || "");
            // Limpiar localidad al cambiar provincia
            setTempCity("");
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
          value={tempCity}
          onChange={(e) => setTempCity(e.target.value)}
          disabled={!tempProvince || isLoadingLocalidades}
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
          value={tempBedrooms}
          onChange={(e) => setTempBedrooms(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="0">0 (Monoambiente)</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4+">4 o más</option>
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
          <option value="3+">3 o más</option>
        </FormSelect>

        {/* Precio */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Precio{" "}
            {tempOperationType === "alquiler"
              ? "(ARS)"
              : tempOperationType === "venta"
                ? "(USD)"
                : ""}
          </label>
          <div className="space-y-2">
            <FormInput
              label=""
              type="number"
              placeholder="Mín"
              value={tempMinPrice}
              onChange={(e) => setTempMinPrice(e.target.value)}
              max="999999999"
            />
            <FormInput
              label=""
              type="number"
              placeholder="Máx"
              value={tempMaxPrice}
              onChange={(e) => setTempMaxPrice(e.target.value)}
              max="999999999"
            />
          </div>
        </div>

        {/* Botón Buscar */}
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          icon={<Icon name="search" className="h-5 w-5" />}
          onClick={handleSearch}
          className="mb-3 font-bold"
        >
          Buscar
        </Button>

        {/* Botón Limpiar filtros */}
        <Button
          variant="outline"
          size="sm"
          fullWidth
          icon={<Icon name="close" className="h-5 w-5" />}
          onClick={handleReset}
          className="font-bold"
        >
          Limpiar filtros
        </Button>
      </div>
    </aside>
  );
}
