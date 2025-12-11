import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Subscription } from '@/types/subscription';

interface CancelSubscriptionModalProps {
  subscription: Subscription | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export function CancelSubscriptionModal({
  subscription,
  open,
  onClose,
  onConfirm,
}: CancelSubscriptionModalProps) {
  if (!subscription) return null;

  const handleConfirm = () => {
    onConfirm(subscription.id);
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            Cancel {subscription.name}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            This removes it from recurring charges and upcoming renewals. 
            The subscription will be marked as cancelled but kept in your history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-secondary border-border hover:bg-secondary/80">
            Keep subscription
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Confirm Cancel
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}