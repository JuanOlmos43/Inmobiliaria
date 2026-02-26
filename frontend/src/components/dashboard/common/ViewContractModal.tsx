import React from "react";
import { Modal, Icon, Button } from "@/components/ui";
import { Contract } from "@/types/api";

interface ViewContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
  viewerRole?: "agent" | "landlord" | "tenant";
}

export default function ViewContractModal({
  isOpen,
  onClose,
  contract,
  viewerRole = "agent",
}: ViewContractModalProps) {
  if (!contract) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Información del Contrato"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Información de la Propiedad */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-(--primary)">
            <Icon name="home" className="h-5 w-5 text-(--accent)" />
            Propiedad
          </h3>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Título:</span>{" "}
              {contract.property?.title || "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Ubicación:</span>{" "}
              {contract.property?.location || "N/A"}
            </p>
          </div>

          {/* Información del Propietario - Ocultar si el visor es el propietario */}
          {contract.landlord && viewerRole !== "landlord" && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-(--primary)">
                <Icon name="user" className="h-5 w-5 text-(--accent)" />
                Propietario
              </h4>
              <div className="space-y-1">
                <p className="text-gray-700">
                  <span className="font-medium">Nombre:</span>{" "}
                  {contract.landlord?.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span>{" "}
                  {contract.landlord?.email}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Información del Inquilino - Ocultar si el visor es el inquilino */}
        {contract.tenant && viewerRole !== "tenant" && (
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-(--primary)">
              <Icon name="key" className="h-5 w-5 text-(--accent)" />
              Inquilino
            </h3>
            <div className="space-y-1">
              <p className="text-gray-700">
                <span className="font-medium">Nombre:</span>{" "}
                {contract.tenant?.name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email:</span>{" "}
                {contract.tenant?.email}
              </p>
            </div>
          </div>
        )}

        {/* Información del Agente */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-(--primary)">
            <Icon name="briefcase" className="h-5 w-5 text-(--accent)" />
            Agente Responsable
          </h3>
          <div className="space-y-1">
            <p className="text-gray-700">
              <span className="font-medium">Nombre:</span>{" "}
              {contract.agent?.name || ""}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span>{" "}
              {contract.agent?.email || ""}
            </p>
          </div>
        </div>

        {/* Fechas del Contrato */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-(--primary)">
            <Icon name="calendar" className="h-5 w-5 text-(--accent)" />
            Vigencia del Contrato
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <p className="text-gray-700">
              <span className="font-medium">Fecha de Inicio:</span>
              <br />
              {formatDate(contract.startDate)}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Fecha de Vencimiento:</span>
              <br />
              {formatDate(contract.endDate)}
            </p>
          </div>
        </div>

        {/* Condiciones Económicas */}
        <div className="space-y-3 rounded-lg bg-gray-50 p-4">
          <div>
            <span className="font-semibold text-gray-700">Depósito:</span>{" "}
            <span className="text-gray-600">
              {contract.deposit
                ? `$ ${contract.deposit.toLocaleString("es-AR")}`
                : "N/A"}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Renta Mensual:</span>{" "}
            <span className="text-gray-600">
              $ {contract.monthlyRent?.toLocaleString("es-AR")}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Ajuste:</span>{" "}
            <span className="text-gray-600">
              Cada {contract.adjustmentFrequency} meses
              {contract.nextAdjustmentDate && contract.status === "active" && (
                <span className="ml-1 font-medium text-(--warning)">
                  (próximo ajuste en{" "}
                  {new Date(contract.nextAdjustmentDate).toLocaleDateString(
                    "es-AR",
                    { month: "long" }
                  )}
                  )
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-6">
          <Button variant="outline" fullWidth onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
