# ✅ Checklist de Integración Backend - Filtros de Propiedades

## 🎯 Estado Actual: LISTO PARA BACKEND

---

## 📦 **Campos que el Frontend Envía al Backend**

### Endpoint esperado:

```
GET /api/properties/public
```

### Parámetros de Query (todos opcionales):

| Campo           | Tipo                    | Ejemplo        | Descripción                           |
| --------------- | ----------------------- | -------------- | ------------------------------------- |
| `operationType` | `"venta" \| "alquiler"` | `"alquiler"`   | Tipo de operación (obligatorio en UI) |
| `listingType`   | `"venta" \| "alquiler"` | `"alquiler"`   | Alias de operationType (mismo valor)  |
| `propertyType`  | `string`                | `"casa"`       | Tipo de inmueble                      |
| `province`      | `string`                | `"Entre Ríos"` | Provincia                             |
| `city`          | `string`                | `"Oro Verde"`  | Localidad/Ciudad                      |
| `minBedrooms`   | `number`                | `3`            | Mínimo de dormitorios                 |
| `minBathrooms`  | `number`                | `2`            | Mínimo de baños                       |
| `minPrice`      | `number`                | `50000`        | Precio mínimo                         |
| `maxPrice`      | `number`                | `200000`       | Precio máximo                         |
| `page`          | `number`                | `1`            | Número de página                      |
| `limit`         | `number`                | `6`            | Propiedades por página                |

---

## 🔍 **Ejemplo de Request Real**

### Caso 1: Usuario busca alquiler en Oro Verde

```
GET /api/properties/public?operationType=alquiler&listingType=alquiler&province=Entre%20R%C3%ADos&city=Oro%20Verde&page=1&limit=6
```

### Caso 2: Usuario busca venta con 3+ dormitorios

```
GET /api/properties/public?operationType=venta&listingType=venta&minBedrooms=3&minPrice=100000&maxPrice=500000&page=1&limit=6
```

### Caso 3: Usuario solo selecciona tipo (sin filtros adicionales)

```
GET /api/properties/public?operationType=alquiler&listingType=alquiler&page=1&limit=6
```

---

## 📤 **Formato de Respuesta Esperado**

El frontend espera esta estructura:

```typescript
{
  data: Property[],
  meta: {
    totalPages: number,
    currentPage: number,
    totalItems: number
  }
}
```

### Ejemplo de respuesta:

```json
{
  "data": [
    {
      "id": "123",
      "title": "Casa en Oro Verde",
      "price": 150000,
      "listingType": "venta",
      "propertyType": "casa",
      "bedrooms": 3,
      "bathrooms": 2,
      "area": 120,
      "mainImage": "https://...",
      "location": "Oro Verde, Entre Ríos",
      "localidad": {
        "nombre": "Oro Verde",
        "provincia": {
          "nombre": "Entre Ríos"
        }
      }
    }
  ],
  "meta": {
    "totalPages": 5,
    "currentPage": 1,
    "totalItems": 28
  }
}
```

---

## ⚙️ **Comportamiento del Frontend**

### 1. **Limpieza Automática de Filtros**

El frontend **automáticamente elimina** campos vacíos antes de enviar:

- ✅ Elimina `undefined`
- ✅ Elimina `null`
- ✅ Elimina strings vacíos `""`
- ✅ Solo envía valores reales

### 2. **Valores por Defecto**

- `operationType`: `"alquiler"` (obligatorio, usuario debe elegir)
- `page`: `1`
- `limit`: `6`

### 3. **Conversión de Tipos**

El frontend convierte automáticamente:

- Inputs de texto → strings
- Inputs numéricos → numbers (usando `parseInt` y `parseFloat`)

---

## 🔧 **Implementación Requerida en Backend**

### 1. **Endpoint: GET /api/properties/public**

```typescript
// Pseudo-código de lo que el backend debe implementar

async getPublicProperties(filters: PropertyFilters) {
  const {
    operationType,    // o listingType (son iguales)
    propertyType,
    province,
    city,
    minBedrooms,
    minBathrooms,
    minPrice,
    maxPrice,
    page = 1,
    limit = 6
  } = filters;

  // Construir query con filtros
  const query = {
    status: 'activa',  // Solo propiedades activas
    ...(operationType && { listingType: operationType }),
    ...(propertyType && { propertyType }),
    ...(province && { 'localidad.provincia.nombre': province }),
    ...(city && { 'localidad.nombre': city }),
    ...(minBedrooms && { bedrooms: { $gte: minBedrooms } }),
    ...(minBathrooms && { bathrooms: { $gte: minBathrooms } }),
    ...(minPrice && { price: { $gte: minPrice } }),
    ...(maxPrice && { price: { $lte: maxPrice } }),
  };

  // Ejecutar query con paginación
  const properties = await Property.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  const totalItems = await Property.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data: properties,
    meta: {
      totalPages,
      currentPage: page,
      totalItems
    }
  };
}
```

