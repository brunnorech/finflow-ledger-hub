
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CategoryFormProps {
  initialData?: {
    name: string;
    type: string;
    color: string;
    icon: string;
  } | null;
  onSubmit: (data: { name: string; type: string; color: string; icon: string }) => void;
}

// Available emoji icons for categories
const EMOJI_ICONS = [
  '🍔', '🏠', '🚗', '⚕️', '🎮', '📚', '💰', '💻', '📈', '🎁',
  '✈️', '👕', '💄', '🎬', '📱', '🍷', '☕', '🏋️', '🔧', '📝'
];

// Predefined colors
const COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
  '#FF9F40', '#26E7A6', '#5CDB95', '#3A86FF', '#FB5607',
  '#8338EC', '#FF006E', '#FFBE0B', '#3A86FF', '#FB5607'
];

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    color: COLORS[0],
    icon: EMOJI_ICONS[0],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        color: initialData.color,
        icon: initialData.icon,
      });
    }
  }, [initialData]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Categoria</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Ex: Alimentação"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => handleChange('type', value)}
          required
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Despesa</SelectItem>
            <SelectItem value="income">Receita</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Cor</Label>
        <div className="grid grid-cols-5 gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-full aspect-square rounded-md border-2 ${
                formData.color === color ? 'border-primary' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleChange('color', color)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Ícone</Label>
        <div className="grid grid-cols-5 gap-2">
          {EMOJI_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              className={`w-full aspect-square rounded-md border-2 bg-muted flex items-center justify-center text-xl ${
                formData.icon === icon ? 'border-primary' : 'border-transparent'
              }`}
              onClick={() => handleChange('icon', icon)}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit">
          {initialData ? 'Atualizar' : 'Criar'} Categoria
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
