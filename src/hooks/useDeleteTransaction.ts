import { useAuthorizedFetch } from "@/api/client-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteTransaction = () => {
  const fetchWithAuth = useAuthorizedFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      const res = await fetchWithAuth(`/transactions/${transactionId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Erro ao excluir transação");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
