import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
  theme?: "light" | "dark"; // Para formularios en fondos oscuros vs claros
}

export default function FormInput({
  label,
  error,
  helpText,
  theme = "light",
  required,
  className = "",
  type,
  max,
  min,
  maxLength,
  minLength,
  onInput,
  ...props
}: FormInputProps) {
  const baseClasses =
    "w-full px-4 py-2 border rounded-lg transition-all duration-300";

  const themeClasses =
    theme === "light"
      ? "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
      : "bg-white/10 border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent disabled:opacity-50";

  const labelClasses = theme === "light" ? "text-gray-700" : "text-gray-200";

  // Handler para validar max/min en inputs numéricos en tiempo real
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;

    if (type === "number") {
      const value = input.value;

      // Si hay un valor
      if (value !== "") {
        const numValue = Number(value);

        // Validar max
        if (max !== undefined && numValue > Number(max)) {
          input.value = String(max);
        }

        // Validar min
        if (min !== undefined && numValue < Number(min)) {
          input.value = String(min);
        }
      }
    }

    // Llamar al onInput original si existe
    if (onInput) {
      onInput(e);
    }
  };

  return (
    <div>
      <label className={`block text-sm font-medium ${labelClasses} mb-2`}>
        {label} {required && "*"}
      </label>
      <input
        className={`${baseClasses} ${themeClasses} ${error ? "border-red-500" : ""} ${className}`}
        required={required}
        type={type}
        max={max}
        min={min}
        maxLength={maxLength}
        minLength={minLength}
        onInput={handleInput}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {helpText && !error && (
        <p className="text-gray-400 text-xs mt-1">{helpText}</p>
      )}
    </div>
  );
}
