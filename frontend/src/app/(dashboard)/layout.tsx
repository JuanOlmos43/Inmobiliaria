"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { DashboardHeader } from "@/components/layout";

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
      router.push("/login");
    }
  }, [isLoading, isError, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-(--accent)"></div>
          <p className="font-medium text-gray-500">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // El useEffect redirigirá
  }

  return (
    <>
      <DashboardHeader
        role={user.role}
        userEmail={user.email}
        onLogout={logout}
      />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-(--background)">
        {children}
      </main>
    </>
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
