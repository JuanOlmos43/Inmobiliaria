# 📁 Estructura de Componentes - Inmobiliaria Frontend

Esta documentación describe la organización de componentes del proyecto, siguiendo las mejores prácticas de **Feature-First Architecture** y **Atomic Design**.

## 🎯 Filosofía de Organización

La estructura está diseñada para:

- ✅ **Escalabilidad**: Fácil agregar nuevas features sin afectar otras
- ✅ **Mantenibilidad**: Los componentes están agrupados por funcionalidad
- ✅ **Colocation**: Componentes relacionados están juntos
- ✅ **Reutilización**: Componentes UI base separados de lógica de negocio
- ✅ **Claridad**: Imports descriptivos y fáciles de entender

## 📂 Estructura General

```
components/
├── ui/                          # Componentes base reutilizables (Design System)
├── features/                    # Componentes organizados por funcionalidad
├── dashboard/                   # Componentes específicos de dashboards
└── layout/                      # Componentes de estructura/layout
```

---

## 🎨 `/ui` - Design System

Componentes base reutilizables sin lógica de negocio. Organizados por categoría.

### Estructura:

```
ui/
├── forms/                       # Componentes de formularios
│   ├── FormInput.tsx
│   ├── FormSelect.tsx
│   └── FormTextarea.tsx
│
├── feedback/                    # Componentes de retroalimentación
│   ├── ConfirmModal.tsx
│   ├── EmptyState.tsx
│   └── Toast.tsx
│
├── modals/                      # Componentes de modales base
│   └── Modal.tsx
│
├── cards/                       # Componentes de tarjetas
│   ├── ContactInfoCard.tsx
│   ├── StatsCard.tsx
│   └── ValueCard.tsx
│
├── navigation/                  # Componentes de navegación
│   ├── Pagination.tsx
│   ├── ScrollToTop.tsx
│   └── TabNavigation.tsx
│
├── icons/                       # Sistema de iconos
│   └── Icon.tsx
│
└── index.ts                     # Barrel export
```

### Uso:

```typescript
import { FormInput, FormSelect, Icon, Toast } from "@/components/ui";
```

### Principios:

- ✅ **Sin lógica de negocio**: Solo presentación y comportamiento UI
- ✅ **Altamente reutilizables**: Usados en múltiples features
- ✅ **Props bien definidas**: TypeScript interfaces claras
- ✅ **Accesibilidad**: ARIA labels y semántica HTML

---

## 🚀 `/features` - Componentes por Funcionalidad

Componentes organizados por dominio de negocio.

### Estructura:

```
features/
├── auth/                        # Autenticación
│   ├── LoginPage.tsx
│   └── index.ts
│
├── home/                        # Página principal
│   ├── HeroSection.tsx
│   └── index.ts
│
└── properties/                  # Funcionalidad de propiedades
    ├── cards/                   # Tarjetas de propiedades
    │   ├── BasePropertyCard.tsx
    │   ├── RentalPropertyCard.tsx
    │   └── index.ts
    │
    ├── filters/                 # Filtros de propiedades
    │   ├── PropertyFilters.tsx
    │   └── index.ts
    │
    ├── search/                  # Búsqueda de propiedades
    │   ├── SearchBlock.tsx
    │   └── index.ts
    │
    ├── featured/                # Propiedades destacadas
    │   ├── FeaturedProperties.tsx
    │   └── index.ts
    │
    └── index.ts                 # Barrel export principal
```

### Uso:

```typescript
// Opción 1: Import directo desde subcarpeta
import { BasePropertyCard } from "@/components/features/properties/cards";
import { PropertyFilters } from "@/components/features/properties/filters";

// Opción 2: Import desde el barrel principal (si está configurado)
import {
  BasePropertyCard,
  PropertyFilters,
} from "@/components/features/properties";

// Opción 3: Import de feature completa
import { LoginPage } from "@/components/features/auth";
import { HeroSection } from "@/components/features/home";
```

### Principios:

- ✅ **Separación por dominio**: Cada feature es independiente
- ✅ **Lógica de negocio**: Pueden contener hooks, servicios, etc.
- ✅ **Composición**: Usan componentes de `/ui`
- ✅ **Barrel exports**: Facilitan imports limpios

---

## 📊 `/dashboard` - Componentes de Dashboards

Componentes específicos para las diferentes vistas de dashboard.

### Estructura:

```
dashboard/
├── admin/                       # Dashboard de administrador
│   ├── AdminStatsGrid.tsx
│   ├── AdminUsersFilters.tsx
│   ├── CreateUserModal.tsx
│   ├── UsersTable.tsx
│   └── README.md
│
├── agent/                       # Dashboard de agente
│   ├── stats/
│   │   └── AgentStatsGrid.tsx
│   ├── properties/
│   │   ├── AgentPropertyCard.tsx
│   │   ├── AgentPropertiesFilters.tsx
│   │   └── PropertyModal/
│   │       ├── PropertyModal.tsx
│   │       ├── ImageSection.tsx
│   │       ├── LandlordSection.tsx
│   │       └── LocationSection.tsx
│   ├── contracts/
│   │   ├── ContractFilters.tsx
│   │   ├── RentalModal.tsx
│   │   └── ViewContractModal.tsx
│   └── UpcomingExpirations.tsx
│
└── common/                      # Compartidos entre dashboards
    └── ViewContractModal.tsx
```

### Uso:

