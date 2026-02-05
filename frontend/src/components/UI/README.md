# Componentes UI

Esta carpeta contiene todos los componentes de UI reutilizables y genéricos del proyecto. Estos componentes son bloques de construcción fundamentales que se utilizan en toda la aplicación.

## 📦 Componentes Disponibles

### Formularios

- **FormInput.tsx** - Input de texto reutilizable con estilos consistentes
- **FormSelect.tsx** - Select/dropdown reutilizable
- **FormTextarea.tsx** - Textarea reutilizable para texto largo

### Tarjetas (Cards)

- **StatsCard.tsx** - Tarjeta para mostrar estadísticas
- **ValueCard.tsx** - Tarjeta para mostrar valores/características
- **ContactInfoCard.tsx** - Tarjeta para información de contacto

### Navegación y Utilidades

- **Icon.tsx** - Componente de iconos con múltiples variantes
- **Modal.tsx** - Modal/diálogo reutilizable
- **EmptyState.tsx** - Estado vacío para listas sin datos
- **Pagination.tsx** - Componente de paginación
- **ScrollToTop.tsx** - Botón para volver arriba

## 🎯 Principios de Diseño

Los componentes en esta carpeta siguen estos principios:

1. **Reutilizables** - Pueden usarse en múltiples contextos
2. **Genéricos** - No contienen lógica de negocio específica
3. **Configurables** - Aceptan props para personalización
4. **Consistentes** - Mantienen estilos y comportamientos uniformes

## 📝 Uso

Importa los componentes usando el alias `@/components/UI`:

```tsx
import { FormInput, Icon, Modal } from "@/components/UI";
```

## 🔧 Agregar Nuevos Componentes

Cuando agregues un nuevo componente UI:

1. Asegúrate de que sea verdaderamente reutilizable
2. Documenta las props con TypeScript
3. Mantén la consistencia con los estilos existentes
4. Actualiza este README con el nuevo componente
