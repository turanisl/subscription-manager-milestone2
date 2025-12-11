export type Category = 'Entertainment' | 'Music' | 'Productivity' | 'Cloud' | 'Other';

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export type Subscription = {
  id: string;
  name: string;
  category: Category;
  amount: number;
  billingDate: string;
  recurring: boolean;
  status: SubscriptionStatus;
  pausedUntil?: string;
};


export type AccountType = 'checking' | 'credit' | 'savings' | 'budget';

export type Account = {
  id: string;
  name: string;
  balance: number;
  type: AccountType;
  updatedAt: Date;
};

export type Transaction = {
  id: string;
  date: string;
  name: string;
  category: Category;
  amount: number;
  type: 'Recurring' | 'One-time';
  accountId?: string;
};

export type View = 'dashboard' | 'recurring' | 'networth' | 'spending' | 'transactions';

export const CATEGORIES: Category[] = ['Entertainment', 'Music', 'Productivity', 'Cloud', 'Other'];

export const CATEGORY_ICONS: Record<Category, string> = {
  Entertainment: '🎬',
  Music: '🎵',
  Productivity: '⚡',
  Cloud: '☁️',
  Other: '📦',
};
