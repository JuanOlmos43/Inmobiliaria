# 🏠 Propiedades Destacadas - Documentación Backend

## 📋 **Resumen**

Sistema de propiedades destacadas para la página principal (home). Las propiedades se seleccionan **automáticamente** según criterios definidos, sin intervención manual del agente.

---

## 🎯 **Endpoint Requerido**

### **GET /api/propiedades/featured**

**Descripción:** Retorna propiedades destacadas para mostrar en el carrusel de la página principal.

**Autenticación:** ❌ NO requiere autenticación (endpoint público)

**Parámetros:** Ninguno

**Respuesta exitosa (200):**

```json
[
  {
    "id": "uuid-123",
    "title": "Casa moderna en Oro Verde",
    "price": 150000,
    "currency": "USD",
    "listingType": "venta",
    "propertyType": "casa",
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 120,
    "mainImage": "https://supabase.url/imagen.jpg",
    "status": "activa",
    "location": "Oro Verde, Entre Ríos",
    "localidad": {
      "id": "uuid-loc",
      "nombre": "Oro Verde",
      "provincia": {
        "id": "uuid-prov",
        "nombre": "Entre Ríos"
      }
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

**Respuesta sin propiedades (200):**

```json
[]
```

**Respuesta de error (500):**

```json
{
  "statusCode": 500,
  "message": "Error al obtener propiedades destacadas",
  "error": "Internal Server Error"
}
```

---

## 🔧 **Implementación Recomendada**

### **Fase 1: Criterios Básicos (Implementar AHORA)**

**Algoritmo simple y efectivo:**

```typescript
async getFeaturedProperties() {
  // Criterios base
  const baseQuery = {
    status: 'activa',
    mainImage: { $exists: true, $ne: null }
  };

  // Obtener 3 propiedades de venta más recientes
  const ventaProperties = await this.propertyModel
    .find({
      ...baseQuery,
      listingType: 'venta'
    })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate('localidad')
    .populate('localidad.provincia')
    .exec();

  // Obtener 3 propiedades de alquiler más recientes
  const alquilerProperties = await this.propertyModel
    .find({
      ...baseQuery,
      listingType: 'alquiler'
    })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate('localidad')
    .populate('localidad.provincia')
    .exec();

  // Combinar y retornar (máximo 6 propiedades)
  return [...ventaProperties, ...alquilerProperties];
}
```

**¿Por qué este algoritmo?**

- ✅ **Simple**: Solo una query, fácil de mantener
- ✅ **Rápido**: Usa índices (createdAt, status, listingType)
- ✅ **Diverso**: Mix de venta y alquiler
- ✅ **Justo**: Todas las propiedades nuevas tienen oportunidad
- ✅ **Calidad**: Solo propiedades con imagen

---

## 📊 **Criterios de Selección**

### **Criterios Obligatorios (Fase 1):**

| Criterio    | Valor            | Razón                        |
| ----------- | ---------------- | ---------------------------- |
| `status`    | `'activa'`       | Solo propiedades disponibles |
| `mainImage` | Debe existir     | Mejor experiencia visual     |
| Orden       | `createdAt DESC` | Contenido fresco             |
| Límite      | 6 propiedades    | 3 venta + 3 alquiler         |

### **Criterios Opcionales (Fase 2 - Futuro):**

Cuando tengas más datos, puedes mejorar con:

```typescript
// Calcular score de calidad
const calculateQualityScore = (property) => {
  let score = 0;

  // Reciente (menos de 30 días)
  const daysSinceCreated =
    (Date.now() - property.createdAt) / (1000 * 60 * 60 * 24);
  if (daysSinceCreated < 30) score += 10;

  // Múltiples imágenes
  if (property.images && property.images.length > 3) score += 5;

  // Descripción completa
  if (property.description && property.description.length > 100) score += 5;

  // Popularidad (si tienes métricas)
  if (property.viewCount) score += Math.min(property.viewCount / 10, 10);

  return score;
};

