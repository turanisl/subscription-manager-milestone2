import { LayoutDashboard, RefreshCw, TrendingUp, PieChart, Receipt, Menu, X, MessageCircle, Bell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { View } from '@/types/subscription';
import { toast } from '@/hooks/use-toast';
import mintLogo from '@/assets/mint-logo.png';

const navItems: { icon: typeof LayoutDashboard; label: string; view: View }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' },
  { icon: RefreshCw, label: 'Recurring', view: 'recurring' },
  { icon: TrendingUp, label: 'Net Worth', view: 'networth' },
  { icon: PieChart, label: 'Spending', view: 'spending' },
  { icon: Receipt, label: 'Transactions', view: 'transactions' },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Sidebar({ isOpen, onToggle, currentView, onViewChange }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar z-50 flex flex-col transition-all duration-300 border-r border-sidebar-border",
          isOpen ? "w-64" : "w-0 lg:w-64",
          "lg:relative"
        )}
      >
        <div className={cn(
          "flex flex-col h-full overflow-hidden",
          isOpen ? "opacity-100" : "opacity-0 lg:opacity-100"
        )}>
          {/* Top Branding Area */}
          <div className="px-4 pt-5 pb-4">
            {/* Logo and App Name */}
            <div className="flex items-center gap-3 mb-4">
              <img src={mintLogo} alt="Mint logo" className="w-10 h-10" />
              <span className="text-2xl font-bold text-primary lowercase tracking-tight">mint</span>
              {/* Mobile close button */}
              <button 
                onClick={onToggle}
                className="ml-auto p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* User Section */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Turan Islamli</p>
                <p className="text-xs text-muted-foreground">Premium Member</p>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => toast({ title: "Notifications", description: "No new notifications" })}
                  className="p-2 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => toast({ title: "Settings", description: "Settings coming soon!" })}
                  className="p-2 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 border-t border-sidebar-border" />

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => onViewChange(item.view)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative",
                    isActive
                      ? "bg-sidebar-accent text-primary font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quote Section */}
          <div className="px-4 py-4">
            <div className="bg-sidebar-accent/50 rounded-lg p-4">
              <p className="text-xs text-foreground/80 italic leading-relaxed mb-2">
                "Setting goals is the first step in turning the invisible into the visible."
              </p>
              <p className="text-[10px] text-muted-foreground">— Tony Robbins</p>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 border-t border-sidebar-border" />

          {/* Chat with us - Bottom */}
          <div className="p-4 mt-auto">
            <button 
              onClick={() => toast({ title: "Chat", description: "Chat coming soon." })}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">Chat with us</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-card hover:bg-card-elevated text-foreground lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
}
