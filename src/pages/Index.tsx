import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { AddSubscriptionModal } from '@/components/dashboard/AddSubscriptionModal';
import { DashboardView } from '@/components/views/DashboardView';
import { mockSubscriptions } from '@/data/mockData';
import { Subscription, View } from '@/types/subscription';
import { PanelType } from '@/types/panel';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'mint_subscriptions';

function loadSubscriptions(): Subscription[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  // First launch: seed with mock data and persist
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockSubscriptions));
  return mockSubscriptions;
}

function saveSubscriptions(subs: Subscription[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
}

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(loadSubscriptions);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  // Persist whenever subscriptions change
  useEffect(() => {
    saveSubscriptions(subscriptions);
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

      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8 overflow-auto max-w-5xl">
          <DashboardView
            subscriptions={subscriptions}
            onAddClick={() => setAddModalOpen(true)}
          />
        </main>
      </div>

      <AddSubscriptionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddSubscription}
      />
    </div>
  );
};

export default Index;
