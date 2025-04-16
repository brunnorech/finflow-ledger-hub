import { useAuthorizedFetch } from "@/api/client-auth";
import { Transaction } from "@/components/Dashboard/TransactionsList";
import { useQuery } from "@tanstack/react-query";

type TRecentTransactions = Transaction;

export const useRecentTransactions = (limit: number = 5) => {
  const fetchWithAuth = useAuthorizedFetch();

  return useQuery({
    queryKey: ["transactions", limit],
    queryFn: async () => {
      const res = await fetchWithAuth(`/transactions?limit=${limit}`);
      if (!res.ok) throw new Error("Erro ao buscar transações");
      const data = await res.json();

      console.log({ data })

      return data.map((item) => ({
        account: item.account.name,
        amount: item.amount,
        category: item.category.name,
        date: item.date,
        description: item.description,
        type: item.type.toLowerCase(),
        id: item.id,
      } as TRecentTransactions)) as TRecentTransactions[]
    },
  });
};
