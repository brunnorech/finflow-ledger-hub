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
import {
  getMethodLabel,
  formatDateToBR,
  parseBRToISODate,
} from "@/utils/format";
import { DatePickerPtBr } from "@/components/ui/date-picker-ptbr";
import { useCategories } from "@/hooks/useCategories";
import { useAccounts } from "@/hooks/useAccounts";

const transactionSchema = z
  .object({
    description: z
      .string()
      .min(3, "A descrição deve ter pelo menos 3 caracteres"),
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "O valor deve ser um número positivo",
    }),
    type: z.enum(["income", "expense"]),
    category: z.string().optional(),
    account: z.string().optional(),
    date: z
      .string()
      .min(1, "Informe a data")
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data deve estar no formato dd/mm/aaaa"),
    payMethod: z.string().optional(),
  })
  .refine(
    (data) => {
      // Para despesas, categoria, conta e método de pagamento são obrigatórios
      if (data.type === "expense") {
        return data.category && data.account && data.payMethod;
      }
      return true;
    },
    {
      message: "Campo obrigatório",
      path: ["category"],
    }
  );

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
      date: formatDateToBR(new Date()),
    },
  });

  React.useEffect(() => {
    form.setValue("type", activeTab);
  }, [activeTab, form]);

  const onSubmit = (data: TransactionFormValues) => {
    // Para receitas, usar valores padrão se não fornecidos
    const accountId = data.account || accounts[0]?.id;
    const categoryId = data.category || categories[0]?.id;
    const paymentMethod = data.payMethod || "PIX";

    if (!accountId || !categoryId) {
      toast({
        title: "Erro",
        description:
          "É necessário ter pelo menos uma conta e uma categoria cadastradas.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      description: data.description,
      amount: parseFloat(data.amount),
      type: data.type.toUpperCase(),
      paymentMethod,
      accountId,
      categoryId,
      date: parseBRToISODate(data.date),
    };

    mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Transação adicionada",
          description: "Sua transação foi salva com sucesso.",
          variant: "success",
        });
        const defaultValues: TransactionFormValues = {
          description: "",
          amount: "",
          type: "expense",
          category: "",
          account: "",
          payMethod: "",
          date: formatDateToBR(new Date()),
        };
        setActiveTab("expense");
        form.reset(defaultValues, { keepDefaultValues: true });
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
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "income" | "expense")}
      >
        <TabsList className="grid w-full grid-cols-2 mb-4 h-11">
          <TabsTrigger value="expense" className="min-h-11">
            Despesa
          </TabsTrigger>
          <TabsTrigger value="income" className="min-h-11">
            Receita
          </TabsTrigger>
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
                    <Input
                      placeholder="Descrição da transação"
                      className="min-h-11"
                      {...field}
                    />
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
                    <Input placeholder="0,00" className="min-h-11" {...field} />
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
                    <FormLabel>
                      Categoria{" "}
                      {activeTab === "expense" && (
                        <span className="text-red-500">*</span>
                      )}
                    </FormLabel>
                    <Select
                      key={`category-${field.value ?? "empty"}`}
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="min-h-11">
                          <SelectValue
                            placeholder={
                              activeTab === "expense"
                                ? "Selecione uma categoria"
                                : "Categoria (opcional)"
                            }
                          />
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
                    <FormLabel>
                      Conta{" "}
                      {activeTab === "expense" && (
                        <span className="text-red-500">*</span>
                      )}
                    </FormLabel>
                    <Select
                      key={`account-${field.value ?? "empty"}`}
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="min-h-11">
                          <SelectValue
                            placeholder={
                              activeTab === "expense"
                                ? "Selecione uma conta"
                                : "Conta (opcional)"
                            }
                          />
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
                    <FormLabel>
                      Método de Pagamento{" "}
                      {activeTab === "expense" && (
                        <span className="text-red-500">*</span>
                      )}
                    </FormLabel>
                    <Select
                      key={`payMethod-${field.value ?? "empty"}`}
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="min-h-11">
                          <SelectValue
                            placeholder={
                              activeTab === "expense"
                                ? "Selecione o método"
                                : "Método (opcional)"
                            }
                          />
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
                    <DatePickerPtBr
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="dd/mm/aaaa"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2 pt-4">
              {onClose && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  className="min-h-11 w-full sm:w-auto"
                >
                  Cancelar
                </Button>
              )}
              <Button type="submit" className="min-h-11 w-full sm:w-auto">
                Salvar Transação
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default TransactionForm;