// Ordenar por score
properties.sort((a, b) => calculateQualityScore(b) - calculateQualityScore(a));
```

---

## 🗄️ **Índices Recomendados**

Para optimizar el rendimiento, crea estos índices en MongoDB:

```typescript
// Índice compuesto para la query principal
propertySchema.index({
  status: 1,
  listingType: 1,
  createdAt: -1,
});

// Índice para verificar imagen
propertySchema.index({ mainImage: 1 });
```

---

## 🧪 **Casos de Prueba**

### **Test 1: Propiedades suficientes**

```typescript
// Setup: 5 propiedades de venta + 5 de alquiler (todas activas con imagen)
// Resultado esperado: 6 propiedades (3 venta + 3 alquiler)
```

### **Test 2: Pocas propiedades**

```typescript
// Setup: 2 propiedades de venta + 1 de alquiler
// Resultado esperado: 3 propiedades (2 venta + 1 alquiler)
```

### **Test 3: Sin propiedades**

```typescript
// Setup: Base de datos vacía
// Resultado esperado: [] (array vacío)
```

### **Test 4: Solo venta**

```typescript
// Setup: 5 propiedades de venta, 0 de alquiler
// Resultado esperado: 3 propiedades (3 venta + 0 alquiler)
```

### **Test 5: Propiedades sin imagen**

```typescript
// Setup: 10 propiedades pero solo 2 con mainImage
// Resultado esperado: 2 propiedades (las que tienen imagen)
```

---

## 📐 **Estructura de Datos Requerida**

### **Campos Obligatorios:**

```typescript
{
  id: string; // UUID de la propiedad
  title: string; // Título de la propiedad
  price: number; // Precio numérico
  currency: "USD" | "ARS"; // Moneda
  listingType: "venta" | "alquiler"; // Tipo de operación
  propertyType: string; // Tipo de inmueble (casa, depto, etc)
  bedrooms: number; // Cantidad de dormitorios
  bathrooms: number; // Cantidad de baños
  area: number; // Superficie en m²
  mainImage: string; // URL completa de la imagen principal
  status: string; // Estado de la propiedad
  createdAt: string; // Fecha de creación (ISO 8601)
}
```

### **Campos Opcionales pero Recomendados:**

```typescript
{
  location?: string;       // String de ubicación (ej: "Oro Verde, Entre Ríos")
  localidad?: {            // Objeto de localidad poblado
    id: string;
    nombre: string;
    provincia?: {
      id: string;
      nombre: string;
    }
  }
}
```

**Nota:** Si no envías `location`, el frontend construirá el string desde `localidad.nombre` y `localidad.provincia.nombre`.

---

## ⚡ **Optimizaciones de Performance**

### **1. Caché (Recomendado)**

```typescript
// Cachear el resultado por 5 minutos
@CacheKey('featured-properties')
@CacheTTL(300) // 5 minutos
async getFeaturedProperties() {
  // ... tu lógica
}
```

**¿Por qué?**

- Las propiedades destacadas no cambian frecuentemente
- Reduce carga en la base de datos
- Mejora tiempo de respuesta

### **2. Projection (Recomendado)**

```typescript
// Solo seleccionar campos necesarios
.select('id title price currency listingType propertyType bedrooms bathrooms area mainImage status createdAt localidad')
```

**¿Por qué?**

- Reduce tamaño de la respuesta
- Más rápido de serializar
- Menos ancho de banda

### **3. Lean Queries (Opcional)**

```typescript
.lean() // Retorna objetos planos en lugar de documentos Mongoose
```

---

## 🔒 **Seguridad**

### **Validaciones:**

1. ✅ **No exponer datos sensibles**
   - NO incluir: `ownerId`, `agentId`, datos del propietario
   - Solo datos públicos de la propiedad

2. ✅ **Rate limiting**
   - Limitar requests por IP (ej: 100 req/min)
   - Prevenir abuso del endpoint

3. ✅ **CORS**
   - Configurar CORS apropiadamente
   - Permitir origen del frontend

---

## 📈 **Monitoreo**

### **Métricas Recomendadas:**

```typescript
// Loggear métricas
logger.info("Featured properties fetched", {
  count: properties.length,
  ventaCount: ventaProperties.length,
  alquilerCount: alquilerProperties.length,
  executionTime: Date.now() - startTime,
});
```

### **Alertas:**

- ⚠️ Si el endpoint tarda más de 500ms
- ⚠️ Si retorna 0 propiedades por más de 1 hora
- ⚠️ Si hay errores frecuentes (>5% de requests)

---

## 🐛 **Troubleshooting**

### **Problema: Endpoint retorna array vacío**

**Posibles causas:**

1. No hay propiedades con `status: 'activa'`
2. Ninguna propiedad tiene `mainImage`
3. Error en la query de MongoDB

**Solución:**

```typescript
// Agregar logs para debuggear
const totalActive = await Property.countDocuments({ status: "activa" });
const withImages = await Property.countDocuments({
  status: "activa",
  mainImage: { $exists: true, $ne: null },
});

