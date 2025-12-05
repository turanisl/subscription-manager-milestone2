import { Wallet, CreditCard, PiggyBank, Target, ChevronDown } from 'lucide-react';
import { Account } from '@/types/subscription';
import { cn } from '@/lib/utils';

const iconMap = {
  checking: Wallet,
  credit: CreditCard,
  savings: PiggyBank,
  budget: Target,
};

interface AccountsCardProps {
  accounts: Account[];
}

export function AccountsCard({ accounts }: AccountsCardProps) {
  return (
    <div className="bg-card rounded-xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Accounts</h3>
        <span className="text-xs text-muted-foreground">Updated 2 hours ago</span>
      </div>

      <div className="space-y-3">
        {accounts.map((account) => {
          const Icon = iconMap[account.type];
          const isNegative = account.balance < 0;
          
          return (
            <div 
              key={account.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
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
                  isNegative ? 'text-money-negative' : 'text-money-positive'
                )}>
                  {isNegative ? '-' : ''}${Math.abs(account.balance).toLocaleString()}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
