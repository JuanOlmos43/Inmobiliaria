"use client";

import { InputHTMLAttributes } from "react";
import { Icon } from "../icons/Icon";
import type { IconName } from "../icons/Icon";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helpText?: string;
  theme?: "light" | "dark"; // Para formularios en fondos oscuros vs claros
  icon?: IconName; // Nombre del icono opcional
}

export function FormInput({
  label,
  helpText,
  theme = "light",
  icon,
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
    "w-full py-2 border rounded-lg transition-all duration-300";

  // Ajustar padding según si hay icono o no
  const paddingClasses = icon ? "pl-10 pr-4" : "px-4";

  const themeClasses =
    theme === "light"
      ? "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
      : "bg-white/10 border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent disabled:opacity-50";

  const labelClasses = theme === "light" ? "text-gray-700" : "text-gray-200";

  // Handler para llamar al onInput original si existe
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (onInput) {
      onInput(e);
    }
  };

  return (
    <div className="mb-2">
      <label className={`block text-sm font-medium ${labelClasses} mb-2`}>
        {label} {required && "*"}
      </label>
      <div className="relative">
        {icon && (
          <Icon
            name={icon}
            className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
          />
        )}
        <input
          className={`${baseClasses} ${paddingClasses} ${themeClasses} ${className}`}
          required={required}
          type={type}
          max={max}
          min={min}
          maxLength={maxLength}
          minLength={minLength}
          onInput={handleInput}
          {...props}
        />
      </div>
      {helpText && <p className="text-gray-400 text-xs mt-1">{helpText}</p>}
    </div>
  );
}
