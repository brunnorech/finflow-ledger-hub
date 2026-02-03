import { useAuthorizedFetch } from "@/api/client-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCategories = (type?: "INCOME" | "EXPENSE") => {
  const fetchWithAuth = useAuthorizedFetch();

  return useQuery({
    queryKey: ["categories", type ?? "all"],
    queryFn: async () => {
      const url = type ? `/categories?type=${type}` : "/categories";
      const res = await fetchWithAuth(url);
      if (!res.ok) throw new Error("Erro ao buscar categorias");
      return res.json();
    },
  });
};

export const useCreateCategory = () => {
  const fetchWithAuth = useAuthorizedFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; type: string }) => {
      const res = await fetchWithAuth("/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          type: data.type.toUpperCase() as "INCOME" | "EXPENSE",
        }),
      });
      if (!res.ok) throw new Error("Erro ao criar categoria");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategory = () => {
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
      const res = await fetchWithAuth(`/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          type: data.type.toUpperCase() as "INCOME" | "EXPENSE",
        }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar categoria");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const fetchWithAuth = useAuthorizedFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchWithAuth(`/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao excluir categoria");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
