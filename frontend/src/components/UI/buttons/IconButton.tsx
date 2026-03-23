import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

// ─── Tipos ───────────────────────────────────────────────
type IconButtonVariant =
  | "default" // texto gris, hover gris       → editar, reset password
  | "primary" // bg accent                    → ver contrato, flechas featured
  | "danger" // texto/bg rojo                → eliminar, cancelar edición
  | "success" // texto/bg verde              → guardar edición
  | "warning" // texto/bg amber              → advertencias
  | "ghost" // transparente, hover sutil     → toggle password, cerrar localidad
  | "overlay"; // sobre imágenes              → flechas carrusel, mover imagen

type IconButtonSize = "xs" | "sm" | "md" | "lg";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon: ReactNode;
  "aria-label": string;
}

// ─── Estilos por variante ────────────────────────────────
const variantStyles: Record<IconButtonVariant, string> = {
  default: "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
  primary:
    "bg-(--accent) text-white shadow-md hover:bg-(--accent-hover) hover:shadow-lg",
  danger: "text-(--danger) hover:bg-red-100",
  success: "text-green-600 hover:bg-green-100",
  warning: "text-(--warning) hover:bg-amber-100",
  ghost: "text-gray-400 hover:text-gray-600",
  overlay: "bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm",
};

// ─── Estilos por tamaño ──────────────────────────────────
const sizeStyles: Record<IconButtonSize, string> = {
  xs: "p-1 [&>svg]:h-3.5 [&>svg]:w-3.5",
  sm: "p-1.5 [&>svg]:h-4 [&>svg]:w-4",
  md: "p-2 [&>svg]:h-5 [&>svg]:w-5",
  lg: "p-3 [&>svg]:h-6 [&>svg]:w-6",
};

// ─── Componente ──────────────────────────────────────────
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { variant = "default", size = "md", icon, className = "", ...props },
    ref
  ) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  )
);

IconButton.displayName = "IconButton";
export { IconButton, type IconButtonProps, type IconButtonVariant };
