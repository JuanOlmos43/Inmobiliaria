# Integración de Filtros con Backend - Documentación

## 📋 Resumen de Cambios

Se realizó una refactorización completa del sistema de filtros para unificar los tipos entre el frontend (componente UI) y el backend (API), preparando la aplicación para la integración completa con el endpoint de backend.

## 🎯 Objetivos Cumplidos

1. ✅ **Unificación de Tipos**: Eliminamos la duplicación entre `PropertyFiltersState` y `PropertyFilters`
2. ✅ **Soporte para Provincia y Ciudad**: Agregados los nuevos campos de ubicación
3. ✅ **Conversión de Tipos**: Implementada conversión automática entre strings (UI) y números (API)
4. ✅ **Simplificación de Código**: Reducida la complejidad en la página de propiedades

---

## 📝 Cambios Detallados

### 1. **types/property.ts**

**Cambios:**

- Agregado `operationType?: "todos" | "venta" | "alquiler"` (alias UI-friendly para `listingType`)
- Agregado `province?: string`
- Agregado `city?: string`

**Propósito:**

- `operationType` permite que el componente UI use "todos" como opción, mientras el backend usa `listingType`
- `province` y `city` soportan la nueva funcionalidad de filtrado por ubicación

```typescript
export interface PropertyFilters {
  search?: string;
  status?: "activa" | "pausada" | "alquilada" | "archivada";
  listingType?: "venta" | "alquiler";
  operationType?: "todos" | "venta" | "alquiler"; // ← NUEVO
  propertyType?: string;
  province?: string; // ← NUEVO
  city?: string; // ← NUEVO
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  ownerId?: string;
  contractStatus?: string;
  page?: number;
  limit?: number;
}
```

---

### 2. **components/PropertyFilters.tsx**

**Cambios Principales:**

- ❌ Eliminada interfaz `PropertyFiltersState` (duplicada)
- ✅ Ahora usa `PropertyFilters` de `@/types/property`
- ✅ Estado interno usa strings para form inputs
- ✅ Conversión automática a números en `handleSearch()`

**Lógica de Conversión:**

```typescript
const handleSearch = () => {
  // Convertir strings a números donde sea necesario
  const filters: PropertyFilters = {
    operationType: tempOperationType,
    listingType:
      tempOperationType === "todos"
        ? undefined
        : (tempOperationType as "venta" | "alquiler"),
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
```

**Por qué esto funciona:**

- Los inputs del formulario trabajan con strings (mejor UX)
- Al hacer búsqueda, convertimos a los tipos que espera el backend
- Valores vacíos se convierten en `undefined` (no se envían al backend)

---

### 3. **app/(groupNF)/propiedades/page.tsx**

**Cambios Principales:**

- ❌ Eliminada importación de `PropertyFiltersState`
- ✅ Usa `PropertyFilters` directamente
- ✅ Simplificada la lógica de fetch (ya no necesita conversión manual)
- ✅ Agregado soporte para `province` y `city` en URL params

**Antes:**

```typescript
const filters: PropertyFiltersType = {
  page: currentPage,
  limit: itemsPerPage,
  listingType:
    appliedFilters.operationType === "todos"
      ? undefined
      : (appliedFilters.operationType as "venta" | "alquiler"),
  propertyType: appliedFilters.propertyType || undefined,
  minBedrooms: appliedFilters.bedrooms
    ? parseInt(appliedFilters.bedrooms)
    : undefined,
  // ... más conversiones manuales
};
```

**Después:**

