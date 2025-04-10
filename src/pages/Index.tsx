
import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import StatsCard from '@/components/Dashboard/StatsCard';
import TransactionsList, { Transaction } from '@/components/Dashboard/TransactionsList';
import ExpensesByCategoryChart from '@/components/Dashboard/ExpensesByCategoryChart';
import IncomeExpenseChart from '@/components/Dashboard/IncomeExpenseChart';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wallet, TrendingUp, TrendingDown, LayoutDashboard } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import TransactionForm from '@/components/Transactions/TransactionForm';

// Mock data
const recentTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Supermercado Bretas',
    amount: 156.78,
    type: 'expense',
    category: 'Alimentação',
    date: '2023-04-08',
    account: 'Nubank'
  },
  {
    id: '2',
    description: 'Salário',
    amount: 4500.00,
    type: 'income',
    category: 'Salário',
    date: '2023-04-05',
    account: 'Banco do Brasil'
  },
  {
    id: '3',
    description: 'Uber',
    amount: 22.50,
    type: 'expense',
    category: 'Transporte',
    date: '2023-04-04',
    account: 'Nubank'
  },
  {
    id: '4',
    description: 'Netflix',
    amount: 55.90,
    type: 'expense',
    category: 'Entretenimento',
    date: '2023-04-02',
    account: 'Nubank'
  },
  {
    id: '5',
    description: 'Freelance Design',
    amount: 800.00,
    type: 'income',
    category: 'Freelance',
    date: '2023-04-01',
    account: 'Banco do Brasil'
  },
];

const expensesData = [
  { name: 'Alimentação', value: 850, color: '#FF6384' },
  { name: 'Moradia', value: 1200, color: '#36A2EB' },
  { name: 'Transporte', value: 450, color: '#FFCE56' },
  { name: 'Saúde', value: 380, color: '#4BC0C0' },
  { name: 'Lazer', value: 320, color: '#9966FF' },
  { name: 'Outros', value: 290, color: '#FF9F40' },
];

const monthlyData = [
  { name: 'Jan', income: 5200, expense: 4300 },
  { name: 'Fev', income: 5100, expense: 4100 },
  { name: 'Mar', income: 5400, expense: 4500 },
  { name: 'Abr', income: 5300, expense: 4200 },
  { name: 'Mai', income: 5600, expense: 4400 },
  { name: 'Jun', income: 5800, expense: 4600 },
];

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral das suas finanças</p>
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
          value="R$ 12.459,87"
          change={{ value: "+R$ 1.245,30", percentage: "11%", trend: "up" }}
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatsCard
          title="Receitas do Mês"
          value="R$ 5.800,00"
          change={{ value: "+R$ 600,00", percentage: "12%", trend: "up" }}
          icon={<TrendingUp className="h-4 w-4" />}
          className="border-l-4 border-l-income"
        />
        <StatsCard
          title="Despesas do Mês"
          value="R$ 4.600,00"
          change={{ value: "+R$ 200,00", percentage: "5%", trend: "down" }}
          icon={<TrendingDown className="h-4 w-4" />}
          className="border-l-4 border-l-expense"
        />
        <StatsCard
          title="Economia do Mês"
          value="R$ 1.200,00"
          change={{ value: "+R$ 400,00", percentage: "50%", trend: "up" }}
          icon={<LayoutDashboard className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <IncomeExpenseChart data={monthlyData} />
        <ExpensesByCategoryChart data={expensesData} />
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
