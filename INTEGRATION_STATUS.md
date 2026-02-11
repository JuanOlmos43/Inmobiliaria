# 📊 Estado de Integración Frontend <-> Backend

Esta tabla resume las discrepancias actuales entre las capacidades implementadas en el Backend y las interfaces listas en el Frontend.

## 🔴 Faltante en Backend (Frontend Listo)

Funcionalidades que ya tienen UI/Lógica en el frontend pero requieren implementación o ajuste en el backend.

| Funcionalidad                        | Estado Frontend                                                          | Estado Backend                                                 | Acción Requerida en Backend                                                                       |
| :----------------------------------- | :----------------------------------------------------------------------- | :------------------------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| **Filtros por Ubicación (Texto)**    | Envía parámetros `province` y `city` (nombres string) en la búsqueda.    | Solo acepta `localidadId` (UUID) o búsqueda genérica `search`. | Modificar `findAll` para aceptar y filtrar por `localidad.nombre` y `localidad.provincia.nombre`. |
| **Alias de Filtros**                 | Envía `operationType` como alias de `listingType`.                       | Espera estrictamente `listingType` en el DTO.                  | Mapear `operationType` a `listingType` en el Controller o DTO.                                    |
| **Upload de Imágenes (Integración)** | Componente `PropertyModal` listo con `ImageSection`. Lógica de UI lista. | Endpoints `/upload-url` y `/images` listos.                    | _Verificar_: Asegurar que el flujo de 3 pasos (URL -> Upload -> Confirm) esté orquestado.         |

## 🟠 Faltante en Frontend (Backend Listo)

Funcionalidades que el backend expone pero el frontend aún no consume o no tiene interfaz dedicada.

| Funcionalidad                | Estado Backend                                                                      | Estado Frontend                                                                                             | Acción Requerida en Frontend                                                           |
| :--------------------------- | :---------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| **Dashboard de Propietario** | Endpoint `GET /contratos/landlord/rented` listo para listar propiedades alquiladas. | No existe carpeta/componentes para dashboard de Propietario (`dashboard/landlord`).                         | Crear vistas para el rol `Propietario` (ver sus propiedades y estado de alquiler).     |
| **Dashboard de Inquilino**   | Modelos y relaciones listos para vincular inquilinos a contratos.                   | No existe interfaz para inquilinos.                                                                         | Crear vista donde el inquilino pueda ver su contrato vigente.                          |
| **Historial de Contratos**   | `ContratosService` permite consultar historial.                                     | Solo muestra "Vencimientos Próximos" (`UpcomingExpirations`).                                               | Agregar vista de listado completo/histórico de contratos en el dashboard de Agente.    |
| **Gestión de Localidades**   | Endpoints CRUD completos para Provincias/Localidades/Calles.                        | Servicio `propertiesService` tiene los métodos. No se ve UI administrativa para gestionar esto masivamente. | (Opcional) Crear ABM de Ubicaciones en Dashboard Admin si se requiere gestione manual. |

## ✅ Sincronizados (Ready to Go)

| Funcionalidad              | Estado                                                                    |
| :------------------------- | :------------------------------------------------------------------------ |
| **Propiedades Destacadas** | ✅ Backend (`/featured`) y Frontend (`FeaturedProperties`) sincronizados. |
| **CRUD Propiedades**       | ✅ Backend y Frontend (Agente) alineados.                                 |
| **Autenticación**          | ✅ Login y Registro (Admin/Agente) implementados.                         |
| **Estadísticas Admin**     | ✅ Endpoint `/users/stats` y componente `AdminStatsGrid` compatibles.     |

---

**Última actualización:** 2026-02-11
