import { useAuthorizedFetch } from "@/api/client-auth";
import { Transaction } from "@/components/Dashboard/TransactionsList";
import { useQuery } from "@tanstack/react-query";

type TRecentTransactions = Transaction;

export const useRecentTransactions = (limit: number = 5) => {
  const fetchWithAuth = useAuthorizedFetch();

  return useQuery<TRecentTransactions[]>({
    queryKey: ["transactions", "recent", limit],
    queryFn: async () => {
      const res = await fetchWithAuth(`/transactions/recents?limit=${limit}`);
      if (!res.ok) throw new Error("Erro ao buscar transações recentes");
      const data = await res.json();

      return data.map(
        (item: any): TRecentTransactions => ({
          id: item.id,
          description: item.description,
          amount: item.amount,
          type:
            (item.type || "").toLowerCase() === "income" ? "income" : "expense",
          category: item.category?.name || "Sem categoria",
          date: item.date,
          account: item.account?.name || "Sem conta",
        })
      );
    },
  });
};
