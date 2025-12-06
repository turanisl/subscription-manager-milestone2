import { LayoutDashboard, RefreshCw, TrendingUp, PieChart, Receipt, Menu, X, MessageCircle, Bell, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { View } from '@/types/subscription';
import { PanelType } from '@/types/panel';
import mintLogo from '@/assets/mint-logo.png';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

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
  collapsed: boolean;
  onCollapseToggle: () => void;
  onPanelOpen: (panel: PanelType) => void;
  hasUnreadNotifications?: boolean;
}

export function Sidebar({ isOpen, onToggle, currentView, onViewChange, collapsed, onCollapseToggle, onPanelOpen, hasUnreadNotifications = false }: SidebarProps) {
  const isCollapsed = collapsed && !isOpen;

  return (
    <TooltipProvider delayDuration={0}>
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
          isOpen ? "w-64" : "w-0",
          "lg:relative lg:w-auto",
          isCollapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        <div className={cn(
          "flex flex-col h-full overflow-hidden transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 lg:opacity-100"
        )}>
          {/* Top Branding Area */}
          <div className={cn("pt-5 pb-4 transition-all", isCollapsed ? "px-2" : "px-4")}>
            {/* Logo and App Name */}
            <div className={cn("flex items-center mb-4", isCollapsed ? "justify-center" : "gap-3")}>
              <div className={cn("rounded-lg overflow-hidden flex items-center justify-center transition-all", isCollapsed ? "w-10 h-10" : "w-12 h-12")}>
                <img src={mintLogo} alt="Mint logo" className="w-full h-full object-cover" />
              </div>
              <span className={cn(
                "text-2xl font-bold text-primary lowercase tracking-tight transition-all",
                isCollapsed ? "hidden" : "block"
              )}>mint</span>
              {/* Mobile close button */}
              <button 
                onClick={onToggle}
                className={cn(
                  "ml-auto p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground lg:hidden",
                  isCollapsed && "ml-0"
                )}
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* User Section - Hidden when collapsed */}
            {!isCollapsed && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Turan Islamli</p>
                  <p className="text-xs text-muted-foreground">Premium Member</p>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => onPanelOpen('notifications')}
                    className="relative p-2 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {hasUnreadNotifications && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
                    )}
                  </button>
                  <button 
                    onClick={() => onPanelOpen('settings')}
                    className="p-2 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className={cn("border-t border-sidebar-border", isCollapsed ? "mx-2" : "mx-4")} />

          {/* Navigation */}
          <nav className={cn("py-4 space-y-1", isCollapsed ? "px-2" : "px-3")}>
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              const button = (
                <button
                  key={item.view}
                  onClick={() => onViewChange(item.view)}
                  className={cn(
                    "w-full flex items-center gap-3 py-2.5 rounded-lg transition-all duration-200 relative",
                    isCollapsed ? "px-0 justify-center" : "px-3",
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
                  {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </button>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.view}>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }
              return button;
            })}
          </nav>

          {/* Spacer to push bottom section down */}
          <div className="flex-1" />

          {/* Bottom Section - Quote + Chat */}
          <div className="mt-auto">
            {/* Quote Section - Hidden when collapsed */}
            {!isCollapsed && (
              <div className="px-4 pb-4">
                <div className="bg-sidebar-accent/50 rounded-lg p-4">
                  <p className="text-xs text-foreground/80 italic leading-relaxed mb-2">
                    "Setting goals is the first step in turning the invisible into the visible."
                  </p>
                  <p className="text-[10px] text-muted-foreground">— Tony Robbins</p>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className={cn("border-t border-sidebar-border", isCollapsed ? "mx-2" : "mx-4")} />

            {/* Chat with us */}
            <div className={cn("p-4", isCollapsed && "p-2")}>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => onPanelOpen('chat')}
                      className="w-full flex items-center justify-center p-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
                    Chat with us
                  </TooltipContent>
                </Tooltip>
              ) : (
                <button 
                  onClick={() => onPanelOpen('chat')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">Chat with us</span>
                </button>
              )}
            </div>

            {/* Collapse Toggle Button - Desktop only */}
            <div className={cn("hidden lg:block border-t border-sidebar-border", isCollapsed ? "px-2 py-2" : "px-4 py-3")}>
              <button 
                onClick={onCollapseToggle}
                className={cn(
                  "w-full flex items-center gap-2 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors",
                  isCollapsed ? "justify-center px-0" : "px-3"
                )}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-xs">Collapse</span>
                  </>
                )}
              </button>
            </div>
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
    </TooltipProvider>
  );
}
