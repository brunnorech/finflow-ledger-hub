
import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface ChartData {
  name: string;
  income: number;
  expense: number;
}

interface MonthlyTrendsChartProps {
  data: ChartData[];
}

const MonthlyTrendsChart: React.FC<MonthlyTrendsChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-4 rounded-md shadow border border-border">
          <p className="font-medium text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`tooltip-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate savings (income - expense) for each month
  const dataWithSavings = data.map(item => ({
    ...item,
    savings: item.income - item.expense
  }));

  return (
    <Card className="h-[500px]">
      <CardHeader>
        <CardTitle>Tendências Mensais</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="line">
          <TabsList className="mb-4">
            <TabsTrigger value="line">Linha</TabsTrigger>
            <TabsTrigger value="area">Área</TabsTrigger>
          </TabsList>
          <TabsContent value="line" className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataWithSavings} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value).replace('R$', '')} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  name="Receitas" 
                  stroke="hsl(var(--income))" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  name="Despesas" 
                  stroke="hsl(var(--expense))" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  name="Economia" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="area" className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataWithSavings} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value).replace('R$', '')} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  name="Receitas" 
                  stroke="hsl(var(--income))" 
                  fill="hsl(var(--income)/0.2)" 
                  stackId="1" 
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  name="Despesas" 
                  stroke="hsl(var(--expense))" 
                  fill="hsl(var(--expense)/0.2)" 
                  stackId="2" 
                />
                <Area 
                  type="monotone" 
                  dataKey="savings" 
                  name="Economia" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary)/0.2)" 
                  stackId="3" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MonthlyTrendsChart;
