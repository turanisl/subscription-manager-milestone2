import { useState, useMemo } from 'react';
import { format, addDays, parseISO, isBefore } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Subscription, CATEGORY_ICONS } from '@/types/subscription';

interface RecurringViewProps {
  subscriptions: Subscription[];
}

export function RecurringView({ subscriptions }: RecurringViewProps) {
  const [showNext30Days, setShowNext30Days] = useState(false);

  const filteredSubscriptions = useMemo(() => {
    const recurring = subscriptions.filter(s => s.recurring);
    if (!showNext30Days) return recurring;
    
    const today = new Date();
    const thirtyDaysFromNow = addDays(today, 30);
    return recurring.filter(s => {
      const billingDate = parseISO(s.billingDate);
      return isBefore(billingDate, thirtyDaysFromNow);
    });
  }, [subscriptions, showNext30Days]);

  const totalMonthly = useMemo(() => {
    return filteredSubscriptions.reduce((sum, s) => sum + s.amount, 0);
  }, [filteredSubscriptions]);

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

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {filteredSubscriptions.length} Active Subscriptions
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
                      {format(parseISO(sub.billingDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
