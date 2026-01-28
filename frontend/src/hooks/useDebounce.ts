import { useState, useEffect } from "react";

/**
 * useDebounce - Retrasa la actualización de un valor.
 * @param value El valor que cambia rápidamente (ej: entrada de teclado)
 * @param delay El tiempo de espera en milisegundos (ej: 500ms)
 */
export function useDebounce<T>(value: T, delay: number): T {
  // Guardamos el valor "retrasado" en un estado interno
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Iniciamos un temporizador cada vez que el valor original cambia
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Si el usuario vuelve a escribir antes de que pase el 'delay',
    // esta función de limpieza cancela el temporizador anterior y comienza uno nuevo.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Se dispara cada vez que cambia el valor o el tiempo

  return debouncedValue;
}