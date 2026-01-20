'use server'

import { authService } from '@/lib/api/services/auth'
import { cookies } from 'next/headers'

/**
 * Server Action para iniciar sesión
 * Se ejecuta en el servidor de Next.js y puede acceder a las cookies httpOnly
 */
export async function loginAction(email: string, password: string) {
    try {
        // Llamar al servicio de autenticación
        const response = await authService.login(email, password)

        // Las cookies httpOnly (access_token y refresh_token) se setean automáticamente
        // por el backend en la respuesta HTTP

        return {
            success: true,
            data: response,
        }
    } catch (error) {
        console.error('[loginAction] Error:', error)

        // Manejar errores de forma segura
        if (error instanceof Error) {
            return {
                success: false,
                error: error.message,
            }
        }

        return {
            success: false,
            error: 'Error al iniciar sesión. Por favor, intenta nuevamente.',
        }
    }
}

/**
 * Server Action para obtener el perfil del usuario actual
 * Lee el access_token de las cookies httpOnly
 */
export async function getMeAction() {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value

        if (!accessToken) {
            return {
                success: false,
                error: 'No autenticado',
            }
        }

        const userProfile = await authService.getMe(accessToken)

        return {
            success: true,
            data: userProfile,
        }
    } catch (error) {
        console.error('[getMeAction] Error:', error)

        if (error instanceof Error) {
            return {
                success: false,
                error: error.message,
            }
        }

        return {
            success: false,
            error: 'Error al obtener perfil de usuario',
        }
    }
}

/**
 * Server Action para cerrar sesión
 */
export async function logoutAction() {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value

        if (accessToken) {
            await authService.logout(accessToken)
        }

        // Limpiar cookies
        cookieStore.delete('access_token')
        cookieStore.delete('refresh_token')

        return {
            success: true,
        }
    } catch (error) {
        console.error('[logoutAction] Error:', error)

        if (error instanceof Error) {
            return {
                success: false,
                error: error.message,
            }
        }

        return {
            success: false,
            error: 'Error al cerrar sesión',
        }
    }
}
