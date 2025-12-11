import { useState, useMemo } from 'react';
import { format, addDays, parseISO, isBefore } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Subscription, CATEGORY_ICONS, SubscriptionStatus } from '@/types/subscription';
import { PauseSubscriptionModal } from '@/components/recurring/PauseSubscriptionModal';
import { CancelSubscriptionModal } from '@/components/recurring/CancelSubscriptionModal';
import { Pause, Play, X } from 'lucide-react';

type StatusFilter = 'all' | SubscriptionStatus;

interface RecurringViewProps {
  subscriptions: Subscription[];
  onPause: (id: string, pausedUntil: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
}

export function RecurringView({ subscriptions, onPause, onResume, onCancel }: RecurringViewProps) {
  const [showNext30Days, setShowNext30Days] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');
  const [pauseModalOpen, setPauseModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const filteredSubscriptions = useMemo(() => {
    let recurring = subscriptions.filter(s => s.recurring);
    
    // Apply status filter
    if (statusFilter !== 'all') {
      recurring = recurring.filter(s => s.status === statusFilter);
    }
    
    // Apply 30 days filter
    if (showNext30Days) {
      const today = new Date();
      const thirtyDaysFromNow = addDays(today, 30);
      recurring = recurring.filter(s => {
        if (s.status !== 'active') return true; // Show all non-active regardless of date
        const billingDate = parseISO(s.billingDate);
        return isBefore(billingDate, thirtyDaysFromNow);
      });
    }
    
    return recurring;
  }, [subscriptions, showNext30Days, statusFilter]);

  const totalMonthly = useMemo(() => {
    // Only count active subscriptions in the total
    return filteredSubscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + s.amount, 0);
  }, [filteredSubscriptions]);

  const activeCount = subscriptions.filter(s => s.recurring && s.status === 'active').length;
  const pausedCount = subscriptions.filter(s => s.recurring && s.status === 'paused').length;
  const cancelledCount = subscriptions.filter(s => s.recurring && s.status === 'cancelled').length;

  const handlePauseClick = (sub: Subscription) => {
    setSelectedSubscription(sub);
    setPauseModalOpen(true);
  };

  const handleCancelClick = (sub: Subscription) => {
    setSelectedSubscription(sub);
    setCancelModalOpen(true);
  };

  const handleResumeClick = (sub: Subscription) => {
    onResume(sub.id);
  };

  const getStatusBadge = (sub: Subscription) => {
    switch (sub.status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            Active
          </Badge>
        );
      case 'paused':
        return (
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
              Paused
            </Badge>
            {sub.pausedUntil && (
              <span className="text-xs text-muted-foreground">
                Until {format(parseISO(sub.pausedUntil), 'MMM d')}
              </span>
            )}
          </div>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            Cancelled
          </Badge>
        );
    }
  };

  const filterButtons: { label: string; value: StatusFilter; count: number }[] = [
    { label: 'All', value: 'all', count: activeCount + pausedCount + cancelledCount },
    { label: 'Active', value: 'active', count: activeCount },
    { label: 'Paused', value: 'paused', count: pausedCount },
    { label: 'Cancelled', value: 'cancelled', count: cancelledCount },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Recurring Subscriptions
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Show only next 30 days</span>
          <Switch checked={showNext30Days} onCheckedChange={setShowNext30Days} />
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterButtons.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              statusFilter === filter.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {filteredSubscriptions.length} {statusFilter === 'all' ? 'Total' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Subscriptions
            </CardTitle>
            <span className="text-xl font-bold text-primary">
              ${totalMonthly.toFixed(2)}/mo
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-muted-foreground">Service</TableHead>
                  <TableHead className="text-muted-foreground">Category</TableHead>
                  <TableHead className="text-muted-foreground text-right">Monthly Cost</TableHead>
                  <TableHead className="text-muted-foreground">Next Billing</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((sub) => (
                  <TableRow key={sub.id} className="border-border hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground">
                      {sub.name}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span>{CATEGORY_ICONS[sub.category]}</span>
                        {sub.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      ${sub.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {sub.status === 'cancelled' ? '—' : format(parseISO(sub.billingDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(sub)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {sub.status === 'active' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePauseClick(sub)}
                              className="h-8 px-3 border-border hover:bg-secondary"
                            >
                              <Pause className="w-3 h-3 mr-1" />
                              Pause
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelClick(sub)}
                              className="h-8 px-3 border-destructive/50 text-destructive hover:bg-destructive/10"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {sub.status === 'paused' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResumeClick(sub)}
                              className="h-8 px-3 border-success/50 text-success hover:bg-success/10"
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Resume
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelClick(sub)}
                              className="h-8 px-3 border-destructive/50 text-destructive hover:bg-destructive/10"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {sub.status === 'cancelled' && (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSubscriptions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No {statusFilter === 'all' ? '' : statusFilter} subscriptions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <PauseSubscriptionModal
        subscription={selectedSubscription}
        open={pauseModalOpen}
        onClose={() => setPauseModalOpen(false)}
        onPause={onPause}
      />

      <CancelSubscriptionModal
        subscription={selectedSubscription}
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={onCancel}
      />
    </div>
  );
}