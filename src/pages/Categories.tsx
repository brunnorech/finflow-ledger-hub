import React, { useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import CategoryForm from "@/components/Categories/CategoryForm";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";

const DEFAULT_COLOR = "#36A2EB";
const DEFAULT_ICON = "📁";

type CategoryFromApi = {
  id: string;
  name: string;
  type: string;
  userId: string;
};

const Categories: React.FC = () => {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryFromApi | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredCategories = categories.filter((category: CategoryFromApi) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const catType = category.type.toLowerCase();
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "expense" && catType === "expense") ||
      (typeFilter === "income" && catType === "income");
    return matchesSearch && matchesType;
  });

  const handleSaveCategory = (formData: {
    name: string;
    type: string;
    color: string;
    icon: string;
  }) => {
    if (categoryToEdit) {
      updateCategory.mutate(
        {
          id: categoryToEdit.id,
          data: { name: formData.name, type: formData.type },
        },
        {
          onSuccess: () => {
            setCategoryToEdit(null);
            setIsDialogOpen(false);
            toast({
              title: "Categoria atualizada",
              description: `A categoria ${formData.name} foi atualizada com sucesso.`,
            });
          },
          onError: () => {
            toast({
              title: "Erro",
              description: "Não foi possível atualizar a categoria.",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createCategory.mutate(
        { name: formData.name, type: formData.type },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            toast({
              title: "Categoria criada",
              description: `A categoria ${formData.name} foi criada com sucesso.`,
            });
          },
          onError: () => {
            toast({
              title: "Erro",
              description: "Não foi possível criar a categoria.",
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const handleEditCategory = (category: CategoryFromApi) => {
    setCategoryToEdit(category);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = (category: CategoryFromApi) => {
    deleteCategory.mutate(category.id, {
      onSuccess: () => {
        toast({
          title: "Categoria excluída",
          description: "A categoria foi excluída com sucesso.",
          variant: "destructive",
        });
      },
      onError: () => {
        toast({
          title: "Erro",
          description: "Não foi possível excluir a categoria.",
          variant: "destructive",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">Carregando categorias...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Categorias</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gerencie e organize suas categorias financeiras
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2 w-full sm:w-auto min-h-11"
              onClick={() => setCategoryToEdit(null)}
            >
              <PlusCircle className="h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-lg font-semibold mb-4">
              {categoryToEdit ? "Editar Categoria" : "Nova Categoria"}
            </h2>
            <CategoryForm
              initialData={
                categoryToEdit
                  ? {
                      name: categoryToEdit.name,
                      type: categoryToEdit.type.toLowerCase(),
                      color: DEFAULT_COLOR,
                      icon: DEFAULT_ICON,
                    }
                  : undefined
              }
              onSubmit={handleSaveCategory}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Buscar categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category: CategoryFromApi) => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: DEFAULT_COLOR }}
                >
                  {DEFAULT_ICON}
                </div>
                <CardTitle className="text-base">{category.name}</CardTitle>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  category.type === "INCOME"
                    ? "bg-income/10 text-income"
                    : "bg-expense/10 text-expense"
                }`}
              >
                {category.type === "INCOME" ? "Receita" : "Despesa"}
              </span>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditCategory(category)}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive/90"
                onClick={() => handleDeleteCategory(category)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Excluir</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          <p>
            {categories.length === 0
              ? "Nenhuma categoria cadastrada."
              : "Nenhuma categoria encontrada com esse filtro."}
          </p>
          {categories.length === 0 && (
            <p className="text-sm mt-1">
              Clique em &quot;Nova Categoria&quot; para começar.
            </p>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Categories;
