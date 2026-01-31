import { TextareaHTMLAttributes } from "react";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  theme?: "light" | "dark";
}

export default function FormTextarea({
  label,
  error,
  theme = "light",
  required,
  className = "",
  ...props
}: FormTextareaProps) {
  const baseClasses =
    "w-full px-4 py-2 border rounded-lg transition-all duration-300 resize-none";

  const themeClasses =
    theme === "light"
      ? "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent"
      : "bg-white/10 border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent";

  const labelClasses = theme === "light" ? "text-gray-700" : "text-gray-200";

  return (
    <div>
      <label className={`block text-sm font-medium ${labelClasses} mb-2`}>
        {label} {required && "*"}
      </label>
      <textarea
        className={`${baseClasses} ${themeClasses} ${error ? "border-red-500" : ""} ${className}`}
        required={required}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
