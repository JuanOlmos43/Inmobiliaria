"use client";

import { Icon, IconName } from "@/components/ui";
import { UserRole } from "@/types/api";

interface DashboardHeaderProps {
  role: UserRole;
  onLogout: () => void;
  userEmail?: string;
}

// Mapeo de roles a sus iconos correspondientes
// La base de datos ya devuelve los nombres en español (Administrador, Gerencia, etc.)
const roleIconMap: Record<UserRole, IconName> = {
  [UserRole.Administrador]: "settings",
  [UserRole.Gerencia]: "star",
  [UserRole.Agente]: "briefcase",
  [UserRole.Propietario]: "home",
  [UserRole.Inquilino]: "key",
};

export function DashboardHeader({
  role,
  onLogout,
  userEmail,
}: DashboardHeaderProps) {
  // Obtener icono basado en el rol, con fallback seguro
  const icon = roleIconMap[role] || ("user" as IconName);

  return (
    <header className="sticky top-0 z-40 bg-(--primary) shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left side - Title and User */}
          <div className="flex items-center gap-3">
            <Icon name={icon} className="h-8 w-8 text-(--accent)" />
            <div>
              <h1 className="text-2xl font-bold text-(--accent)">{role}</h1>
              <p className="font-mono text-sm text-white">
                Bienvenido, {userEmail || ""}
              </p>
            </div>
          </div>

          {/* Right side - Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors hover:bg-(--danger)"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}
