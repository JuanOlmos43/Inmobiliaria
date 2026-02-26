"use client";

import { useState } from "react";
import { authService } from "@/lib/api/services/auth";
import { Button } from "@/components/ui";

interface ChangePasswordModalProps {
  onSuccess: () => void;
}

export default function ChangePasswordModal({
  onSuccess,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validación en tiempo real de la nueva contraseña
  const passwordTooShort = newPassword.length > 0 && newPassword.length < 8;
  const passwordsDontMatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const isFormValid =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setError("");
    setIsLoading(true);

    try {
      await authService.changePassword({ currentPassword, newPassword });
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cambiar la contraseña"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* Overlay — cubre toda la pantalla, sin posibilidad de cerrar */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="animate-scale-in w-full max-w-md rounded-2xl border border-gray-200 shadow-2xl"
        style={{ background: "#ffffff" }}
      >
        {/* Header con ícono de advertencia */}
        <div
          className="rounded-t-2xl px-8 pt-8 pb-6 text-center"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
          }}
        >
          {/* Ícono de candado */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Cambio de contraseña requerido
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Por seguridad, debes establecer una contraseña personal antes de
            continuar.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5 px-8 py-6">
          {/* Contraseña actual */}
          <div>
            <label
              htmlFor="cp-current"
              className="mb-1.5 block text-sm font-medium text-gray-600"
            >
              Contraseña actual
            </label>
            <div className="relative">
              <input
                id="cp-current"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-lg border px-4 py-2.5 pr-11 text-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-(--accent) focus:outline-none [&::-ms-clear]:hidden [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                maxLength={100}
                style={{
                  background: "#f8fafc",
                  borderColor: "#e2e8f0",
                  color: "#0f172a",
                }}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-opacity hover:opacity-70"
                aria-label={showCurrent ? "Ocultar" : "Mostrar"}
              >
                <EyeIcon open={showCurrent} />
              </button>
            </div>
          </div>

          {/* Nueva contraseña */}
          <div>
            <label
              htmlFor="cp-new"
              className="mb-1.5 block text-sm font-medium text-gray-600"
            >
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                id="cp-new"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                className="w-full rounded-lg border px-4 py-2.5 pr-11 text-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-(--accent) focus:outline-none [&::-ms-clear]:hidden [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                maxLength={100}
                style={{
                  background: "#f8fafc",
                  borderColor: passwordTooShort ? "#ef4444" : "#e2e8f0",
                  color: "#0f172a",
                }}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-opacity hover:opacity-70"
                aria-label={showNew ? "Ocultar" : "Mostrar"}
              >
                <EyeIcon open={showNew} />
              </button>
            </div>
            {passwordTooShort && (
              <p className="mt-1 text-xs text-red-500">
                La contraseña debe tener al menos 8 caracteres
              </p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label
              htmlFor="cp-confirm"
              className="mb-1.5 block text-sm font-medium text-gray-600"
            >
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <input
                id="cp-confirm"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repetí la nueva contraseña"
                autoComplete="new-password"
                className="w-full rounded-lg border px-4 py-2.5 pr-11 text-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-(--accent) focus:outline-none [&::-ms-clear]:hidden [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                maxLength={100}
                style={{
                  background: "#f8fafc",
                  borderColor: passwordsDontMatch ? "#ef4444" : "#e2e8f0",
                  color: "#0f172a",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-opacity hover:opacity-70"
                aria-label={showConfirm ? "Ocultar" : "Mostrar"}
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {passwordsDontMatch && (
              <p className="mt-1 text-xs text-red-500">
                Las contraseñas no coinciden
              </p>
            )}
          </div>

          {/* Error del servidor */}
          {error && (
            <div
              className="rounded-lg border px-4 py-3 text-sm"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                borderColor: "rgba(239, 68, 68, 0.3)",
                color: "#ef4444",
              }}
            >
              {error}
            </div>
          )}

          {/* Botón de submit */}
          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={!isFormValid}
            isLoading={isLoading}
            icon={
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
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            className="font-bold"
          >
            Establecer nueva contraseña
          </Button>

          {/* Nota informativa */}
          <p className="text-center text-xs text-gray-400">
            Esta acción es obligatoria. No podrás acceder al sistema hasta
            completarla.
          </p>
        </form>
      </div>
    </div>
  );
}

/* Ícono de ojo reutilizable */
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
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
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  ) : (
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
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}
