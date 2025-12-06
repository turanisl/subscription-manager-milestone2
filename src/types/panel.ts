export type PanelType = 'notifications' | 'settings' | 'chat' | null;

export type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export type AppSettings = {
  isDarkMode: boolean;
  currency: 'USD' | 'EUR' | 'GBP';
  emailOnRenewal: boolean;
  notifyOnBudgetExceed: boolean;
};
