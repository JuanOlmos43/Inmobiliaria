"use client";

import { useState, useEffect } from "react";
import { Modal, FormInput, FormSelect, Toast } from "@/components/ui";
import { authService } from "@/lib/api/services/auth";
import { UserRole } from "@/types/api";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

/**
 * CreateUserModal
 *
 * Componente especializado en la creación de nuevos usuarios.
 * La contraseña se asigna automáticamente como "admin123" por defecto.
 */
export default function CreateUserModal({
  isOpen,
  onClose,
  onUserCreated,
}: CreateUserModalProps) {
  // Estado inicial del formulario (limpio para creación)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    role: UserRole.Inquilino,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
    duration: 3000,
  });

  // Limpiar el formulario cada vez que se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: "",
        name: "",
        phone: "",
        role: UserRole.Inquilino,
      });
    }
  }, [isOpen]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    const duration = type === "error" ? 6000 : 3000;
    setToast({ show: true, message, type, duration });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Registrar nuevo usuario con contraseña por defecto
      await authService.register({
        email: formData.email,
        password: "admin123", // Contraseña fija según requerimiento
        name: formData.name || undefined,
        phone: formData.phone || undefined,
        role: formData.role,
      });

      showToast("Usuario creado exitosamente");
      onUserCreated(); // Avisar al padre para refrescar la lista

      // Cerrar modal tras un pequeño delay para que se vea el éxito
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      showToast(
        `Error al guardar usuario: ${error instanceof Error ? error.message : "Error desconocido"}`,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        duration={toast.duration}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Crear nuevo usuario"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Correo electrónico"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            placeholder="usuario@email.com"
            disabled={isSubmitting}
            maxLength={255}
          />

          <FormInput
            label="Contraseña inicial"
            type="text"
            value="admin123"
            onChange={() => {}}
            disabled={true} // Bloqueado según requerimiento
            helpText="Valor fijo para nuevos registros."
            maxLength={100}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              label="Nombre completo"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nombre del usuario"
              disabled={isSubmitting}
              maxLength={100}
            />

            <FormInput
              label="Teléfono"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+54 11 1234-5678"
              disabled={isSubmitting}
              maxLength={20}
            />
          </div>

          <FormSelect
            label="Rol del usuario"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as UserRole })
            }
            disabled={isSubmitting}
          >
            <option value={UserRole.Inquilino}>Inquilino</option>
            <option value={UserRole.Propietario}>Propietario</option>
            <option value={UserRole.Agente}>Agente</option>
            <option value={UserRole.Gerencia}>Gerencia</option>
            <option value={UserRole.Administrador}>Administrador</option>
          </FormSelect>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-all duration-200 hover:border-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-(--accent) px-4 py-2.5 font-medium text-white shadow-md transition-all hover:bg-(--accent-hover) hover:shadow-lg disabled:opacity-50"
            >
              {isSubmitting && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}
              {isSubmitting ? "Creando..." : "Crear usuario"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
