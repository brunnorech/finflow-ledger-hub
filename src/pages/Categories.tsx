
import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import CategoryForm from '@/components/Categories/CategoryForm';

// Mock data
const CATEGORIES = [
  { id: '1', name: 'Alimentação', type: 'expense', color: '#FF6384', icon: '🍔' },
  { id: '2', name: 'Moradia', type: 'expense', color: '#36A2EB', icon: '🏠' },
  { id: '3', name: 'Transporte', type: 'expense', color: '#FFCE56', icon: '🚗' },
  { id: '4', name: 'Saúde', type: 'expense', color: '#4BC0C0', icon: '⚕️' },
  { id: '5', name: 'Lazer', type: 'expense', color: '#9966FF', icon: '🎮' },
  { id: '6', name: 'Educação', type: 'expense', color: '#FF9F40', icon: '📚' },
  { id: '7', name: 'Salário', type: 'income', color: '#26E7A6', icon: '💰' },
  { id: '8', name: 'Freelance', type: 'income', color: '#5CDB95', icon: '💻' },
  { id: '9', name: 'Investimentos', type: 'income', color: '#3A86FF', icon: '📈' },
  { id: '10', name: 'Presentes', type: 'income', color: '#FB5607', icon: '🎁' },
];

const Categories: React.FC = () => {
  const [categories, setCategories] = useState(CATEGORIES);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = 
      typeFilter === 'all' || 
      (typeFilter === 'expense' && category.type === 'expense') ||
      (typeFilter === 'income' && category.type === 'income');
    
    return matchesSearch && matchesType;
  });

  const handleSaveCategory = (category: any) => {
    if (categoryToEdit) {
      // Update existing category
      setCategories(categories.map(c => c.id === categoryToEdit.id ? {...category, id: categoryToEdit.id} : c));
      toast({
        title: "Categoria atualizada",
        description: `A categoria ${category.name} foi atualizada com sucesso.`,
      });
    } else {
      // Add new category
      const newCategory = {
        ...category,
        id: (categories.length + 1).toString(),
      };
      setCategories([...categories, newCategory]);
      toast({
        title: "Categoria criada",
        description: `A categoria ${category.name} foi criada com sucesso.`,
      });
    }
    setCategoryToEdit(null);
    setIsDialogOpen(false);
  };

  const handleEditCategory = (category: any) => {
    setCategoryToEdit(category);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    toast({
      title: "Categoria excluída",
      description: "A categoria foi excluída com sucesso.",
      variant: "destructive",
    });
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categorias</h1>
          <p className="text-muted-foreground">Gerencie e organize suas categorias financeiras</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="flex items-center gap-2"
              onClick={() => setCategoryToEdit(null)}
            >
              <PlusCircle className="h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-lg font-semibold mb-4">
              {categoryToEdit ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            <CategoryForm 
              initialData={categoryToEdit} 
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
        {filteredCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon}
                </div>
                <CardTitle className="text-base">{category.name}</CardTitle>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                category.type === 'income' ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'
              }`}>
                {category.type === 'income' ? 'Receita' : 'Despesa'}
              </span>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex justify-end space-x-2">
              <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:text-destructive/90"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Excluir</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Categories;