### 2. **Validaciones Recomendadas**

```typescript
// Validar que page y limit sean números positivos
if (page < 1) page = 1;
if (limit < 1 || limit > 100) limit = 6;

// Validar que operationType sea válido
if (operationType && !["venta", "alquiler"].includes(operationType)) {
  throw new BadRequestException('operationType debe ser "venta" o "alquiler"');
}

// Validar que los números sean válidos
if (minBedrooms && minBedrooms < 0) {
  throw new BadRequestException("minBedrooms debe ser >= 0");
}
```

### 3. **Manejo de Errores**

El backend debe retornar errores en este formato:

```json
{
  "statusCode": 400,
  "message": "Mensaje de error descriptivo",
  "error": "Bad Request"
}
```

El frontend mostrará el mensaje al usuario.

---

## 🧪 **Testing del Backend**

### Casos de Prueba Mínimos:

1. **Sin filtros (solo paginación)**

   ```
   GET /api/properties/public?page=1&limit=6
   ```

   Debe retornar las primeras 6 propiedades activas

2. **Filtro por tipo de operación**

   ```
   GET /api/properties/public?operationType=alquiler&page=1&limit=6
   ```

   Debe retornar solo propiedades en alquiler

3. **Filtro por ubicación**

   ```
   GET /api/properties/public?province=Entre%20Ríos&city=Oro%20Verde&page=1&limit=6
   ```

   Debe retornar propiedades en esa ubicación

4. **Filtros combinados**

   ```
   GET /api/properties/public?operationType=venta&minBedrooms=3&minPrice=100000&maxPrice=500000&page=1&limit=6
   ```

   Debe aplicar todos los filtros correctamente

5. **Sin resultados**
   ```
   GET /api/properties/public?city=CiudadInexistente&page=1&limit=6
   ```
   Debe retornar:
   ```json
   {
     "data": [],
     "meta": {
       "totalPages": 0,
       "currentPage": 1,
       "totalItems": 0
     }
   }
   ```

---

## 🚨 **Posibles Problemas y Soluciones**

### Problema 1: "operationType vs listingType"

**Solución:** El backend puede usar cualquiera de los dos (son iguales)

```typescript
const type = operationType || listingType;
```

### Problema 2: "Búsqueda por provincia/ciudad no funciona"

**Solución:** Asegurar que el backend busque en las relaciones correctas

```typescript
// Si usas Mongoose
.populate('localidad')
.populate('localidad.provincia')
```

### Problema 3: "Paginación incorrecta"

**Solución:** Verificar cálculo de skip/limit

```typescript
.skip((page - 1) * limit)  // Página 1 = skip 0, Página 2 = skip 6, etc.
.limit(limit)
```

---

## 📊 **Debugging**

### En el Frontend (Consola del Navegador):

```
Filters being sent to backend: { operationType: "alquiler", listingType: "alquiler", page: 1, limit: 6 }
```

### En el Backend (Logs):

```typescript
console.log("Received filters:", req.query);
console.log("Constructed query:", query);
console.log("Results found:", properties.length);
```

---

## ✅ **Checklist Final para el Backend**

- [ ] Endpoint `GET /api/properties/public` implementado
- [ ] Acepta todos los parámetros de query listados arriba
- [ ] Retorna formato `{ data: [], meta: {} }`
- [ ] Filtra solo propiedades con `status: 'activa'`
- [ ] Implementa paginación correctamente
- [ ] Maneja búsqueda por provincia y ciudad
- [ ] Valida parámetros numéricos (bedrooms, bathrooms, price)
- [ ] Retorna array vacío cuando no hay resultados (no error)
- [ ] Maneja errores con mensajes descriptivos
- [ ] Probado con casos de prueba mínimos

---

## 🎉 **Una vez implementado el backend:**

1. **Remover el console.log** de debugging en `propiedades/page.tsx` (línea 102)
2. **Verificar** que los filtros funcionen correctamente
3. **Probar** todos los casos de uso
4. **Celebrar** 🎊

---

**Fecha:** 2026-02-09
**Estado:** ✅ Frontend listo para integración
**Pendiente:** Implementación del endpoint en backend
