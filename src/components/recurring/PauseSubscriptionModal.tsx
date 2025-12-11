import { useState } from 'react';
import { format, addMonths } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Subscription } from '@/types/subscription';

interface PauseSubscriptionModalProps {
  subscription: Subscription | null;
  open: boolean;
  onClose: () => void;
  onPause: (id: string, pausedUntil: string) => void;
}

type PauseDuration = '1month' | '2months' | '3months' | 'custom';

export function PauseSubscriptionModal({
  subscription,
  open,
  onClose,
  onPause,
}: PauseSubscriptionModalProps) {
  const [duration, setDuration] = useState<PauseDuration>('1month');
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined);

  if (!subscription) return null;

  const getPausedUntilDate = (): string => {
    const today = new Date();
    switch (duration) {
      case '1month':
        return format(addMonths(today, 1), 'yyyy-MM-dd');
      case '2months':
        return format(addMonths(today, 2), 'yyyy-MM-dd');
      case '3months':
        return format(addMonths(today, 3), 'yyyy-MM-dd');
      case 'custom':
        return customDate ? format(customDate, 'yyyy-MM-dd') : format(addMonths(today, 1), 'yyyy-MM-dd');
      default:
        return format(addMonths(today, 1), 'yyyy-MM-dd');
    }
  };

  const handleConfirm = () => {
    const pausedUntil = getPausedUntilDate();
    onPause(subscription.id, pausedUntil);
    setDuration('1month');
    setCustomDate(undefined);
    onClose();
  };

  const handleClose = () => {
    setDuration('1month');
    setCustomDate(undefined);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Pause subscription</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Pause <span className="font-medium text-foreground">{subscription.name}</span> temporarily. 
            It won't appear in upcoming renewals or count towards your monthly spend.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Pause duration</label>
            <Select value={duration} onValueChange={(v) => setDuration(v as PauseDuration)}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="1month">1 month</SelectItem>
                <SelectItem value="2months">2 months</SelectItem>
                <SelectItem value="3months">3 months</SelectItem>
                <SelectItem value="custom">Custom date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {duration === 'custom' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Resume date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal bg-secondary border-border',
                      !customDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customDate ? format(customDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                  <Calendar
                    mode="single"
                    selected={customDate}
                    onSelect={setCustomDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Pause subscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}