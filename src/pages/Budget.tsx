
import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import BudgetChart from '@/components/Budget/BudgetChart';

// Mock categories data
const categories = [
  { id: '1', name: 'Alimentação', type: 'expense', color: '#FF6384' },
  { id: '2', name: 'Moradia', type: 'expense', color: '#36A2EB' },
  { id: '3', name: 'Transporte', type: 'expense', color: '#FFCE56' },
  { id: '4', name: 'Saúde', type: 'expense', color: '#4BC0C0' },
  { id: '5', name: 'Lazer', type: 'expense', color: '#9966FF' },
  { id: '6', name: 'Educação', type: 'expense', color: '#FF9F40' },
  { id: '7', name: 'Salário', type: 'income', color: '#26E7A6' },
  { id: '8', name: 'Freelance', type: 'income', color: '#5CDB95' },
];

// Mock budget data
const initialBudgets = [
  { 
    id: '1', 
    categoryId: '1', 
    categoryName: 'Alimentação',
    color: '#FF6384',
    amount: 800,
    spent: 650,
    period: 'monthly',
    type: 'expense'
  },
  { 
    id: '2', 
    categoryId: '2', 
    categoryName: 'Moradia',
    color: '#36A2EB',
    amount: 1500,
    spent: 1500,
    period: 'monthly',
    type: 'expense'
  },
  { 
    id: '3', 
    categoryId: '3', 
    categoryName: 'Transporte',
    color: '#FFCE56',
    amount: 500,
    spent: 320,
    period: 'monthly',
    type: 'expense'
  },
  { 
    id: '4', 
    categoryId: '4', 
    categoryName: 'Saúde',
    color: '#4BC0C0',
    amount: 400,
    spent: 180,
    period: 'monthly',
    type: 'expense'
  },
  { 
    id: '5', 
    categoryId: '5', 
    categoryName: 'Lazer',
    color: '#9966FF',
    amount: 300,
    spent: 290,
    period: 'monthly',
    type: 'expense'
  },
];

// Form schema for budget creation and edit
const formSchema = z.object({
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'O valor deve ser um número válido maior que zero',
  }),
  period: z.string().min(1, 'Período é obrigatório'),
});

// Budget Form component
const BudgetForm = ({ 
  defaultValues, 
  onSubmit, 
  onCancel 
}: { 
  defaultValues?: z.infer<typeof formSchema>,
  onSubmit: (values: z.infer<typeof formSchema>) => void,
  onCancel: () => void
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      categoryId: '',
      amount: '',
      period: 'monthly',
    },
  });

  // Filter only expense categories
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Orçado</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Período</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
};