console.log(`Active: ${totalActive}, With images: ${withImages}`);
```

### **Problema: Endpoint muy lento (>1s)**

**Posibles causas:**

1. Falta índice en la base de datos
2. Populate muy pesado
3. Muchas propiedades en la base

**Solución:**

```typescript
// 1. Verificar índices
db.properties
  .getIndexes()

  // 2. Usar projection
  .select("campos necesarios");

// 3. Implementar caché
```

---

## ✅ **Checklist de Implementación**

- [ ] Endpoint `GET /api/propiedades/featured` creado
- [ ] Retorna solo propiedades con `status: 'activa'`
- [ ] Retorna solo propiedades con `mainImage`
- [ ] Ordena por `createdAt DESC`
- [ ] Limita a 6 propiedades (3 venta + 3 alquiler)
- [ ] Popula `localidad` y `localidad.provincia`
- [ ] Retorna array vacío si no hay propiedades (no error)
- [ ] Índices creados en MongoDB
- [ ] Endpoint es público (no requiere auth)
- [ ] Probado con todos los casos de prueba
- [ ] Caché implementado (opcional pero recomendado)
- [ ] Logs y métricas configurados

---

## 🚀 **Ejemplo de Respuesta Real**

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Casa moderna con piscina",
    "price": 250000,
    "currency": "USD",
    "listingType": "venta",
    "propertyType": "casa",
    "bedrooms": 4,
    "bathrooms": 3,
    "area": 180,
    "mainImage": "https://xxxxxx.supabase.co/storage/v1/object/public/properties/casa1.jpg",
    "status": "activa",
    "location": "Oro Verde, Entre Ríos",
    "localidad": {
      "id": "loc-123",
      "nombre": "Oro Verde",
      "provincia": {
        "id": "prov-456",
        "nombre": "Entre Ríos"
      }
    },
    "createdAt": "2024-02-01T10:30:00.000Z"
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "title": "Departamento céntrico 2 ambientes",
    "price": 85000,
    "currency": "ARS",
    "listingType": "alquiler",
    "propertyType": "departamento",
    "bedrooms": 1,
    "bathrooms": 1,
    "area": 45,
    "mainImage": "https://xxxxxx.supabase.co/storage/v1/object/public/properties/depto1.jpg",
    "status": "activa",
    "location": "Paraná, Entre Ríos",
    "localidad": {
      "id": "loc-789",
      "nombre": "Paraná",
      "provincia": {
        "id": "prov-456",
        "nombre": "Entre Ríos"
      }
    },
    "createdAt": "2024-02-05T15:45:00.000Z"
  }
]
```

---

## 📞 **Contacto**

Si tienes dudas sobre la implementación, consulta:

- Este documento
- El código del frontend en `src/components/FeaturedProperties.tsx`
- El servicio de API en `src/lib/api/services/properties.ts`

---

**Fecha:** 2026-02-10  
**Estado:** ✅ Frontend implementado y listo  
**Pendiente:** Implementación del endpoint en backend
