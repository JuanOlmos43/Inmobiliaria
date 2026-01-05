'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Tipos
interface WebStats {
  totalVisits: number;
  totalProperties: number;
  activeAgents: number;
  totalInquiries: number;
  monthlyRevenue: number;
  conversionRate: number;
}

interface MonthlyData {
  month: string;
  visits: number;
  inquiries: number;
  sales: number;
}

export default function DashboardOwnerPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [stats, setStats] = useState<WebStats>({
    totalVisits: 12450,
    totalProperties: 45,
    activeAgents: 3,
    totalInquiries: 234,
    monthlyRevenue: 45000,
    conversionRate: 18.5
  });

  const [monthlyData] = useState<MonthlyData[]>([
    { month: 'Enero', visits: 1200, inquiries: 45, sales: 8 },
    { month: 'Febrero', visits: 1350, inquiries: 52, sales: 10 },
    { month: 'Marzo', visits: 1500, inquiries: 58, sales: 12 },
    { month: 'Abril', visits: 1650, inquiries: 65, sales: 14 },
    { month: 'Mayo', visits: 1800, inquiries: 72, sales: 15 },
    { month: 'Junio', visits: 1950, inquiries: 80, sales: 18 }
  ]);

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
    <div className="min-h-screen bg-[#F4F6F8]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0A2647] to-[#061829] shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#C69B56]">Dashboard del Propietario</h1>
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
          <h2 className="text-2xl font-bold text-[#0A2647] mb-6">📊 Resumen General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              title="Visitas Totales"
              value={stats.totalVisits.toLocaleString()}
              icon="👥"
              color="from-[#0A2647] to-[#144272]"
              trend="+12.5%"
              trendUp={true}
            />
            <StatsCard
              title="Propiedades Publicadas"
              value={stats.totalProperties}
              icon="🏠"
              color="from-[#C69B56] to-[#B38A45]"
              trend="+5"
              trendUp={true}
            />
            <StatsCard
              title="Agentes Activos"
              value={stats.activeAgents}
              icon="👔"
              color="from-[#205295] to-[#144272]"
              trend="Estable"
              trendUp={true}
            />
            <StatsCard
              title="Consultas Recibidas"
              value={stats.totalInquiries}
              icon="📧"
              color="from-[#144272] to-[#0A2647]"
              trend="+18.3%"
              trendUp={true}
            />
            <StatsCard
              title="Ingresos Mensuales"
              value={`$${stats.monthlyRevenue.toLocaleString()}`}
              icon="💰"
              color="from-[#C69B56] to-[#B38A45]"
              trend="+22.1%"
              trendUp={true}
            />
            <StatsCard
              title="Tasa de Conversión"
              value={`${stats.conversionRate}%`}
              icon="📈"
              color="from-[#0A2647] to-[#144272]"
              trend="+3.2%"
              trendUp={true}
            />
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0A2647] mb-6">📅 Rendimiento Mensual</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#0A2647] to-[#144272] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Mes</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Visitas</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Consultas</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Ventas</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Conversión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {monthlyData.map((data, index) => {
                    const conversion = ((data.sales / data.inquiries) * 100).toFixed(1);
                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-[#0A2647]">{data.month}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{data.visits.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{data.inquiries}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{data.sales}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                            {conversion}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0A2647] mb-6">⚡ Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              title="Ver Reportes"
              icon="📊"
              description="Reportes detallados"
              color="bg-[#0A2647]"
            />
            <ActionCard
              title="Gestionar Agentes"
              icon="👥"
              description="Administrar equipo"
              color="bg-[#C69B56]"
            />
            <ActionCard
              title="Configuración"
              icon="⚙️"
              description="Ajustes del sitio"
              color="bg-[#205295]"
            />
            <ActionCard
              title="Soporte"
              icon="💬"
              description="Ayuda y contacto"
              color="bg-[#144272]"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-[#0A2647] mb-6">🔔 Actividad Reciente</h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="space-y-4">
              <ActivityItem
                icon="🏠"
                title="Nueva propiedad publicada"
                description="Casa Moderna en Zona Norte - Agente01"
                time="Hace 2 horas"
              />
              <ActivityItem
                icon="📧"
                title="Nueva consulta recibida"
                description="Cliente interesado en Departamento Céntrico"
                time="Hace 4 horas"
              />
              <ActivityItem
                icon="💰"
                title="Venta completada"
                description="Propiedad vendida por $250,000"
                time="Hace 1 día"
              />
              <ActivityItem
                icon="👔"
                title="Nuevo agente registrado"
                description="Agente02 se unió al equipo"
                time="Hace 2 días"
              />
              <ActivityItem
                icon="📈"
                title="Incremento en visitas"
                description="Las visitas aumentaron un 15% esta semana"
                time="Hace 3 días"
              />
            </div>
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

// Action Card Component
function ActionCard({ 
  title, 
  icon, 
  description, 
  color 
}: { 
  title: string; 
  icon: string; 
  description: string;
  color: string;
}) {
  return (
    <button className={`${color} text-white rounded-xl p-6 hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-left`}>
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </button>
  );
}

// Activity Item Component
function ActivityItem({ 
  icon, 
  title, 
  description, 
  time 
}: { 
  icon: string; 
  title: string; 
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="text-3xl">{icon}</div>
      <div className="flex-1">
        <h4 className="font-semibold text-[#0A2647] mb-1">{title}</h4>
        <p className="text-sm text-gray-600 mb-1">{description}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
}
