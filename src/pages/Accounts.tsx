import React, { useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  BanknoteIcon,
  Wallet,
  BuildingIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  useAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from "@/hooks/useAccounts";

const ACCOUNT_TYPE_API_TO_FRONT: Record<string, string> = {
  CORRENTE: "checking",
  POUPANCA: "savings",
  CREDITO: "credit",
  CARTEIRA: "cash",
  OUTRA: "investment",
};

const ACCOUNT_TYPE_FRONT_TO_API: Record<string, string> = {
  checking: "CORRENTE",
  savings: "POUPANCA",
  credit: "CREDITO",
  cash: "CARTEIRA",
  investment: "OUTRA",
};

const accountTypes = [
  { id: "checking", name: "Conta Corrente", icon: BanknoteIcon },
  { id: "savings", name: "Conta Poupança", icon: BuildingIcon },
  { id: "investment", name: "Investimento", icon: CreditCard },
  { id: "cash", name: "Dinheiro", icon: Wallet },
  { id: "credit", name: "Cartão de Crédito", icon: CreditCard },
];

const formSchema = z.object({
  name: z.string().min(1, "Nome da conta é obrigatório"),
  type: z.string().min(1, "Tipo da conta é obrigatório"),
});

type AccountFromApi = {
  id: string;
  name: string;
  type: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

const AccountTypeIcon = ({ type }: { type: string }) => {
  const frontType = ACCOUNT_TYPE_API_TO_FRONT[type] ?? type;
  const accountType = accountTypes.find((t) => t.id === frontType);
  const Icon = accountType?.icon ?? Wallet;
  return <Icon className="h-5 w-5" />;
};

const AccountForm = ({
  defaultValues,
  onSubmit,
  onCancel,
}: {
  defaultValues?: z.infer<typeof formSchema>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      name: "",
      type: "",
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
              <Select onValueChange={field.onChange} value={field.value}>
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
  const { data: accounts = [], isLoading } = useAccounts();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<AccountFromApi | null>(
    null
  );
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const handleAddAccount = (values: z.infer<typeof formSchema>) => {
    const apiType = ACCOUNT_TYPE_FRONT_TO_API[values.type] ?? values.type;
    createAccount.mutate(
      { name: values.name, type: apiType },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast({
            title: "Conta adicionada",
            description: `${values.name} foi adicionada com sucesso.`,
          });
        },
        onError: () => {
          toast({
            title: "Erro",
            description: "Não foi possível criar a conta.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleEditAccount = (values: z.infer<typeof formSchema>) => {
    if (!currentAccount) return;
    const apiType = ACCOUNT_TYPE_FRONT_TO_API[values.type] ?? values.type;
    updateAccount.mutate(
      {
        id: currentAccount.id,
        data: { name: values.name, type: apiType },
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setCurrentAccount(null);
          toast({
            title: "Conta atualizada",
            description: `${values.name} foi atualizada com sucesso.`,
          });
        },
        onError: () => {
          toast({
            title: "Erro",
            description: "Não foi possível atualizar a conta.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDeleteAccount = (account: AccountFromApi) => {
    deleteAccount.mutate(account.id, {
      onSuccess: () => {
        toast({
          title: "Conta removida",
          description: `${account.name} foi removida com sucesso.`,
          variant: "destructive",
        });
      },
      onError: () => {
        toast({
          title: "Erro",
          description: "Não foi possível excluir a conta.",
          variant: "destructive",
        });
      },
    });
  };

  const getFormDefaultValues = (): z.infer<typeof formSchema> | undefined => {
    if (!currentAccount) return undefined;
    const frontType =
      ACCOUNT_TYPE_API_TO_FRONT[currentAccount.type] ?? currentAccount.type;
    return {
      name: currentAccount.name,
      type: frontType,
    };
  };

  const getAccountTypeName = (type: string) => {
    const frontType = ACCOUNT_TYPE_API_TO_FRONT[type] ?? type;
    return accountTypes.find((t) => t.id === frontType)?.name ?? "Conta";
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">Carregando contas...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contas Financeiras</h1>
          <p className="text-muted-foreground">
            Gerencie suas contas bancárias e financeiras
          </p>
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
                {currentAccount ? "Editar Conta" : "Adicionar Nova Conta"}
              </DialogTitle>
            </DialogHeader>
            <AccountForm
              defaultValues={
                currentAccount ? getFormDefaultValues() : undefined
              }
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
            <CardTitle className="text-lg">Total de contas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{accounts.length}</div>
            <p className="text-muted-foreground text-sm mt-1">
              Contas cadastradas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account: AccountFromApi) => (
          <Card key={account.id} className="overflow-hidden">
            <div className="h-2 bg-primary/20" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <AccountTypeIcon type={account.type} />
                  </div>
                  <CardTitle className="text-lg">{account.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCurrentAccount(account);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAccount(account)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-muted-foreground">—</div>
              <p className="text-muted-foreground text-sm mt-1">
                {getAccountTypeName(account.type)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          <p>Nenhuma conta cadastrada.</p>
          <p className="text-sm mt-1">
            Clique em &quot;Nova Conta&quot; para começar.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Accounts;
