import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

// ─── Tipos ───────────────────────────────────────────────
type ButtonVariant =
  | "primary" // bg-(--accent)   → Guardar, Crear, Submit
  | "secondary" // bg-(--primary)  → Buscar, Enviar mensaje
  | "outline" // border gris     → Cancelar
  | "danger" // bg-red          → Confirmar eliminación
  | "success" // bg-green        → Confirmar éxito
  | "warning" // bg-amber        → Confirmar advertencia
  | "ghost"; // bg-gray-100     → Agregar feature, Limpiar filtros

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

// ─── Estilos por variante ────────────────────────────────
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-(--accent) text-white shadow-md hover:bg-(--accent-hover) hover:shadow-lg",
  secondary:
    "bg-(--primary)/95 text-white shadow-lg hover:bg-(--primary) hover:shadow-xl",
  outline:
    "border border-gray-300 text-gray-700 hover:border-red-600 hover:bg-red-600 hover:text-white",
	danger: "bg-(--danger) text-white hover:bg-red-700",
  success: "bg-(--success) text-white hover:bg-green-700",
  warning: "bg-(--warning) text-white hover:bg-amber-700",
  ghost: "bg-gray-100 text-gray-700 hover:bg-(--accent-hover) hover:text-white",
};

// ─── Estilos por tamaño ──────────────────────────────────
const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

// ─── Componente ──────────────────────────────────────────
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      icon,
      children,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full flex-1" : ""} ${className}`}
      {...props}
    >
      {isLoading && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
      )}
      {!isLoading && icon}
      {children}
    </button>
  )
);

Button.displayName = "Button";
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
