import { useState, useCallback } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { AccountsCard } from '@/components/dashboard/AccountsCard';
import { AccountDetailsModal } from '@/components/dashboard/AccountDetailsModal';
import { UpcomingRenewals } from '@/components/dashboard/UpcomingRenewals';
import { AddSubscriptionModal } from '@/components/dashboard/AddSubscriptionModal';
import { ManageSubscriptionModal } from '@/components/dashboard/ManageSubscriptionModal';
import { NotificationsPanel } from '@/components/panels/NotificationsPanel';
import { SettingsPanel } from '@/components/panels/SettingsPanel';
import { ChatPanel } from '@/components/panels/ChatPanel';
import { DashboardView } from '@/components/views/DashboardView';
import { RecurringView } from '@/components/views/RecurringView';
import { NetWorthView } from '@/components/views/NetWorthView';
import { SpendingView } from '@/components/views/SpendingView';
import { TransactionsView } from '@/components/views/TransactionsView';
import { mockSubscriptions, mockAccounts, mockTransactions } from '@/data/mockData';
import { Subscription, Transaction, Category, View, Account } from '@/types/subscription';
import { PanelType, Notification, AppSettings } from '@/types/panel';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X } from 'lucide-react';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [cancelledAlert, setCancelledAlert] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  
  // Panel state
  const [openPanel, setOpenPanel] = useState<PanelType>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Upcoming charge', message: 'Spotify renews tomorrow for $9.99.', time: '2h ago', read: false },
    { id: '2', title: 'New subscription added', message: 'You added Netflix for $15.99/month.', time: '1d ago', read: true },
    { id: '3', title: 'Budget reminder', message: 'You are close to your subscriptions budget.', time: '3d ago', read: false },
  ]);
  const [settings, setSettings] = useState<AppSettings>({
    isDarkMode: true,
    currency: 'USD',
    emailOnRenewal: true,
    notifyOnBudgetExceed: true,
  });
  
  const hasUnreadNotifications = notifications.some(n => !n.read);
  
  const handleMarkAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const updateAccountBalance = useCallback((accountId: string, amount: number, isDeduction: boolean = true) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        return {
          ...acc,
          balance: isDeduction ? acc.balance - amount : amount,
          updatedAt: new Date(),
        };
      }
      return acc;
    }));
  }, []);

  const handleAddSubscription = (newSub: Omit<Subscription, 'id'>, accountId: string) => {
    const subscription: Subscription = {
      ...newSub,
      id: Date.now().toString(),
    };
    setSubscriptions(prev => [subscription, ...prev]);
    
    // Add a transaction linked to the account
    const transaction: Transaction = {
      id: `t-${Date.now()}`,
      date: newSub.billingDate,
      name: newSub.name,
      category: newSub.category,
      amount: newSub.amount,
      type: newSub.recurring ? 'Recurring' : 'One-time',
      accountId,
    };
    setTransactions(prev => [transaction, ...prev]);
    
    // Update the payment account balance
    updateAccountBalance(accountId, newSub.amount);
    
    // Update the subscriptions budget if it's a recurring subscription
    if (newSub.recurring) {
      updateAccountBalance('budget', newSub.amount);
    }
    
    toast({
      title: "Subscription added",
      description: `${subscription.name} has been added to your subscriptions.`,
    });
  };

  const handleManageClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setManageModalOpen(true);
  };

  const handlePauseSubscription = useCallback((id: string, pausedUntil: string) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === id) {
        return { ...sub, status: 'paused' as const, pausedUntil };
      }
      return sub;
    }));
    
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      const pauseDate = new Date(pausedUntil);
      setNotifications(prev => [{
        id: `n-${Date.now()}`,
        title: 'Subscription paused',
        message: `Paused ${sub.name} until ${pauseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.`,
        time: 'Just now',
        read: false,
      }, ...prev]);
    }
    
    toast({
      title: "Subscription paused",
      description: `The subscription has been paused.`,
    });
  }, [subscriptions]);

  const handleResumeSubscription = useCallback((id: string) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === id) {
        const { pausedUntil, ...rest } = sub;
        return { ...rest, status: 'active' as const };
      }
      return sub;
    }));
    
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      setNotifications(prev => [{
        id: `n-${Date.now()}`,
        title: 'Subscription resumed',
        message: `Resumed ${sub.name}.`,
        time: 'Just now',
        read: false,
      }, ...prev]);
    }
    
    toast({
      title: "Subscription resumed",
      description: `The subscription is now active.`,
    });
  }, [subscriptions]);

  const handleCancelSubscription = useCallback((id: string) => {
    const sub = subscriptions.find(s => s.id === id);
    
    setSubscriptions(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: 'cancelled' as const, pausedUntil: undefined };
      }
      return s;
    }));
    
    if (sub) {
      setCancelledAlert(sub.name);
      setTimeout(() => setCancelledAlert(null), 5000);
      
      setNotifications(prev => [{
        id: `n-${Date.now()}`,
        title: 'Subscription cancelled',
        message: `Cancelled ${sub.name}.`,
        time: 'Just now',
        read: false,
      }, ...prev]);
    }
  }, [subscriptions]);

  const handleAccountClick = (account: Account) => {
    setSelectedAccount(account);
    setAccountModalOpen(true);
  };

  const handleUpdateAccountBalance = (accountId: string, newBalance: number) => {
    updateAccountBalance(accountId, newBalance, false);
    toast({
      title: "Balance updated",
      description: `Account balance has been adjusted.`,
    });
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
        return (
          <RecurringView 
            subscriptions={subscriptions} 
            onPause={handlePauseSubscription}
            onResume={handleResumeSubscription}
            onCancel={handleCancelSubscription}
          />
        );
      case 'networth':
        return <NetWorthView accounts={accounts} />;
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
        onPanelOpen={setOpenPanel}
        hasUnreadNotifications={hasUnreadNotifications}
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
          <AccountsCard 
            accounts={accounts} 
            selectedAccountId={accountModalOpen ? selectedAccount?.id : null}
            onAccountClick={handleAccountClick}
          />
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
        accounts={accounts}
      />
      <ManageSubscriptionModal
        subscription={selectedSubscription}
        open={manageModalOpen}
        onClose={() => setManageModalOpen(false)}
        onCancel={handleCancelSubscription}
      />
      <AccountDetailsModal
        account={selectedAccount}
        transactions={transactions}
        open={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        onUpdateBalance={handleUpdateAccountBalance}
      />
      
      {/* Panels */}
      <NotificationsPanel
        open={openPanel === 'notifications'}
        onClose={() => setOpenPanel(null)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />
      <SettingsPanel
        open={openPanel === 'settings'}
        onClose={() => setOpenPanel(null)}
        settings={settings}
        onSettingsChange={setSettings}
      />
      <ChatPanel
        open={openPanel === 'chat'}
        onClose={() => setOpenPanel(null)}
        userName="Turan Islamli"
      />
    </div>
  );
};

export default Index;
