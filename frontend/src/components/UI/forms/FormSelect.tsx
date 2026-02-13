"use client";

import { SelectHTMLAttributes, ReactNode } from "react";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  theme?: "light" | "dark";
  children: ReactNode;
}

export function FormSelect({
  label,
  error,
  theme = "light",
  required,
  className = "",
  children,
  ...props
}: FormSelectProps) {
  const baseClasses =
    "w-full px-4 py-2 border rounded-lg transition-all duration-300";

  const themeClasses =
    theme === "light"
      ? "border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent [color-scheme:light] disabled:bg-gray-100 disabled:text-gray-500"
      : "bg-white/10 border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent disabled:opacity-50";

  const labelClasses = theme === "light" ? "text-gray-700" : "text-gray-200";

  return (
    <div className="mb-2">
      <label className={`block text-sm font-medium ${labelClasses} mb-2`}>
        {label} {required && "*"}
      </label>
      <select
        className={`${baseClasses} ${themeClasses} ${error ? "border-(--danger)" : ""} ${className}`}
        required={required}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-(--danger)">{error}</p>}
    </div>
  );
}
