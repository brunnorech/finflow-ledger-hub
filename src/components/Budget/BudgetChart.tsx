
import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';

interface BudgetData {
  id: string;
  categoryId: string;
  categoryName: string;
  color: string;
  amount: number;
  spent: number;
  period: string;
  type: string;
}

interface BudgetChartProps {
  data: BudgetData[];
}

const BudgetChart: React.FC<BudgetChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentUsed = ((item.spent / item.amount) * 100).toFixed(1);
      
      return (
        <div className="bg-background p-3 rounded-md shadow border border-border">
          <p className="font-medium mb-1">{item.categoryName}</p>
          <p className="text-sm text-muted-foreground">
            Orçado: {formatCurrency(item.amount)}
          </p>
          <p className="text-sm text-muted-foreground">
            Gasto: {formatCurrency(item.spent)} ({percentUsed}%)
          </p>
          <p className="text-sm text-muted-foreground">
            Restante: {formatCurrency(item.amount - item.spent)}
          </p>
        </div>
      );
    }
    return null;
  };

  const chartData = data.map(item => ({
    ...item,
    value: item.amount,
    name: item.categoryName,
  }));

  // If there's no data, display a message
  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-muted-foreground">
          Nenhum orçamento definido ainda
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius={60}
          outerRadius={110}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          formatter={(value, entry: any) => {
            return (
              <span className="text-xs">{value}</span>
            );
          }}
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{ fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BudgetChart;
