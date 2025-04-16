import React from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import StatsCard from "@/components/Dashboard/StatsCard";
import TransactionsList from "@/components/Dashboard/TransactionsList";
import ExpensesByCategoryChart from "@/components/Dashboard/ExpensesByCategoryChart";
import IncomeExpenseChart from "@/components/Dashboard/IncomeExpenseChart";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Wallet,
  TrendingUp,
  TrendingDown,
  LayoutDashboard,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TransactionForm from "@/components/Transactions/TransactionForm";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useRecentTransactions } from "@/hooks/useRecentTransactions";

const Dashboard: React.FC = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const { data, isLoading, isError } = useDashboard(month, year);
  const { data: recentTransactions = [] } = useRecentTransactions(5);
  const { user } = useAuth();

  const formatCurrency = (value?: number) => {
    return (value ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <p>Carregando dashboard...</p>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <p>Erro ao carregar os dados do dashboard.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das suas finanças, {user?.name?.split(" ")[0]}
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-lg font-semibold mb-4">Nova Transação</h2>
            <TransactionForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Saldo Total"
          value={formatCurrency(data?.totalBalance)}
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatsCard
          title="Receitas do Mês"
          value={formatCurrency(data?.monthlyIncome)}
          icon={<TrendingUp className="h-4 w-4" />}
          className="border-l-4 border-l-income"
        />
        <StatsCard
          title="Despesas do Mês"
          value={formatCurrency(data?.monthlyExpense)}
          icon={<TrendingDown className="h-4 w-4" />}
          className="border-l-4 border-l-expense"
        />
        <StatsCard
          title="Economia do Mês"
          value={formatCurrency(data?.monthlySavings)}
          icon={<LayoutDashboard className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <IncomeExpenseChart data={data?.monthlySummary || []} />
        <ExpensesByCategoryChart data={data?.expensesByCategory || []} />
      </div>

      <div className="mb-6">
        <TransactionsList
          transactions={recentTransactions}
          title="Transações Recentes"
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
