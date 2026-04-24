# Inmobiliaria — Full Stack Application

Sistema de gestión integral para agencias inmobiliarias. Permite registrar y publicar propiedades en venta o alquiler, gestionar contratos con seguimiento de vencimientos y ajustes periódicos, y administrar usuarios con dashboards diferenciados según su rol (Administrador, Agente, Gerencia, Propietario e Inquilino). Incluye notificaciones automáticas por email ante eventos relevantes de los contratos, un panel de KPIs para gerencia, y herramientas de backup y restore de base de datos y almacenamiento.

Aplicación full-stack moderna construida con **Next.js 16**, **Nest.js 11**, **PostgreSQL (Supabase)** y **Prisma 7**.

---

## 🏗️ Estructura del Proyecto

```
inmobiliaria/
├── frontend/                   # Aplicación Next.js 16 (App Router)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/       # Páginas públicas (home, propiedades, contacto, nosotros)
│   │   │   ├── (dashboard)/    # Dashboards por rol (admin, agente, gerencia, inquilino, propietario)
│   │   │   └── login/          # Página de login
│   │   ├── components/
│   │   │   ├── dashboard/      # Componentes de dashboard (admin, agent, gerencia, common)
│   │   │   ├── features/       # Componentes feature-first (auth, home, properties)
│   │   │   ├── layout/         # Navbar, Footer, DashboardHeader
│   │   │   └── ui/             # Componentes reutilizables (buttons, cards, forms, modals, icons, feedback, navigation)
│   │   ├── context/            # AuthContext, QueryProvider (TanStack Query)
│   │   ├── hooks/              # Custom hooks (useAuth, useAgentProperties, useAdminUsers, useGerenciaData, etc.)
│   │   ├── lib/                # API client y route-config
│   │   └── types/              # Tipos TypeScript (api, property, location)
│   └── package.json
├── backend/                    # API REST Nest.js 11
│   ├── src/
│   │   ├── auth/               # Autenticación JWT + Passport.js (guards, strategies, decorators)
│   │   ├── users/              # Gestión de usuarios (CRUD, roles)
│   │   ├── propiedades/        # Gestión de propiedades (CRUD, filtros, featured)
│   │   ├── properties/         # Módulo de propiedades auxiliar
│   │   ├── contratos/          # Contratos de alquiler (CRUD, vencimientos)
│   │   ├── ubicaciones/        # Ubicaciones geográficas (provincias, localidades, calles)
│   │   ├── gerencia/           # Dashboard de gerencia (KPIs, estadísticas)
│   │   ├── notifications/      # Notificaciones por email (Resend)
│   │   ├── storage/            # Almacenamiento de archivos (Supabase Storage)
│   │   ├── contact/            # Formulario de contacto
│   │   └── prisma/             # Servicio global de Prisma
│   ├── prisma/
│   │   ├── schema.prisma       # Schema de la base de datos
│   │   ├── seed.ts             # Datos de prueba
│   │   └── migrations/         # Historial de migraciones
│   └── prisma.config.ts        # Configuración de Prisma 7 (adapter-pg)
├── infra/
│   └── backup/                 # Herramientas de backup y restore (DB + Storage)
└── package.json                # Scripts raíz (monorepo)
```

---

## 🚀 Tecnologías

| Capa            | Tecnología                                         |
| --------------- | -------------------------------------------------- |
| **Frontend**    | Next.js 16 (App Router) · React 19 · TypeScript    |
| **Estilos**     | Tailwind CSS 4 · CSS Variables                     |
| **Estado**      | TanStack React Query 5                             |
| **Gráficos**    | Recharts 3                                         |
| **Backend**     | Nest.js 11 · TypeScript                            |
| **Autenticación** | Passport.js · JWT (access + refresh tokens)      |
| **Validación**  | class-validator · class-transformer                |
| **Email**       | Resend                                             |
| **Base de Datos** | PostgreSQL (Supabase)                            |
| **ORM**         | Prisma 7 (driver adapter `@prisma/adapter-pg`)     |
| **Storage**     | Supabase Storage                                   |
| **Infra**       | Scripts de backup/restore (DB + Storage)            |
| **Node.js**     | v20.18.0                                           |

