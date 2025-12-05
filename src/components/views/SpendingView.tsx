import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Transaction, Category, CATEGORY_ICONS } from '@/types/subscription';

interface SpendingViewProps {
  transactions: Transaction[];
}

const COLORS: Record<Category, string> = {
  Entertainment: '#10b981',
  Music: '#3b82f6',
  Productivity: '#f59e0b',
  Cloud: '#8b5cf6',
  Other: '#6b7280',
};

export function SpendingView({ transactions }: SpendingViewProps) {
  const [period, setPeriod] = useState<'this' | 'last'>('this');

  const categoryTotals = useMemo(() => {
    // For demo: use same data, but could split by month
    const totals: Record<Category, number> = {
      Entertainment: 0,
      Music: 0,
      Productivity: 0,
      Cloud: 0,
      Other: 0,
    };

    transactions.forEach(t => {
      totals[t.category] += t.amount;
    });

    return Object.entries(totals)
      .map(([category, amount]) => ({
        category: category as Category,
        amount,
        icon: CATEGORY_ICONS[category as Category],
      }))
      .filter(item => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const totalSpending = useMemo(() => {
    return categoryTotals.reduce((sum, item) => sum + item.amount, 0);
  }, [categoryTotals]);

  const chartData = categoryTotals.map(item => ({
    name: item.category,
    value: item.amount,
    color: COLORS[item.category],
  }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Spending by Category
        </h1>
        <Select value={period} onValueChange={(v) => setPeriod(v as 'this' | 'last')}>
          <SelectTrigger className="w-40 bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this">This month</SelectItem>
            <SelectItem value="last">Last month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">
              Total: ${totalSpending.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend
                    formatter={(value) => <span className="text-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-muted-foreground">Category</TableHead>
                  <TableHead className="text-muted-foreground text-right">Total</TableHead>
                  <TableHead className="text-muted-foreground text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryTotals.map((item) => (
                  <TableRow key={item.category} className="border-border hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground">
                      <span className="flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[item.category] }}
                        />
                        <span>{item.icon}</span>
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      ${item.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {((item.amount / totalSpending) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
