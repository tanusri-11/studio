"use client";

import { useAppContext } from "@/lib/app-context";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { isToday, isThisMonth, parseISO } from "date-fns";
import { DollarSign, Wallet } from "lucide-react";

export default function StatsCards() {
  const { expenses } = useAppContext();

  const todaySpending = expenses
    .filter(e => isToday(parseISO(e.date)))
    .reduce((sum, e) => sum + e.amount, 0);

  const monthSpending = expenses
    .filter(e => isThisMonth(parseISO(e.date)))
    .reduce((sum, e) => sum + e.amount, 0);
  
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Spending</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(todaySpending)}</div>
          <p className="text-xs text-muted-foreground">Total for today</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(monthSpending)}</div>
          <p className="text-xs text-muted-foreground">Total for this month</p>
        </CardContent>
      </Card>
    </div>
  );
}
