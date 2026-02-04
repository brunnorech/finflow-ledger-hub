import { useEffect, useState } from "react";

/**
 * Retorna um valor que só é atualizado após o delay (em ms) sem novas mudanças.
 * Útil para buscar na API após o usuário parar de digitar.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
