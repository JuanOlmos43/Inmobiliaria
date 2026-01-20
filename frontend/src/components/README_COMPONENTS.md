# Componentes Reutilizables - InmoHogar

Este documento describe todos los componentes reutilizables creados para mejorar la mantenibilidad y consistencia del proyecto.

## 📋 Índice de Componentes

### **Componentes de UI Base**

1. [HeroSection](#herosection) - Sección hero/banner principal
2. [ContactInfoCard](#contactinfocard) - Tarjeta de información de contacto
3. [StatsCard](#statscard) - Tarjeta de estadística
4. [ValueCard](#valuecard) - Tarjeta de valor/principio
5. [EmptyState](#emptystate) - Estado vacío consistente ⭐ NUEVO

### **Componentes de Formulario**

6. [FormInput](#forminput) - Input de formulario
7. [FormTextarea](#formtextarea) - Textarea de formulario
8. [FormSelect](#formselect) - Select de formulario

### **Componentes de Navegación**

9. [Pagination](#pagination) - Paginación de listas ⭐ NUEVO

### **Componentes de Layout**

10. [Modal](#modal) - Ventana modal
11. [DashboardHeader](#dashboardheader) - Header de dashboards ⭐ NUEVO

### **Componentes Complejos**

12. [PropertyFilters](#propertyfilters) - Filtros de propiedades
13. [ScrollToTop](#scrolltotop) - Auto-scroll al cambiar de página

---

## 🎨 Componentes de UI Base

### HeroSection

Sección hero/banner principal con fondo degradado, efectos decorativos y texto destacado.

#### Props

```typescript
interface HeroSectionProps {
  title: string; // Título principal
  highlightedText?: string; // Parte del título con gradiente aqua
  subtitle: string; // Subtítulo descriptivo
}
```

#### Ejemplo de Uso

```tsx
<HeroSection
  title="Contáctanos"
  highlightedText="Contáctanos"
  subtitle="Estamos aquí para ayudarte a encontrar tu hogar ideal"
/>
```

#### Usado en

- `/contacto`
- `/nosotros`

---

### ContactInfoCard

Tarjeta blanca con borde de color para mostrar información de contacto con icono.

#### Props

```typescript
interface ContactInfoCardProps {
  icon: ReactNode; // Icono SVG o componente
  title: string; // Título (ej: "Dirección")
  content: ReactNode; // Contenido (puede incluir JSX para links, br, etc.)
}
```

#### Ejemplo de Uso

```tsx
<ContactInfoCard
  icon={
    <svg className="w-6 h-6 text-white" fill="currentColor">
      ...
    </svg>
  }
  title="Teléfono"
  content={
    <>
      <a href="tel:+541112345678">+54 11 1234-5678</a>
      <br />
      <a href="tel:+541187654321">+54 11 8765-4321</a>
    </>
  }
/>
```

#### Usado en

- `/contacto` (4 instancias)

---

### StatsCard

Tarjeta con gradiente de color para mostrar estadísticas/métricas.

#### Props

```typescript
interface StatsCardProps {
  title: string; // Etiqueta de la estadística
  value: string | number; // Valor numérico
  color: string; // Clases de gradiente Tailwind
  icon: string; // Nombre del icono (del componente Icon)
}
```

#### Ejemplo de Uso

```tsx
<StatsCard
  title="Total Usuarios"
  value={25}
  color="from-[#0f172a] to-[#334155]"
  icon="users"
/>
```

#### Usado en

- `/admin` (6 instancias)
- `/agente` (5 instancias)
- Otros dashboards

---

### ValueCard

Tarjeta con gradiente para mostrar valores/principios de la empresa.

#### Props

```typescript
interface ValueCardProps {
  icon: ReactNode; // Icono del valor
  title: string; // Título del valor
  description: string; // Descripción del valor
  color: "dark" | "aqua"; // Variante de color
}
```

#### Ejemplo de Uso

```tsx
<ValueCard
  icon={<Icon name="check" className="w-12 h-12" strokeWidth={2} />}
  title="Transparencia"
  description="Creemos en la honestidad total. Cada propiedad, cada precio, cada detalle es presentado con claridad absoluta."
  color="dark"
/>
```

#### Usado en

- `/nosotros` (3 instancias)

---

### EmptyState ⭐ NUEVO

Componente para mostrar estados vacíos de forma consistente en toda la aplicación.

#### Props

```typescript
interface EmptyStateProps {
  icon?: ReactNode; // Icono personalizado (opcional)
  title: string; // Título del estado vacío
  description: string; // Descripción del estado
  actionLabel?: string; // Texto del botón de acción (opcional)
  onAction?: () => void; // Handler del botón (opcional)
  actionIcon?: ReactNode; // Icono del botón (opcional)
}
```

#### Ejemplo de Uso

```tsx
// Estado vacío simple
<EmptyState
  title="No se encontraron propiedades"
  description="Intenta ajustar los filtros para ver más resultados"
/>

// Con acción
<EmptyState
  icon={<Icon name="building" className="w-16 h-16" />}
  title="No hay propiedades"
  description="Comienza agregando tu primera propiedad"
  actionLabel="Agregar Propiedad"
  onAction={handleAddProperty}
  actionIcon={<Icon name="plus" className="w-5 h-5" />}
/>
```

#### Usado en

- `/propiedades` (sin resultados)
- `/agente` (sin propiedades)
- `/inquilino` (sin rentas)
- Cualquier lista vacía

---

## 📝 Componentes de Formulario

### FormInput

Input de formulario con label, soporte para temas claro/oscuro y manejo de errores.

#### Props

```typescript
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string; // Etiqueta del campo
  error?: string; // Mensaje de error (opcional)
  theme?: "light" | "dark"; // Tema del formulario
}
```

#### Ejemplo de Uso

```tsx
// Tema claro (default)
<FormInput
  label="Nombre Completo"
  type="text"
  name="nombre"
  value={nombre}
  onChange={(e) => setNombre(e.target.value)}
  required
  placeholder="Tu nombre"
/>

// Tema oscuro
<FormInput
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  theme="dark"
/>
```

#### Usado en

- `/contacto`
- `/login`
- `/admin` (modal)

---

### FormTextarea

Textarea de formulario con las mismas características que FormInput.

#### Props

```typescript
interface FormTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  theme?: "light" | "dark";
}
```

#### Ejemplo de Uso

```tsx
<FormTextarea
  label="Mensaje"
  name="mensaje"
  value={mensaje}
  onChange={(e) => setMensaje(e.target.value)}
  required
  rows={4}
  placeholder="Cuéntanos cómo podemos ayudarte..."
/>
```

#### Usado en

- `/contacto`

---

### FormSelect

Select/dropdown de formulario con las mismas características que FormInput.

#### Props

```typescript
interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  theme?: "light" | "dark";
  children: ReactNode; // Las opciones del select
}
```

#### Ejemplo de Uso

```tsx
<FormSelect
  label="Asunto"
  name="asunto"
  value={asunto}
  onChange={(e) => setAsunto(e.target.value)}
  required
>
  <option value="">Selecciona un asunto</option>
  <option value="compra">Consulta sobre Compra</option>
  <option value="venta">Consulta sobre Venta</option>
</FormSelect>
```

#### Usado en

- `/contacto`
- `/admin` (modal)

---

## 🧭 Componentes de Navegación

### Pagination ⭐ NUEVO

Componente de paginación con números de página inteligentes, elipsis para muchas páginas, y accesibilidad.

#### Props

```typescript
interface PaginationProps {
  currentPage: number; // Página actual (1-indexed)
  totalPages: number; // Total de páginas
  onPageChange: (page: number) => void; // Callback al cambiar de página
  maxVisiblePages?: number; // Máximo de páginas visibles (default: 7)
}
```

#### Ejemplo de Uso

```tsx
const [currentPage, setCurrentPage] = useState(1);
const totalPages = Math.ceil(items.length / itemsPerPage);

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  maxVisiblePages={7}
/>;
```

#### Características

- ✅ Muestra elipsis (...) para muchas páginas
- ✅ Botones Anterior/Siguiente
- ✅ Página actual destacada con gradiente aqua
- ✅ Atributos ARIA para accesibilidad
- ✅ Se oculta automáticamente si solo hay 1 página

#### Usado en

- `/propiedades`
- Potencialmente en dashboards con listas largas

---

## 🏗️ Componentes de Layout

### Modal

Ventana modal/diálogo con fondo oscuro, cierre con ESC, click fuera, y bloqueo de scroll.

#### Props

```typescript
interface ModalProps {
  isOpen: boolean; // Controla si el modal está visible
  onClose: () => void; // Función para cerrar el modal
  title: string; // Título del modal
  children: ReactNode; // Contenido del modal
  maxWidth?: "sm" | "md" | "lg" | "xl"; // Tamaño del modal (default: 'md')
}
```

#### Ejemplo de Uso

```tsx
const [showModal, setShowModal] = useState(false);

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Crear Nuevo Usuario"
  maxWidth="md"
>
  <form>{/* Contenido del formulario */}</form>
</Modal>;
```

#### Características

- ✅ Cierre con tecla ESC
- ✅ Cierre al hacer clic fuera del modal
- ✅ Bloqueo de scroll del body cuando está abierto
- ✅ Animación de entrada
- ✅ Botón X para cerrar
- ✅ Previene salto visual del scrollbar

#### Usado en

- `/admin` (crear/editar usuario)

---

### DashboardHeader ⭐ NUEVO

Header consistente para todas las páginas de dashboard con título, icono, email del usuario y botón de logout.

#### Props

```typescript
interface DashboardHeaderProps {
  title: string; // Título del dashboard (ej: "Agente", "Admin")
  userEmail: string; // Email del usuario logueado
  icon: string; // Nombre del icono (del componente Icon)
  onLogout: () => void; // Callback para cerrar sesión
}
```

#### Ejemplo de Uso

```tsx
<DashboardHeader
  title="Agente"
  userEmail={userEmail}
  icon="briefcase"
  onLogout={handleLogout}
/>
```

#### Características

- ✅ Sticky header (se mantiene visible al hacer scroll)
- ✅ Gradiente oscuro consistente
- ✅ Icono personalizable por rol
- ✅ Botón de logout con hover effect

#### Usado en

- `/admin`
- `/agente`
- `/inquilino`
- `/propietario`
- `/gerencia`

---

## 🔧 Componentes Complejos

### PropertyFilters

Componente de filtrado de propiedades con múltiples criterios y estados temporales vs aplicados.

#### Props

```typescript
interface PropertyFiltersState {
  operationType: "todos" | "venta" | "alquiler";
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
  appliedOperationType?: "todos" | "venta" | "alquiler";
}
```

#### Ejemplo de Uso

```tsx
const [appliedFilters, setAppliedFilters] = useState<PropertyFiltersState>({
  operationType: "todos",
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  minPrice: "",
  maxPrice: "",
});

<PropertyFilters
  initialFilters={appliedFilters}
  onSearch={setAppliedFilters}
  onReset={() => setAppliedFilters(defaultFilters)}
  appliedOperationType={appliedFilters.operationType}
/>;
```

#### Características

- ✅ 6 filtros diferentes
- ✅ Estados temporales vs aplicados
- ✅ Sincronización con URL params
- ✅ Botones Buscar y Limpiar
- ✅ Sticky sidebar
- ✅ Muestra moneda según tipo de operación

#### Usado en

- `/propiedades`
- Potencialmente en dashboards de agente/propietario

---

### ScrollToTop

Componente invisible que resetea el scroll automáticamente al cambiar de ruta.

#### Props

Ninguno (componente sin props)

#### Ejemplo de Uso

```tsx
// En el layout
export default function Layout({ children }) {
  return (
    <div>
      <ScrollToTop />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
```

#### Características

- ✅ Detecta cambios de ruta con `usePathname()`
- ✅ Scroll automático al tope
- ✅ Limpia `overflow: hidden` residual
- ✅ No renderiza nada (return null)

#### Usado en

- `(groupNF)/layout.tsx` (todas las páginas públicas)

---

## 📊 Resumen de Beneficios

### Antes de la Componentización

- ❌ Código duplicado en múltiples archivos
- ❌ Difícil mantener consistencia visual
- ❌ Cambios requieren editar múltiples archivos
- ❌ Archivos de página muy largos (300+ líneas)

### Después de la Componentización

- ✅ Código DRY (Don't Repeat Yourself)
- ✅ Consistencia garantizada en toda la app
- ✅ Cambios centralizados en un solo lugar
- ✅ Archivos de página más limpios y legibles
- ✅ Componentes reutilizables en futuras páginas
- ✅ Más fácil de testear
- ✅ Mejor accesibilidad (ARIA labels)

---

## 📈 Estadísticas del Proyecto

| Métrica                           | Valor  |
| --------------------------------- | ------ |
| **Total Componentes**             | 13     |
| **Líneas de código reducidas**    | ~550+  |
| **Páginas refactorizadas**        | 8+     |
| **Reducción promedio por página** | 25-40% |

---

## 🎨 Convenciones de Diseño

Todos los componentes siguen estas convenciones:

- **Color primario**: `#14b8a6` (aqua/teal)
- **Color oscuro**: `#0f172a` (slate-900)
- **Bordes redondeados**: `rounded-lg` o `rounded-2xl`
- **Transiciones**: `transition-all duration-300`
- **Focus ring**: `focus:ring-2 focus:ring-[#14b8a6]`
- **Hover effects**: `hover:shadow-xl`, `hover:scale-105`
- **Gradientes**: `from-[#14b8a6] to-[#0d9488]` (aqua) o `from-[#0f172a] to-[#334155]` (dark)

---

## 🚀 Próximos Pasos

Estos componentes pueden ser extendidos para:

- Agregar validación de formularios más robusta
- Crear variantes adicionales de colores
- Agregar animaciones más complejas
- Implementar tests unitarios
- Agregar soporte para i18n (internacionalización)
- Crear Storybook para documentación visual

---

## 📝 Guía de Uso Rápido

### ¿Necesitas mostrar un estado vacío?

→ Usa `<EmptyState />`

### ¿Necesitas paginar una lista?

→ Usa `<Pagination />`

### ¿Estás creando un dashboard?

→ Usa `<DashboardHeader />`

### ¿Necesitas un formulario?

→ Usa `<FormInput />`, `<FormTextarea />`, `<FormSelect />`

### ¿Necesitas filtrar propiedades?

→ Usa `<PropertyFilters />`

### ¿Necesitas un modal?

→ Usa `<Modal />`

### ¿Necesitas mostrar estadísticas?

→ Usa `<StatsCard />`

### ¿Necesitas un hero banner?

→ Usa `<HeroSection />`
