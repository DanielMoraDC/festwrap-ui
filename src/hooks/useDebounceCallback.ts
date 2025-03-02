import { useCallback, useRef } from 'react';

/**
 * Hook para debouncing de funciones sin `useEffect`
 * @param callback - Función a ejecutar después del debounce
 * @param delay - Tiempo en milisegundos para el debounce
 */
export function useDebouncedCallback<T extends (..._args: any[]) => void>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}
