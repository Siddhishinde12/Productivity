'use server';

/**
 * @fileOverview Generates personalized productivity tips based on the user's tasks.
 *
 * - generateProductivityTips - A function that generates productivity tips.
 * - GenerateProductivityTipsInput - The input type for the generateProductivityTips function.
 * - GenerateProductivityTipsOutput - The return type for the generateProductivityTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductivityTipsInputSchema = z.object({
  tasks: z
    .string()
    .describe('A comma separated list of tasks to be analyzed.'),
});
export type GenerateProductivityTipsInput = z.infer<
  typeof GenerateProductivityTipsInputSchema
>;

const GenerateProductivityTipsOutputSchema = z.object({
  tips: z
    .string()
    .describe('A list of personalized productivity tips for the user.'),
});
export type GenerateProductivityTipsOutput = z.infer<
  typeof GenerateProductivityTipsOutputSchema
>;

export async function generateProductivityTips(
  input: GenerateProductivityTipsInput
): Promise<GenerateProductivityTipsOutput> {
  return generateProductivityTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductivityTipsPrompt',
  input: {schema: GenerateProductivityTipsInputSchema},
  output: {schema: GenerateProductivityTipsOutputSchema},
  prompt: `You are a productivity expert. Analyze the following tasks and provide personalized productivity tips to improve focus and efficiency. Use a bulleted list format.

Tasks: {{{tasks}}}`,
});

const generateProductivityTipsFlow = ai.defineFlow(
  {
    name: 'generateProductivityTipsFlow',
    inputSchema: GenerateProductivityTipsInputSchema,
    outputSchema: GenerateProductivityTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
