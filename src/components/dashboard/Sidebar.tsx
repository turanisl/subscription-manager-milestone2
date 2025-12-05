import { LayoutDashboard, CreditCard, TrendingUp, FileText, MessageCircle, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: CreditCard, label: 'Subscriptions', active: false },
  { icon: TrendingUp, label: 'Spending', active: false },
  { icon: FileText, label: 'Reports', active: false },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const handleNavClick = (label: string, active: boolean) => {
    if (!active) {
      toast({
        title: `${label} coming soon`,
        description: "This section is under development.",
      });
    }
  };

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
          <h1 className={cn(
            "font-semibold text-xl text-primary transition-opacity duration-200",
            isOpen ? "opacity-100" : "opacity-0 lg:hidden"
          )}>
            SubTrack
          </h1>
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
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.label, item.active)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                item.active
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className={cn(
                "whitespace-nowrap transition-opacity duration-200",
                isOpen ? "opacity-100" : "opacity-0 lg:hidden"
              )}>
                {item.label}
              </span>
            </button>
          ))}
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
