export type Category = 'Entertainment' | 'Music' | 'Productivity' | 'Cloud' | 'Other';

export type Subscription = {
  id: string;
  name: string;
  category: Category;
  amount: number;
  billingDate: string;
  recurring: boolean;
};

export type Account = {
  id: string;
  name: string;
  balance: number;
  type: 'checking' | 'credit' | 'savings' | 'budget';
};

export const CATEGORIES: Category[] = ['Entertainment', 'Music', 'Productivity', 'Cloud', 'Other'];

export const CATEGORY_ICONS: Record<Category, string> = {
  Entertainment: '🎬',
  Music: '🎵',
  Productivity: '⚡',
  Cloud: '☁️',
  Other: '📦',
};
