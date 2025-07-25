"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from 'date-fns';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/lib/app-context";
import type { Expense } from "@/lib/types";
import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  category: z.string().min(1, "Category is required"),
  date: z.date({ required_error: "Date is required." }),
});

interface ExpenseDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  expense: Expense | null;
  setExpense: Dispatch<SetStateAction<Expense | null>>;
}

export default function ExpenseDialog({ isOpen, setIsOpen, expense, setExpense }: ExpenseDialogProps) {
  const { categories, addCategory, addExpense, updateExpense } = useAppContext();
  const { toast } = useToast();
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      category: "",
      date: new Date(),
    },
  });

  useEffect(() => {
    if (expense) {
      form.reset({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: parseISO(expense.date),
      });
    } else {
      form.reset({
        description: "",
        amount: 0,
        category: "",
        date: new Date(),
      });
    }
  }, [expense, form, isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setExpense(null);
      form.reset();
    }
    setIsOpen(open);
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim() !== "") {
      addCategory({ name: newCategory.trim() });
      form.setValue('category', newCategory.trim());
      setNewCategory("");
      setIsCategoryDialogOpen(false);
      toast({ title: "Category added", description: `"${newCategory.trim()}" has been added.` });
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const expenseData = {
      ...values,
      date: format(values.date, "yyyy-MM-dd"),
    };

    if (expense) {
      updateExpense({ ...expense, ...expenseData });
      toast({ title: "Expense Updated", description: "Your expense has been successfully updated." });
    } else {
      addExpense(expenseData);
      toast({ title: "Expense Added", description: "Your new expense has been successfully added." });
    }
    handleOpenChange(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{expense ? "Edit Expense" : "Add New Expense"}</DialogTitle>
            <DialogDescription>
              {expense ? "Update the details of your expense." : "Fill in the details of your new expense."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g. Lunch with colleagues" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g. 500.50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.name} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                        <button
                            type="button"
                            className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent"
                            onClick={() => setIsCategoryDialogOpen(true)}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Category...
                        </button>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>Enter the name for the new category.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <Input 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="e.g. Groceries"
                  />
              </div>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddNewCategory}>Add</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
