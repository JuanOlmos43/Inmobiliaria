'use client';

import { createContext, ReactNode, useContext, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/api/services/auth';
import { UserProfile } from '@/types/api';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    user: UserProfile | null;
    isLoading: boolean;
    isError: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* Proveedor de autenticación.
Es el Componente que envuelve a tu aplicación (o una parte de ella). Su responsabilidad 
es tener el estado (fetchear el usuario, guardar isLoading, etc.) y "proveerlo" a sus hijos. */
export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const pathname = usePathname();

    // Query para obtener el perfil del usuario actual (me)
    // Se ejecutará automáticamente al montar y reintentará si falla según config de react-query
    const { data: user, isLoading, isError, error } = useQuery({
        queryKey: ['me'],
        queryFn: authService.getMe,
        retry: false, 
        staleTime: 1000 * 60 * 5, // 5 minutos de cache
    });

    /* Función para cerrar sesión, la llamada al backend limpia las cookies con los tokens
    mientras que el queryClient limpia el cache de react-query */
    const logout = async () => {
        try {
            await authService.logout();
            // Limpiar cache de react-query
            queryClient.setQueryData(['me'], null);
            queryClient.clear();
            router.push('/login');
        } catch (error) {
            console.error('Error durante logout:', error);
            router.push('/login');
        }
    };

    useEffect(() => {
        if (isError && !pathname.includes('/login')) {
        }
    }, [isError, pathname, router]);

    const value = {
        user: user ?? null,
        isLoading,
        isError,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* Hook personalizado para acceder al contexto, los componentes que consumen el provider 
podrían usar el hook directamente desde aca pero corresponde que los hooks existan en 
un archivo separado para mantener la separación de responsabilidades. 
Por eso se exporta esta función desde el archivo /hooks/useAuth.ts */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