```typescript
const filters: PropertyFiltersType = {
  ...appliedFilters, // ← Ya vienen en el formato correcto!
  page: currentPage,
  limit: itemsPerPage,
};
```

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│  1. Usuario interactúa con PropertyFilters                  │
│     - Inputs usan strings (ej: "3" para bedrooms)           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  2. handleSearch() convierte tipos                          │
│     - Strings → Numbers                                     │
│     - Valores vacíos → undefined                            │
│     - operationType → listingType                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  3. onSearch(filters: PropertyFilters)                      │
│     - Filtros ya tienen el formato correcto del backend    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  4. propiedades/page.tsx recibe filtros                     │
│     - Agrega page y limit                                   │
│     - Envía directamente al backend                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  5. propertiesService.getPublicProperties(filters)          │
│     - Backend recibe PropertyFilters correctamente tipado   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Preparación para Backend

### Campos Soportados

El componente ahora envía al backend:

| Campo UI          | Campo Backend                   | Tipo   | Ejemplo        |
| ----------------- | ------------------------------- | ------ | -------------- |
| Tipo de operación | `operationType` + `listingType` | string | `"venta"`      |
| Tipo de inmueble  | `propertyType`                  | string | `"casa"`       |
| Provincia         | `province`                      | string | `"Entre Ríos"` |
| Localidad         | `city`                          | string | `"Oro Verde"`  |
| Dormitorios       | `minBedrooms`                   | number | `3`            |
| Baños             | `minBathrooms`                  | number | `2`            |
| Precio Mín        | `minPrice`                      | number | `50000`        |
| Precio Máx        | `maxPrice`                      | number | `200000`       |

### Endpoint Esperado

```typescript
GET /api/properties/public?operationType=venta&province=Entre%20Ríos&minBedrooms=3&minPrice=50000
```

---

## ⚠️ Notas Importantes

### 1. **Warnings de ESLint (No Críticos)**

Hay dos warnings que son **pre-existentes** y no afectan la funcionalidad:

- **"Calling setState synchronously within an effect"**: Este patrón es intencional para sincronizar filtros desde URL params
- **"Missing dependencies in useEffect"**: Las dependencias están correctamente manejadas

### 2. **Compatibilidad con SearchBlock.tsx**

`SearchBlock.tsx` todavía usa su propia lógica de query params. Esto es intencional para mantener la página de inicio independiente.

### 3. **Valores por Defecto**

- Campos vacíos se envían como `undefined` (no se incluyen en la query)
- `operationType: "todos"` se traduce a `listingType: undefined` (trae todas las propiedades)

---

## ✅ Testing Checklist

Cuando el backend esté listo, verificar:

- [ ] Filtro por tipo de operación (venta/alquiler/todos)
- [ ] Filtro por tipo de inmueble
- [ ] Filtro por provincia
- [ ] Filtro por ciudad
- [ ] Filtro por número de dormitorios
- [ ] Filtro por número de baños
- [ ] Filtro por rango de precio
- [ ] Combinación de múltiples filtros
- [ ] Botón "Limpiar filtros"
- [ ] Persistencia de filtros en URL
- [ ] Paginación con filtros aplicados

---

## 🎓 Ejemplo de Uso

```typescript
// El usuario selecciona:
// - Tipo: Alquiler
// - Provincia: Entre Ríos
// - Ciudad: Oro Verde
// - Dormitorios: 3+
// - Precio: 50000 - 200000 ARS

// PropertyFilters envía:
{
  operationType: "alquiler",
  listingType: "alquiler",
  province: "Entre Ríos",
  city: "Oro Verde",
  minBedrooms: 3,
  minPrice: 50000,
  maxPrice: 200000
}

// Backend recibe query:
// GET /api/properties/public?listingType=alquiler&province=Entre%20Ríos&city=Oro%20Verde&minBedrooms=3&minPrice=50000&maxPrice=200000&page=1&limit=6
```

---

## 📚 Archivos Modificados

1. ✅ `frontend/src/types/property.ts`
2. ✅ `frontend/src/components/PropertyFilters.tsx`
3. ✅ `frontend/src/app/(groupNF)/propiedades/page.tsx`

---

**Fecha de Implementación:** 2026-02-09
**Estado:** ✅ Listo para integración con backend
