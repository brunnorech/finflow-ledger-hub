import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCreateTransaction } from "@/hooks/useCreateTransaction";
import { useMetadata } from "@/hooks/useMetadata";
import { getMethodLabel } from "@/utils/format";
import { useCategories } from "@/hooks/useCategories";
import { useAccounts } from "@/hooks/useAccounts";

const transactionSchema = z.object({
  description: z
    .string()
    .min(3, "A descrição deve ter pelo menos 3 caracteres"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "O valor deve ser um número positivo",
  }),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Selecione uma categoria"),
  account: z.string().min(1, "Selecione uma conta"),
  date: z.string().min(1, "Selecione uma data"),
  payMethod: z.string().min(1, "Selecione o método de pagamento"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

const accounts = [
  { id: "1", name: "Conta Corrente" },
  { id: "2", name: "Poupança" },
  { id: "3", name: "Cartão de Crédito" },
];

interface TransactionFormProps {
  onClose?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose }) => {
  const { toast } = useToast();
  const { mutate, isPending } = useCreateTransaction();
  const { data: accounts = [] } = useAccounts();
  const { data: metadata } = useMetadata();

  const [activeTab, setActiveTab] = React.useState<"income" | "expense">(
    "expense"
  );

  const { data: categories = [] } = useCategories(
    activeTab.toUpperCase() as "INCOME" | "EXPENSE"
  );

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: "",
      type: "expense",
      category: "",
      account: "",
      payMethod: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  React.useEffect(() => {
    form.setValue("type", activeTab);
  }, [activeTab, form]);

  const onSubmit = (data: TransactionFormValues) => {
    const payload = {
      description: data.description,
      amount: parseFloat(data.amount),
      type: data.type.toUpperCase(),
      paymentMethod: data.payMethod,
      accountId: data.account,
      categoryId: data.category,
      date: data.date,
    };

    mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Transação adicionada",
          description: "Sua transação foi salva com sucesso.",
          variant: "success",
        });
        form.reset();
        if (onClose) onClose();
      },
      onError: (err: Error) => {
        toast({
          title: "Erro",
          description: err.message || "Erro ao adicionar transação.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue="expense"
        onValueChange={(value) => setActiveTab(value as "income" | "expense")}
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="expense">Despesa</TabsTrigger>
          <TabsTrigger value="income">Receita</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição da transação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input placeholder="0,00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
                name="account"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conta</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma conta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
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
                name="payMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o método" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(metadata?.paymentMethods || []).map((method) => (
                          <SelectItem key={method} value={method}>
                            {getMethodLabel(method)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              {onClose && (
                <Button variant="outline" type="button" onClick={onClose}>
                  Cancelar
                </Button>
              )}
              <Button type="submit">Salvar Transação</Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default TransactionForm;
