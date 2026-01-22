# Backend - Inmobiliaria API

API REST construida con NestJS, Prisma y PostgreSQL para el sistema de gestión inmobiliaria.

## Tecnologías

- **Framework**: NestJS
- **Base de datos**: PostgreSQL (Supabase)
- **ORM**: Prisma 7 con driver adapter
- **Autenticación**: Passport.js + JWT
- **Validación**: class-validator

## Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env` en la raíz del backend:

```env
# Database URLs
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# JWT Secrets
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
```

> **Importante**: 
> - `DATABASE_URL` usa el puerto 6543 (pooler de Supabase) para queries
> - `DIRECT_URL` usa el puerto 5432 (conexión directa) para migraciones

### 3. Configurar Prisma

El archivo `prisma.config.ts` debe exportar la configuración:

```typescript
export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
      directUrl: process.env.DIRECT_URL,
    },
  },
}
```

## Ejecutar el Proyecto

```bash
# Modo desarrollo (watch mode)
npm run start:dev

# Modo producción
npm run start:prod
```

El servidor estará disponible en `http://localhost:4000`

---

## 📋 Guía de Migraciones con Prisma

### Flujo Completo para Cambios en el Schema

Cuando necesites hacer cambios en la base de datos (agregar tablas, columnas, relaciones, etc.):

#### 1️⃣ Verificar Configuración

**Antes de cualquier migración**, asegúrate de que `prisma.config.ts` tenga la `DIRECT_URL`:

```typescript
export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
      directUrl: process.env.DIRECT_URL, // ← CRÍTICO para migraciones
    },
  },
}
```

#### 2️⃣ Modificar el Schema

Edita `prisma/schema.prisma` con los cambios necesarios:

```prisma
// Ejemplo: Agregar un nuevo enum
enum UserRole {
  admin
  agent
  landlord
  tenant
  manager // ← Nuevo rol agregado
}
```

#### 3️⃣ Crear y Aplicar la Migración

```bash
npx prisma migrate dev --name nombre_descriptivo_del_cambio
```

Esto hará automáticamente:
- ✅ Crear el archivo de migración SQL
- ✅ Aplicar la migración a la base de datos
- ✅ Regenerar el Prisma Client

**Ejemplo de nombres descriptivos:**
- `add_manager_role`
- `add_property_images_table`
- `add_user_phone_field`

#### 4️⃣ Verificar la Migración

Revisa que la migración se aplicó correctamente:

```bash
# Ver el estado de las migraciones
npx prisma migrate status

# Abrir Prisma Studio para ver los datos
npx prisma studio
```

#### 5️⃣ Actualizar Seed (si es necesario)

Si agregaste nuevos modelos o enums, actualiza `prisma/seed.ts`:

```typescript
// Ejemplo: Agregar usuario con nuevo rol
const manager = await prisma.user.create({
  data: {
    email: 'manager@inmobiliaria.com',
    role: UserRole.manager, // ← Usar el nuevo enum
    // ...
  },
});
```

#### 6️⃣ Ejecutar el Seed

```bash
npx tsx prisma/seed.ts
```

### Comandos Útiles de Prisma

```bash
# Regenerar el Prisma Client (después de cambios en schema.prisma)
npx prisma generate

# Resetear la base de datos (CUIDADO: borra todos los datos)
npx prisma migrate reset --force

# Ver el estado de las migraciones
npx prisma migrate status

# Abrir interfaz visual de la base de datos
npx prisma studio

# Formatear el archivo schema.prisma
npx prisma format
```

### ⚠️ Solución de Problemas Comunes

#### Error: "Drift detected"

**Problema**: El schema de Prisma no coincide con la base de datos.

**Solución**:
```bash
# Opción 1: Resetear la base de datos (desarrollo)
npx prisma migrate reset --force

# Opción 2: Crear una migración para resolver el drift
npx prisma migrate dev --name fix_drift
```

#### Error: "Missing DIRECT_URL"

**Problema**: Falta la configuración de `DIRECT_URL` en `prisma.config.ts`.

**Solución**:
1. Agregar `directUrl: process.env.DIRECT_URL` en `prisma.config.ts`
2. Verificar que `.env` tenga `DIRECT_URL` configurado
3. Reintentar la migración

#### Error: "Prisma Client not generated"

**Problema**: El cliente de Prisma no está actualizado después de cambios en el schema.

**Solución**:
```bash
npx prisma generate
```

#### Error en Seed: "Property 'X' does not exist on type 'Y'"

**Problema**: El Prisma Client no se regeneró después de agregar nuevos campos/enums.

**Solución**:
```bash
# 1. Regenerar el cliente
npx prisma generate

# 2. Ejecutar el seed nuevamente
npx tsx prisma/seed.ts
```

### 🔄 Flujo Recomendado (Checklist)

Usa este checklist cada vez que hagas cambios en la base de datos:

- [ ] Verificar que `prisma.config.ts` tiene `directUrl` configurado
- [ ] Modificar `prisma/schema.prisma` con los cambios necesarios
- [ ] Ejecutar `npx prisma migrate dev --name descripcion_del_cambio`
- [ ] Verificar que la migración se aplicó: `npx prisma migrate status`
- [ ] Si agregaste enums/modelos, actualizar `prisma/seed.ts`
- [ ] Ejecutar seed: `npx tsx prisma/seed.ts`
- [ ] Verificar datos en Prisma Studio: `npx prisma studio`

---

## Usuarios de Prueba

Después de ejecutar el seed, estarán disponibles estos usuarios:

| Email | Rol | Contraseña |
|-------|-----|------------|
| admin@inmobiliaria.com | admin | admin123 |
| agent@inmobiliaria.com | agent | admin123 |
| landlord@inmobiliaria.com | landlord | admin123 |
| tenant@inmobiliaria.com | tenant | admin123 |
| manager@inmobiliaria.com | manager | admin123 |

## Estructura del Proyecto

```
backend/
├── src/
│   ├── auth/           # Autenticación y autorización
│   ├── users/          # Gestión de usuarios
│   ├── propiedades/    # Gestión de propiedades
│   ├── ubicaciones/    # Gestión de ubicaciones (provincias, localidades, calles)
│   └── prisma/         # Servicio de Prisma
├── prisma/
│   ├── schema.prisma   # Schema de la base de datos
│   ├── seed.ts         # Datos de prueba
│   └── migrations/     # Historial de migraciones
└── prisma.config.ts    # Configuración de Prisma
```

## Documentación

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Passport.js](http://www.passportjs.org/)

## Licencia

MIT
