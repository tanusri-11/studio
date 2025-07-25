'use server';
/**
 * @fileOverview Provides insights into spending habits based on transaction descriptions and amounts.
 *
 * - analyzeSpendingHabits - Analyzes spending habits and identifies trends or savings opportunities.
 * - AnalyzeSpendingHabitsInput - The input type for the analyzeSpendingHabits function.
 * - AnalyzeSpendingHabitsOutput - The return type for the analyzeSpendingHabits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSpendingHabitsInputSchema = z.object({
  transactions: z.array(
    z.object({
      description: z.string().describe('The description of the transaction.'),
      amount: z.number().describe('The amount of the transaction.'),
    })
  ).describe('An array of transactions to analyze.'),
});
export type AnalyzeSpendingHabitsInput = z.infer<typeof AnalyzeSpendingHabitsInputSchema>;

const AnalyzeSpendingHabitsOutputSchema = z.object({
  summary: z.string().describe('A summary of spending habits, trends, and potential savings opportunities.'),
});
export type AnalyzeSpendingHabitsOutput = z.infer<typeof AnalyzeSpendingHabitsOutputSchema>;

export async function analyzeSpendingHabits(input: AnalyzeSpendingHabitsInput): Promise<AnalyzeSpendingHabitsOutput> {
  return analyzeSpendingHabitsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSpendingHabitsPrompt',
  input: {schema: AnalyzeSpendingHabitsInputSchema},
  output: {schema: AnalyzeSpendingHabitsOutputSchema},
  prompt: `You are an AI assistant designed to analyze spending habits and identify trends or savings opportunities.

  Analyze the following transactions to identify spending patterns, trends, and potential areas for savings.

  Transactions:
  {{#each transactions}}
  - Description: {{this.description}}, Amount: {{this.amount}}
  {{/each}}

  Provide a concise summary of your findings, highlighting key trends and actionable recommendations for saving money.
  Consider things such as common themes, large expenses, or any unusual spending.
  Be specific and provide practical advice.
  `,
});

const analyzeSpendingHabitsFlow = ai.defineFlow(
  {
    name: 'analyzeSpendingHabitsFlow',
    inputSchema: AnalyzeSpendingHabitsInputSchema,
    outputSchema: AnalyzeSpendingHabitsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
