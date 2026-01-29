"use client";

import Icon, { IconName } from "@/components/UI/Icon";
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

export default function DashboardHeader({
  role,
  onLogout,
  userEmail,
}: DashboardHeaderProps) {
  // Obtener icono basado en el rol, con fallback seguro
  const icon = roleIconMap[role] || ("user" as IconName);

  return (
    <header className="bg-(--primary) shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Left side - Title and User */}
          <div className="flex items-center gap-3">
            <Icon name={icon} className="w-8 h-8 text-(--accent)" />
            <div>
              <h1 className="text-2xl font-bold text-(--accent)">{role}</h1>
              <p className="text-sm text-gray-300 font-mono">
                Bienvenido, {userEmail || ""}
              </p>
            </div>
          </div>

          {/* Right side - Logout Button */}
          <button
            onClick={onLogout}
            className="px-4 py-2 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg
              className="w-5 h-5"
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
