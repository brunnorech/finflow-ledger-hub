
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface SpendingByCategoryTableProps {
  data: CategoryData[];
  title: string;
}

const SpendingByCategoryTable: React.FC<SpendingByCategoryTableProps> = ({ data, title }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const totalAmount = data.reduce((sum, item) => sum + item.value, 0);

  // Sort data by value in descending order
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoria</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="text-right">Porcentagem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((category) => (
              <TableRow key={category.name}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(category.value)}</TableCell>
                <TableCell className="text-right">
                  {((category.value / totalAmount) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="font-medium">
              <TableCell>Total</TableCell>
              <TableCell>{formatCurrency(totalAmount)}</TableCell>
              <TableCell className="text-right">100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SpendingByCategoryTable;
