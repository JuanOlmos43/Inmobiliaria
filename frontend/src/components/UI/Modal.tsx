import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'; // Tamaño del modal
  staticBackdrop?: boolean; // Si es true, no cierra al hacer click fuera ni escape
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  staticBackdrop = false
}: ModalProps) {
  // Cerrar con tecla ESC y manejar scroll del body
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !staticBackdrop) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      // Restaurar scroll cuando se cierra
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Asegurar que siempre se restaure el scroll al desmontar
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen, onClose, staticBackdrop]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={!staticBackdrop ? onClose : undefined} // Cerrar al hacer clic en el fondo solo si no es estático
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] flex flex-col animate-scale-in`}
        onClick={(e) => e.stopPropagation()} // Prevenir cierre al hacer clic dentro del modal
      >
        <div className="flex justify-between items-start p-6 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-2xl font-bold text-[#0f172a]">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
