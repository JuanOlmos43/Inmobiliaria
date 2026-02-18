# 🗄️ Backup & Restore — Sistema Inmobiliaria

Sistema de backup y restauración atómico para el proyecto Inmobiliaria.

Respalda tanto la **base de datos PostgreSQL** como los **archivos del Storage de Supabase** (imágenes de propiedades), garantizando consistencia completa del sistema.

## Arquitectura

```
Backup del sistema = DB (datos JSON) + Storage (imágenes)
Restore válido    = Prisma migrate + datos + imágenes
```

```
infra/backup/
├── src/
│   ├── config.js           ← Configuración compartida
│   ├── backup-db.js        ← Exporta todas las tablas como JSON
│   ├── backup-storage.js   ← Descarga archivos del bucket
│   ├── backup-all.js       ← Orquestador de backup completo
│   ├── restore-db.js       ← Recrea esquema + importa datos
│   ├── restore-storage.js  ← Sube archivos al bucket
│   ├── restore-all.js      ← Orquestador de restore completo
│   └── cleanup.js          ← Política de retención
├── backups/                ← Datos de backup (gitignored)
│   ├── db/                 ← Dumps por fecha
│   └── storage/            ← Imágenes por fecha
├── .env.backup             ← Variables de entorno (gitignored)
├── .env.backup.example     ← Template
├── package.json
└── README.md
```

## Prerequisitos

- **Node.js** (v18+)
- Acceso a las credenciales de Supabase (URL, Service Role Key, Database URL)

No se requieren herramientas externas. Todo se instala con `npm install`.

## Configuración

### 1. Instalar dependencias

```bash
cd infra/backup
npm install
```

### 2. Configurar variables de entorno

```bash
# Copiar template
cp .env.backup.example .env.backup

# Editar con tus credenciales
# Tip: Los valores son los mismos que en backend/.env
```

Variables requeridas:

| Variable | Descripción | Fuente |
|---|---|---|
| `DATABASE_URL` | Conexión directa PostgreSQL | `DIRECT_URL` de `backend/.env` |
| `SUPABASE_URL` | URL del proyecto Supabase | `SUPABASE_URL` de `backend/.env` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio | `SUPABASE_SERVICE_ROLE_KEY` de `backend/.env` |
| `BUCKET_NAME` | Nombre del bucket (default: `propiedades`) | Opcional |
| `RETENTION_COUNT` | Backups a retener (default: `7`) | Opcional |

## Uso

### Backup completo (recomendado)

```bash
npm run backup
```

Ejecuta en secuencia:
1. Exporta todas las tablas como JSON versionado
2. Descarga todas las imágenes del bucket
3. Limpia backups antiguos (retención de 7)

### Backup individual

```bash
npm run backup:db         # Solo base de datos
npm run backup:storage    # Solo imágenes
```

### Restore completo (recomendado)

```bash
npm run restore                              # Usa el backup más reciente
npm run restore -- 2026-02-17_153000         # Usa un backup específico
```

Ejecuta en secuencia:
1. `prisma migrate deploy` → recrea el esquema
2. Importa datos desde JSON → restaura toda la data
3. Sube imágenes al bucket → restaura el storage

### Restore individual

```bash
npm run restore:db                           # Solo base de datos
npm run restore:db -- 2026-02-17_153000      # Versión específica
npm run restore:storage                      # Solo imágenes
```

### Limpieza manual

```bash
npm run cleanup
```

## Desde la raíz del proyecto

También se puede ejecutar desde la raíz del monorepo:

```bash
npm run backup       # Backup completo
npm run restore      # Restore completo
```

## Backup automático

### Windows (Task Scheduler)

1. Abrir **Programador de tareas** (Task Scheduler)
2. Crear tarea básica → "Backup Inmobiliaria"
3. Trigger: Diario, a la hora deseada
4. Acción: Iniciar programa
   - Programa: `node`
   - Argumentos: `src/backup-all.js`
   - Directorio: `C:\projects\Inmobiliaria\infra\backup`

### Linux/Mac (cron)

```bash
# Backup diario a las 2:00 AM
0 2 * * * cd /path/to/Inmobiliaria/infra/backup && node src/backup-all.js >> backup.log 2>&1
```

## Escenario de examen: Restauración completa

Ante **eliminación total** del proyecto Supabase:

```bash
# 1. Configurar nuevo proyecto Supabase
#    → Obtener nuevas credenciales
#    → Actualizar .env.backup con las nuevas credenciales

# 2. Restaurar todo
cd infra/backup
npm run restore

# 3. Verificar
#    → Login funciona
#    → Propiedades visibles
#    → Imágenes cargan correctamente
```

**Sin** edición manual de tablas, recreación manual de datos, ni descarga manual de archivos.
