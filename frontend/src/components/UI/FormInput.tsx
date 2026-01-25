import { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  theme?: 'light' | 'dark'; // Para formularios en fondos oscuros vs claros
}

export default function FormInput({
  label,
  error,
  theme = 'light',
  required,
  className = '',
  ...props
}: FormInputProps) {
  const baseClasses = "w-full px-4 py-2 border rounded-lg transition-all duration-300";

  const themeClasses = theme === 'light'
    ? "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
    : "bg-white/10 border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent disabled:opacity-50";

  const labelClasses = theme === 'light'
    ? "text-gray-700"
    : "text-gray-200";

  return (
    <div>
      <label className={`block text-sm font-medium ${labelClasses} mb-2`}>
        {label} {required && '*'}
      </label>
      <input
        className={`${baseClasses} ${themeClasses} ${error ? 'border-red-500' : ''} ${className}`}
        required={required}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
