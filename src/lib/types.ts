export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface Category {
  name: string;
  color: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { name: 'Food', color: 'hsl(10, 80%, 60%)' },
  { name: 'Transportation', color: 'hsl(200, 80%, 60%)' },
  { name: 'Entertainment', color: 'hsl(300, 80%, 60%)' },
  { name: 'Shopping', color: 'hsl(50, 80%, 60%)' },
  { name: 'Bills', color: 'hsl(250, 80%, 60%)' },
  { name: 'Health', color: 'hsl(150, 80%, 60%)' },
  { name: 'Other', color: 'hsl(0, 0%, 60%)' },
];

export const COLOR_PALETTE = [
  'hsl(180, 80%, 60%)',
  'hsl(220, 80%, 60%)',
  'hsl(340, 80%, 60%)',
  'hsl(20, 80%, 60%)',
  'hsl(80, 60%, 55%)',
  'hsl(280, 70%, 65%)',
];
