# Agent Hooks - Arquitectura de Dashboard

Esta carpeta contiene los hooks especializados para el dashboard de agente, siguiendo el patrón de **Separación de Responsabilidades** y **Arquitectura en Capas**.

## 📁 Estructura

```
agent/
├── useAgentFilters.ts    → Maneja filtros, búsqueda y tabs
├── useAgentUI.ts         → Maneja modales y toasts
├── useAgentQueries.ts    → Maneja fetching de propiedades
└── useAgentMutations.ts  → Maneja operaciones CRUD
```

## 🎯 Patrón de Uso

Estos hooks se combinan en el **hook orquestador** `useAgentProperties.ts` (ubicado en `/hooks`), que expone una API unificada para el componente de página.

```typescript
// En agente/page.tsx
import { useAgentProperties } from "@/hooks/useAgentProperties";

export default function AgentDashboardPage() {
  const {
    properties,
    isLoading,
    handleAddProperty,
    handleEditProperty,
    // ... más exports
  } = useAgentProperties();

  // Solo JSX aquí, sin lógica de negocio
}
```

## 📚 Responsabilidades de Cada Hook

### 🔍 useAgentFilters

**Propósito:** Maneja el estado local de filtros y navegación.

**Estados:**

- `searchTerm: string` - Término de búsqueda
- `filterStatus: "all" | "activa" | "pausada"` - Filtro por status
- `activeTab: "vencimientos" | "propiedades"` - Tab activo

**Características:**

- ✅ Debouncing automático (500ms) para búsqueda
- ✅ Memoización de filtros activos
- ✅ Optimización de re-renders

**Exports:**

```typescript
{
  (searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    activeTab,
    setActiveTab,
    debouncedSearch,
    activeFilters); // Objeto memoizado para queries
}
```

---

### 🎨 useAgentUI

**Propósito:** Centraliza el manejo de estados visuales (modales, toasts).

**Estados:**

- `isModalOpen: boolean` - Estado del modal de propiedades
- `editingProperty: Property | null` - Propiedad en edición
- `isRentalModalOpen: boolean` - Estado del modal de alquiler
- `rentingProperty: Property | null` - Propiedad para alquilar
- `toast: { isVisible, message, type }` - Estado de notificaciones

**Funciones Helper:**

```typescript
// Modales de Propiedades
openCreatePropertyModal(); // Abre modal en modo creación
openEditPropertyModal(property); // Abre modal en modo edición
closePropertyModal(); // Cierra modal y limpia estado

// Modales de Alquiler
openRentalModal(property); // Abre modal de alquiler
closeRentalModal(); // Cierra modal y limpia estado

// Toasts
showToast(message, type); // Muestra notificación
hideToast(); // Oculta notificación
```

**Características:**

- ✅ Funciones memoizadas con `useCallback`
- ✅ Limpieza automática de estados
- ✅ Sin lógica de negocio

---

### 📡 useAgentQueries

**Propósito:** Maneja la obtención de datos del servidor.

**Parámetros:**

```typescript
filters?: {
  search?: string;
  status?: "activa" | "pausada";
}
```

**Características:**

- ✅ Usa TanStack Query para caching
- ✅ Re-ejecuta automáticamente cuando cambian los filtros
- ✅ **SIN transformaciones** (Property coincide con backend)
- ✅ Manejo de estados de carga y error

**Exports:**

```typescript
{
  properties: Property[],  // Lista de propiedades
  isLoading: boolean,      // Estado de carga
  error: string | null,    // Mensaje de error
  refetch: () => void      // Función para refrescar datos
}
```

**Transformaciones Eliminadas:**
Anteriormente se transformaba `listingType` → `type` y `mainImage` → `image`.
Ahora el tipo `Property` coincide directamente con el backend, eliminando mapeos innecesarios.

---

### ✏️ useAgentMutations

**Propósito:** Centraliza todas las operaciones de modificación de datos.

**Parámetros:**

```typescript
{
  showToast: (message, type) => void,  // Callback para feedback
  onPropertySaved?: () => void,         // Callback post-guardado
  onRentalSaved?: () => void            // Callback post-alquiler
}
```

**Funciones Principales:**

#### 1. `handleSaveProperty(propertyData, files, editingProperty)`

- Crea o actualiza una propiedad
- Sube imágenes a Supabase
- Invalida queries de TanStack Query
- Maneja errores con feedback al usuario

#### 2. `handleDeleteProperty(id)`

- Elimina una propiedad con confirmación
- Invalida queries automáticamente
- Muestra toast de éxito/error

#### 3. `handleToggleStatus(id, currentStatus)`

- Cambia status entre "activa" ↔ "pausada"
- Actualiza en backend
- Retorna nuevo status

#### 4. `handleCreateRental(property, rentalData)`

- Crea contrato de alquiler
- Pausa la propiedad automáticamente
- Guarda en localStorage (temporal, pendiente API)

