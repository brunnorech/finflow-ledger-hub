// src/hooks/useDashboard.ts
import { useAuthorizedFetch } from "@/api/client-auth";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = (month: number, year: number) => {
  const fetchWithAuth = useAuthorizedFetch();

  return useQuery({
    queryKey: ["dashboard", month, year],
    queryFn: async () => {
      const res = await fetchWithAuth(`/dashboard?month=${month}&year=${year}`);
      if (!res.ok) throw new Error("Erro ao carregar o dashboard");
      return res.json();
    },
  });
};