---

## 📋 Prerequisitos

- ✅ **Node.js** v20.18.0+
- ✅ **npm** 10.8.2+
- ✅ **Cuenta en Supabase** → https://supabase.com

---

## ⚙️ Configuración Inicial

### 1. Instalar Dependencias

Este proyecto es un **monorepo sin workspaces**; las dependencias se instalan en cada carpeta:

```bash
# Desde la raíz del proyecto
npm run install:all
```

Esto instala dependencias del root, frontend, backend e infra/backup, y genera automáticamente el Prisma Client (`postinstall`).

### 2. Configurar Supabase

1. Ve a https://supabase.com y crea una cuenta.
2. Crea un nuevo proyecto.
3. Ve a **Settings > Database** y copia la **Connection String** (URI mode).
4. Ve a **Settings > API** y copia:
   - Project URL
   - `anon` / public key
   - `service_role` key (solo para backend)

### 3. Configurar Variables de Entorno

**Backend** — Crear `backend/.env` basado en las siguientes variables:

```env
# Database
DATABASE_URL="postgresql://...@pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://...@pooler.supabase.com:5432/postgres"

# Server
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# JWT
JWT_ACCESS_SECRET="clave-secreta-access"
JWT_REFRESH_SECRET="clave-secreta-refresh"
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Supabase
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

> ⚠️ `DATABASE_URL` usa el puerto **6543** (pooler PgBouncer) para queries.
> `DIRECT_URL` usa el puerto **5432** (conexión directa) para migraciones.

**Frontend** — Crear `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Base de Datos y Prisma

El backend usa **Prisma 7** con `@prisma/adapter-pg`. La generación del cliente se ejecuta automáticamente al correr `npm install` o `npm run start:dev`.

Si necesitás hacerlo manualmente:

```bash
cd backend

npx prisma generate                      # Generar Prisma Client
npx prisma migrate dev --name init        # Crear y aplicar migración
npx prisma studio                         # (Opcional) GUI de la base de datos
```

### 5. Seed de Datos

```bash
cd backend
npx tsx prisma/seed.ts
```

---

## 🏃 Ejecutar el Proyecto

### Desarrollo (Frontend + Backend simultáneamente)

```bash
# Desde la raíz del proyecto
npm run dev
```

Esto iniciará:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

> No levantar frontend o backend manualmente si usás `npm run dev`, para evitar conflictos de puertos.

### Ejecutar por separado

```bash
# Frontend
npm run dev:frontend
# o: cd frontend && npm run dev

# Backend
npm run dev:backend
# o: cd backend && npm run start:dev
```

---

## 🔨 Comandos Útiles

### Raíz (Monorepo)

```bash
npm run dev              # Frontend + Backend en paralelo
npm run install:all      # Instalar todo (root + frontend + backend + infra)
npm run build            # Build de producción (frontend + backend)
npm run format           # Prettier en frontend + backend
npm run backup           # Backup completo (DB + Storage)
npm run backup:db        # Solo backup de base de datos
npm run backup:storage   # Solo backup de storage
npm run restore          # Restore completo
npm run nuke             # ⚠️ Eliminar datos de la DB
npm run quality          # Análisis estático con Semgrep
```

### Frontend

```bash
cd frontend
npm run dev              # Modo desarrollo
npm run build            # Build de producción
npm run start            # Ejecutar build de producción
npm run lint             # ESLint
npm run format           # Prettier + Tailwind sort
```

### Backend

```bash
cd backend
npm run start:dev        # Modo desarrollo con hot-reload
npm run start:debug      # Modo debug
npm run build            # Build de producción
npm run start:prod       # Ejecutar build de producción
npm run test             # Tests unitarios
npm run test:e2e         # Tests end-to-end
npm run format           # Prettier
```

### Prisma

