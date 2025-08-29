
'use server';
/**
 * @fileOverview A flow to generate a daily farm briefing.
 *
 * - generateDailyBriefing - A function that provides a comprehensive daily summary for the farm.
 * - GenerateDailyBriefingOutput - The return type for the generateDailyBriefing function.
 */

import { ai } from '@/ai/genkit';
import { getWeatherForecastTool } from '@/ai/tools/get-weather-forecast';
import { getSystemStatusTool } from '@/ai/tools/get-system-status';
import { z } from 'zod';
import { mockDetectionFrequency } from '@/lib/mock-data';

const GenerateDailyBriefingOutputSchema = z.object({
  weather: z.object({
    summary: z.string().describe("A very concise, farmer-friendly summary of the day's weather. Mention temperature, chance of rain, and wind."),
  }),
  birdActivity: z.object({
    prediction: z.string().describe("A prediction of bird activity for the day, including the expected level (e.g., low, high) and a brief reason."),
  }),
  systemStatus: z.object({
    summary: z.string().describe("A summary of the system status, mentioning the number of offline nodes and any critical alerts. If all is well, state that the system is operating normally."),
  }),
});
export type GenerateDailyBriefingOutput = z.infer<typeof GenerateDailyBriefingOutputSchema>;

export async function generateDailyBriefing(location: {latitude: number, longitude: number}): Promise<GenerateDailyBriefingOutput> {
  return generateDailyBriefingFlow({ location });
}

const prompt = ai.definePrompt({
  name: 'generateDailyBriefingPrompt',
  output: { schema: GenerateDailyBriefingOutputSchema },
  prompt: `You are an agricultural assistant. Your task is to provide a daily briefing for a farmer based on the data provided.

  - Analyze the provided weather, system status, and bird detection data.
  - Use this information to generate a farmer-friendly briefing in the required JSON format.

  Weather Forecast Data:
  {{{json weatherForecast}}}

  System Status Data:
  {{{json systemStatus}}}
  
  Bird Detection Frequency Data (last 24 hours):
  {{#each detectionFrequency}}
  - Time: {{time}}, Detections: {{detections}}
  {{/each}}
  `,
});

const generateDailyBriefingFlow = ai.defineFlow(
  {
    name: 'generateDailyBriefingFlow',
    inputSchema: z.object({
      location: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
    }),
    outputSchema: GenerateDailyBriefingOutputSchema,
  },
  async (input) => {
    // 1. Call tools to gather all necessary data first.
    const weatherForecast = await getWeatherForecastTool(input.location);
    const systemStatus = await getSystemStatusTool({});
    const detectionFrequency = mockDetectionFrequency; // Using mock data as before

    // 2. Pass the gathered data to the prompt.
    const { output } = await prompt({
        weatherForecast,
        systemStatus,
        detectionFrequency
    });

    if (!output) {
      throw new Error("The AI model failed to generate a briefing. Please try again.");
    }

    return output;
  }
);
