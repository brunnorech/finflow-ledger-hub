import { useAuthorizedFetch } from "@/api/client-auth";
import { Transaction } from "@/components/Dashboard/TransactionsList";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export type TransactionFilterType = "income" | "expense" | "all";

export interface TransactionsQueryParams {
  page: number;
  pageSize: number;
  type?: TransactionFilterType | undefined;
  search?: string | undefined;
}

export interface TransactionsMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface TransactionsResult {
  items: Transaction[];
  meta: TransactionsMeta;
}

export const useTransactions = (
  params: TransactionsQueryParams
): UseQueryResult<TransactionsResult> => {
  const fetchWithAuth = useAuthorizedFetch();

  return useQuery<TransactionsResult>({
    queryKey: ["transactions", params],
    queryFn: async (): Promise<TransactionsResult> => {
      const searchParams = new URLSearchParams();
      searchParams.set("page", String(params.page));
      searchParams.set("pageSize", String(params.pageSize));

      if (params.type && params.type !== "all") {
        searchParams.set("type", params.type.toUpperCase());
      }

      if (params.search) {
        searchParams.set("search", params.search);
      }

      const res = await fetchWithAuth(
        `/transactions?${searchParams.toString()}`
      );
      if (!res.ok) {
        throw new Error("Erro ao buscar transações");
      }

      const json = await res.json();

      const items: Transaction[] = (json.data || []).map((item: any) => ({
        id: item.id,
        description: item.description,
        amount: item.amount,
        type:
          (item.type || "").toLowerCase() === "income" ? "income" : "expense",
        category: item.category?.name || "Sem categoria",
        date: item.date,
        account: item.account?.name || "Sem conta",
      }));

      const meta: TransactionsMeta = json.meta || {
        page: params.page,
        pageSize: params.pageSize,
        total: items.length,
        totalPages: 1,
      };

      return { items, meta };
    },
    keepPreviousData: true,
  });
};
