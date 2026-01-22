# Server Actions - DEPRECATED

## ⚠️ Nota Importante

Los Server Actions en este archivo (`auth.ts`) **ya no se utilizan** en el proyecto.

## ¿Por qué?

Las Server Actions se ejecutan en el **servidor de Next.js**, no en el navegador del usuario. Esto causa problemas con las cookies httpOnly:

1. El navegador hace login → Server Action (servidor Next.js)
2. Server Action llama al backend → Backend responde con cookies
3. Las cookies se quedan en el servidor de Next.js
4. El navegador del usuario **nunca recibe las cookies**

## Solución Implementada

Todas las llamadas a la API se hacen **directamente desde el navegador** usando los servicios en `lib/api/services/`:

```typescript
// ✅ Correcto: Llamada desde el navegador
import { authService } from '@/lib/api/services/auth'

await authService.login(email, password)
// Las cookies se guardan en el navegador automáticamente
```

```typescript
// ❌ Incorrecto: Server Action (deprecated)
import { loginAction } from '@/app/actions/auth'

await loginAction(email, password)
// Las cookies se quedan en el servidor de Next.js
```

## Servicios Disponibles

Todos los servicios están en `lib/api/services/`:
- `auth.ts` - Autenticación (login, logout, getMe)
- Futuros servicios para propiedades, usuarios, etc.

## Configuración de Cookies

Las cookies funcionan correctamente con:
- `credentials: 'include'` en fetch (configurado en `apiClient`)
- `sameSite: 'lax'` en desarrollo (configurado en backend)
- CORS con `credentials: true` (configurado en backend)

---

**Este archivo se mantiene por referencia pero no debe usarse.**
