// src/hooks/useMetadata.ts
import { useAuthorizedFetch } from "@/api/client-auth";
import { useQuery } from "@tanstack/react-query";

export const useMetadata = () => {
  const fetchWithAuth = useAuthorizedFetch();

  return useQuery({
    queryKey: ["metadata"],
    queryFn: async () => {
      const res = await fetchWithAuth("/metadata");
      if (!res.ok) throw new Error("Erro ao buscar metadados");
      return res.json();
    },
  });
};
