import { Bell, Trash2 } from 'lucide-react';
import { Subscription } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface ManageSubscriptionModalProps {
  subscription: Subscription | null;
  open: boolean;
  onClose: () => void;
  onCancel: (id: string) => void;
}

export function ManageSubscriptionModal({
  subscription,
  open,
  onClose,
  onCancel,
}: ManageSubscriptionModalProps) {
  if (!subscription) return null;

  const handleSnooze = () => {
    toast({
      title: "Reminder snoozed",
      description: `We'll remind you about ${subscription.name} later.`,
    });
    onClose();
  };

  const handleCancel = () => {
    onCancel(subscription.id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Manage {subscription.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="bg-secondary rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Service</span>
              <span className="text-sm font-medium text-foreground">{subscription.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Monthly Cost</span>
              <span className="text-sm font-semibold text-money-positive">${subscription.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Next Renewal</span>
              <span className="text-sm font-medium text-foreground">
                {format(new Date(subscription.billingDate), 'MMMM d, yyyy')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Category</span>
              <span className="text-sm font-medium text-foreground">{subscription.category}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSnooze}
              className="flex-1 gap-2"
            >
              <Bell className="w-4 h-4" />
              Snooze Reminder
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              className="flex-1 gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Mark as Cancelled
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