```bash
cd backend
npx prisma generate             # Generar Prisma Client
npx prisma migrate dev          # Crear y aplicar migración
npx prisma migrate deploy       # Aplicar migraciones en producción
npx prisma migrate status       # Ver estado de migraciones
npx prisma studio               # GUI de base de datos
npx prisma db push              # Sincronizar schema sin migraciones
npx prisma format               # Formatear schema.prisma
```

---

## 📊 Modelo de Datos

El schema completo se encuentra en `backend/prisma/schema.prisma`.

### Entidades principales

| Modelo              | Descripción                                           |
| ------------------- | ----------------------------------------------------- |
| `User`              | Usuarios del sistema con roles y estado                |
| `RefreshToken`      | Tokens de refresco para autenticación JWT              |
| `Provincia`         | Provincias (nivel superior de ubicación)               |
| `Localidad`         | Localidades dentro de una provincia                    |
| `Calle`             | Calles dentro de una localidad                         |
| `Property`          | Propiedades inmobiliarias (venta o alquiler)           |
| `PropertyImage`     | Imágenes asociadas a una propiedad                     |
| `PropertyFeature`   | Características adicionales de una propiedad           |
| `RentalContract`    | Contratos de alquiler entre partes                     |
| `Notification`      | Notificaciones enviadas a usuarios (vencimientos, ajustes) |

### Enums

| Enum                    | Valores                                                   |
| ----------------------- | --------------------------------------------------------- |
| `UserRole`              | Administrador, Agente, Propietario, Inquilino, Gerencia   |
| `UserStatus`            | active, inactive, suspended                               |
| `PropertyType`          | casa, departamento, terreno, duplex, monoambiente, local_comercial, oficina |
| `PropertyListingType`   | venta, alquiler                                           |
| `PropertyStatus`        | activa, pausada, alquilada, vendida, archivada            |
| `ContractStatus`        | active, expired, terminated                               |
| `NotificationType`      | contract_expiration, rent_adjustment                      |
| `NotificationChannel`   | email                                                     |
| `NotificationStatus`    | sent, failed                                              |

---

## 🔐 Características Configuradas

- ✅ **CORS** habilitado para comunicación frontend ↔ backend
- ✅ **Prisma Service** global disponible en todos los módulos de Nest.js
- ✅ **TypeScript** en frontend y backend
- ✅ **Tailwind CSS 4** para estilos en el frontend
- ✅ **TanStack Query** para manejo de estado del servidor
- ✅ **ESLint + Prettier** para calidad y formato de código
- ✅ **Hot-reload** en desarrollo para ambos proyectos
- ✅ **Autenticación JWT** con Passport.js y cookies httpOnly
- ✅ **Refresh Tokens** con rotación segura
- ✅ **Protección CSRF** mediante cookies `sameSite`
- ✅ **Dashboards por rol** (Admin, Agente, Gerencia, Inquilino, Propietario)
- ✅ **Supabase Storage** para imágenes de propiedades
- ✅ **Notificaciones por email** con Resend
- ✅ **Backup & Restore** automatizado (DB + Storage)

---

## 🔒 Seguridad y Despliegue a Producción

### Configuración de Cookies

El proyecto usa **cookies httpOnly** para tokens de autenticación. La configuración se ajusta automáticamente según entorno:

| Configuración | Desarrollo                   | Producción                  |
| ------------- | ---------------------------- | --------------------------- |
| `sameSite`    | `lax` (permite cross-origin) | `strict` (máxima seguridad) |
| `secure`      | `false` (HTTP permitido)     | `true` (solo HTTPS)         |

> **⚠️ En producción**, el código cambia automáticamente a `sameSite: 'strict'` y `secure: true`.
> Esto requiere que:
> 1. Frontend y backend estén en el **mismo dominio** (ej: `app.tudominio.com` y `api.tudominio.com`)
> 2. O uses un **proxy reverso** (Nginx) para servir ambos desde el mismo origen
> 3. Ambos usen **HTTPS**


---

## 📁 Problemas Comunes

### Puerto ocupado (Windows)

Si aparece `EADDRINUSE`:

```bash
taskkill /F /IM node.exe
npm run dev
```

---

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Nest.js Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Resend (Email)](https://resend.com/docs)

---
