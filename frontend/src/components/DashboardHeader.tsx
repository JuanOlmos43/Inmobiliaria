'use client';

import Icon, { IconName } from './Icon';

interface DashboardHeaderProps {
  title: string;
  userEmail: string;
  icon: IconName;
  onLogout: () => void;
}

export default function DashboardHeader({
  title,
  userEmail,
  icon,
  onLogout
}: DashboardHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Left side - Title and User */}
          <div className="flex items-center gap-3">
            <Icon name={icon} className="w-8 h-8 text-[#14b8a6]" />
            <div>
              <h1 className="text-2xl font-bold text-[#14b8a6]">{title}</h1>
              <p className="text-sm text-gray-300">Bienvenido, {userEmail}</p>
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
