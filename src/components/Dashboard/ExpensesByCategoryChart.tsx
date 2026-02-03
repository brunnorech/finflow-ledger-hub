
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ExpenseCategory {
  name: string;
  value: number;
  color?: string;
}

interface ExpensesByCategoryChartProps {
  data: ExpenseCategory[];
}

// Paleta de cores padrão para categorias (cores variadas e contrastantes)
const DEFAULT_COLORS = [
  '#FF6384', // Rosa/Vermelho
  '#36A2EB', // Azul
  '#FFCE56', // Amarelo
  '#4BC0C0', // Ciano/Turquesa
  '#9966FF', // Roxo/Violeta
  '#FF9F40', // Laranja
  '#26E7A6', // Verde menta
  '#5CDB95', // Verde claro
  '#C9CBCF', // Cinza
  '#FB5607', // Vermelho laranja
  '#3A86FF', // Azul vibrante
  '#8338EC', // Roxo escuro
  '#FF006E', // Rosa vibrante
  '#FB8500', // Laranja escuro
  '#023047', // Azul escuro
];

// Função para gerar uma cor baseada no nome da categoria
const getColorForCategory = (categoryName: string, index: number): string => {
  // Se já tiver cor, usa ela
  // Caso contrário, gera uma cor baseada no nome ou usa o índice da paleta
  const hash = categoryName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Usa o hash para selecionar uma cor da paleta de forma determinística
  const colorIndex = Math.abs(hash) % DEFAULT_COLORS.length;
  return DEFAULT_COLORS[colorIndex] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
};

const ExpensesByCategoryChart: React.FC<ExpensesByCategoryChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Garantir que todos os itens tenham cor
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || getColorForCategory(item.name, index),
  })).filter(item => item.value > 0); // Filtrar categorias com valor zero

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-4 rounded-md shadow border border-border">
          <p className="font-medium">{payload[0].name}</p>
          <p className="font-semibold text-primary">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-dashboard p-6 h-full">
      <h2 className="text-lg font-semibold mb-4">Despesas por Categoria</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithColors}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {dataWithColors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value, entry: any) => (
                <span style={{ color: entry.payload.fill }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpensesByCategoryChart;
