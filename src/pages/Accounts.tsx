
import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Plus, Pencil, Trash2, BanknoteIcon, Wallet, BuildingIcon } from 'lucide-react';
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

// Define account types with their respective icons
const accountTypes = [
  { id: 'checking', name: 'Conta Corrente', icon: BanknoteIcon },
  { id: 'savings', name: 'Conta Poupança', icon: BuildingIcon },
  { id: 'investment', name: 'Investimento', icon: CreditCard },
  { id: 'cash', name: 'Dinheiro', icon: Wallet },
  { id: 'credit', name: 'Cartão de Crédito', icon: CreditCard },
];

// Mock accounts data
const initialAccounts = [
  { id: '1', name: 'Conta Principal', type: 'checking', balance: 4750.5, color: '#36A2EB' },
  { id: '2', name: 'Poupança', type: 'savings', balance: 12650.75, color: '#4BC0C0' },
  { id: '3', name: 'Cartão Nubank', type: 'credit', balance: -1250.8, color: '#9966FF' },
  { id: '4', name: 'Investimentos XP', type: 'investment', balance: 35000, color: '#FFCE56' },
];

// Form schema for account creation and edit
const formSchema = z.object({
  name: z.string().min(1, 'Nome da conta é obrigatório'),
  type: z.string().min(1, 'Tipo da conta é obrigatório'),
  balance: z.string().refine((val) => !isNaN(Number(val)), {
    message: 'O saldo deve ser um número válido',
  }),
  color: z.string().min(1, 'Cor é obrigatória'),
});

// Component to render account type icon
const AccountTypeIcon = ({ type }: { type: string }) => {
  const accountType = accountTypes.find((t) => t.id === type);
  const Icon = accountType?.icon || Wallet;
  return <Icon className="h-5 w-5" />;
};

// Form component for adding/editing accounts
const AccountForm = ({ 
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
      name: '',
      type: '',
      balance: '0',
      color: '#36A2EB',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Conta</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Conta Bancária" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Conta</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de conta" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        <span>{type.name}</span>
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
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Saldo Inicial</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input 
                    type="color" 
                    {...field}
                    className="w-12 h-10 p-1 cursor-pointer" 
                  />
                  <Input 
                    type="text" 
                    value={field.value} 
                    onChange={field.onChange}
                    className="flex-1" 
                  />
                </div>
              </FormControl>
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

const Accounts = () => {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const handleAddAccount = (values: z.infer<typeof formSchema>) => {
    const newAccount = {
      id: Date.now().toString(),
      name: values.name,
      type: values.type,
      balance: Number(values.balance),
      color: values.color,
    };

    setAccounts([...accounts, newAccount]);
    setIsDialogOpen(false);
    toast({
      title: "Conta adicionada",
      description: `${values.name} foi adicionada com sucesso.`,
    });
  };

  const handleEditAccount = (values: z.infer<typeof formSchema>) => {
    if (!currentAccount) return;

    const updatedAccounts = accounts.map((account) =>
      account.id === currentAccount
        ? {
            ...account,
            name: values.name,
            type: values.type,
            balance: Number(values.balance),
            color: values.color,
          }
        : account
    );

    setAccounts(updatedAccounts);
    setIsDialogOpen(false);
    setCurrentAccount(null);
    toast({
      title: "Conta atualizada",
      description: `${values.name} foi atualizada com sucesso.`,
    });
  };

  const handleDeleteAccount = (id: string) => {
    const accountToDelete = accounts.find(account => account.id === id);
    if (!accountToDelete) return;

    const updatedAccounts = accounts.filter((account) => account.id !== id);
    setAccounts(updatedAccounts);
    toast({
      title: "Conta removida",
      description: `${accountToDelete.name} foi removida com sucesso.`,
      variant: "destructive",
    });
  };

  const getFormDefaultValues = () => {
    if (!currentAccount) return;

    const account = accounts.find((a) => a.id === currentAccount);
    if (!account) return;

    return {
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      color: account.color,
    };
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contas Financeiras</h1>
          <p className="text-muted-foreground">Gerencie suas contas bancárias e financeiras</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setCurrentAccount(null);
                setIsDialogOpen(true);
              }} 
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nova Conta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {currentAccount ? 'Editar Conta' : 'Adicionar Nova Conta'}
              </DialogTitle>
            </DialogHeader>
            <AccountForm 
              defaultValues={currentAccount ? getFormDefaultValues() : undefined}
              onSubmit={currentAccount ? handleEditAccount : handleAddAccount}
              onCancel={() => {
                setIsDialogOpen(false);
                setCurrentAccount(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Saldo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Soma de todos os saldos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="overflow-hidden">
            <div 
              className="h-2" 
              style={{ backgroundColor: account.color }} 
            />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="p-2 rounded-full" 
                    style={{ backgroundColor: `${account.color}20` }}
                  >
                    <AccountTypeIcon type={account.type} />
                  </div>
                  <CardTitle className="text-lg">{account.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      setCurrentAccount(account.id);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteAccount(account.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${account.balance < 0 ? 'text-destructive' : ''}`}>
                {formatCurrency(account.balance)}
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                {accountTypes.find(t => t.id === account.type)?.name || 'Conta'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Accounts;
