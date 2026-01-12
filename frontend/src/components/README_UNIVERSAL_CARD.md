# UniversalPropertyCard - Componente Universal de Propiedades

Componente unificado que reemplaza `PropertyCard` y `DashboardPropertyCard`, basado en el diseño premium de `/propiedades`.

## 🎨 Características

- ✅ **Diseño Premium**: Basado en la card de `/propiedades` con animaciones y efectos hover
- ✅ **Imágenes Optimizadas**: Soporte para Next/Image con placeholder SVG cuando no hay imagen
- ✅ **Badges Flexibles**: Tipo, Estado, y Advertencias configurables
- ✅ **Acciones Personalizables**: Botones con 6 variantes de color
- ✅ **Comportamiento Flexible**: Link, onClick, o estático
- ✅ **Responsive**: Adaptable a todos los tamaños de pantalla

## 📋 Props

```typescript
interface UniversalPropertyCardProps {
  property: UniversalPropertyData;

  // Comportamiento
  href?: string; // Si tiene href, es un Link
  onClick?: () => void; // Para cards clickeables sin link

  // Badges
  showTypeBadge?: boolean; // Badge de Venta/Alquiler (default: true)
  showStatusBadge?: boolean; // Badge de Activa/Pausada (default: false)
  warningBadge?: {
    // Badge de advertencia
    type: "expiration" | "adjustment";
    message: string;
    variant?: "red" | "amber";
  };

  // Acciones (para dashboards)
  actions?: PropertyAction[];

  // Configuración visual
  showPropertyDetails?: boolean; // Mostrar hab, baños, área (default: true)
  variant?: "default" | "compact";
}
```

## 📚 Ejemplos de Uso

### 1. Card Pública (Home y /propiedades)

```tsx
import UniversalPropertyCard from "@/components/UniversalPropertyCard";

<UniversalPropertyCard
  property={{
    id: 1,
    title: "Casa + Local Comercial",
    price: 98000,
    location: "Blas Parera 272",
    image: "/images/property-1.jpg",
    bedrooms: 4,
    bathrooms: 3,
    area: 400,
    type: "Venta",
  }}
  href={`/propiedades/${property.id}`}
  showTypeBadge={true}
  showPropertyDetails={true}
/>;
```

### 2. Card de Dashboard con Acciones (Agente)

```tsx
<UniversalPropertyCard
  property={{
    id: "prop-123",
    title: "Departamento Céntrico",
    price: 85000,
    location: "Av. Principal 1234",
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    type: "Alquiler",
    status: "Activa",
  }}
  showTypeBadge={true}
  showStatusBadge={true}
  showPropertyDetails={true}
  actions={[
    {
      label: "Editar",
      onClick: () => handleEdit(property),
      variant: "primary",
      icon: <EditIcon />,
    },
    {
      label: "Pausar",
      onClick: () => handleToggleStatus(property.id),
      variant: "warning",
      icon: <PauseIcon />,
    },
    {
      label: "Eliminar",
      onClick: () => handleDelete(property.id),
      variant: "danger",
      icon: <DeleteIcon />,
    },
  ]}
/>
```

### 3. Card con Badge de Advertencia (Próximos Vencimientos)

```tsx
<UniversalPropertyCard
  property={{
    id: "rent-456",
    title: "Oficina Comercial Centro",
    price: 150000,
    location: "Av. Comercio 890",
    type: "Alquiler",
  }}
  warningBadge={{
    type: "expiration",
    message: "Próximo mes: Vence contrato",
    variant: "red",
  }}
  onClick={() => handleViewDetails(property)}
  showPropertyDetails={false}
/>
```

### 4. Card de Propietario (Solo Visualización)

```tsx
<UniversalPropertyCard
  property={{
    id: "my-prop-789",
    title: "Mi Casa en Barrio Residencial",
    price: 120000,
    location: "Calle Los Aromos 567",
    image: "/images/my-house.jpg",
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    type: "Alquiler",
    status: "Activa",
  }}
  showTypeBadge={true}
  showStatusBadge={true}
  showPropertyDetails={true}
  // Sin href, onClick ni actions = card estática
/>
```

### 5. Card Sin Imagen (Placeholder Automático)

```tsx
<UniversalPropertyCard
  property={{
    id: "new-prop",
    title: "Propiedad Nueva",
    price: 75000,
    location: "Zona Norte",
    type: "Venta",
    // Sin image - mostrará placeholder SVG automáticamente
  }}
  href="/propiedades/new-prop"
/>
```

## 🎨 Variantes de Acciones

```typescript
"primary"; // bg-[#0f172a] - Oscuro (Editar, Ver)
"secondary"; // bg-[#14b8a6] - Teal (Alquilar, Publicar)
"danger"; // bg-red-500 - Rojo (Eliminar)
"success"; // bg-green-500 - Verde (Activar)
"warning"; // bg-amber-500 - Ámbar (Pausar)
"info"; // bg-blue-500 - Azul (Info)
```

## 🔄 Guía de Migración

### Desde PropertyCard (Home y /propiedades)

**Antes:**

```tsx
<PropertyCard
  id={property.id}
  title={property.title}
  price={property.price}
  location={property.location}
  bedrooms={property.bedrooms}
  bathrooms={property.bathrooms}
  area={property.area}
  type={property.type}
  image={property.image}
/>
```

**Ahora:**

```tsx
<UniversalPropertyCard
  property={property}
  href={`/propiedades/${property.id}`}
/>
```

### Desde DashboardPropertyCard (Dashboards)

**Antes:**

```tsx
<DashboardPropertyCard
  property={property}
  showStatusBadge={true}
  showTypeBadge={true}
  showPropertyDetails={true}
  actions={actions}
/>
```

**Ahora:**

```tsx
<UniversalPropertyCard
  property={property}
  showStatusBadge={true}
  showTypeBadge={true}
  showPropertyDetails={true}
  actions={actions}
/>
```

## ✨ Ventajas

1. **Un Solo Componente**: Reemplaza PropertyCard y DashboardPropertyCard
2. **Diseño Consistente**: Mismo look premium en toda la app
3. **Menos Código**: ~50% menos líneas de código
4. **Más Flexible**: Soporta todos los casos de uso
5. **Mejor Mantenimiento**: Cambios en un solo lugar

## 📝 Notas

- **RentalCard se mantiene separado**: Tiene lógica específica de modal + advertencias complejas
- **Imágenes**: Usa Next/Image para optimización automática
- **Animaciones**: Incluye hover effects y transform animations
- **Accesibilidad**: Soporte completo para navegación por teclado

## 🚀 Próximos Pasos

1. Migrar Home y /propiedades (usar `href`)
2. Migrar dashboards de agente/propietario (usar `actions`)
3. Deprecar PropertyCard y DashboardPropertyCard
4. Actualizar documentación
