import React from "react";
import { Modal, Icon } from "@/components/UI";
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
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-(--primary) mb-3 flex items-center gap-2">
            <Icon name="home" className="w-5 h-5 text-(--accent)" />
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
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-(--primary) mb-3 flex items-center gap-2">
                <Icon name="user" className="w-5 h-5 text-(--accent)" />
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
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-(--primary) mb-3 flex items-center gap-2">
              <Icon name="key" className="w-5 h-5 text-(--accent)" />
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
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-(--primary) mb-3 flex items-center gap-2">
            <Icon name="briefcase" className="w-5 h-5 text-(--accent)" />
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
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-(--primary) mb-3 flex items-center gap-2">
            <Icon name="calendar" className="w-5 h-5 text-(--accent)" />
            Vigencia del Contrato
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
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
                <span className="text-amber-700 font-medium ml-1">
                  (próximo ajuste en{" "}
                  {new Date(contract.nextAdjustmentDate).toLocaleDateString(
                    "es-AR",
                    { month: "long" },
                  )}
                  )
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
