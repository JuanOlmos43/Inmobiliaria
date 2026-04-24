# Frontend — Inmobiliaria

Aplicación web construida con **Next.js 16** (App Router), **React 19**, **TypeScript** y **Tailwind CSS 4**.

---

## 🚀 Tecnologías

| Categoría       | Tecnología                              |
| --------------- | --------------------------------------- |
| **Framework**   | Next.js 16 (App Router)                 |
| **UI**          | React 19 · TypeScript                   |
| **Estilos**     | Tailwind CSS 4 · CSS Variables          |
| **Estado**      | TanStack React Query 5                  |
| **Gráficos**    | Recharts 3                              |
| **Fonts**       | Geist (via `next/font`)                 |
| **Linting**     | ESLint 9 · Prettier · `prettier-plugin-tailwindcss` |

---

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                        # App Router de Next.js 16
│   │   ├── globals.css             # Estilos globales + variables CSS
│   │   ├── layout.tsx              # Layout raíz
│   │   ├── login/                  # Página de login
│   │   │   └── page.tsx
│   │   ├── (public)/               # Grupo de rutas públicas
│   │   │   ├── layout.tsx          # Layout público (Navbar + Footer)
│   │   │   ├── page.tsx            # Home
│   │   │   ├── propiedades/        # Listado y detalle de propiedades
│   │   │   ├── contacto/           # Formulario de contacto
│   │   │   └── nosotros/           # Página "Nosotros"
│   │   └── (dashboard)/            # Grupo de rutas protegidas (dashboards)
│   │       ├── layout.tsx          # Layout dashboard (DashboardHeader + sidebar)
│   │       ├── admin/              # Dashboard Administrador
│   │       ├── agente/             # Dashboard Agente
│   │       ├── gerencia/           # Dashboard Gerencia
│   │       ├── inquilino/          # Dashboard Inquilino
│   │       └── propietario/        # Dashboard Propietario
│   ├── components/
│   │   ├── features/               # Componentes feature-first
│   │   │   ├── auth/               # Componentes de autenticación
│   │   │   ├── home/               # Componentes del home (hero, featured, etc.)
│   │   │   └── properties/         # Componentes de propiedades (cards, filtros, detalle)
│   │   ├── dashboard/              # Componentes de dashboards
│   │   │   ├── admin/              # Paneles de administración (usuarios, etc.)
│   │   │   ├── agent/              # Panel del agente (propiedades, carga)
│   │   │   ├── gerencia/           # Panel de gerencia (KPIs, estadísticas)
│   │   │   └── common/             # Componentes compartidos entre dashboards
│   │   ├── layout/                 # Componentes de layout
│   │   │   ├── Navbar.tsx          # Barra de navegación pública
│   │   │   ├── Footer.tsx          # Pie de página
│   │   │   └── DashboardHeader.tsx # Header del dashboard
│   │   └── ui/                     # Librería de componentes reutilizables
│   │       ├── buttons/            # Botones
│   │       ├── cards/              # Cards
│   │       ├── forms/              # Inputs, selects, etc.
│   │       ├── modals/             # Modales y diálogos
│   │       ├── feedback/           # Alertas, toasts, loaders
│   │       ├── icons/              # Íconos SVG
│   │       ├── navigation/         # Breadcrumbs, tabs, etc.
│   │       └── index.ts            # Barrel exports
│   ├── context/
│   │   ├── AuthContext.tsx         # Contexto de autenticación (login, logout, user)
│   │   └── QueryProvider.tsx       # Proveedor de TanStack React Query
│   ├── hooks/
│   │   ├── useAuth.ts              # Hook de autenticación
│   │   ├── useDebounce.ts          # Hook de debounce
│   │   ├── useAdminUsers.ts        # Hook para gestión de usuarios (admin)
│   │   ├── useAgentProperties.ts   # Hook para propiedades del agente
│   │   ├── useGerenciaData.ts      # Hook para datos de gerencia
│   │   ├── useLandlordSearch.ts    # Hook para buscar propietarios
│   │   ├── useLocationLogic.ts     # Hook para lógica de ubicaciones
│   │   ├── admin/                  # Hooks específicos del admin
│   │   └── agent/                  # Hooks específicos del agente
│   ├── lib/
│   │   ├── api/                    # Cliente API (fetch wrapper con auth)
│   │   └── route-config.ts         # Configuración de rutas por rol
│   ├── types/
│   │   ├── api.ts                  # Tipos de respuestas API
│   │   ├── property.ts             # Tipos de propiedades
│   │   └── location.ts             # Tipos de ubicaciones
│   └── proxy.ts                    # Proxy de API para desarrollo
├── public/                         # Archivos estáticos
├── next.config.ts                  # Configuración de Next.js (imágenes remotas, turbopack)
├── tsconfig.json                   # Configuración de TypeScript
├── eslint.config.mjs               # Configuración de ESLint 9
├── postcss.config.mjs              # PostCSS (Tailwind CSS 4)
├── .prettierrc                     # Configuración de Prettier + Tailwind sort
└── .prettierignore                 # Archivos ignorados por Prettier
```

---

## 🏃 Ejecución

```bash
npm run dev          # Servidor de desarrollo (http://localhost:3000)
npm run build        # Build de producción
npm run start        # Ejecutar build de producción
npm run lint         # ESLint
npm run format       # Prettier + ordenamiento de Tailwind
```

> También podés ejecutar desde la raíz del monorepo: `npm run dev:frontend`

---

## 🗺️ Rutas de la Aplicación

### Públicas

| Ruta             | Descripción                       |
| ---------------- | --------------------------------- |
| `/`              | Página principal (home)           |
| `/propiedades`   | Listado de propiedades            |
| `/contacto`      | Formulario de contacto            |
| `/nosotros`      | Página "Nosotros"                 |
| `/login`         | Página de login                   |

### Dashboards (protegidas por rol)

| Ruta              | Rol           | Descripción                                       |
| ----------------- | ------------- | ------------------------------------------------- |
| `/admin`          | Administrador | Gestión de usuarios, propiedades, configuración   |
| `/agente`         | Agente        | Gestión de propiedades asignadas, carga de props   |
| `/gerencia`       | Gerencia      | KPIs, estadísticas, reportes                      |
| `/inquilino`      | Inquilino     | Contratos activos, pagos, perfil                  |
| `/propietario`    | Propietario   | Propiedades propias, contratos, ingresos          |

---

## 🧩 Arquitectura de Componentes

El frontend sigue una arquitectura **Feature-First**:

- **`components/features/`** — Componentes específicos de una funcionalidad (auth, home, properties).
- **`components/dashboard/`** — Componentes de los dashboards organizados por rol.
- **`components/layout/`** — Componentes estructurales (Navbar, Footer, DashboardHeader).
- **`components/ui/`** — Librería interna de componentes reutilizables y atómicos.

---

## 🔗 Comunicación con el Backend

- El frontend consume la API REST del backend en `http://localhost:3001` (configurable via `NEXT_PUBLIC_API_URL`).
- Se usa **TanStack React Query** para cache, refetch automático y manejo de estado del servidor.
- La autenticación se maneja via **cookies httpOnly** (los tokens JWT se envían automáticamente con `credentials: 'include'`).

---

## 🎨 Estilo y Formato de Código

### Auto-Formato (VS Code)

1. Instalar la extensión **Prettier - Code formatter**.
2. Habilitar **"Format On Save"** en la configuración de VS Code.
   - Esto ordena automáticamente las clases de Tailwind (ej: `p-4 flex` → `flex p-4`) y corrige la indentación.

### Formato Manual

```bash
npx prettier --write .
```

### Configuración

- **`.prettierrc`** — Configuración de Prettier + plugin `prettier-plugin-tailwindcss`.
- **`.prettierignore`** — Archivos/carpetas ignorados (`.next`, `node_modules`).

---

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19](https://react.dev)
- [TanStack React Query](https://tanstack.com/query/latest)
- [Tailwind CSS 4](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org)