const Budget = () => {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<string | null>(null);
  const { toast } = useToast();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };
  
  const handleAddBudget = (values: z.infer<typeof formSchema>) => {
    const category = categories.find(c => c.id === values.categoryId);
    if (!category) return;
    
    // Check if budget for this category already exists
    if (budgets.some(b => b.categoryId === values.categoryId)) {
      toast({
        title: "Categoria já possui orçamento",
        description: "Você já definiu um orçamento para esta categoria.",
        variant: "destructive",
      });
      return;
    }

    const newBudget = {
      id: Date.now().toString(),
      categoryId: values.categoryId,
      categoryName: category.name,
      color: category.color,
      amount: Number(values.amount),
      spent: 0, // New budgets start with 0 spent
      period: values.period,
      type: category.type
    };

    setBudgets([...budgets, newBudget]);
    setIsDialogOpen(false);
    toast({
      title: "Orçamento adicionado",
      description: `Orçamento para ${category.name} foi adicionado com sucesso.`,
    });
  };
  
  const handleEditBudget = (values: z.infer<typeof formSchema>) => {
    if (!currentBudget) return;
    
    const category = categories.find(c => c.id === values.categoryId);
    if (!category) return;
    
    const budget = budgets.find(b => b.id === currentBudget);
    if (!budget) return;

    const updatedBudgets = budgets.map((budget) =>
      budget.id === currentBudget
        ? {
            ...budget,
            categoryId: values.categoryId,
            categoryName: category.name,
            color: category.color,
            amount: Number(values.amount),
            period: values.period,
          }
        : budget
    );

    setBudgets(updatedBudgets);
    setIsDialogOpen(false);
    setCurrentBudget(null);
    toast({
      title: "Orçamento atualizado",
      description: `Orçamento para ${category.name} foi atualizado com sucesso.`,
    });
  };
  
  const handleDeleteBudget = (id: string) => {
    const budgetToDelete = budgets.find(budget => budget.id === id);
    if (!budgetToDelete) return;

    const updatedBudgets = budgets.filter((budget) => budget.id !== id);
    setBudgets(updatedBudgets);
    toast({
      title: "Orçamento removido",
      description: `Orçamento para ${budgetToDelete.categoryName} foi removido com sucesso.`,
      variant: "destructive",
    });
  };

  const getFormDefaultValues = () => {
    if (!currentBudget) return;

    const budget = budgets.find((b) => b.id === currentBudget);
    if (!budget) return;

    return {
      categoryId: budget.categoryId,
      amount: budget.amount.toString(),
      period: budget.period,
    };
  };

  // Calculate totals
  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const percentSpent = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orçamento</h1>
          <p className="text-muted-foreground">Gerencie seus limites de gastos por categoria</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setCurrentBudget(null);
                setIsDialogOpen(true);
              }} 
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Orçamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {currentBudget ? 'Editar Orçamento' : 'Adicionar Novo Orçamento'}
              </DialogTitle>
            </DialogHeader>
            <BudgetForm 
              defaultValues={currentBudget ? getFormDefaultValues() : undefined}
              onSubmit={currentBudget ? handleEditBudget : handleAddBudget}
              onCancel={() => {
                setIsDialogOpen(false);
                setCurrentBudget(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Orçado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(totalBudgeted)}
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Total definido para o período
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Gasto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-expense">
              {formatCurrency(totalSpent)}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <ArrowUpRight className="h-4 w-4 text-expense" />
              <span>{percentSpent.toFixed(0)}% do orçamento</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Saldo Restante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(totalRemaining)}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <ArrowDownRight className="h-4 w-4 text-primary" />
              <span>{(100 - percentSpent).toFixed(0)}% disponível</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral do Orçamento</CardTitle>
            <CardDescription>Distribuição dos seus orçamentos por categoria</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <BudgetChart data={budgets} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progresso do Orçamento</CardTitle>
            <CardDescription>Quanto você já gastou do valor orçado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {budgets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Nenhum orçamento definido</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Clique em "Novo Orçamento" para começar a definir seus limites de gastos
                  </p>
                </div>
              ) : (
                budgets.map((budget) => {
                  const percentUsed = (budget.spent / budget.amount) * 100;
                  const status = 
                    percentUsed > 90 ? 'text-destructive' : 
                    percentUsed > 70 ? 'text-warning' : 
                    'text-primary';
                  
                  return (
                    <div key={budget.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: budget.color }}
                          />
                          <span className="font-medium">{budget.categoryName}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={status}>
                            {percentUsed.toFixed(0)}%
                          </span>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => {
                                setCurrentBudget(budget.id);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => handleDeleteBudget(budget.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {formatCurrency(budget.spent)} de {formatCurrency(budget.amount)}
                        </span>
                        <span className="text-muted-foreground">
                          Restante: {formatCurrency(budget.amount - budget.spent)}
                        </span>
                      </div>
                      <Progress 
                        value={percentUsed > 100 ? 100 : percentUsed} 
                        className="h-2" 
                        indicatorClassName={
                          percentUsed > 90 ? "bg-destructive" : 
                          percentUsed > 70 ? "bg-yellow-500" : 
                          "bg-primary"
                        }
                      />
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Budget;
