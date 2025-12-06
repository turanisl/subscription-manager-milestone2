import { X, Check } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Notification } from '@/types/panel';
import { cn } from '@/lib/utils';

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
}

export function NotificationsPanel({ open, onClose, notifications, onMarkAllRead }: NotificationsPanelProps) {
  const hasUnread = notifications.some(n => !n.read);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md bg-card border-border">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-foreground">Notifications</SheetTitle>
            {hasUnread && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onMarkAllRead}
                className="text-primary hover:text-primary/80"
              >
                <Check className="w-4 h-4 mr-1" />
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] mt-4">
          <div className="space-y-3 pr-4">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 rounded-lg border transition-colors",
                    notification.read 
                      ? "bg-background/50 border-border/50" 
                      : "bg-primary/5 border-primary/20"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    )}
                    <div className={cn("flex-1", notification.read && "pl-5")}>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={cn(
                          "text-sm",
                          notification.read ? "text-muted-foreground" : "text-foreground font-medium"
                        )}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className={cn(
                        "text-sm",
                        notification.read ? "text-muted-foreground/70" : "text-muted-foreground"
                      )}>
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
