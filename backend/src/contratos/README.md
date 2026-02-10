# Módulo de Contratos

Documentación de los endpoints disponibles en el módulo de Contratos de Alquiler.

## Base URL

`/contratos`

Todas las peticiones requieren autenticación (Bearer Token) y permisos de Agente para operaciones de escritura.

---

## 1. Listar Contratos (Paginado)

Obtiene el listado de contratos con filtros avanzados.

**Endpoint:** `GET /contratos`

**Query Params:**
| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `page` | number | Número de página (Default: 1) | `1` |
| `limit` | number | Resultados por página (Default: 10) | `20` |
| `status` | enum | `active`, `expired`, `terminated` | `active` |
| `tenantName` | string | Buscar por nombre O email del inquilino (parcial) | `Juan` |
| `landlordName` | string | Buscar por nombre O email del propietario (parcial) | `maria@email.com` |
| `propertyLocation`| string | Buscar por dirección de propiedad | `Av. Siempre Viva` |
| `propertyId` | UUID | Filtrar por propiedad específica | |
| `tenantId` | UUID | Filtrar por inquilino específico | |

**Respuesta:**

```json
{
  "data": [ ...contracts... ],
  "meta": {
    "total": 50,
    "page": 1,
    "totalPages": 5,
    "limit": 10
  }
}
```

---

## 2. Estadísticas Generales

Métricas rápidas para tarjetas de resumen.

**Endpoint:** `GET /contratos/stats`

**Query Params:** Ninguno.

**Respuesta:**

```json
{
  "monthly": {
    "new": 8, // Iniciados este mes
    "expiring": 3 // Finalizan este mes
  },
  "status": {
    "active": 45, // Total activos
    "expired": 120 // Total históricos vencidos
  }
}
```

---

## 3. Dashboard Mensual (Vencimientos y Ajustes)

Obtiene contratos que requieren atención en el mes actual (Vencimientos o Ajustes de precio).
Incluye lógica de auto-corrección para fechas de ajuste pasadas.

**Endpoint:** `GET /contratos/dashboard/expirations`

**Query Params:**
| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `type` | enum | `all` (default), `end_contract`, `adjustment` | `adjustment` |
| `search` | string | Buscar por nombre/email | `Pedro` |
| `role` | enum | `tenant`, `landlord`. Si se omite, busca en ambos. | `tenant` |

**Respuesta:**
Lista plana de contratos con campo extra `eventType`.

```json
[
  {
    "id": "...",
    "monthlyRent": 450000,
    "nextAdjustmentDate": "2024-03-15T00:00:00.000Z",
    "endDate": "2024-12-01T00:00:00.000Z",
    "eventType": "adjustment" // 'adjustment', 'end_contract' o 'both'
    // ... más datos del contrato, inquilino, propietario ...
  }
]
```

---

## 4. Crear Contrato

Crea un nuevo contrato.

- Valida que `startDate` < `endDate`.
- Calcula automáticamente `nextAdjustmentDate` basado en la frecuencia.
- **Automáticamente actualiza el estado de la propiedad asociada a `alquilada`.**

**Endpoint:** `POST /contratos`

**Body:**

```json
{
  "propertyId": "uuid...",
  "tenantId": "uuid...",
  "landlordId": "uuid...",
  "monthlyRent": 500000,
  "currency": "ARS", // (Opcional si se manejará)
  "startDate": "2024-01-01",
  "endDate": "2026-01-01",
  "adjustmentFrequency": 6, // Meses (1-12)
  "deposit": 500000
}
```

---

## 5. Actualizar Contrato

Modifica un contrato existente. Recalcula automáticamente fechas de ajuste si cambian las fechas base.

**Endpoint:** `PATCH /contratos/:id`

**Body:** (Campos opcionales)

```json
{
  "monthlyRent": 600000,
  "adjustmentFrequency": 3
}
```

---

## 6. Obtener Detalle

**Endpoint:** `GET /contratos/:id`

## 7. Eliminar Contrato

**Endpoint:** `DELETE /contratos/:id`
