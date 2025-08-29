'use server';
/**
 * @fileOverview A pest management AI agent.
 *
 * - managePest - A function that handles the pest identification and management advice process.
 */

import {ai} from '@/ai/genkit';
import { ManagePestInputSchema, ManagePestOutputSchema, type ManagePestInput, type ManagePestOutput } from '@/ai/types';

export async function managePest(input: ManagePestInput): Promise<ManagePestOutput> {
  return managePestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'managePestPrompt',
  input: {schema: ManagePestInputSchema},
  output: {schema: ManagePestOutputSchema},
  prompt: `You are an expert agricultural entomologist and botanist. Your task is to identify a potential pest from an image and user-provided notes.

Analyze the image and the user's notes to identify the pest. If it is not a pest, set the isPest flag to false and explain why.

If it is a pest, provide the following information:
1.  The common name of the pest.
2.  A detailed description of the pest.
3.  The potential impact it could have on crops.
4.  A few high-level, non-pesticide recommendations for management (e.g., introducing natural predators, crop rotation, etc.).

User Notes: {{{userNotes}}}
Pest Photo: {{media url=photoDataUri}}`,
});

const managePestFlow = ai.defineFlow(
  {
    name: 'managePestFlow',
    inputSchema: ManagePestInputSchema,
    outputSchema: ManagePestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
