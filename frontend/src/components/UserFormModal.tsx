"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/UI/Modal";
import FormInput from "@/components/UI/FormInput";
import FormSelect from "@/components/UI/FormSelect";
import Toast from "@/components/UI/Toast";
import { authService } from "@/lib/api/services/auth";
import { UserRole } from "@/types/api";

// Tipos
interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  status: "active" | "inactive";
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser: User | null;
  onUserCreated: (user: User) => void;
  onUserUpdated: (user: User) => void;
}

// Mapeo de roles del frontend al backend - YA NO ES NECESARIO SI USAMOS ENUMS DIRECTAMENTE
// const roleMapping: Record<string, UserRole> = { ... };

export default function UserFormModal({
  isOpen,
  onClose,
  editingUser,
  onUserCreated,
  onUserUpdated,
}: UserFormModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    role: UserRole.Inquilino as UserRole,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  // Actualizar formulario cuando cambia editingUser
  useEffect(() => {
    if (editingUser) {
      setFormData({
        email: editingUser.email,
        password: editingUser.password,
        name: editingUser.name || "",
        phone: editingUser.phone || "",
        role: editingUser.role,
      });
    } else {
      setFormData({
        email: "",
        password: "",
        name: "",
        phone: "",
        role: UserRole.Inquilino,
      });
    }
  }, [editingUser, isOpen]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingUser) {
        // Editar usuario existente
        const updatedUser: User = {
          ...editingUser,
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          role: formData.role,
        };
        onUserUpdated(updatedUser);
        showToast("Usuario actualizado exitosamente");
      } else {
        // Crear nuevo usuario
        const newUser = await authService.register({
          email: formData.email,
          password: formData.password,
          name: formData.name || undefined,
          phone: formData.phone || undefined,
          role: formData.role,
        });

        // Crear objeto de usuario para la lista
        const userForList: User = {
          id: newUser.id,
          email: newUser.email,
          password: formData.password,
          name: newUser.name,
          phone: newUser.phone || undefined,
          role: formData.role,
          createdAt: newUser.createdAt,
          status: "active",
        };

        onUserCreated(userForList);
        showToast("Usuario creado exitosamente");
      }

      onClose();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      showToast(
        `Error al guardar usuario: ${error instanceof Error ? error.message : "Error desconocido"}`,
        "error",
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
        onClose={() => setToast({ ...toast, show: false })}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Correo Electrónico"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            placeholder="usuario@email.com"
            disabled={isSubmitting}
          />

          <FormInput
            label="Contraseña"
            type="text"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            placeholder="Contraseña"
            disabled={isSubmitting}
          />

          <FormInput
            label="Nombre Completo"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nombre completo del usuario"
            disabled={isSubmitting}
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
          />

          <FormSelect
            label="Rol"
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
          </FormSelect>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-[#14b8a6] text-white rounded-lg hover:bg-[#0d9488] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Guardando..."
                : editingUser
                  ? "Guardar Cambios"
                  : "Crear Usuario"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
