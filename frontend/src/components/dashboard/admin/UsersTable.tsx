import { useState } from "react";
import Icon from "@/components/UI/Icon";
import { UserProfile, UserRole, UserStatus } from "@/types/api";

interface UsersTableProps {
  users: UserProfile[];
  onSaveEdit: (userId: string, data: Partial<UserProfile>) => Promise<void>;
  onResetPassword: (userId: string) => void;
}

const roleColors: Record<string, string> = {
  [UserRole.Inquilino]: "bg-blue-600",
  [UserRole.Propietario]: "bg-green-600",
  [UserRole.Agente]: "bg-purple-600",
  [UserRole.Gerencia]: "bg-amber-600",
  [UserRole.Administrador]: "bg-(--primary)",
};

export default function UsersTable({
  users,
  onSaveEdit,
  onResetPassword,
}: UsersTableProps) {
  // Estado para manejar la edición en línea
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<UserProfile>>({});
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Entra en modo de edición para una fila
   */
  const startEditing = (user: UserProfile) => {
    setEditingId(user.id);
    setEditFormData({
      email: user.email,
      name: user.name || "",
      phone: user.phone || "",
      role: user.role,
      status: user.status,
    });
  };

  /**
   * Cancela la edición actual
   */
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  /**
   * Guarda los cambios realizados en línea
   */
  const saveEditing = async () => {
    if (!editingId) return;

    try {
      setIsSaving(true);
      await onSaveEdit(editingId, editFormData);
      setEditingId(null);
      setEditFormData({});
    } catch (error) {
      console.error("Error al guardar edición en línea:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-(--primary) text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Rol</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Fecha creación
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => {
              const isEditing = editingId === user.id;

              return (
                <tr
                  key={user.id}
                  className={`transition-all duration-300 ${
                    isEditing
                      ? "bg-(--accent)/5 shadow-md relative z-10 border-l-4 border-(--accent)"
                      : "hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                >
                  {/* Celda Email */}
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                    {isEditing ? (
                      <input
                        type="email"
                        value={editFormData.email || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            email: e.target.value,
                          })
                        }
                        maxLength={255}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent transition-all text-sm"
                      />
                    ) : (
                      user.email
                    )}
                  </td>

                  {/* Celda Nombre */}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.name || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            name: e.target.value,
                          })
                        }
                        maxLength={100}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent transition-all text-sm"
                      />
                    ) : (
                      user.name || (
                        <span className="text-gray-400 italic">Sin nombre</span>
                      )
                    )}
                  </td>

                  {/* Celda Teléfono */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editFormData.phone || ""}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            phone: e.target.value,
                          })
                        }
                        maxLength={20}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent transition-all text-sm"
                      />
                    ) : (
                      user.phone || (
                        <span className="text-gray-400 italic">
                          Sin teléfono
                        </span>
                      )
                    )}
                  </td>

                  {/* Celda Rol */}
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <select
                        value={editFormData.role}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            role: e.target.value as UserRole,
                          })
                        }
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent transition-all text-sm bg-white"
                      >
                        <option value={UserRole.Inquilino}>Inquilino</option>
                        <option value={UserRole.Propietario}>
                          Propietario
                        </option>
                        <option value={UserRole.Agente}>Agente</option>
                        <option value={UserRole.Gerencia}>Gerencia</option>
                        <option value={UserRole.Administrador}>
                          Administrador
                        </option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${roleColors[user.role]}`}
                      >
                        {user.role}
                      </span>
                    )}
                  </td>

                  {/* Celda Estado */}
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() =>
                            setEditFormData({
                              ...editFormData,
                              status:
                                editFormData.status === UserStatus.ACTIVE
                                  ? UserStatus.INACTIVE
                                  : UserStatus.ACTIVE,
                            })
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-(--accent) focus:ring-offset-2 ${
                            editFormData.status === UserStatus.ACTIVE
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                              editFormData.status === UserStatus.ACTIVE
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span
                          className={`ml-3 text-xs font-medium ${
                            editFormData.status === UserStatus.ACTIVE
                              ? "text-green-700"
                              : "text-gray-500"
                          }`}
                        >
                          {editFormData.status === UserStatus.ACTIVE
                            ? "Activo"
                            : "Pausado"}
                        </span>
                      </div>
                    ) : (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === UserStatus.ACTIVE
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {user.status === UserStatus.ACTIVE
                          ? "Activo"
                          : "Pausado"}
                      </span>
                    )}
                  </td>

                  {/* Celda Fecha */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString("es-ES")}
                  </td>

                  {/* Celda Acciones */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={saveEditing}
                            disabled={isSaving}
                            className="p-1.5 text-green-600 hover:bg-green-200 rounded-lg transition-colors border border-green-200"
                            title="Guardar"
                          >
                            {isSaving ? (
                              <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Icon name="check" className="w-5 h-5" />
                            )}
                          </button>

                          <button
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className="p-1.5 text-red-500 hover:bg-red-200 rounded-lg transition-colors border border-red-200"
                            title="Cancelar"
                          >
                            <Icon name="close" className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditing(user)}
                            className="p-1 text-blue-600 hover:text-blue-900 transition-colors"
                            title="Editar"
                          >
                            <Icon name="edit" className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => onResetPassword(user.id)}
                            className="p-1 text-amber-600 hover:text-amber-900 transition-colors"
                            title="Restaurar contraseña"
                          >
                            <Icon name="key" className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No se encontraron usuarios
          </div>
        )}
      </div>
    </div>
  );
}
