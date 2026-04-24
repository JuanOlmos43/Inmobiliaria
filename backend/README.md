# Backend — Inmobiliaria API

API REST construida con **NestJS 11**, **Prisma 7** y **PostgreSQL (Supabase)** para el sistema de gestión inmobiliaria.

---

## 🚀 Tecnologías

| Categoría         | Tecnología                                  |
| ----------------- | ------------------------------------------- |
| **Framework**     | NestJS 11                                   |
| **Lenguaje**      | TypeScript 5                                |
| **Base de Datos** | PostgreSQL (Supabase)                       |
| **ORM**           | Prisma 7 (`@prisma/adapter-pg`)             |
| **Autenticación** | Passport.js · JWT (access + refresh tokens) |
| **Validación**    | class-validator · class-transformer         |
| **Email**         | Resend                                      |
| **Storage**       | Supabase Storage                            |
| **Scheduling**    | `@nestjs/schedule`                          |
| **Testing**       | Jest · Supertest                            |
| **Linting**       | ESLint 9 · Prettier                         |

---

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── main.ts                     # Entry point (CORS, cookie-parser)
│   ├── app.module.ts               # Módulo raíz (importa todos los módulos)
│   ├── app.controller.ts           # Controller raíz
│   ├── app.service.ts              # Service raíz
│   ├── auth/                       # 🔐 Autenticación y autorización
│   │   ├── auth.controller.ts      # Endpoints: login, register, refresh, logout
│   │   ├── auth.service.ts         # Lógica de autenticación JWT
│   │   ├── auth.module.ts
│   │   ├── guards/                 # JwtAuthGuard, RolesGuard
│   │   ├── strategies/             # JwtStrategy, LocalStrategy
│   │   ├── decorators/             # @Roles(), @Public(), @CurrentUser()
│   │   └── dto/                    # LoginDto, RegisterDto
│   ├── users/                      # 👤 Gestión de usuarios
│   │   ├── users.controller.ts     # CRUD de usuarios
│   │   ├── users.service.ts        # Lógica de negocio de usuarios
│   │   ├── users.module.ts
│   │   └── dto/                    # CreateUserDto, UpdateUserDto
│   ├── propiedades/                # 🏠 Gestión de propiedades
│   │   ├── propiedades.controller.ts  # CRUD, filtros, featured
│   │   ├── propiedades.service.ts     # Lógica de propiedades (~18k líneas)
│   │   ├── propiedades.module.ts
│   │   ├── dto/                       # CreatePropertyDto, UpdatePropertyDto, filtros
│   │   └── entities/                  # Entidades de propiedades
│   ├── properties/                 # 🏗️ Módulo de propiedades auxiliar
│   ├── contratos/                  # 📋 Contratos de alquiler
│   │   ├── contratos.controller.ts # CRUD de contratos
│   │   ├── contratos.service.ts    # Lógica de contratos (~18k líneas)
│   │   ├── contratos.module.ts
│   │   ├── dto/                    # CreateContractDto, UpdateContractDto
│   │   └── entities/               # Entidades de contratos
│   ├── ubicaciones/                # 📍 Ubicaciones geográficas
│   │   ├── ubicaciones.controller.ts  # Provincias, localidades, calles
│   │   ├── ubicaciones.service.ts
│   │   └── ubicaciones.module.ts
│   ├── gerencia/                   # 📊 Dashboard de gerencia
│   │   ├── gerencia.controller.ts  # KPIs y estadísticas
│   │   ├── gerencia.service.ts     # Lógica de reportes
│   │   └── gerencia.module.ts
│   ├── notifications/              # 📧 Notificaciones por email
│   │   ├── notifications.controller.ts
│   │   ├── notifications.service.ts   # Envío de emails con Resend
│   │   └── notifications.module.ts
│   ├── storage/                    # 📦 Almacenamiento de archivos
│   │   ├── storage.service.ts      # Subida/descarga desde Supabase Storage
│   │   └── storage.module.ts
│   ├── contact/                    # ✉️ Formulario de contacto
│   │   ├── contact.controller.ts
│   │   ├── contact.service.ts
│   │   ├── contact.module.ts
│   │   ├── dto/                    # ContactDto
│   │   └── providers/              # Proveedores de email
│   └── prisma/                     # 🗄️ Servicio global de Prisma
│       ├── prisma.service.ts       # PrismaService (global, onModuleInit)
│       └── prisma.module.ts
├── prisma/
│   ├── schema.prisma               # Schema de la base de datos
│   ├── seed.ts                     # Datos de prueba
│   └── migrations/                 # Historial de migraciones SQL
├── prisma.config.ts                # Configuración de Prisma 7 (datasources)
├── supabase_policies.sql           # Políticas RLS de Supabase
├── test/                           # Tests E2E
├── tsconfig.json                   # Configuración de TypeScript
├── tsconfig.build.json             # Config de build
├── nest-cli.json                   # Configuración de Nest CLI
├── eslint.config.mjs               # Configuración de ESLint 9
└── .prettierrc                     # Configuración de Prettier
```

---

## ⚙️ Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env` en la raíz del backend:

