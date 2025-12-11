import { useState } from 'react';
import { Category, CATEGORIES, Subscription, Account } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AddSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (subscription: Omit<Subscription, 'id'>, accountId: string) => void;
  accounts: Account[];
}

export function AddSubscriptionModal({ open, onClose, onAdd, accounts }: AddSubscriptionModalProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Other');
  const [billingDate, setBillingDate] = useState('');
  const [accountId, setAccountId] = useState('checking');

  // Filter to only show payment accounts (not budget)
  const paymentAccounts = accounts.filter(a => a.type !== 'budget');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !amount || !billingDate) return;

    onAdd({
      name,
      amount: parseFloat(amount),
      category,
      billingDate,
      recurring: true,
      status: 'active',
    }, accountId);

    // Reset form
    setName('');
    setAmount('');
    setCategory('Other');
    setBillingDate('');
    setAccountId('checking');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Subscription</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Service Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Netflix"
              className="bg-secondary border-0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground">Monthly Cost</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-secondary border-0 pl-7"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger className="bg-secondary border-0">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountId" className="text-foreground">Pay from Account</Label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger className="bg-secondary border-0">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {paymentAccounts.map(acc => (
                  <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingDate" className="text-foreground">First Billing Date</Label>
            <Input
              id="billingDate"
              type="date"
              value={billingDate}
              onChange={(e) => setBillingDate(e.target.value)}
              className="bg-secondary border-0"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Subscription
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
