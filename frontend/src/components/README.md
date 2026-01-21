# Componentes

Documentación de los componentes principales del proyecto InmoHogar.

## 📁 Estructura

```
components/
├── UI/                          # Componentes UI reutilizables (ver UI/README.md)
├── Navbar.tsx                   # Barra de navegación
├── Footer.tsx                   # Pie de página
├── HeroSection.tsx              # Sección hero para páginas
├── SearchBlock.tsx              # Búsqueda de propiedades (home)
├── PropertyFilters.tsx          # Filtros de propiedades
├── FeaturedProperties.tsx       # Propiedades destacadas
├── UniversalPropertyCard.tsx    # Tarjeta universal de propiedad
├── DashboardHeader.tsx          # Header para dashboards
└── LoginPage.tsx                # Página de login
```

## 📚 Componentes

### UniversalPropertyCard

Componente unificado para mostrar propiedades en toda la aplicación (páginas públicas y dashboards).

**Props principales:**

```typescript
interface UniversalPropertyCardProps {
  property: UniversalPropertyData;
  href?: string; // Para links (páginas públicas)
  onClick?: () => void; // Para cards clickeables
  showTypeBadge?: boolean; // Badge Venta/Alquiler
  showStatusBadge?: boolean; // Badge Activa/Pausada
  warningBadge?: {
    // Advertencias
    type: "expiration" | "adjustment";
    message: string;
    variant?: "red" | "amber";
  };
  actions?: PropertyAction[]; // Botones de acción (dashboards)
  showPropertyDetails?: boolean; // Mostrar hab/baños/área
}
```

**Ejemplos:**

```tsx
// Página pública con link
<UniversalPropertyCard
  property={property}
  href={`/propiedades/${property.id}`}
/>

// Dashboard con acciones
<UniversalPropertyCard
  property={property}
  showStatusBadge={true}
  actions={[
    { label: 'Editar', onClick: handleEdit, variant: 'primary' },
    { label: 'Eliminar', onClick: handleDelete, variant: 'danger' }
  ]}
/>

// Con advertencia
<UniversalPropertyCard
  property={property}
  warningBadge={{
    type: 'expiration',
    message: 'Vence en 30 días',
    variant: 'red'
  }}
/>
```

**Variantes de acciones:**

- `primary` - Oscuro (Editar, Ver)
- `secondary` - Teal (Alquilar, Publicar)
- `danger` - Rojo (Eliminar)
- `success` - Verde (Activar)
- `warning` - Ámbar (Pausar)
- `info` - Azul (Info)

---

### PropertyFilters

Sidebar de filtros para búsqueda de propiedades con estados temporales vs aplicados.

```tsx
<PropertyFilters
  initialFilters={appliedFilters}
  onSearch={setAppliedFilters}
  onReset={() => setAppliedFilters(defaultFilters)}
  appliedOperationType={appliedFilters.operationType}
/>
```

**Filtros disponibles:**

- Tipo de operación (Venta/Alquiler/Todos)
- Tipo de inmueble (Casa, Departamento, etc.)
- Dormitorios (1, 2, 3, 4+)
- Baños (1, 2, 3)
- Rango de precio (ARS para alquiler, USD para venta)

**Usado en:** `/propiedades`

---

### SearchBlock

Bloque de búsqueda principal del home con tabs Alquilar/Venta y formulario completo.

```tsx
<SearchBlock />
```

**Características:**

- Tabs para Alquilar/Venta
- Filtros: tipo, localidad, dormitorios, baños, barrio, precio
- Validación de rango de precios
- Redirige a `/propiedades` con query params

**Usado en:** Home (`/`)

---

### DashboardHeader

Header consistente para todos los dashboards con título, icono, email y logout.

```tsx
<DashboardHeader
  title="Agente"
  userEmail={userEmail}
  icon="briefcase"
  onLogout={handleLogout}
/>
```

**Características:**

- Sticky header (se mantiene visible al scroll)
- Gradiente oscuro consistente
- Icono personalizable por rol
- Botón de logout con hover effect

**Usado en:** `/admin`, `/agente`, `/inquilino`, `/propietario`, `/gerencia`

---

### HeroSection

Banner hero para páginas con título destacado y efectos decorativos.

```tsx
<HeroSection
  title="Contáctanos"
  highlightedText="Contáctanos" // Parte con gradiente aqua
  subtitle="Estamos aquí para ayudarte a encontrar tu hogar ideal"
/>
```

**Usado en:** `/contacto`, `/nosotros`

---

### Navbar

Barra de navegación principal con logo, links y botón de login.

**Características:**

- Responsive con menú hamburguesa en móvil
- Links: Inicio, Propiedades, Nosotros, Contacto
- Botón "Iniciar Sesión"
- Sticky con fondo oscuro

**Usado en:** Todas las páginas públicas (layout `(groupNF)`)

---

### Footer

Pie de página con información de la empresa, links y redes sociales.

**Características:**

- 3 columnas: Empresa, Enlaces Rápidos, Contacto
- Logo e información de contacto
- Links a páginas principales
- Redes sociales

**Usado en:** Todas las páginas públicas (layout `(groupNF)`)

---

### FeaturedProperties

Sección de propiedades destacadas para el home.

```tsx
<FeaturedProperties />
```

Muestra un grid de propiedades destacadas usando `UniversalPropertyCard`.

**Usado en:** Home (`/`)

---

### LoginPage

Página completa de login con formulario de email/password.

```tsx
<LoginPage />
```

**Características:**

- Formulario con validación
- Integración con server actions
- Redirección según rol de usuario
- Diseño con gradiente y efectos

**Usado en:** `/login`

---

## 🎨 Convenciones de Diseño

Todos los componentes siguen estas convenciones:

- **Color primario**: `#14b8a6` (aqua/teal)
- **Color oscuro**: `#0f172a` (slate-900)
- **Bordes**: `rounded-lg` o `rounded-2xl`
- **Transiciones**: `transition-all duration-300`
- **Gradientes**:
  - Aqua: `from-[#14b8a6] to-[#0d9488]`
  - Oscuro: `from-[#0f172a] to-[#334155]`

## 🔍 ¿Dónde Poner un Nuevo Componente?

**Ponlo en `/UI` si:**

- ✅ Es genérico y reutilizable (botones, inputs, modales, etc.)
- ✅ No tiene lógica de negocio específica
- ✅ Podría usarse en cualquier tipo de aplicación

**Ponlo en `/components` (raíz) si:**

- ✅ Es específico del dominio inmobiliario
- ✅ Tiene lógica de negocio
- ✅ Es un componente de layout o página completa

---

**Ver también:** [UI/README.md](./UI/README.md) para componentes UI reutilizables
