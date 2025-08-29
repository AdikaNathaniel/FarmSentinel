// predict-bird-activity.ts
'use server';

/**
 * @fileOverview Predicts potential bird activity based on historical detection frequency.
 *
 * - predictBirdActivity - A function that predicts bird activity.
 * - PredictBirdActivityInput - The input type for the predictBirdActivity function.
 * - PredictBirdActivityOutput - The return type for the predictBirdActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectionFrequencyEntrySchema = z.object({
  time: z.string().describe('The time of day (HH:MM format).'),
  detections: z.number().describe('The number of bird detections at this time.'),
});

const PredictBirdActivityInputSchema = z.object({
  detectionFrequency: z.array(DetectionFrequencyEntrySchema).describe('A list of bird detection frequencies over a period of time.'),
});

export type PredictBirdActivityInput = z.infer<typeof PredictBirdActivityInputSchema>;

const PredictBirdActivityOutputSchema = z.object({
  activityLevel: z
    .enum(['low', 'medium', 'high'])
    .describe('The predicted bird activity level for the next few hours.'),
  reasoning: z.string().describe('The reasoning behind the prediction, based on trends and peak times.'),
});

export type PredictBirdActivityOutput = z.infer<typeof PredictBirdActivityOutputSchema>;

export async function predictBirdActivity(input: PredictBirdActivityInput): Promise<PredictBirdActivityOutput> {
  return predictBirdActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictBirdActivityPrompt',
  input: {schema: PredictBirdActivityInputSchema},
  output: {schema: PredictBirdActivityOutputSchema},
  prompt: `You are an expert in analyzing bird activity patterns. Given the following bird detection frequency data from the last 24 hours, predict the likely future bird activity level (low, medium, or high) for the next few hours and explain your reasoning. Look for trends, patterns, and peak activity times.

  Bird Detection Frequency Data (last 24 hours):
  {{#each detectionFrequency}}
  - Time: {{time}}, Detections: {{detections}}
  {{/each}}
  `,
});

const predictBirdActivityFlow = ai.defineFlow(
  {
    name: 'predictBirdActivityFlow',
    inputSchema: PredictBirdActivityInputSchema,
    outputSchema: PredictBirdActivityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
