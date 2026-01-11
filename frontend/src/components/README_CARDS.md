# Componentes Compartidos de Cards

Este documento describe los componentes compartidos de cards creados para evitar duplicación de código entre los dashboards de agente, inquilino y propietario.

## Componentes Disponibles

### 1. DashboardPropertyCard

Componente reutilizable para mostrar propiedades en los dashboards de agente y propietario.

**Ubicación:** `src/components/DashboardPropertyCard.tsx`

**Props:**

```typescript
interface DashboardPropertyCardProps {
  property: DashboardPropertyData; // Datos de la propiedad
  showStatusBadge?: boolean; // Mostrar badge de estado (Activa/Pausada)
  showTypeBadge?: boolean; // Mostrar badge de tipo (Venta/Alquiler)
  showPropertyDetails?: boolean; // Mostrar detalles (habitaciones, baños, área)
  actions?: PropertyAction[]; // Acciones personalizables
}
```

**Ejemplo de uso - Dashboard de Agente:**

```tsx
import DashboardPropertyCard from "@/components/DashboardPropertyCard";

<DashboardPropertyCard
  property={property}
  showStatusBadge={true}
  showTypeBadge={true}
  showPropertyDetails={true}
  actions={[
    {
      label: "Editar",
      onClick: () => handleEdit(property),
      variant: "primary",
      icon: <EditIcon />,
    },
    {
      label: "Eliminar",
      onClick: () => handleDelete(property.id),
      variant: "danger",
      icon: <DeleteIcon />,
    },
  ]}
/>;
```

**Ejemplo de uso - Dashboard de Propietario:**

```tsx
<DashboardPropertyCard
  property={property}
  showStatusBadge={true}
  showTypeBadge={true}
  showPropertyDetails={true}
  // Sin acciones - solo visualización
/>
```

**Variantes de acciones disponibles:**

