# Inmobiliaria - Full Stack Application

Aplicación full-stack moderna para gestión inmobiliaria construida con Next.js, Nest.js, PostgreSQL (Supabase) y Prisma ORM.

## 🏗️ Estructura del Proyecto

```
inmobiliaria/
├── frontend/          # Aplicación Next.js
│   ├── src/
│   │   └── app/      # App Router de Next.js 14+
│   ├── public/
│   └── package.json
├── backend/           # API Nest.js
│   ├── src/
│   │   ├── prisma/   # Módulo y servicio de Prisma
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── prisma.config.ts
│   └── package.json
└── package.json       # Scripts raíz
```

## 🚀 Tecnologías

- **Frontend**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **Backend**: Nest.js + TypeScript
- **Base de Datos**: PostgreSQL (Supabase)
- **ORM**: Prisma 7
- **Node.js**: v24.11.1

## 📋 Prerequisitos

- ✅ Node.js v24.11.1 (instalado)
- ✅ npm 11.6.2 (instalado)
- ⏳ Cuenta en Supabase (https://supabase.com)

## ⚙️ Configuración Inicial

### 1. Instalar Dependencias

Este proyecto es un **monorepo sin workspaces**, por lo que las dependencias deben instalarse en cada carpeta.
Desde la raíz del proyecto:

```bash
npm run install:all

Este comando:
- Instala dependencias del root
- Instala dependencias del frontend
- Instala dependencias del backend
- Genera automáticamente el Prisma Client (postinstall)

### 2. Configurar Supabase

1. Ve a https://supabase.com y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a **Settings > Database** y copia la "Connection String" (URI mode)
4. Ve a **Settings > API** y copia:
   - Project URL
   - Anon/Public Key

### 3. Configurar Variables de Entorno

**Backend** - Crea `backend/.env` basado en `backend/.env.example`:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend** - Crea `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Base de Datos y Prisma

El backend usa Prisma 7 con adapter PostgreSQL.

La generación del cliente Prisma se ejecuta automáticamente en:
npm install
npm run start:dev

Si necesitás hacerlo manualmente:

```bash
cd backend

# Generar Prisma Client (ya ejecutado ✅)
npx prisma generate

# Crear y aplicar migraciones
npx prisma migrate dev --name init

# (Opcional) Abrir Prisma Studio para ver la base de datos
npx prisma studio
```

## 🏃 Ejecutar el Proyecto

### Desarrollo (Frontend + Backend simultáneamente)

```bash
# Desde la raíz del proyecto
npm run dev
```

Esto iniciará:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

No levantar frontend o backend manualmente si usás npm run dev, para evitar conflictos de puertos.

### Ejecutar por separado

**Frontend**:

```bash
npm run dev:frontend
# o
cd frontend && npm run dev
```

**Backend**:

```bash
npm run dev:backend
# o
cd backend && npm run start:dev
```

## 🔨 Comandos Útiles

### Frontend

```bash
cd frontend
npm run dev          # Modo desarrollo
npm run build        # Build de producción
npm run start        # Ejecutar build de producción
npm run lint         # Linter
```

### Backend

```bash
cd backend
npm run start:dev    # Modo desarrollo con hot-reload
npm run start:debug  # Modo debug
npm run build        # Build de producción
npm run start:prod   # Ejecutar build de producción
npm run test         # Tests unitarios
npm run test:e2e     # Tests end-to-end
```

### Prisma

```bash
cd backend
npx prisma generate        # Generar Prisma Client
npx prisma migrate dev     # Crear y aplicar migración
npx prisma migrate deploy  # Aplicar migraciones en producción
npx prisma studio          # Abrir GUI de base de datos
npx prisma db push         # Sincronizar schema sin migraciones
```

## 📊 Modelo de Datos

El proyecto incluye un modelo de ejemplo `User` en `backend/prisma/schema.prisma`:

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Personaliza este modelo según las necesidades de tu aplicación inmobiliaria (propiedades, clientes, agentes, etc.).

## 🔐 Características Configuradas

- ✅ **CORS** habilitado en el backend para comunicación con frontend
- ✅ **Prisma Service** global disponible en todos los módulos de Nest.js
- ✅ **TypeScript** configurado en frontend y backend
- ✅ **Tailwind CSS** para estilos en el frontend
- ✅ **ESLint** para calidad de código
- ✅ **Hot-reload** en desarrollo para ambos proyectos
- ✅ **Autenticación JWT** con Passport.js y cookies httpOnly
- ✅ **Protección CSRF** mediante cookies sameSite

## 🔒 Seguridad y Despliegue a Producción

### Configuración de Cookies (Importante)

El proyecto usa **cookies httpOnly** para almacenar tokens de autenticación. La configuración actual está optimizada para **desarrollo local** (frontend y backend en diferentes puertos).

**Para producción**, asegúrate de configurar las siguientes variables de entorno:

#### Backend (`backend/.env`)

```env
NODE_ENV=production
FRONTEND_URL=https://tu-dominio.com
```

#### Comportamiento automático según entorno:

| Configuración | Desarrollo | Producción |
|---------------|------------|------------|
| `sameSite` | `lax` (permite cross-origin) | `strict` (máxima seguridad) |
| `secure` | `false` (HTTP permitido) | `true` (solo HTTPS) |

> **⚠️ CRÍTICO**: En producción, el código automáticamente cambia a `sameSite: 'strict'` y `secure: true`. 
> Esto requiere que:
> 1. El frontend y backend estén en el **mismo dominio** (ej: `app.tudominio.com` y `api.tudominio.com`)
> 2. O uses un **proxy reverso** (ej: Nginx) para servir ambos desde el mismo origen
> 3. Ambos usen **HTTPS**

### Opciones de Despliegue Recomendadas

#### Opción 1: Mismo Dominio con Subdominios
```
Frontend: https://app.inmobiliaria.com
Backend:  https://api.inmobiliaria.com
```
Configurar CORS para permitir `https://app.inmobiliaria.com`

#### Opción 2: Proxy Reverso (Nginx/Vercel)
```
https://inmobiliaria.com/          → Frontend
https://inmobiliaria.com/api/      → Backend (proxy)
```
Las cookies funcionarán sin problemas porque ambos están en el mismo origen.

#### Opción 3: Plataformas Serverless
- **Frontend**: Vercel / Netlify
- **Backend**: Railway / Render / Fly.io
- Usar proxy reverso o configurar dominio compartido

### Checklist Pre-Producción

- [ ] Configurar `NODE_ENV=production` en el backend
- [ ] Configurar certificados SSL (HTTPS)
- [ ] Verificar que `FRONTEND_URL` apunta al dominio correcto
- [ ] Configurar CORS con el dominio de producción
- [ ] Cambiar secretos JWT (`JWT_SECRET`, `JWT_REFRESH_SECRET`)
- [ ] Configurar variables de entorno en la plataforma de hosting
- [ ] Probar login y cookies en el entorno de producción

## 📁 Problemas comunes

### Puerto ocupado (Windows)

Si aparece EADDRINUSE:

```bash
taskkill /F /IM node.exe
npm run dev
```

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Nest.js Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contribuir

Este es un proyecto privado. Para contribuir, contacta al administrador del repositorio.

## 📄 Licencia

ISC
