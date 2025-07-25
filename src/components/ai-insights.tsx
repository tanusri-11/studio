"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2 } from 'lucide-react';
import { analyzeSpendingHabits } from '@/ai/flows/analyze-spending-habits';
import { useAppContext } from '@/lib/app-context';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export default function AiInsights() {
  const { expenses } = useAppContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (expenses.length < 5) {
      toast({
        title: "Not Enough Data",
        description: "Please add at least 5 expenses to get a meaningful analysis.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setInsights(null);
    try {
      const transactions = expenses.map(({ description, amount }) => ({ description, amount }));
      const result = await analyzeSpendingHabits({ transactions });
      setInsights(result.summary);
    } catch (error) {
      console.error("Error analyzing spending habits:", error);
      toast({
        title: "Analysis Failed",
        description: "Something went wrong while analyzing your spending. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>AI-Powered Insights</CardTitle>
            <CardDescription>Discover trends and savings opportunities.</CardDescription>
        </div>
        <Button onClick={handleAnalyze} disabled={isLoading} size="sm">
            {isLoading ? (
                <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                    Analyzing...
                </>
            ) : (
                <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze Spending
                </>
            )}
        </Button>
      </CardHeader>
      <CardContent>
        {insights ? (
            <Alert>
                <Wand2 className="h-4 w-4" />
                <AlertTitle>Spending Analysis</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap">
                    {insights}
                </AlertDescription>
            </Alert>
        ) : (
          <div className="flex h-[286px] items-center justify-center rounded-lg border border-dashed">
            <div className="text-center text-muted-foreground">
              <p>Click "Analyze Spending" to get your AI-powered report.</p>
              <p className="text-xs">Identifies trends and savings opportunities.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
