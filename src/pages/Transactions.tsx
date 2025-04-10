
import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import TransactionsList, { Transaction } from '@/components/Dashboard/TransactionsList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import TransactionForm from '@/components/Transactions/TransactionForm';
import { PlusCircle, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

// Mock data
const allTransactions: Transaction[] = [
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
  {
    id: '6',
    description: 'Aluguel',
    amount: 1200.00,
    type: 'expense',
    category: 'Moradia',
    date: '2023-03-30',
    account: 'Banco do Brasil'
  },
  {
    id: '7',
    description: 'Conta de Luz',
    amount: 98.50,
    type: 'expense',
    category: 'Moradia',
    date: '2023-03-28',
    account: 'Nubank'
  },
  {
    id: '8',
    description: 'Conta de Água',
    amount: 45.75,
    type: 'expense',
    category: 'Moradia',
    date: '2023-03-25',
    account: 'Nubank'
  },
  {
    id: '9',
    description: 'Bônus',
    amount: 1200.00,
    type: 'income',
    category: 'Salário',
    date: '2023-03-22',
    account: 'Banco do Brasil'
  },
  {
    id: '10',
    description: 'Restaurante',
    amount: 85.90,
    type: 'expense',
    category: 'Alimentação',
    date: '2023-03-20',
    account: 'Nubank'
  },
];

const Transactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = 
      typeFilter === 'all' || 
      (typeFilter === 'expense' && transaction.type === 'expense') ||
      (typeFilter === 'income' && transaction.type === 'income');
    
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Transações</h1>
          <p className="text-muted-foreground">Gerencie todas as suas transações</p>
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
      
      <div className="bg-card border rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
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
      
      <TransactionsList
        transactions={filteredTransactions}
        title={`Transações (${filteredTransactions.length})`}
      />
    </DashboardLayout>
  );
};

export default Transactions;
