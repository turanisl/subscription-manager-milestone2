import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Subscription, Category, CATEGORY_ICONS } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface DashboardViewProps {
  subscriptions: Subscription[];
  onAddClick: () => void;
}

export function DashboardView({
  subscriptions,
  onAddClick,
}: DashboardViewProps) {
  const activeSubscriptions = useMemo(() =>
    subscriptions.filter(s => s.status === 'active'),
    [subscriptions]
  );

  const totalMonthlySpend = useMemo(() =>
    activeSubscriptions.reduce((sum, sub) => sum + sub.amount, 0),
    [activeSubscriptions]
  );

  return (
    <>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Subscription Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and track your subscriptions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-card rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Monthly Spend</p>
          <h2 className="text-3xl font-bold text-foreground">${totalMonthlySpend.toFixed(2)}</h2>
        </div>
        <div className="bg-card rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Active Subscriptions</p>
          <h2 className="text-3xl font-bold text-foreground">{activeSubscriptions.length}</h2>
        </div>
      </div>

      {/* Subscription List */}
      <div className="bg-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Your Subscriptions</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {subscriptions.length} subscription{subscriptions.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <Button onClick={onAddClick} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Subscription
          </Button>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Billing Date</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                >
                  <td className="py-3.5 px-4 text-sm font-medium text-foreground">
                    {sub.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span>{CATEGORY_ICONS[sub.category]}</span>
                      {sub.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-foreground">
                    {format(new Date(sub.billingDate), 'MMM d, yyyy')}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-right font-medium text-foreground">
                    ${sub.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-right">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      sub.status === 'active'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {subscriptions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No subscriptions yet. Click "Add Subscription" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
