import { useState, useEffect } from "react";
import { FormSelect, FormInput, Icon } from "@/components/ui";
import type { PropertyFilters } from "@/types/property";

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
    initialFilters.propertyType || "",
  );
  const [tempProvince, setTempProvince] = useState(
    initialFilters.province || "",
  );
  const [tempCity, setTempCity] = useState(initialFilters.city || "");
  const [tempBedrooms, setTempBedrooms] = useState(
    initialFilters.minBedrooms?.toString() || "",
  );
  const [tempBathrooms, setTempBathrooms] = useState(
    initialFilters.minBathrooms?.toString() || "",
  );
  const [tempMinPrice, setTempMinPrice] = useState(
    initialFilters.minPrice?.toString() || "",
  );
  const [tempMaxPrice, setTempMaxPrice] = useState(
    initialFilters.maxPrice?.toString() || "",
  );

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
      initialFilters.minBedrooms.toString() !== tempBedrooms
    )
      setTempBedrooms(initialFilters.minBedrooms.toString());
    if (
      initialFilters.minBathrooms !== undefined &&
      initialFilters.minBathrooms.toString() !== tempBathrooms
    )
      setTempBathrooms(initialFilters.minBathrooms.toString());
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
  }, [initialFilters]);

  const handleSearch = () => {
    // Convertir strings a números donde sea necesario
    const filters: PropertyFilters = {
      operationType: tempOperationType,
      listingType: tempOperationType,
      propertyType: tempPropertyType || undefined,
      province: tempProvince || undefined,
      city: tempCity || undefined,
      minBedrooms: tempBedrooms ? parseInt(tempBedrooms) : undefined,
      minBathrooms: tempBathrooms ? parseInt(tempBathrooms) : undefined,
      minPrice: tempMinPrice ? parseFloat(tempMinPrice) : undefined,
      maxPrice: tempMaxPrice ? parseFloat(tempMaxPrice) : undefined,
    };

    onSearch(filters);
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
  };

  return (
    <aside className="lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20 border-l-4 border-(--accent)">
        <h2 className="text-xl font-bold text-(--primary) mb-6">Filtros</h2>

        {/* Tipo de operación - Tabs */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de operación
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTempOperationType("alquiler")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                tempOperationType === "alquiler"
                  ? "bg-(--accent) text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Alquiler
            </button>
            <button
              type="button"
              onClick={() => setTempOperationType("venta")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                tempOperationType === "venta"
                  ? "bg-(--primary) text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
        <FormInput
          label="Provincia"
          type="text"
          placeholder="Ej: Entre Ríos"
          value={tempProvince}
          onChange={(e) => setTempProvince(e.target.value)}
          maxLength={100}
        />

        {/* Localidad */}
        <FormInput
          label="Localidad"
          type="text"
          placeholder="Ej: Oro Verde"
          value={tempCity}
          onChange={(e) => setTempCity(e.target.value)}
          maxLength={100}
        />

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
        <button
          onClick={handleSearch}
          className="w-full bg-(--primary) hover:bg-(--primary-light) text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 mb-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <Icon name="search" className="w-5 h-5" />
          Buscar
        </button>

        {/* Botón Limpiar filtros */}
        <button
          onClick={handleReset}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <Icon name="close" className="w-5 h-5" />
          Limpiar filtros
        </button>
      </div>
    </aside>
  );
}

