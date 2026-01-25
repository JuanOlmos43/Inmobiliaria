'use client';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import DashboardHeader from '@/components/DashboardHeader';

// Wrapper interno para manejar la lógica de redirección y loading UI
// Necesitamos esto porque useAuth debe usarse DENTRO de AuthProvider
function DashboardContent({ children }: { children: React.ReactNode }) {
    const { user, isLoading, isError, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Si terminó de cargar y hay error o no hay usuario, redirigir
        // El middleware protege las rutas, pero esto es doble check del lado cliente
        // especialmente útil si el token expira mientras se navega
        if (!isLoading && (isError || !user)) {
            router.push('/login');
        }
    }, [isLoading, isError, user, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14b8a6]"></div>
                    <p className="text-gray-500 font-medium">Cargando sesión...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // El useEffect redirigirá
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <DashboardHeader
                role={user.role}
                userEmail={user.email}
                onLogout={logout}
            />
            {children}
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <DashboardContent>{children}</DashboardContent>
        </AuthProvider>
    );
}
