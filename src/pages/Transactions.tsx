import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import TransactionsList from "@/components/Dashboard/TransactionsList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TransactionForm from "@/components/Transactions/TransactionForm";
import { PlusCircle, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  useTransactions,
  type TransactionFilterType,
  type TransactionsResult,
} from "@/hooks/useTransactions";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteTransaction } from "@/hooks/useDeleteTransaction";
import type { Transaction } from "@/components/Dashboard/TransactionsList";

const DEBOUNCE_SEARCH_MS = 400;

const Transactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchDebounced = useDebouncedValue(searchTerm, DEBOUNCE_SEARCH_MS);
  const [typeFilter, setTypeFilter] = useState<TransactionFilterType>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const { data, isLoading } = useTransactions({
    page,
    pageSize,
    type: typeFilter,
    search: searchDebounced || undefined,
  });

  const result = data as TransactionsResult | undefined;
  const total = result?.meta.total ?? 0;
  const totalPages = result?.meta.totalPages ?? 1;
  const transactions = result?.items ?? [];

  const deleteTransaction = useDeleteTransaction();

  useEffect(() => {
    setPage(1);
  }, [typeFilter, searchDebounced]);

  const handleConfirmDelete = () => {
    if (!transactionToDelete) return;
    deleteTransaction.mutate(transactionToDelete.id, {
      onSettled: () => setTransactionToDelete(null),
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Transações</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gerencie todas as suas transações
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (open) setFormKey((k) => k + 1);
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 w-full sm:w-auto min-h-11">
              <PlusCircle className="h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-lg font-semibold mb-4">Nova Transação</h2>
            <TransactionForm
              key={formKey}
              onClose={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-lg p-4 mb-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1 min-w-0">
            <Input
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v as TransactionFilterType)}
            >
              <SelectTrigger className="w-full md:w-[180px] min-h-11">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">Carregando transações...</p>
        </div>
      ) : (
        <>
          <TransactionsList
            transactions={transactions}
            title={`Transações (${total})`}
            onDelete={(t) => setTransactionToDelete(t)}
          />

          <AlertDialog
            open={!!transactionToDelete}
            onOpenChange={(open) => {
              if (!open) setTransactionToDelete(null);
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
                <AlertDialogDescription>
                  {transactionToDelete ? (
                    <>
                      Esta ação não pode ser desfeita. A transação &quot;
                      {transactionToDelete.description}&quot; será excluída
                      permanentemente.
                    </>
                  ) : (
                    "Esta ação não pode ser desfeita."
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleConfirmDelete();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteTransaction.isPending ? "Excluindo..." : "Excluir"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((prev) => (prev > 1 ? prev - 1 : prev));
                      }}
                      className={
                        page === 1
                          ? "pointer-events-none opacity-50 hover:bg-transparent"
                          : ""
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-3 text-sm text-muted-foreground">
                      Página {page} de {totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((prev) =>
                          prev < totalPages ? prev + 1 : prev
                        );
                      }}
                      className={
                        page >= totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default Transactions;
