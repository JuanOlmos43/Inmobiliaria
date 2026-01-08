'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Tipos
interface OrganizationStats {
  totalProperties: number;
  occupancyRate: number;
  avgMarketTime: number;
  activeContracts: number;
  completedContracts: number;
}

export default function DashboardOwnerPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [stats, setStats] = useState<OrganizationStats>({
    totalProperties: 127,
    occupancyRate: 78.5,
    avgMarketTime: 45,
    activeContracts: 89,
    completedContracts: 234
  });

  // Verificar autenticación y rol
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    
    if (!isAuth || isAuth !== 'true' || role !== 'owner') {
      router.push('/login');
    } else {
      setUserEmail(email || '');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#14b8a6]">Dueño</h1>
              <p className="text-sm text-gray-300">Bienvenido, {userEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0f172a] mb-6">📊 Estadísticas de la Organización</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              title="Cantidad de Propiedades"
              value={stats.totalProperties}
              icon="🏢"
              color="from-[#0f172a] to-[#334155]"
              trend="+8 este mes"
              trendUp={true}
            />
            <StatsCard
              title="Ocupación Global"
              value={`${stats.occupancyRate}%`}
              icon="📊"
              color="from-[#14b8a6] to-[#0d9488]"
              trend="+5.2%"
              trendUp={true}
            />
            <StatsCard
              title="Tiempo Promedio en Mercado"
              value={`${stats.avgMarketTime} días`}
              icon="⏱️"
              color="from-[#475569] to-[#334155]"
              trend="-7 días"
              trendUp={true}
            />
            <StatsCard
              title="Contratos Activos"
              value={stats.activeContracts}
              icon="📝"
              color="from-[#14b8a6] to-[#0d9488]"
              trend="+12"
              trendUp={true}
            />
            <StatsCard
              title="Contratos Finalizados"
              value={stats.completedContracts}
              icon="✅"
              color="from-[#334155] to-[#0f172a]"
              trend="Total histórico"
              trendUp={true}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// Stats Card Component
function StatsCard({ 
  title, 
  value, 
  icon, 
  color, 
  trend, 
  trendUp 
}: { 
  title: string; 
  value: string | number; 
  icon: string; 
  color: string;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-4xl opacity-80">{icon}</div>
        <div className={`text-xs px-2 py-1 rounded-full ${trendUp ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
          {trend}
        </div>
      </div>
      <p className="text-sm opacity-90 mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
