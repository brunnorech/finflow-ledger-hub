// src/hooks/useAccounts.ts
import { useAuthorizedFetch } from "@/api/client-auth";
import { useQuery } from "@tanstack/react-query";

export const useAccounts = () => {
  const fetchWithAuth = useAuthorizedFetch();

  return useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await fetchWithAuth("/accounts");
      if (!res.ok) throw new Error("Erro ao buscar contas");
      return res.json();
    },
  });
};
