import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { AddSubscriptionModal } from '@/components/dashboard/AddSubscriptionModal';
import { DashboardView } from '@/components/views/DashboardView';
import { mockSubscriptions, mockAccounts } from '@/data/mockData';
import { Subscription, View, Account } from '@/types/subscription';
import { PanelType } from '@/types/panel';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [accounts] = useState<Account[]>(mockAccounts);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Milestone 2: panel state kept but not used in UI
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  const handleAddSubscription = (newSub: Omit<Subscription, 'id'>, _accountId: string) => {
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

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentView={currentView}
        onViewChange={setCurrentView}
        collapsed={sidebarCollapsed}
        onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onPanelOpen={setOpenPanel}
        hasUnreadNotifications={false}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8 overflow-auto max-w-5xl">
          <DashboardView
            subscriptions={subscriptions}
            onAddClick={() => setAddModalOpen(true)}
          />
        </main>
      </div>

      {/* Add Subscription Modal */}
      <AddSubscriptionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddSubscription}
        accounts={accounts}
      />
    </div>
  );
};

export default Index;
