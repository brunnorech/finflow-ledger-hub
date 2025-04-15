import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, ChartPie, ChartBar, Download, Filter } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ExpensesByCategoryChart from '@/components/Dashboard/ExpensesByCategoryChart';
import IncomeExpenseChart from '@/components/Dashboard/IncomeExpenseChart';
import MonthlyTrendsChart from '@/components/Reports/MonthlyTrendsChart';
import SpendingByCategoryTable from '@/components/Reports/SpendingByCategoryTable';

// Mock data for expense categories
const expensesData = [
  { name: 'Alimentação', value: 850, color: '#FF6384' },
  { name: 'Moradia', value: 1200, color: '#36A2EB' },
  { name: 'Transporte', value: 450, color: '#FFCE56' },
  { name: 'Saúde', value: 380, color: '#4BC0C0' },
  { name: 'Lazer', value: 320, color: '#9966FF' },
  { name: 'Outros', value: 290, color: '#FF9F40' },
];

// Mock data for income categories
const incomeData = [
  { name: 'Salário', value: 5200, color: '#26E7A6' },
  { name: 'Freelance', value: 800, color: '#5CDB95' },
  { name: 'Investimentos', value: 320, color: '#3A86FF' },
  { name: 'Presentes', value: 150, color: '#FB5607' },
];

// Mock data for monthly overview
const monthlyData = [
  { name: 'Jan', income: 5200, expense: 4300 },
  { name: 'Fev', income: 5100, expense: 4100 },
  { name: 'Mar', income: 5400, expense: 4500 },
  { name: 'Abr', income: 5300, expense: 4200 },
  { name: 'Mai', income: 5600, expense: 4400 },
  { name: 'Jun', income: 5800, expense: 4600 },
  { name: 'Jul', income: 5900, expense: 4800 },
  { name: 'Ago', income: 5750, expense: 4700 },
  { name: 'Set', income: 5650, expense: 4500 },
  { name: 'Out', income: 6000, expense: 4900 },
  { name: 'Nov', income: 6200, expense: 5000 },
  { name: 'Dez', income: 6500, expense: 5500 },
];

const Reports: React.FC = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

  // Generate available years (current year and 5 years back)
  const availableYears = Array.from({ length: 6 }, (_, i) => (currentYear - i).toString());
  
  const [period, setPeriod] = useState('month');
  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState(currentMonth.toString());
  
  // Update month selection if it's beyond the current month in the current year
  useEffect(() => {
    if (parseInt(year) === currentYear && parseInt(month) > currentMonth) {
      setMonth(currentMonth.toString());
    }
  }, [year, month, currentYear, currentMonth]);

  const handleExportPDF = () => {
    alert('Exportando relatório como PDF...');
  };

  // Generate available months based on year selection
  const getAvailableMonths = () => {
    // If it's the current year, only allow months up to the current month
    // Otherwise, allow all 12 months
    const monthLimit = parseInt(year) === currentYear ? currentMonth : 12;
    
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    return Array.from({ length: monthLimit }, (_, i) => ({
      value: (i + 1).toString(),
      label: monthNames[i]
    }));
  };

  const availableMonths = getAvailableMonths();

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Relatórios Financeiros</h1>
          <p className="text-muted-foreground">Analise detalhadamente seus dados financeiros</p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleExportPDF}
        >
          <Download className="h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      <div className="bg-card border rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Mensal</SelectItem>
                <SelectItem value="quarter">Trimestral</SelectItem>
                <SelectItem value="year">Anual</SelectItem>
              </SelectContent>
            </Select>

            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {period === 'month' && (
              <Select 
                value={month} 
                onValueChange={setMonth}
                disabled={availableMonths.length === 0}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ChartBar className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <ChartPie className="h-4 w-4" />
            Despesas
          </TabsTrigger>
          <TabsTrigger value="income" className="flex items-center gap-2">
            <ChartPie className="h-4 w-4 text-income" />
            Receitas
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Tendências
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IncomeExpenseChart data={monthlyData} />
            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Total de Receitas:</span>
                    <span className="text-income font-semibold">R$ 6.500,00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Total de Despesas:</span>
                    <span className="text-expense font-semibold">R$ 5.500,00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Saldo do Período:</span>
                    <span className="text-primary font-semibold">R$ 1.000,00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Taxa de Economia:</span>
                    <span className="font-semibold">15.38%</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Maior Categoria de Gasto:</span>
                    <span className="font-semibold">Moradia</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpensesByCategoryChart data={expensesData} />
            <SpendingByCategoryTable data={expensesData} title="Despesas por Categoria" />
          </div>
        </TabsContent>

        <TabsContent value="income" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpensesByCategoryChart data={incomeData} />
            <SpendingByCategoryTable data={incomeData} title="Receitas por Categoria" />
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <MonthlyTrendsChart data={monthlyData} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Reports;
