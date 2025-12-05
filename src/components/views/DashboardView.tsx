import { useMemo } from 'react';
import { SpendCard } from '@/components/dashboard/SpendCard';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { Subscription, Category, Transaction } from '@/types/subscription';

interface DashboardViewProps {
  subscriptions: Subscription[];
  transactions: Transaction[];
  selectedCategory: Category | 'All';
  onCategoryChange: (category: Category | 'All') => void;
  onAddClick: () => void;
}

export function DashboardView({
  subscriptions,
  transactions,
  selectedCategory,
  onCategoryChange,
  onAddClick,
}: DashboardViewProps) {
  const totalSpend = useMemo(() => {
    return subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  }, [subscriptions]);

  return (
    <>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Good morning, Turan!
        </h1>
      </div>

      {/* Spend Card */}
      <div className="mb-8">
        <SpendCard totalSpend={totalSpend} />
      </div>

      {/* Transactions */}
      <TransactionsTable
        subscriptions={subscriptions}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        onAddClick={onAddClick}
      />
    </>
  );
}
