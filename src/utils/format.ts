// src/utils/format.ts

/** Formata Date para string dd/mm/yyyy (padrão Brasil) */
export function formatDateToBR(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

/** Converte string dd/mm/yyyy para yyyy-mm-dd (ISO para API) */
export function parseBRToISODate(dateBR: string): string {
  const match = dateBR.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return dateBR;
  const [, d, m, y] = match;
  return `${y}-${m}-${d}`;
}

/** Aplica máscara dd/mm/yyyy enquanto o usuário digita */
export function maskDateBR(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export const getMethodLabel = (method: string): string => {
  const map: Record<string, string> = {
    PIX: "Pix",
    CREDITO: "Crédito",
    DEBITO: "Débito",
    BOLETO: "Boleto",
    DINHEIRO: "Dinheiro",
    OUTRO: "Outro",
  };

  return map[method] || method;
};
