import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartData {
  name: string;
  income: number;
  expense: number;
}

interface IncomeExpenseChartProps {
  data: ChartData[];
}

const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-4 rounded-md shadow border border-border">
          <p className="font-medium text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`tooltip-${index}`}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-dashboard p-4 sm:p-6 h-full min-w-0 w-full">
      <h2 className="text-lg font-semibold mb-4 truncate">
        Receitas vs Despesas
      </h2>
      <div className="h-[280px] sm:h-[300px] w-full min-w-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 8,
              left: -8,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(value) =>
                formatCurrency(value).replace("R$", "").trim()
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              name="Receitas"
              dataKey="income"
              fill="hsl(var(--income))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              name="Despesas"
              dataKey="expense"
              fill="hsl(var(--expense))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseChart;
