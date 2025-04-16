import { useAuthorizedFetch } from "@/api/client-auth";
import { useQuery } from "@tanstack/react-query";

export const useCategories = (type: "INCOME" | "EXPENSE") => {
  const fetchWithAuth = useAuthorizedFetch();

  return useQuery({
    queryKey: ["categories", type],
    queryFn: async () => {
      const res = await fetchWithAuth(`/categories?type=${type}`);
      if (!res.ok) throw new Error("Erro ao buscar categorias");
      return res.json();
    },
  });
};