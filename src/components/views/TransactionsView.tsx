import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Search, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Transaction, CATEGORY_ICONS } from '@/types/subscription';

interface TransactionsViewProps {
  transactions: Transaction[];
}

type SortField = 'date' | 'amount';
type SortDirection = 'asc' | 'desc';

export function TransactionsView({ transactions }: TransactionsViewProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = transactions;

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(searchLower));
    }

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [transactions, search, sortField, sortDirection]);

  const totalAmount = useMemo(() => {
    return filteredAndSorted.reduce((sum, t) => sum + t.amount, 0);
  }, [filteredAndSorted]);

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
        All Transactions
      </h1>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">
              {filteredAndSorted.length} Transactions • ${totalAmount.toFixed(2)}
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/50 border-border"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead 
                    className="text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('date')}
                  >
                    <span className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </TableHead>
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Category</TableHead>
                  <TableHead 
                    className="text-muted-foreground text-right cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('amount')}
                  >
                    <span className="flex items-center justify-end gap-1">
                      Amount
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </TableHead>
                  <TableHead className="text-muted-foreground">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSorted.map((transaction) => (
                  <TableRow key={transaction.id} className="border-border hover:bg-muted/30">
                    <TableCell className="text-muted-foreground">
                      {format(parseISO(transaction.date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {transaction.name}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span>{CATEGORY_ICONS[transaction.category]}</span>
                        {transaction.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={transaction.type === 'Recurring' 
                          ? 'bg-primary/10 text-primary border-primary/20' 
                          : 'bg-muted text-muted-foreground border-border'
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
