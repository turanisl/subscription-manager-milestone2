import { Subscription, Account, Transaction } from '@/types/subscription';
import { addDays, format, subDays, subHours } from 'date-fns';

const today = new Date();

const billingDate = (daysFromNow: number) => format(addDays(today, daysFromNow), 'yyyy-MM-dd');
const pastDate = (daysAgo: number) => format(subDays(today, daysAgo), 'yyyy-MM-dd');

export const mockSubscriptions: Subscription[] = [
  { id: '1', name: 'Netflix', category: 'Entertainment', amount: 15.99, billingDate: billingDate(9), recurring: true },
  { id: '2', name: 'Spotify', category: 'Music', amount: 9.99, billingDate: billingDate(3), recurring: true },
  { id: '3', name: 'Notion', category: 'Productivity', amount: 10.00, billingDate: billingDate(12), recurring: true },
  { id: '4', name: 'iCloud+', category: 'Cloud', amount: 2.99, billingDate: billingDate(-2), recurring: true },
  { id: '5', name: 'Adobe Creative', category: 'Productivity', amount: 54.99, billingDate: billingDate(15), recurring: true },
  { id: '6', name: 'YouTube Premium', category: 'Entertainment', amount: 13.99, billingDate: billingDate(6), recurring: true },
  { id: '7', name: 'Dropbox', category: 'Cloud', amount: 11.99, billingDate: billingDate(18), recurring: true },
  { id: '8', name: 'Apple Music', category: 'Music', amount: 10.99, billingDate: billingDate(-5), recurring: true },
  { id: '9', name: 'Disney+', category: 'Entertainment', amount: 7.99, billingDate: billingDate(11), recurring: true },
  { id: '10', name: 'ChatGPT Plus', category: 'Productivity', amount: 20.00, billingDate: billingDate(20), recurring: true },
];

export const mockTransactions: Transaction[] = [
  { id: 't1', date: pastDate(1), name: 'Netflix', category: 'Entertainment', amount: 15.99, type: 'Recurring', accountId: 'checking' },
  { id: 't2', date: pastDate(3), name: 'Spotify', category: 'Music', amount: 9.99, type: 'Recurring', accountId: 'credit' },
  { id: 't3', date: pastDate(5), name: 'iCloud+', category: 'Cloud', amount: 2.99, type: 'Recurring', accountId: 'checking' },
  { id: 't4', date: pastDate(7), name: 'Adobe Creative', category: 'Productivity', amount: 54.99, type: 'Recurring', accountId: 'credit' },
  { id: 't5', date: pastDate(8), name: 'App Purchase', category: 'Other', amount: 4.99, type: 'One-time', accountId: 'checking' },
  { id: 't6', date: pastDate(10), name: 'YouTube Premium', category: 'Entertainment', amount: 13.99, type: 'Recurring', accountId: 'checking' },
  { id: 't7', date: pastDate(12), name: 'Dropbox', category: 'Cloud', amount: 11.99, type: 'Recurring', accountId: 'credit' },
  { id: 't8', date: pastDate(14), name: 'Apple Music', category: 'Music', amount: 10.99, type: 'Recurring', accountId: 'checking' },
  { id: 't9', date: pastDate(15), name: 'Notion', category: 'Productivity', amount: 10.00, type: 'Recurring', accountId: 'checking' },
  { id: 't10', date: pastDate(18), name: 'Disney+', category: 'Entertainment', amount: 7.99, type: 'Recurring', accountId: 'credit' },
];

export const mockAccounts: Account[] = [
  { id: 'checking', name: 'Checking', balance: 5848, type: 'checking', updatedAt: subHours(today, 2) },
  { id: 'credit', name: 'Credit Card', balance: -3001, type: 'credit', updatedAt: subHours(today, 2) },
  { id: 'savings', name: 'Savings', balance: 267, type: 'savings', updatedAt: subHours(today, 2) },
  { id: 'budget', name: 'Subscriptions Budget', balance: 150, type: 'budget', updatedAt: subHours(today, 2) },
];

export const mockSpendingData = [
  { day: 1, amount: 45 },
  { day: 3, amount: 78 },
  { day: 5, amount: 112 },
  { day: 7, amount: 145 },
  { day: 9, amount: 168 },
  { day: 11, amount: 198 },
  { day: 13, amount: 225 },
  { day: 15, amount: 248 },
  { day: 17, amount: 275 },
  { day: 19, amount: 298 },
  { day: 21, amount: 315 },
  { day: 23, amount: 329 },
];

export const lastMonthTotal = 378.50;
