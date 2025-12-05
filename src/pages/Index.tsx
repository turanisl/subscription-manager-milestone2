import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { AccountsCard } from '@/components/dashboard/AccountsCard';
import { UpcomingRenewals } from '@/components/dashboard/UpcomingRenewals';
import { AddSubscriptionModal } from '@/components/dashboard/AddSubscriptionModal';
import { ManageSubscriptionModal } from '@/components/dashboard/ManageSubscriptionModal';
import { DashboardView } from '@/components/views/DashboardView';
import { RecurringView } from '@/components/views/RecurringView';
import { NetWorthView } from '@/components/views/NetWorthView';
import { SpendingView } from '@/components/views/SpendingView';
import { TransactionsView } from '@/components/views/TransactionsView';
import { mockSubscriptions, mockAccounts, mockTransactions } from '@/data/mockData';
import { Subscription, Transaction, Category, View } from '@/types/subscription';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X } from 'lucide-react';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [cancelledAlert, setCancelledAlert] = useState<string | null>(null);

  const handleAddSubscription = (newSub: Omit<Subscription, 'id'>) => {
    const subscription: Subscription = {
      ...newSub,
      id: Date.now().toString(),
    };
    setSubscriptions(prev => [subscription, ...prev]);
    
    // Also add a transaction
    const transaction: Transaction = {
      id: `t-${Date.now()}`,
      date: newSub.billingDate,
      name: newSub.name,
      category: newSub.category,
      amount: newSub.amount,
      type: newSub.recurring ? 'Recurring' : 'One-time',
    };
    setTransactions(prev => [transaction, ...prev]);
    
    toast({
      title: "Subscription added",
      description: `${subscription.name} has been added to your subscriptions.`,
    });
  };

  const handleManageClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setManageModalOpen(true);
  };

  const handleCancelSubscription = (id: string) => {
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      setSubscriptions(prev => prev.filter(s => s.id !== id));
      setCancelledAlert(sub.name);
      setTimeout(() => setCancelledAlert(null), 5000);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            subscriptions={subscriptions}
            transactions={transactions}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onAddClick={() => setAddModalOpen(true)}
          />
        );
      case 'recurring':
        return <RecurringView subscriptions={subscriptions} />;
      case 'networth':
        return <NetWorthView accounts={mockAccounts} />;
      case 'spending':
        return <SpendingView transactions={transactions} />;
      case 'transactions':
        return <TransactionsView transactions={transactions} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentView={currentView}
        onViewChange={setCurrentView}
        collapsed={sidebarCollapsed}
        onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
        {/* Center Column */}
        <main className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8 overflow-auto">
          {/* Cancelled Alert */}
          {cancelledAlert && (
            <Alert className="mb-4 bg-destructive/10 border-destructive/20 animate-fade-in">
              <AlertDescription className="flex items-center justify-between">
                <span className="text-foreground">
                  <strong>{cancelledAlert}</strong> marked as cancelled.
                </span>
                <button 
                  onClick={() => setCancelledAlert(null)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </AlertDescription>
            </Alert>
          )}

          {renderView()}
        </main>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 xl:w-96 p-6 lg:p-8 lg:border-l border-border space-y-6 bg-background">
          <AccountsCard accounts={mockAccounts} />
          <UpcomingRenewals 
            subscriptions={subscriptions} 
            onManage={handleManageClick}
          />
        </aside>
      </div>

      {/* Modals */}
      <AddSubscriptionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddSubscription}
      />
      <ManageSubscriptionModal
        subscription={selectedSubscription}
        open={manageModalOpen}
        onClose={() => setManageModalOpen(false)}
        onCancel={handleCancelSubscription}
      />
    </div>
  );
};

export default Index;
