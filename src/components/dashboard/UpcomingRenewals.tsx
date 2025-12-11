import { Settings } from 'lucide-react';
import { Subscription } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

interface UpcomingRenewalsProps {
  subscriptions: Subscription[];
  onManage: (subscription: Subscription) => void;
}

export function UpcomingRenewals({ subscriptions, onManage }: UpcomingRenewalsProps) {
  const today = new Date();
  const sevenDaysFromNow = addDays(today, 7);
  
  const upcomingRenewals = subscriptions
    .filter(sub => {
      // Only show active subscriptions in upcoming renewals
      if (sub.status !== 'active') return false;
      const billingDate = new Date(sub.billingDate);
      return billingDate >= today && billingDate <= sevenDaysFromNow;
    })
    .sort((a, b) => new Date(a.billingDate).getTime() - new Date(b.billingDate).getTime());

  // Generate mini calendar dates (2 weeks)
  const weekStart = startOfWeek(today);
  const calendarDates = Array.from({ length: 14 }, (_, i) => addDays(weekStart, i));

  const hasRenewalOnDate = (date: Date) => {
    return subscriptions.some(sub => 
      sub.status === 'active' && isSameDay(new Date(sub.billingDate), date)
    );
  };

  return (
    <div className="bg-card rounded-xl p-5 animate-fade-in">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
        Coming Up
      </h3>

      <p className="text-sm text-foreground mb-4">
        You have <span className="text-primary font-semibold">{upcomingRenewals.length}</span> recurring charges due within the next 7 days.
      </p>

      {/* Mini Calendar */}
      <div className="mb-5">
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-xs text-muted-foreground font-medium py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDates.map((date, i) => {
            const isToday = isSameDay(date, today);
            const hasRenewal = hasRenewalOnDate(date);
            
            return (
              <div
                key={i}
                className={`relative flex flex-col items-center py-1.5 rounded-lg text-sm ${
                  isToday
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-foreground hover:bg-secondary/50'
                }`}
              >
                {format(date, 'd')}
                {hasRenewal && (
                  <div className={`absolute -bottom-0.5 w-1 h-1 rounded-full ${
                    isToday ? 'bg-primary-foreground' : 'bg-primary'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Renewal List */}
      <div className="space-y-3">
        {upcomingRenewals.slice(0, 3).map((sub) => (
          <div 
            key={sub.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{sub.name}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(sub.billingDate), 'MMMM d')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">
                ${sub.amount.toFixed(2)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onManage(sub)}
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
              >
                <Settings className="w-4 h-4" />
                <span className="sr-only">Manage {sub.name}</span>
              </Button>
            </div>
          </div>
        ))}

        {upcomingRenewals.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming renewals in the next 7 days
          </p>
        )}
      </div>
    </div>
  );
}
