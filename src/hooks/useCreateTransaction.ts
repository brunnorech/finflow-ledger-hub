/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthorizedFetch } from "@/api/client-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTransaction = () => {
  const fetchWithAuth = useAuthorizedFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetchWithAuth("/transactions", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao criar transação");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dashboard"] as any);
      queryClient.invalidateQueries(["transactions", 5] as any);
    },
  });
};