```env
# Database
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# Server
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# JWT
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Supabase
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

> **Importante**:
>
> - `DATABASE_URL` usa el puerto **6543** (PgBouncer pooler de Supabase) para queries.
> - `DIRECT_URL` usa el puerto **5432** (conexión directa) para migraciones.

### 3. Configurar Prisma

El archivo `prisma.config.ts` exporta la configuración del datasource:

```typescript
export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
      directUrl: process.env.DIRECT_URL, // ← Crítico para migraciones
    },
  },
};
```

---

## 🏃 Ejecución

```bash
npm run start:dev        # Modo desarrollo (watch mode)
npm run start:debug      # Modo debug
npm run start:prod       # Modo producción
```

El servidor estará disponible en `http://localhost:3001`.

---

## 📊 Modelo de Datos

El schema completo está en `prisma/schema.prisma`.

### Entidades

| Modelo            | Descripción                                                                  |
| ----------------- | ---------------------------------------------------------------------------- |
| `User`            | Usuarios con roles (Administrador, Agente, Propietario, Inquilino, Gerencia) |
| `RefreshToken`    | Tokens de refresco para JWT                                                  |
| `Provincia`       | Provincias argentinas                                                        |
| `Localidad`       | Localidades dentro de una provincia                                          |
| `Calle`           | Calles dentro de una localidad                                               |
| `Property`        | Propiedades inmobiliarias (venta/alquiler)                                   |
| `PropertyImage`   | Imágenes de una propiedad (Supabase Storage)                                 |
| `PropertyFeature` | Características adicionales (ej: "Cochera", "Patio")                         |
| `RentalContract`  | Contratos de alquiler (inquilino, propietario, agente)                       |

### Enums

```
UserRole:            Administrador | Agente | Propietario | Inquilino | Gerencia
UserStatus:          active | inactive | suspended
PropertyType:        casa | departamento | terreno | duplex | monoambiente | local_comercial | oficina
PropertyListingType: venta | alquiler
PropertyStatus:      activa | pausada | alquilada | vendida | archivada
ContractStatus:      active | expired | terminated
```

---

## 🔐 Autenticación

El sistema usa **JWT con refresh tokens** almacenados en **cookies httpOnly**:

1. **Login** → genera `accessToken` (15 min) + `refreshToken` (7 días).
2. **Access Token** → enviado como cookie httpOnly.
3. **Refresh Token** → almacenado como cookie httpOnly y en BD (hash).
4. **Refresh** → rota el refresh token (el anterior se invalida).
5. **Logout** → elimina tokens de cookies y BD.

### Guards disponibles

- `JwtAuthGuard` — Protege endpoints que requieren autenticación.
- `RolesGuard` — Restringe acceso según el rol del usuario.

### Decoradores