```typescript
import AdminStatsGrid from "@/components/dashboard/admin/AdminStatsGrid";
import AgentPropertyCard from "@/components/dashboard/agent/AgentPropertyCard";
```

### Principios:

- ✅ **Separación por rol**: Admin, Agent, Owner, Tenant
- ✅ **Componentes compartidos**: En `/common`
- ✅ **Lógica específica**: Hooks y servicios del dashboard

---

## 🏗️ `/layout` - Componentes de Layout

Componentes estructurales de la aplicación.

### Estructura:

```
layout/
├── DashboardHeader.tsx          # Header de dashboards
├── Navbar.tsx                   # Navegación principal
├── Footer.tsx                   # Footer del sitio
└── index.ts                     # Barrel export
```

### Uso:

```typescript
import { Navbar, Footer, DashboardHeader } from "@/components/layout";
```

### Principios:

- ✅ **Estructura global**: Usados en layouts de Next.js
- ✅ **Consistencia**: Mantienen la estructura visual
- ✅ **Responsive**: Adaptados a diferentes tamaños

---

## 📝 Guías de Uso

### ¿Dónde crear un nuevo componente?

#### 1. **Componente UI reutilizable** (sin lógica de negocio)

→ `/ui/[categoría]/ComponentName.tsx`

**Ejemplo**: Un nuevo componente de botón

```
ui/buttons/Button.tsx
```

#### 2. **Componente de feature** (con lógica de negocio)

→ `/features/[dominio]/ComponentName.tsx`

**Ejemplo**: Un componente de mapa de propiedades

```
features/properties/map/PropertyMap.tsx
```

#### 3. **Componente de dashboard**

→ `/dashboard/[rol]/ComponentName.tsx`

**Ejemplo**: Un widget de estadísticas del propietario

```
dashboard/owner/OwnerStatsWidget.tsx
```

#### 4. **Componente de layout**

→ `/layout/ComponentName.tsx`

**Ejemplo**: Un sidebar

```
layout/Sidebar.tsx
```

---

## 🔄 Migración desde estructura antigua

### Mapeo de rutas:

| Antigua Ruta                      | Nueva Ruta                                  |
| --------------------------------- | ------------------------------------------- |
| `@/components/UI`                 | `@/components/ui`                           |
| `@/components/LoginPage`          | `@/components/features/auth`                |
| `@/components/BasePropertyCard`   | `@/components/features/properties/cards`    |
| `@/components/PropertyFilters`    | `@/components/features/properties/filters`  |
| `@/components/SearchBlock`        | `@/components/features/properties/search`   |
| `@/components/FeaturedProperties` | `@/components/features/properties/featured` |
| `@/components/HeroSection`        | `@/components/features/home`                |

### Cambio de imports:

**Antes:**

```typescript
import LoginPage from "@/components/LoginPage";
import BasePropertyCard from "@/components/BasePropertyCard";
import { Icon } from "@/components/ui";
```

**Después:**

```typescript
import { LoginPage } from "@/components/features/auth";
import { BasePropertyCard } from "@/components/features/properties/cards";
import { Icon } from "@/components/ui";
```

---

## 🎯 Mejores Prácticas

### 1. **Barrel Exports**

Cada carpeta debe tener un `index.ts` para facilitar imports:

```typescript
// features/properties/cards/index.ts
export { default as BasePropertyCard } from "./BasePropertyCard";
export { default as RentalPropertyCard } from "./RentalPropertyCard";
```

### 2. **Naming Conventions**

- **Componentes**: PascalCase (`BasePropertyCard.tsx`)
- **Carpetas**: camelCase (`features/properties/cards/`)
- **Archivos de tipos**: PascalCase con `.types.ts` (`Property.types.ts`)

### 3. **Imports**

Preferir named exports sobre default exports para mejor tree-shaking:

```typescript
// ✅ Bueno
export function MyComponent() { ... }

// ❌ Evitar (excepto en páginas de Next.js)
export default function MyComponent() { ... }
```

### 4. **Colocation**

Mantener archivos relacionados juntos:

```
PropertyModal/
├── PropertyModal.tsx           # Componente principal
├── ImageSection.tsx            # Subcomponente
├── LandlordSection.tsx         # Subcomponente
└── LocationSection.tsx         # Subcomponente
```

---

### 5. **Estilos y Clases (Tailwind)**

El proyecto utiliza **Prettier** para ordenar automáticamente las clases.

- 🤖 **Deja que la herramienta trabaje**: No pierdas tiempo ordenando clases manualmente.
- 💾 **Guardar para ordenar**: Simplemente guarda el archivo (`Ctrl+S`) y Prettier agrupará las clases lógicamente (Layout → Box Model → Visual → etc).

---

## 📚 Recursos Adicionales

- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [Feature-First Architecture](https://feature-sliced.design/)
- [Next.js Project Structure](https://nextjs.org/docs/app/building-your-application/routing/colocation)

---

## 🔧 Mantenimiento

Esta estructura debe evolucionar con el proyecto. Al agregar nuevas features:

1. ✅ Evaluar si pertenece a una carpeta existente
2. ✅ Crear nuevas carpetas si es necesario
3. ✅ Actualizar este README
4. ✅ Mantener barrel exports actualizados
5. ✅ Documentar decisiones importantes

---

**Última actualización**: 2026-02-13
**Versión**: 2.1.0 (Actualización de Estándares de Estilo)
