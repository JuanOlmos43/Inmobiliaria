# 📁 Estructura de Rutas - Next.js App Router

Esta documentación describe la organización de rutas del proyecto usando Next.js 13+ App Router con Route Groups.

## 🎯 Filosofía de Organización

La estructura está diseñada para:

- ✅ **Separación clara**: Páginas públicas vs dashboards protegidos
- ✅ **Layouts específicos**: Cada grupo tiene su propio layout
- ✅ **Code splitting automático**: Optimización de bundle por ruta
- ✅ **Escalabilidad**: Fácil agregar nuevos roles o páginas
- ✅ **URLs limpias**: Route groups no afectan las rutas públicas

## 📂 Estructura General

```
app/
├── (public)/                     # Route Group - Páginas públicas
├── (dashboard)/                  # Route Group - Dashboards protegidos
├── login/                        # Página de autenticación
├── layout.tsx                    # Root layout
├── globals.css                   # Estilos globales
└── icon.png                      # Favicon
```

---

## 🌐 `(public)` - Páginas Públicas

Páginas accesibles sin autenticación, con Navbar y Footer.

### Estructura:

```
(public)/
├── layout.tsx                    # Layout con Navbar + Footer + ScrollToTop
├── page.tsx                      # Home page (/)
├── contacto/
│   └── page.tsx                  # /contacto
├── nosotros/
│   └── page.tsx                  # /nosotros
└── propiedades/
    ├── page.tsx                  # /propiedades (listado)
    └── [id]/
        └── page.tsx              # /propiedades/[id] (detalle)
```

### Layout Features:

```typescript
// (public)/layout.tsx
- Navbar (navegación principal)
- Footer (información de contacto)
- ScrollToTop (botón para volver arriba)
```

### Rutas Públicas:

| Ruta                | Descripción               |
| ------------------- | ------------------------- |
| `/`                 | Página principal          |
| `/contacto`         | Formulario de contacto    |
| `/nosotros`         | Información de la empresa |
| `/propiedades`      | Listado de propiedades    |
| `/propiedades/[id]` | Detalle de una propiedad  |

---

## 🔐 `(dashboard)` - Dashboards Protegidos

Dashboards específicos por rol, protegidos con autenticación.

### Estructura:

```
(dashboard)/
├── layout.tsx                    # Layout con AuthProvider + DashboardHeader
├── admin/
│   └── page.tsx                  # /admin
├── agente/
│   └── page.tsx                  # /agente
├── gerencia/
│   └── page.tsx                  # /gerencia
├── inquilino/
│   └── page.tsx                  # /inquilino
└── propietario/
    └── page.tsx                  # /propietario
```

### Layout Features:

```typescript
// (dashboard)/layout.tsx
- AuthProvider (gestión de autenticación)
- DashboardHeader (header con info de usuario + logout)
- Protección de rutas (redirect a /login si no autenticado)
- Loading state (spinner mientras carga sesión)
```

### Rutas de Dashboard:

| Ruta           | Rol         | Descripción                        |
| -------------- | ----------- | ---------------------------------- |
| `/admin`       | Admin       | Gestión de usuarios y sistema      |
| `/agente`      | Agente      | Gestión de propiedades y contratos |
| `/gerencia`    | Gerencia    | Vista ejecutiva y reportes         |
| `/inquilino`   | Inquilino   | Mis contratos y pagos              |
| `/propietario` | Propietario | Mis propiedades y contratos        |

---

## 🔑 `/login` - Autenticación

Página de inicio de sesión, fuera de route groups.

### Estructura:

```
login/
└── page.tsx                      # /login
```

### Características:

- ✅ Sin layout de Navbar/Footer
- ✅ Redirección automática si ya está autenticado
- ✅ Redirección al dashboard correspondiente según rol

---

## 🏗️ Layouts Jerárquicos

### 1. **Root Layout** (`app/layout.tsx`)

Layout principal que envuelve toda la aplicación.

```typescript
// Responsabilidades:
- Configuración de fuentes (Geist Sans, Geist Mono)
- Metadata global (title, description)
- QueryProvider (React Query)
- HTML lang="es"
```

### 2. **Public Layout** (`(public)/layout.tsx`)

Layout para páginas públicas.

```typescript
// Responsabilidades:
- Navbar (navegación principal)
- Footer (información de contacto)
- ScrollToTop (UX mejorada)
- Estructura flex con min-h-screen
```

### 3. **Dashboard Layout** (`(dashboard)/layout.tsx`)

Layout para dashboards protegidos.

```typescript
// Responsabilidades:
- AuthProvider (contexto de autenticación)
- DashboardHeader (header con usuario y logout)
- Protección de rutas (useEffect + redirect)
- Loading state (spinner mientras valida sesión)
- Error handling (redirect si token inválido)
```

