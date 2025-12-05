import { Wallet, CreditCard, PiggyBank, Target, ChevronRight } from 'lucide-react';
import { Account } from '@/types/subscription';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';

const iconMap = {
  checking: Wallet,
  credit: CreditCard,
  savings: PiggyBank,
  budget: Target,
};

interface AccountsCardProps {
  accounts: Account[];
  selectedAccountId?: string | null;
  onAccountClick?: (account: Account) => void;
}

export function AccountsCard({ accounts, selectedAccountId, onAccountClick }: AccountsCardProps) {
  const lastUpdated = useMemo(() => {
    const mostRecent = accounts.reduce((latest, acc) => 
      acc.updatedAt > latest ? acc.updatedAt : latest
    , accounts[0]?.updatedAt || new Date());
    return formatDistanceToNow(mostRecent, { addSuffix: true });
  }, [accounts]);

  const getBudgetColor = (balance: number) => {
    if (balance < 0) return 'text-destructive';
    if (balance < 50) return 'text-warning';
    return 'text-money-positive';
  };

  return (
    <div className="bg-card rounded-xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Accounts</h3>
        <span className="text-xs text-muted-foreground">Updated {lastUpdated}</span>
      </div>

      <div className="space-y-3">
        {accounts.map((account) => {
          const Icon = iconMap[account.type];
          const isNegative = account.balance < 0;
          const isSelected = selectedAccountId === account.id;
          const isBudget = account.type === 'budget';
          
          return (
            <div 
              key={account.id}
              onClick={() => onAccountClick?.(account)}
              className={cn(
                "flex items-center justify-between py-2 px-3 rounded-lg transition-colors cursor-pointer group",
                isSelected ? 'bg-primary/10 ring-1 ring-primary/30' : 'hover:bg-secondary/70'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  account.type === 'credit' ? 'bg-destructive/10' : 'bg-primary/10'
                )}>
                  <Icon className={cn(
                    "w-4 h-4",
                    account.type === 'credit' ? 'text-destructive' : 'text-primary'
                  )} />
                </div>
                <span className="text-sm font-medium text-foreground">{account.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "font-semibold",
                  isBudget 
                    ? getBudgetColor(account.balance)
                    : isNegative ? 'text-money-negative' : 'text-money-positive'
                )}>
                  {isNegative ? '-' : ''}${Math.abs(account.balance).toLocaleString()}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