- `@Roles(UserRole.Administrador, ...)` — Define roles permitidos.
- `@Public()` — Marca un endpoint como público (sin autenticación).
- `@CurrentUser()` — Inyecta el usuario autenticado en el handler.

---

## 👥 Usuarios de Prueba

Después de ejecutar el seed (`npx tsx prisma/seed.ts`):

| Email                     | Rol           | Contraseña |
| ------------------------- | ------------- | ---------- |
| admin@inmobiliaria.com    | Administrador | admin123   |
| agent@inmobiliaria.com    | Agente        | admin123   |
| landlord@inmobiliaria.com | Propietario   | admin123   |
| tenant@inmobiliaria.com   | Inquilino     | admin123   |
| manager@inmobiliaria.com  | Gerencia      | admin123   |

---

## 📋 Guía de Migraciones con Prisma

### Flujo Completo

```bash
# 1. Verificar que prisma.config.ts tiene directUrl ✅
# 2. Modificar prisma/schema.prisma con los cambios
# 3. Crear y aplicar la migración
npx prisma migrate dev --name descripcion_del_cambio

# 4. Verificar
npx prisma migrate status

# 5. (Si agregaste enums/modelos) actualizar prisma/seed.ts
# 6. Ejecutar seed
npx tsx prisma/seed.ts

# 7. Verificar datos
npx prisma studio
```

### Comandos Útiles de Prisma

```bash
npx prisma generate              # Regenerar Prisma Client
npx prisma migrate dev           # Crear y aplicar migración
npx prisma migrate deploy        # Aplicar migraciones en producción
npx prisma migrate status        # Ver estado de migraciones
npx prisma migrate reset --force # ⚠️ Resetear DB (borra datos)
npx prisma studio                # GUI de base de datos
npx prisma format                # Formatear schema.prisma
npx prisma db push               # Sync schema sin migraciones
```

### Solución de Problemas

| Error                         | Causa                                   | Solución                                                                       |
| ----------------------------- | --------------------------------------- | ------------------------------------------------------------------------------ |
| "Drift detected"              | Schema no coincide con la DB            | `npx prisma migrate reset --force` o `npx prisma migrate dev --name fix_drift` |
| "Missing DIRECT_URL"          | Falta `directUrl` en `prisma.config.ts` | Agregar `directUrl: process.env.DIRECT_URL`                                    |
| "Prisma Client not generated" | Cliente no actualizado                  | `npx prisma generate`                                                          |
| "Property 'X' does not exist" | Cliente no regenerado tras cambios      | `npx prisma generate` → reintentar                                             |

### Checklist de Migraciones

- [ ] Verificar que `prisma.config.ts` tiene `directUrl` configurado
- [ ] Modificar `prisma/schema.prisma` con los cambios
- [ ] Ejecutar `npx prisma migrate dev --name descripcion`
- [ ] Verificar que la migración se aplicó: `npx prisma migrate status`
- [ ] Si agregaste enums/modelos → actualizar `prisma/seed.ts`
- [ ] Ejecutar seed: `npx tsx prisma/seed.ts`
- [ ] Verificar datos en Prisma Studio: `npx prisma studio`

---

## 🔨 Comandos Disponibles

```bash
npm run start:dev        # Desarrollo con hot-reload
npm run start:debug      # Modo debug
npm run build            # Build de producción
npm run start:prod       # Ejecutar producción
npm run test             # Tests unitarios
npm run test:watch       # Tests en watch mode
npm run test:cov         # Coverage
npm run test:e2e         # Tests E2E
npm run format           # Prettier
npm run lint             # ESLint con auto-fix
npm run prisma:generate  # Generar Prisma Client
npm run prisma:migrate   # Crear migración
npm run prisma:seed      # Ejecutar seed
```

---

## 📚 Recursos

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Passport.js](http://www.passportjs.org/)
- [Supabase](https://supabase.com/docs)
- [Resend](https://resend.com/docs)
- [class-validator](https://github.com/typestack/class-validator)

---

## 📄 Licencia

ISC
