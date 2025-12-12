import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Subscription, CATEGORY_ICONS } from '@/types/subscription';
import { format, parseISO } from 'date-fns';
import { TrendingUp, TrendingDown, AlertCircle, Eye, Bell } from 'lucide-react';

interface UsageViewProps {
  subscriptions: Subscription[];
  onAddNotification?: (notification: { title: string; message: string }) => void;
}

type SortOption = 'most-used' | 'cost-per-use' | 'never-used';
type UsageTag = 'most-used' | 'barely-used' | 'never-used';

export function UsageView({ subscriptions, onAddNotification }: UsageViewProps) {
  const [sortBy, setSortBy] = useState<SortOption>('most-used');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  const activeSubscriptions = useMemo(() => 
    subscriptions.filter(s => s.status === 'active' && s.usage),
    [subscriptions]
  );

  const getUsage = (sub: Subscription) => sub.usage?.usesLast30Days ?? 0;

  const getUsageTag = (uses: number): UsageTag => {
    if (uses === 0) return 'never-used';
    if (uses <= 3) return 'barely-used';
    return 'most-used';
  };

  const getCostPerUse = (amount: number, uses: number): string => {
    if (uses === 0) return '—';
    return `$${(amount / uses).toFixed(2)}`;
  };

  const mostUsed = useMemo(() => 
    [...activeSubscriptions]
      .sort((a, b) => getUsage(b) - getUsage(a))
      .slice(0, 3),
    [activeSubscriptions]
  );

  const barelyUsed = useMemo(() => 
    activeSubscriptions.filter(s => getUsage(s) >= 1 && getUsage(s) <= 3),
    [activeSubscriptions]
  );

  const neverUsed = useMemo(() => 
    activeSubscriptions.filter(s => getUsage(s) === 0),
    [activeSubscriptions]
  );

  const sortedSubscriptions = useMemo(() => {
    const sorted = [...activeSubscriptions];
    switch (sortBy) {
      case 'most-used':
        return sorted.sort((a, b) => getUsage(b) - getUsage(a));
      case 'cost-per-use':
        return sorted.sort((a, b) => {
          const costA = getUsage(a) > 0 ? a.amount / getUsage(a) : Infinity;
          const costB = getUsage(b) > 0 ? b.amount / getUsage(b) : Infinity;
          return costB - costA;
        });
      case 'never-used':
        return sorted.sort((a, b) => getUsage(a) - getUsage(b));
      default:
        return sorted;
    }
  }, [activeSubscriptions, sortBy]);

  const handleReview = (sub: Subscription) => {
    setSelectedSub(sub);
    setReviewModalOpen(true);
  };

  const handleSetReminder = () => {
    if (selectedSub && onAddNotification) {
      onAddNotification({
        title: 'Review reminder set',
        message: `Reminder to review ${selectedSub.name} next month.`,
      });
    }
    setReviewModalOpen(false);
  };

  const getReviewMessage = (sub: Subscription): string => {
    const uses = getUsage(sub);
    if (uses === 0) return "You haven't used this in 30 days.";
    if (uses <= 3) return `You used this only ${uses} time${uses > 1 ? 's' : ''}.`;
    return "This is one of your most used subscriptions.";
  };

  const getTagBadge = (tag: UsageTag) => {
    switch (tag) {
      case 'most-used':
        return <Badge className="bg-primary/20 text-primary border-primary/30">Most used</Badge>;
      case 'barely-used':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Barely used</Badge>;
      case 'never-used':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Never used</Badge>;
    }
  };

  const formatLastUsed = (date?: string): string => {
    if (!date) return 'Never';
    return format(parseISO(date), 'MMM d');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Usage</h1>
        <p className="text-muted-foreground text-sm mt-1">Track how much you actually use each subscription</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Most Used */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <TrendingUp className="w-4 h-4 text-primary" />
              Most Used
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mostUsed.map(sub => (
              <div key={sub.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{CATEGORY_ICONS[sub.category]}</span>
                  <span className="text-foreground">{sub.name}</span>
                </div>
                <div className="text-right text-muted-foreground">
                  <span className="text-primary font-medium">{sub.usage.usesLast30Days}</span> uses
                  {sub.usage.minutesLast30Days && (
                    <span className="text-xs ml-1">({Math.round(sub.usage.minutesLast30Days / 60)}h)</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Barely Used */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <TrendingDown className="w-4 h-4 text-yellow-400" />
              Barely Used
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {barelyUsed.length === 0 ? (
              <p className="text-sm text-muted-foreground">No barely used subscriptions</p>
            ) : (
              barelyUsed.map(sub => (
                <div key={sub.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{CATEGORY_ICONS[sub.category]}</span>
                    <span className="text-foreground">{sub.name}</span>
                  </div>
                  <div className="text-right text-muted-foreground text-xs">
                    {sub.usage.usesLast30Days} uses · {formatLastUsed(sub.usage.lastUsedAt)}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Never Used */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <AlertCircle className="w-4 h-4 text-destructive" />
              Never Used
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {neverUsed.length === 0 ? (
              <p className="text-sm text-muted-foreground">All subscriptions used!</p>
            ) : (
              neverUsed.map(sub => (
                <div key={sub.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{CATEGORY_ICONS[sub.category]}</span>
                    <span className="text-foreground">{sub.name}</span>
                  </div>
                  <span className="text-destructive text-xs">0 uses</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="most-used">Most Used</SelectItem>
            <SelectItem value="cost-per-use">Highest Cost per Use</SelectItem>
            <SelectItem value="never-used">Never Used</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Usage Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Subscription</TableHead>
                  <TableHead className="text-muted-foreground">Category</TableHead>
                  <TableHead className="text-muted-foreground text-right">Monthly Cost</TableHead>
                  <TableHead className="text-muted-foreground text-right">Uses (30d)</TableHead>
                  <TableHead className="text-muted-foreground text-right">Cost per Use</TableHead>
                  <TableHead className="text-muted-foreground">Last Used</TableHead>
                  <TableHead className="text-muted-foreground">Usage Tag</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSubscriptions.map(sub => {
                  const tag = getUsageTag(sub.usage.usesLast30Days);
                  return (
                    <TableRow key={sub.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{CATEGORY_ICONS[sub.category]}</span>
                          <span className="font-medium text-foreground">{sub.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{sub.category}</TableCell>
                      <TableCell className="text-right text-foreground">${sub.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-foreground">{sub.usage.usesLast30Days}</TableCell>
                      <TableCell className="text-right text-foreground">{getCostPerUse(sub.amount, sub.usage.usesLast30Days)}</TableCell>
                      <TableCell className="text-muted-foreground">{formatLastUsed(sub.usage.lastUsedAt)}</TableCell>
                      <TableCell>{getTagBadge(tag)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleReview(sub)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              {selectedSub && <span>{CATEGORY_ICONS[selectedSub.category]}</span>}
              {selectedSub?.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Review your subscription usage
            </DialogDescription>
          </DialogHeader>
          {selectedSub && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Monthly Cost</p>
                  <p className="text-lg font-semibold text-foreground">${selectedSub.amount.toFixed(2)}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Uses (30 days)</p>
                  <p className="text-lg font-semibold text-foreground">{selectedSub.usage.usesLast30Days}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Cost per Use</p>
                  <p className="text-lg font-semibold text-foreground">
                    {getCostPerUse(selectedSub.amount, selectedSub.usage.usesLast30Days)}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Last Used</p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatLastUsed(selectedSub.usage.lastUsedAt)}
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground">{getReviewMessage(selectedSub)}</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setReviewModalOpen(false)}>
                  Close
                </Button>
                {onAddNotification && (
                  <Button onClick={handleSetReminder} className="bg-primary hover:bg-primary/90">
                    <Bell className="w-4 h-4 mr-2" />
                    Set Reminder
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}