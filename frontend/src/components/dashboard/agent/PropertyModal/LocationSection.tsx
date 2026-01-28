import FormInput from "@/components/UI/FormInput";
import FormSelect from "@/components/UI/FormSelect";
import { useLocationLogic } from "@/hooks/useLocationLogic";

interface LocationSectionProps {
    formData: any;
    setFormData: (data: any) => void;
    inputModes: { city: "select" | "input"; street: "select" | "input" };
    setInputModes: (modes: any) => void;
}

export default function LocationSection({
    formData,
    setFormData,
    inputModes,
    setInputModes,
}: LocationSectionProps) {
    const { provincias, localidades, calles, isLoadingLocalidades, isLoadingCalles } =
        useLocationLogic(formData.provinciaId, formData.localidadId);

    return (
        <div className="space-y-4 border-t border-gray-100 pt-4">
            <div className="grid grid-cols-2 gap-4">
                {/* Provincia */}
                <FormSelect
                    label="Provincia"
                    required
                    value={formData.province}
                    onChange={(e) => {
                        const nombre = e.target.value;
                        const prov = provincias.find((p: any) => p.nombre === nombre);
                        setFormData((prev: any) => ({
                            ...prev,
                            province: nombre,
                            provinciaId: prov?.id || "",
                            city: "",
                            localidadId: "",
                            street: "",
                            calleId: "",
                        }));
                    }}
                >
                    <option value="">Seleccione Provincia</option>
                    {provincias.map((prov: any) => (
                        <option key={prov.id} value={prov.nombre}>
                            {prov.nombre}
                        </option>
                    ))}
                </FormSelect>

                {/* Localidad */}
                {inputModes.city === "select" ? (
                    <FormSelect
                        label="Localidad"
                        required
                        value={formData.city}
                        disabled={!formData.province}
                        onChange={(e) => {
                            const nombre = e.target.value;
                            if (nombre === "custom") {
                                setInputModes((prev: any) => ({ ...prev, city: "input" }));
                                setFormData((prev: any) => ({
                                    ...prev,
                                    city: "",
                                    localidadId: "",
                                    street: "",
                                    calleId: "",
                                }));
                            } else {
                                const loc = localidades.find((l: any) => l.nombre === nombre);
                                setFormData((prev: any) => ({
                                    ...prev,
                                    city: nombre,
                                    localidadId: loc?.id || "",
                                    street: "",
                                    calleId: "",
                                }));
                            }
                        }}
                    >
                        <option value="">
                            {isLoadingLocalidades ? "Cargando localidades..." : "Seleccione Localidad"}
                        </option>
                        {localidades.map((loc: any) => (
                            <option key={loc.id} value={loc.nombre}>
                                {loc.nombre}
                            </option>
                        ))}
                        <option value="custom" className="font-semibold text-(--accent)">
                            Ingresar manualmente...
                        </option>
                    </FormSelect>
                ) : (
                    <div className="relative">
                        <FormInput
                            label="Localidad"
                            type="text"
                            required
                            disabled={!formData.province}
                            value={formData.city || ""}
                            onChange={(e) =>
                                setFormData((prev: any) => ({
                                    ...prev,
                                    city: e.target.value,
                                    street: "",
                                }))
                            }
                            placeholder="Ingrese Localidad"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setInputModes((prev: any) => ({ ...prev, city: "select" }));
                                setFormData((prev: any) => ({ ...prev, city: "", street: "" }));
                            }}
                            className="absolute top-9 right-2 text-gray-400"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Calle */}
                {inputModes.street === "select" ? (
                    <FormSelect
                        label="Calle"
                        required
                        value={formData.street}
                        disabled={!formData.city}
                        onChange={(e) => {
                            const nombre = e.target.value;
                            if (nombre === "custom") {
                                setInputModes((prev: any) => ({ ...prev, street: "input" }));
                                setFormData((prev: any) => ({ ...prev, street: "", calleId: "" }));
                            } else {
                                const calle = calles.find((c: any) => c.nombre === nombre);
                                setFormData((prev: any) => ({
                                    ...prev,
                                    street: nombre,
                                    calleId: calle?.id || "",
                                }));
                            }
                        }}
                    >
                        <option value="">
                            {isLoadingCalles ? "Cargando calles..." : "Seleccione Calle"}
                        </option>
                        {calles.map((calle: any) => (
                            <option key={calle.id} value={calle.nombre}>
                                {calle.nombre}
                            </option>
                        ))}
                        <option value="custom" className="font-semibold text-(--accent)">
                            Ingresar manualmente...
                        </option>
                    </FormSelect>
                ) : (
                    <div className="relative">
                        <FormInput
                            label="Calle"
                            type="text"
                            required
                            disabled={!formData.city}
                            value={formData.street || ""}
                            onChange={(e) =>
                                setFormData((prev: any) => ({ ...prev, street: e.target.value }))
                            }
                            placeholder="Ingrese Calle"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setInputModes((prev: any) => ({ ...prev, street: "select" }));
                                setFormData((prev: any) => ({ ...prev, street: "" }));
                            }}
                            className="absolute top-9 right-2 text-gray-400"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                    <FormInput
                        label="Altura"
                        type="text"
                        required
                        value={formData.streetNumber || ""}
                        onChange={(e) =>
                            setFormData((prev: any) => ({ ...prev, streetNumber: e.target.value }))
                        }
                        placeholder="1234"
                    />
                    <FormInput
                        label="Depto"
                        type="text"
                        value={formData.apartment || ""}
                        onChange={(e) =>
                            setFormData((prev: any) => ({ ...prev, apartment: e.target.value }))
                        }
                        placeholder="4B"
                    />
                </div>
            </div>
        </div>
    );
}
