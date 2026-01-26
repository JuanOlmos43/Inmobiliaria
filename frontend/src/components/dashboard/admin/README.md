# Componentes del Dashboard de Administrador

Esta carpeta contiene los componentes exclusivos del dashboard de administrador.

## Componentes

### UserFormModal

Modal para crear y editar usuarios del sistema. Permite:

- Crear nuevos usuarios con todos sus datos
- Editar usuarios existentes
- Asignar roles (Inquilino, Propietario, Agente, Gerencia)
- Validación de formularios

**Ubicación:** `UserFormModal.tsx`

**Props:**

- `isOpen`: boolean - Controla la visibilidad del modal
- `onClose`: () => void - Callback para cerrar el modal
- `editingUser`: User | null - Usuario a editar (null para crear nuevo)
- `onUserCreated`: (user: User) => void - Callback al crear usuario
- `onUserUpdated`: (user: User) => void - Callback al actualizar usuario

### UsersTable

Tabla para visualizar y gestionar todos los usuarios del sistema. Incluye:

- Listado de usuarios con todos sus datos
- Filtros por email y rol
- Acciones de editar y eliminar
- Toggle de estado activo/inactivo
- Visualización de contraseñas (solo para admin)

**Ubicación:** `UsersTable.tsx`

**Props:**

- `users`: User[] - Array de usuarios a mostrar
- `onEditUser`: (user: User) => void - Callback para editar usuario
- `onDeleteUser`: (userId: string) => void - Callback para eliminar usuario
- `onToggleStatus`: (userId: string) => void - Callback para cambiar estado

## Uso

Estos componentes son utilizados exclusivamente en la página de administrador:

```tsx
import UserFormModal from "@/components/dashboard/admin/UserFormModal";
import UsersTable from "@/components/dashboard/admin/UsersTable";
```

## Organización

Esta estructura sigue el patrón de organización por roles del dashboard, similar a la carpeta `agent/` que contiene componentes exclusivos del agente inmobiliario.
