'use server';
/**
 * @fileOverview An AI flow to get a list of Indian festivals for a given year.
 *
 * - getIndianFestivals - A function that returns a list of festivals.
 * - GetIndianFestivalsInput - The input type for the getIndianFestivals function.
 * - GetIndianFestivalsOutput - The return type for the getIndianFestivals function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetIndianFestivalsInputSchema = z.object({
  year: z.string().describe('The year for which to get the festivals.'),
});
export type GetIndianFestivalsInput = z.infer<
  typeof GetIndianFestivalsInputSchema
>;

const FestivalSchema = z.object({
    date: z.string().describe('The date of the festival in YYYY-MM-DD format.'),
    name: z.string().describe('The name of the festival.'),
});

const GetIndianFestivalsOutputSchema = z.object({
  festivals: z.array(FestivalSchema).describe('A list of Indian festivals for the given year.')
});
export type GetIndianFestivalsOutput = z.infer<
  typeof GetIndianFestivalsOutputSchema
>;

export async function getIndianFestivals(
  input: GetIndianFestivalsInput
): Promise<GetIndianFestivalsOutput> {
  return getIndianFestivalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getIndianFestivalsPrompt',
  input: { schema: GetIndianFestivalsInputSchema },
  output: { schema: GetIndianFestivalsOutputSchema },
  prompt: `You are an expert on Indian culture and festivals. Provide a comprehensive list of major Indian festivals for the year {{{year}}}.
Include national holidays, regional festivals, and other significant cultural events.
Ensure the date format is always YYYY-MM-DD.
Example festivals to include: Diwali, Holi, Eid-ul-Fitr, Christmas, Guru Nanak Jayanti, Navratri, Dussehra, Ganesh Chaturthi, Pongal, Onam, Raksha Bandhan, Janmashtami, Maha Shivaratri, etc.
Provide at least 20 festivals.
`,
});

const getIndianFestivalsFlow = ai.defineFlow(
  {
    name: 'getIndianFestivalsFlow',
    inputSchema: GetIndianFestivalsInputSchema,
    outputSchema: GetIndianFestivalsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
