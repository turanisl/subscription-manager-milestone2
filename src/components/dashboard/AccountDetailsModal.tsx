import { useState, useMemo } from 'react';
import { Wallet, CreditCard, PiggyBank, Target } from 'lucide-react';
import { Account, Transaction } from '@/types/subscription';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, parseISO } from 'date-fns';

const iconMap = {
  checking: Wallet,
  credit: CreditCard,
  savings: PiggyBank,
  budget: Target,
};

interface AccountDetailsModalProps {
  account: Account | null;
  transactions: Transaction[];
  open: boolean;
  onClose: () => void;
  onUpdateBalance: (accountId: string, newBalance: number) => void;
}

export function AccountDetailsModal({ 
  account, 
  transactions, 
  open, 
  onClose,
  onUpdateBalance 
}: AccountDetailsModalProps) {
  const [newBalance, setNewBalance] = useState('');

  const recentTransactions = useMemo(() => {
    if (!account) return [];
    return transactions
      .filter(t => t.accountId === account.id)
      .slice(0, 5);
  }, [account, transactions]);

  if (!account) return null;

  const Icon = iconMap[account.type];
  const isNegative = account.balance < 0;

  const handleSave = () => {
    const balance = parseFloat(newBalance);
    if (!isNaN(balance)) {
      onUpdateBalance(account.id, balance);
      setNewBalance('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-foreground">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              account.type === 'credit' ? 'bg-destructive/10' : 'bg-primary/10'
            )}>
              <Icon className={cn(
                "w-5 h-5",
                account.type === 'credit' ? 'text-destructive' : 'text-primary'
              )} />
            </div>
            {account.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Current Balance */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
            <p className={cn(
              "text-3xl font-bold",
              isNegative ? 'text-money-negative' : 'text-money-positive'
            )}>
              {isNegative ? '-' : ''}${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground mt-1 capitalize">
              {account.type === 'budget' ? 'Budget Account' : `${account.type} Account`}
            </p>
          </div>

          {/* Recent Transactions */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Recent Transactions</h4>
            {recentTransactions.length > 0 ? (
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/30">
                      <TableHead className="text-muted-foreground">Date</TableHead>
                      <TableHead className="text-muted-foreground">Name</TableHead>
                      <TableHead className="text-right text-muted-foreground">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(parseISO(tx.date), 'MMM d')}
                        </TableCell>
                        <TableCell className="text-foreground">{tx.name}</TableCell>
                        <TableCell className="text-right text-money-negative">
                          -${tx.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4 bg-secondary/30 rounded-lg">
                No transactions for this account yet.
              </p>
            )}
          </div>

          {/* Adjust Balance */}
          <div className="space-y-3">
            <Label htmlFor="newBalance" className="text-foreground">Adjust Balance</Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="newBalance"
                  type="number"
                  step="0.01"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  placeholder={Math.abs(account.balance).toFixed(2)}
                  className="bg-secondary border-0 pl-7"
                />
              </div>
              <Button onClick={handleSave} disabled={!newBalance}>
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter a new balance to manually correct this account.
              {account.type === 'credit' && ' Use a negative number for debt.'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
