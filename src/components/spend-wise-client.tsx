"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { AppProvider } from '@/lib/app-context';
import type { Category, Expense } from '@/lib/types';
import { DEFAULT_CATEGORIES, COLOR_PALETTE } from '@/lib/types';
import Header from '@/components/header';
import StatsCards from '@/components/stats-cards';
import CategoryChart from '@/components/category-chart';
import AiInsights from '@/components/ai-insights';
import ExpenseTable from '@/components/expense-table';

export default function SpendWiseClient() {
  const [expenses, setExpensesState] = useState<Expense[]>([]);
  const [categories, setCategoriesState] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    try {
      const storedExpenses = localStorage.getItem('spendwise-expenses');
      const storedCategories = localStorage.getItem('spendwise-categories');

      if (storedExpenses) {
        setExpensesState(JSON.parse(storedExpenses));
      }

      if (storedCategories) {
        setCategoriesState(JSON.parse(storedCategories));
      } else {
        setCategoriesState(DEFAULT_CATEGORIES);
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      setCategoriesState(DEFAULT_CATEGORIES);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('spendwise-expenses', JSON.stringify(expenses));
    }
  }, [expenses, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('spendwise-categories', JSON.stringify(categories));
    }
  }, [categories, isLoaded]);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setEditingExpense(null);
    setIsDialogOpen(true);
  }

  const setExpenses = (newExpenses: Expense[]) => {
    setExpensesState(newExpenses);
  }

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    setExpensesState(prev => [{ ...expense, id: crypto.randomUUID() }, ...prev]);
  }, []);

  const updateExpense = useCallback((updatedExpense: Expense) => {
    setExpensesState(prev => prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpensesState(prev => prev.filter(exp => exp.id !== id));
  }, []);
  
  const setCategories = (newCategories: Category[]) => {
    setCategoriesState(newCategories);
  }

  const addCategory = useCallback((category: Omit<Category, 'color'>) => {
    const existingCategory = categories.find(c => c.name.toLowerCase() === category.name.toLowerCase());
    if (existingCategory) {
      return;
    }
    const newCategory: Category = {
        ...category,
        color: COLOR_PALETTE[categories.length % COLOR_PALETTE.length]
    };
    setCategoriesState(prev => [...prev, newCategory]);
  }, [categories]);

  const getCategoryColor = useCallback((categoryName: string) => {
    return categories.find(c => c.name === categoryName)?.color || 'hsl(0, 0%, 60%)';
  }, [categories]);

  const appContextValue = useMemo(() => ({
    expenses, setExpenses, addExpense, updateExpense, deleteExpense,
    categories, setCategories, addCategory, getCategoryColor
  }), [expenses, categories, addExpense, updateExpense, deleteExpense, addCategory, getCategoryColor]);

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <AppProvider value={appContextValue}>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Header 
          onAddExpense={handleAdd} 
          isDialogOpen={isDialogOpen} 
          setIsDialogOpen={setIsDialogOpen}
          editingExpense={editingExpense}
          setEditingExpense={setEditingExpense}
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <StatsCards />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <CategoryChart />
              <div className="lg:col-span-2">
                <AiInsights />
              </div>
            </div>
            <ExpenseTable onEdit={handleEdit} />
          </div>
        </main>
      </div>
    </AppProvider>
  );
}
