// src/utils/format.ts

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
  