import { Plus } from 'lucide-react';
import { Subscription, Category, CATEGORIES, CATEGORY_ICONS } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

interface TransactionsTableProps {
  subscriptions: Subscription[];
  selectedCategory: Category | 'All';
  onCategoryChange: (category: Category | 'All') => void;
  onAddClick: () => void;
}

export function TransactionsTable({
  subscriptions,
  selectedCategory,
  onCategoryChange,
  onAddClick,
}: TransactionsTableProps) {
  const filteredSubscriptions = selectedCategory === 'All'
    ? subscriptions
    : subscriptions.filter(sub => sub.category === selectedCategory);

  return (
    <div className="bg-card rounded-xl p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            You've had {subscriptions.length} transactions so far this month
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedCategory} onValueChange={(value) => onCategoryChange(value as Category | 'All')}>
            <SelectTrigger className="w-40 bg-secondary border-0">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {CATEGORY_ICONS[cat]} {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={onAddClick} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Subscription
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.map((sub) => (
              <tr 
                key={sub.id} 
                className="border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <td className="py-3.5 px-4 text-sm text-foreground">
                  {format(new Date(sub.billingDate), 'M/d')}
                </td>
                <td className="py-3.5 px-4 text-sm font-medium text-foreground">
                  {sub.name}
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span>{CATEGORY_ICONS[sub.category]}</span>
                    {sub.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-sm text-right font-medium text-foreground">
                  ${sub.amount.toFixed(2)}
                </td>
                <td className="py-3.5 px-4 text-sm text-right">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    sub.recurring 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {sub.recurring ? 'Recurring' : 'One-time'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
