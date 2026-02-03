// src/hooks/useAccounts.ts
import { useAuthorizedFetch } from "@/api/client-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useCreateAccount = () => {
  const fetchWithAuth = useAuthorizedFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; type: string }) => {
      const res = await fetchWithAuth("/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao criar conta");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

export const useUpdateAccount = () => {
  const fetchWithAuth = useAuthorizedFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { name: string; type: string };
    }) => {
      const res = await fetchWithAuth(`/accounts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao atualizar conta");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

export const useDeleteAccount = () => {
  const fetchWithAuth = useAuthorizedFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchWithAuth(`/accounts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir conta");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};