**Características:**

- ✅ Try/catch en todas las operaciones
- ✅ Mensajes de error específicos
- ✅ Invalidación automática de cache
- ✅ Callbacks para acciones post-mutación

---

## 🎭 Hook Orquestador: useAgentProperties

**Ubicación:** `/hooks/useAgentProperties.ts`

**Propósito:** Combina los 4 hooks especializados y expone una API limpia.

**Arquitectura:**

```typescript
useAgentProperties()
    ├── useAgentFilters()    // Capa 1: Filtros
    ├── useAgentUI()         // Capa 2: UI
    ├── useAgentQueries()    // Capa 3: Datos
    └── useAgentMutations()  // Capa 4: Acciones
```

**API Pública:**

```typescript
{
  // Datos
  properties,
  isLoading,
  error,

  // Filtros
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  activeTab,
  setActiveTab,

  // UI State
  isModalOpen,
  editingProperty,
  isRentalModalOpen,
  rentingProperty,
  toast,
  hideToast,

  // Acciones
  handleAddProperty,
  handleEditProperty,
  handleDeleteProperty,
  handleSave,
  handleToggleStatus,
  handleRentProperty,
  handleSaveRental,
  closePropertyModal,
  closeRentalModal,
  refetch,
}
```

---

## ✅ Beneficios de Esta Arquitectura

### 1. **Separación de Responsabilidades**

- Cada hook tiene una única responsabilidad clara
- Fácil de entender y mantener
- Cambios aislados sin efectos secundarios

### 2. **Reutilización**

- Los hooks pueden usarse independientemente
- Fácil de testear cada capa por separado
- Código DRY (Don't Repeat Yourself)

### 3. **Escalabilidad**

- Agregar nuevas funcionalidades es simple
- Estructura clara para nuevos desarrolladores
- Patrón replicable en otros dashboards

### 4. **Performance**

- Memoización donde es necesario
- Debouncing automático
- Cache inteligente con TanStack Query

### 5. **Mantenibilidad**

- Bugs fáciles de localizar
- Refactoring seguro
- Documentación auto-explicativa

---

## 🔄 Comparación: Antes vs Después

### **Antes:**

```typescript
// agente/page.tsx - 351 líneas
export default function DashboardPage() {
  // 8 estados locales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  // ... 6 estados más

  // Lógica de queries mezclada
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      // Transformaciones inline
      response.data = response.data.map(p => ({
        ...p,
        type: p.listingType === "venta" ? "Venta" : "Alquiler"
      }));
    }
  });

  // Handlers largos y complejos (200+ líneas)
  const handleSaveProperty = async (...) => {
    // Lógica de negocio mezclada con UI
  };

  // JSX mezclado con lógica
  return (/* 150 líneas de JSX */);
}
```

### **Después:**

```typescript
// agente/page.tsx - 180 líneas
export default function AgentDashboardPage() {
  // Un solo hook orquestador
  const {
    properties,
    handleAddProperty,
    handleEditProperty,
    // ... todo lo necesario
  } = useAgentProperties();

  // Solo JSX, sin lógica de negocio
  return (/* 150 líneas de JSX limpio */);
}
```

---

## 📊 Métricas

| Métrica            | Antes | Después | Mejora |
| ------------------ | ----- | ------- | ------ |
| Líneas en page.tsx | 351   | 180     | -49%   |
| Estados locales    | 8     | 0       | -100%  |
| Handlers en page   | 7     | 0       | -100%  |
| Archivos de hooks  | 0     | 5       | +5     |
| Testabilidad       | Baja  | Alta    | ✅     |
| Mantenibilidad     | Media | Alta    | ✅     |

---

## 🧪 Testing

Cada hook puede testearse independientemente:

```typescript
// Ejemplo: test de useAgentFilters
import { renderHook, act } from "@testing-library/react";
import { useAgentFilters } from "./useAgentFilters";

test("debounce funciona correctamente", async () => {
  const { result } = renderHook(() => useAgentFilters());

  act(() => {
    result.current.setSearchTerm("casa");
  });

  // Verificar que debouncedSearch se actualiza después de 500ms
  await waitFor(
    () => {
      expect(result.current.debouncedSearch).toBe("casa");
    },
    { timeout: 600 },
  );
});
```

---

## 🚀 Próximos Pasos

1. **Agregar tests unitarios** para cada hook
2. **Implementar API de contratos** (reemplazar localStorage)
3. **Agregar más filtros** (por tipo de propiedad, rango de precio)
4. **Optimizar queries** con pagination
5. **Agregar analytics** para tracking de acciones

---

## 📖 Referencias

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Hooks Best Practices](https://react.dev/reference/react)
- [Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)

---

**Última actualización:** 2026-02-03  
**Autor:** Refactorización completa del dashboard de agente  
**Patrón:** Inspirado en `admin/page.tsx`
