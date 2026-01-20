import { SelectHTMLAttributes, ReactNode } from 'react';

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  theme?: 'light' | 'dark';
  children: ReactNode;
}

export default function FormSelect({ 
  label, 
  error, 
  theme = 'light',
  required,
  className = '',
  children,
  ...props 
}: FormSelectProps) {
  const baseClasses = "w-full px-4 py-2 border rounded-lg transition-all duration-300";
  
  const themeClasses = theme === 'light' 
    ? "border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent [color-scheme:light]"
    : "bg-white/10 border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent";

  const labelClasses = theme === 'light'
    ? "text-gray-700"
    : "text-gray-200";

  return (
    <div>
      <label className={`block text-sm font-medium ${labelClasses} mb-2`}>
        {label} {required && '*'}
      </label>
      <select
        className={`${baseClasses} ${themeClasses} ${error ? 'border-red-500' : ''} ${className}`}
        required={required}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