- `primary`: Botón oscuro (bg-[#0f172a])
- `secondary`: Botón teal (bg-[#14b8a6])
- `danger`: Botón rojo (bg-red-500)
- `success`: Botón verde (bg-green-500)
- `warning`: Botón ámbar (bg-amber-500)
- `info`: Botón azul (bg-blue-500)

---

### 2. RentalCard

Componente reutilizable para mostrar rentas en los dashboards de inquilino y propietario. **Incluye modal integrado** para mostrar detalles completos de la renta.

**Ubicación:** `src/components/RentalCard.tsx`

**Props:**

```typescript
interface RentalCardProps {
  rental: RentalData; // Datos de la renta
  showExpirationWarning?: boolean; // Mostrar advertencia de vencimiento/ajuste
  daysUntilExpiration?: number; // Días hasta vencimiento del contrato
  daysUntilAdjustment?: number; // Días hasta ajuste de precio
  viewerRole?: "tenant" | "landlord" | "agent"; // Rol del usuario (para modal integrado)
  actions?: RentalAction[]; // Acciones personalizables (opcional)
  onViewDetails?: () => void; // Callback personalizado (opcional)
}
```

**Ejemplo de uso - Dashboard de Inquilino (con modal integrado):**

```tsx
import RentalCard from "@/components/RentalCard";

<RentalCard
  rental={rental}
  viewerRole="tenant" // Muestra "Contacto del Propietario" en el modal
  showExpirationWarning={true}
  daysUntilExpiration={getDaysUntilExpiration(rental.endDate)}
  daysUntilAdjustment={getDaysUntilAdjustment(rental.nextAdjustmentDate)}
/>;
```

**Ejemplo de uso - Dashboard de Propietario (con modal integrado):**

```tsx
<RentalCard
  rental={rental}
  viewerRole="landlord" // Muestra "Contacto del Inquilino" en el modal
  showExpirationWarning={true}
  daysUntilExpiration={daysUntilExpiration}
  daysUntilAdjustment={daysUntilAdjustment}
/>
```

**Ejemplo de uso - Dashboard de Agente (con modal integrado - muestra ambos contactos):**

```tsx
<RentalCard
  rental={rental}
  viewerRole="agent" // Muestra AMBOS: "Contacto del Propietario" Y "Contacto del Inquilino"
  showExpirationWarning={true}
  daysUntilExpiration={daysUntilExpiration}
  daysUntilAdjustment={daysUntilAdjustment}
/>
```

**Ejemplo de uso - Con callback personalizado (sin modal integrado):**

```tsx
<RentalCard
  rental={rental}
  showExpirationWarning={true}
  daysUntilExpiration={daysUntilExpiration}
  daysUntilAdjustment={daysUntilAdjustment}
  onViewDetails={() => handleCustomModal(rental)}
/>
```

**Características:**

- **Modal integrado**: Si se proporciona `viewerRole`, el componente maneja automáticamente el modal de detalles
- **Contacto dinámico**:
  - `tenant`: Muestra "Contacto del Propietario"
  - `landlord`: Muestra "Contacto del Inquilino"
  - `agent`: Muestra **AMBOS** contactos (Propietario e Inquilino)
- **Advertencias automáticas**: Muestra badges cuando:
  - El contrato vence en menos de 60 días (badge rojo)
  - Hay un ajuste de precio próximo en menos de 60 días (badge ámbar)
- **Determina automáticamente** cuál evento ocurre primero y lo muestra
- **Botón "Ver Detalles Completos"** incluido por defecto
- **Flexibilidad**: Puede usar callback personalizado si no se desea el modal integrado

**Datos del modal:**
El modal integrado muestra:

- Información de la propiedad (nombre, dirección, renta mensual)
- Detalles del contrato (inicio, vencimiento, meses de ajuste)
- Contacto del propietario/inquilino (según `viewerRole`):
  - `tenant`: Muestra contacto del **Propietario**
  - `landlord`: Muestra contacto del **Inquilino**
  - `agent`: Muestra **ambos** contactos (Propietario e Inquilino)
- **Contacto del Agente** (siempre se muestra si está disponible, para todos los roles)

---

## Beneficios de Usar Componentes Compartidos

### ✅ Reducción de Código Duplicado

- **Antes:** ~500 líneas de código duplicado entre 3 páginas (cards + modales)
- **Ahora:** Componentes reutilizables centralizados con modal integrado

### ✅ Mantenimiento Simplificado

- Cambios de diseño se hacen en un solo lugar
- Correcciones de bugs benefician a todos los dashboards
- Consistencia visual garantizada

### ✅ Flexibilidad

- Props configurables para adaptar a cada caso de uso
- Sistema de acciones personalizables
- Badges y detalles opcionales

### ✅ Escalabilidad

- Fácil agregar nuevas funcionalidades
- Nuevos dashboards pueden reutilizar los componentes
- Tipos TypeScript bien definidos

---

## Estructura de Archivos

```
frontend/src/
├── components/
│   ├── DashboardPropertyCard.tsx  # Card de propiedades para dashboards
│   ├── RentalCard.tsx             # Card de rentas para dashboards
│   ├── PropertyCard.tsx           # Card de propiedades para listado público
│   └── Icon.tsx                   # Componente de iconos
└── app/
    ├── agente/
    │   └── page.tsx               # Usa DashboardPropertyCard
    ├── inquilino/
    │   └── page.tsx               # Usa RentalCard
    └── propietario/
        └── page.tsx               # Usa RentalCard y DashboardPropertyCard
```

---

## Notas Importantes

1. **PropertyCard vs DashboardPropertyCard:**

   - `PropertyCard`: Para el listado público de propiedades (con Link a detalles)
   - `DashboardPropertyCard`: Para dashboards internos (con acciones personalizables)

2. **Wrappers Locales:**

   - Cada página mantiene un wrapper local (ej: `PropertyCardWrapper`, `RentalCardWrapper`)
   - Esto permite adaptar las props específicas de cada dashboard
   - Facilita futuras personalizaciones sin afectar el componente compartido

3. **Tipos TypeScript:**
   - Todos los componentes exportan sus tipos de datos
   - Importar tipos: `import { DashboardPropertyData, PropertyAction } from '@/components/DashboardPropertyCard'`

---

## Futuras Mejoras Sugeridas

- [ ] Agregar soporte para imágenes reales (actualmente usa placeholder SVG)
- [ ] Implementar skeleton loading states
- [ ] Agregar animaciones de entrada/salida
- [ ] Crear variantes de tamaño (small, medium, large)
- [ ] Agregar modo compacto para vistas de lista
