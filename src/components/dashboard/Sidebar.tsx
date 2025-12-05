import { LayoutDashboard, RefreshCw, TrendingUp, PieChart, Receipt, Menu, X, MessageCircle } from 'lucide-react';
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
          isOpen ? "w-64" : "w-0 lg:w-16",
          "lg:relative"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 h-16">
          <div className={cn(
            "flex items-center gap-2 transition-opacity duration-200",
            isOpen ? "opacity-100" : "opacity-0 lg:hidden"
          )}>
            <img src={mintLogo} alt="Mint logo" className="w-8 h-8 rounded-lg" />
            <h1 className="font-semibold text-xl text-primary">Mint</h1>
          </div>
          {/* Show icon only when collapsed on desktop */}
          <div className={cn(
            "hidden lg:flex items-center justify-center transition-opacity duration-200",
            isOpen ? "lg:hidden" : "opacity-100"
          )}>
            <img src={mintLogo} alt="Mint logo" className="w-8 h-8 rounded-lg" />
          </div>
          <button 
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onViewChange(item.view)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={cn(
                  "whitespace-nowrap transition-opacity duration-200",
                  isOpen ? "opacity-100" : "opacity-0 lg:hidden"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Quote */}
        <div className={cn(
          "px-4 py-6 transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 hidden lg:hidden"
        )}>
          <p className="text-xs text-muted-foreground italic leading-relaxed">
            "Small choices add up over time."
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <button 
            onClick={() => toast({ title: "Help", description: "Support coming soon!" })}
            className={cn(
              "flex items-center gap-3 text-sm text-muted-foreground hover:text-sidebar-foreground transition-colors",
              !isOpen && "lg:justify-center"
            )}
          >
            <MessageCircle className="w-4 h-4 flex-shrink-0" />
            <span className={cn(
              "transition-opacity duration-200",
              isOpen ? "opacity-100" : "opacity-0 lg:hidden"
            )}>
              Contact / Help
            </span>
          </button>
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
