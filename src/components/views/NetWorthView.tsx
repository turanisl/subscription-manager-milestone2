import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Account } from '@/types/subscription';
import { cn } from '@/lib/utils';

interface NetWorthViewProps {
  accounts: Account[];
}

export function NetWorthView({ accounts }: NetWorthViewProps) {
  const { netWorth, checking, savings, creditCard } = useMemo(() => {
    const checking = accounts.find(a => a.type === 'checking')?.balance || 0;
    const savings = accounts.find(a => a.type === 'savings')?.balance || 0;
    const creditCard = Math.abs(accounts.find(a => a.type === 'credit')?.balance || 0);
    return {
      netWorth: checking + savings - creditCard,
      checking,
      savings,
      creditCard,
    };
  }, [accounts]);

  const maxBalance = Math.max(checking, savings, creditCard);

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
        Net Worth Overview
      </h1>

      {/* Net Worth Card */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-2">Your Net Worth</p>
            <p className={cn(
              "text-4xl lg:text-5xl font-bold",
              netWorth >= 0 ? "text-success" : "text-destructive"
            )}>
              ${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Checking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">
              ${checking.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-success rounded-full transition-all"
                style={{ width: `${(checking / maxBalance) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              ${savings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(savings / maxBalance) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Credit Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">
              -${creditCard.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-destructive rounded-full transition-all"
                style={{ width: `${(creditCard / maxBalance) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Net worth is approximated from your current sample account balances.
      </p>
    </div>
  );
}
