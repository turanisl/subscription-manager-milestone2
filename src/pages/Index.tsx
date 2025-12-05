import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { SpendCard } from '@/components/dashboard/SpendCard';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { AccountsCard } from '@/components/dashboard/AccountsCard';
import { UpcomingRenewals } from '@/components/dashboard/UpcomingRenewals';
import { AddSubscriptionModal } from '@/components/dashboard/AddSubscriptionModal';
import { ManageSubscriptionModal } from '@/components/dashboard/ManageSubscriptionModal';
import { mockSubscriptions, mockAccounts } from '@/data/mockData';
import { Subscription, Category } from '@/types/subscription';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X } from 'lucide-react';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [cancelledAlert, setCancelledAlert] = useState<string | null>(null);

  const totalSpend = useMemo(() => {
    return subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  }, [subscriptions]);

  const handleAddSubscription = (newSub: Omit<Subscription, 'id'>) => {
    const subscription: Subscription = {
      ...newSub,
      id: Date.now().toString(),
    };
    setSubscriptions(prev => [subscription, ...prev]);
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

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
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
            onCategoryChange={setSelectedCategory}
            onAddClick={() => setAddModalOpen(true)}
          />
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