---

## 🎨 Route Groups - Ventajas

### ¿Qué son los Route Groups?

Carpetas con nombre entre paréntesis `(nombre)` que **NO afectan la URL**.

### Ventajas:

1. **Organización lógica sin afectar URLs**

   ```
   (public)/contacto  →  /contacto  (no /public/contacto)
   ```

2. **Layouts específicos por grupo**

   ```
   (public)/layout.tsx    →  Navbar + Footer
   (dashboard)/layout.tsx →  AuthProvider + DashboardHeader
   ```

3. **Code splitting automático**
   - Next.js separa el código de cada grupo
   - Dashboards no cargan en páginas públicas

4. **Separación de concerns**
   - Páginas públicas vs protegidas
   - Diferentes contextos y providers

---

## 🚀 Rutas Dinámicas

### Patrón `[id]`

```
propiedades/[id]/page.tsx
```

**Uso:**

```typescript
// Acceder al parámetro dinámico
export default function PropertyDetail({ params }: { params: { id: string } }) {
  const propertyId = params.id;
  // ...
}
```

**URLs generadas:**

```
/propiedades/1
/propiedades/2
/propiedades/abc-123
```

---

## 📝 Convenciones de Archivos

### Archivos Especiales de Next.js:

| Archivo         | Propósito                               |
| --------------- | --------------------------------------- |
| `layout.tsx`    | Layout compartido para rutas hijas      |
| `page.tsx`      | Página de la ruta                       |
| `loading.tsx`   | UI de loading (Suspense automático)     |
| `error.tsx`     | UI de error (Error Boundary automático) |
| `not-found.tsx` | UI de 404                               |

### Convenciones de Carpetas:

| Patrón      | Propósito                    |
| ----------- | ---------------------------- |
| `(nombre)`  | Route Group (no afecta URL)  |
| `[param]`   | Ruta dinámica                |
| `[...slug]` | Catch-all route              |
| `_carpeta`  | Carpeta privada (no es ruta) |

---

## 🔄 Flujo de Navegación

### Usuario No Autenticado:

```
1. Visita /agente
2. (dashboard)/layout.tsx detecta no auth
3. Redirect a /login
4. Usuario se autentica
5. Redirect a /agente (dashboard correspondiente)
```

### Usuario Autenticado:

```
1. Visita /agente
2. (dashboard)/layout.tsx valida token
3. Muestra DashboardHeader + contenido
4. Usuario navega libremente entre dashboards
```

---

## 🎯 Mejores Prácticas

### 1. **Mantener páginas ligeras**

```typescript
// ✅ Bueno - Página delega a componentes
export default function HomePage() {
  return <HomePageContent />;
}

// ❌ Evitar - Toda la lógica en la página
export default function HomePage() {
  // 500 líneas de código...
}
```

### 2. **Server Components por defecto**

```typescript
// ✅ Server Component (por defecto)
export default async function Page() {
  const data = await fetch(...);
  return <div>{data}</div>;
}

// Solo usar "use client" cuando sea necesario
"use client";
export default function InteractivePage() {
  const [state, setState] = useState();
  // ...
}
```

### 3. **Layouts para código compartido**

```typescript
// ✅ Bueno - Navbar en layout
// (public)/layout.tsx
export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

// ❌ Evitar - Navbar en cada página
```

### 4. **Metadata por página**

```typescript
// Cada página puede tener su metadata
export const metadata = {
  title: "Contacto - InmoHogar",
  description: "Contáctanos para más información",
};
```

---

## 📊 Code Splitting Automático

Next.js automáticamente separa el código por ruta:

```
Chunk 1: (public) pages     →  Navbar, Footer, propiedades
Chunk 2: (dashboard)/admin  →  Admin components
Chunk 3: (dashboard)/agente →  Agent components
```

**Beneficios:**

- ✅ Páginas públicas no cargan código de dashboards
- ✅ Cada dashboard solo carga su código específico
- ✅ Mejor performance y tiempo de carga

---

## 🔧 Mantenimiento

### Agregar nueva página pública:

```
1. Crear carpeta en (public)/
2. Agregar page.tsx
3. La ruta estará disponible automáticamente
```

### Agregar nuevo dashboard:

```
1. Crear carpeta en (dashboard)/
2. Agregar page.tsx
3. Actualizar middleware si es necesario
4. Actualizar tipos de roles
```

---

## 📚 Recursos

- [Next.js App Router](https://nextjs.org/docs/app)
- [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)

---

**Última actualización**: 2026-02-10  
**Versión**: 1.0.0 (Estructura con Route Groups)
