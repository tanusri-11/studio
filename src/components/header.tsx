"use client";

import type { Dispatch, SetStateAction } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ExpenseDialog from "./expense-dialog";
import type { Expense } from '@/lib/types';

interface HeaderProps {
  onAddExpense: () => void;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  editingExpense: Expense | null;
  setEditingExpense: Dispatch<SetStateAction<Expense | null>>;
}

export default function Header({ 
  onAddExpense,
  isDialogOpen,
  setIsDialogOpen,
  editingExpense,
  setEditingExpense
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between p-4 sm:p-6 md:p-8">
        <div className="flex items-center gap-2">
           <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-primary"
            >
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
          <h1 className="text-2xl font-bold text-foreground">SpendWise</h1>
        </div>
        <Button onClick={onAddExpense} className="gap-2">
          <PlusCircle size={20} />
          <span className="hidden sm:inline">Add Expense</span>
        </Button>
        <ExpenseDialog 
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          expense={editingExpense}
          setExpense={setEditingExpense}
        />
      </div>
    </header>
  );
}
