"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/ui";
import { authService } from "@/lib/api/services/auth";
import { ChangePasswordModal } from "@/components/features/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login(email, password);

      if (response.mustChangePassword) {
        // Primer login: mostrar modal obligatorio de cambio de contraseña
        setShowChangePasswordModal(true);
        setIsLoading(false);
      } else {
        // Login normal: redirigir al dashboard correspondiente
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
      setIsLoading(false);
    }
  };

  const handlePasswordChanged = () => {
    // El usuario cambió su contraseña exitosamente → redirigir al dashboard
    router.push("/dashboard");
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-(--primary) via-(--primary) to-(--primary-light) px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="animate-scale-in rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Iniciar Sesión
              </h1>
              <p className="text-gray-500">Accede a tu cuenta de InmoHogar</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <FormInput
                label="Correo Electrónico"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                maxLength={255}
              />

              {/* Password Input con botón de mostrar/ocultar */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    autoComplete="new-password"
                    maxLength={100}
                    className="w-full rounded-lg border border-gray-300 bg-slate-50 px-4 py-2 pr-12 text-gray-900 placeholder-gray-400 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-(--accent) focus:outline-none [&::-ms-clear]:hidden [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full transform items-center justify-center gap-2 rounded-full bg-(--accent) px-6 py-3 font-bold text-white shadow-xl transition-all duration-300 hover:scale-95 hover:bg-(--accent-hover) hover:shadow-2xl focus:bg-(--accent-hover) active:bg-(--accent-hover) disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  "Iniciando sesión..."
                ) : (
                  <>
                    <svg
                      className="h-5 w-5 text-white/80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            {/* volver a Home */}
            <div className="mt-4 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-(--accent)"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de cambio de contraseña obligatorio — se renderiza sobre el login */}
      {showChangePasswordModal && (
        <ChangePasswordModal onSuccess={handlePasswordChanged} />
      )}
    </>
  );
}
