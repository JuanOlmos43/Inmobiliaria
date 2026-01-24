'use client';

import { useState } from 'react';
import Icon, { IconName } from '@/components/UI/Icon';

interface DashboardHeaderProps {
  title: 'Administrador' | 'Gerencia' | 'Agente' | 'Propietario' | 'Inquilino';
  onLogout: () => void;
}

// Mapeo de títulos de roles a sus iconos correspondientes
const roleIconMap: Record<string, IconName> = {
  'Administrador': 'settings',
  'Gerencia': 'star',
  'Agente': 'briefcase',
  'Propietario': 'home',
  'Inquilino': 'key'
};

export default function DashboardHeader({
  title,
  onLogout
}: DashboardHeaderProps) {
  const [userEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userEmail') || '';
    }
    return '';
  });

  // Obtener el icono basado en el título, con fallback a 'user'
  const icon = roleIconMap[title] || 'user';

  return (
    <header className="bg-[#0f172a] shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Left side - Title and User */}
          <div className="flex items-center gap-3">
            <Icon name={icon} className="w-8 h-8 text-[#14b8a6]" />
            <div>
              <h1 className="text-2xl font-bold text-[#14b8a6]">{title}</h1>
              <p className="text-sm text-gray-300 font-mono">Bienvenido, {userEmail}</p>
            </div>
          </div>

          {/* Right side - Logout Button */}
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Icon name="logout" className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}
