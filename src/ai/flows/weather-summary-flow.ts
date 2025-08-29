'use server';
/**
 * @fileOverview A flow to get and summarize the weather forecast.
 *
 * - getWeatherSummary - A function that gets the weather and provides a summary.
 * - WeatherSummaryInput - The input type for the getWeatherSummary function.
 * - WeatherSummaryOutput - The return type for the getWeatherSummary function.
 */

import { ai } from '@/ai/genkit';
import { getWeatherForecastTool } from '@/ai/tools/get-weather-forecast';
import { WeatherSummaryInputSchema, WeatherSummaryOutputSchema } from '@/ai/types';
import type { WeatherSummaryInput, WeatherSummaryOutput } from '@/ai/types';

export async function getWeatherSummary(input: WeatherSummaryInput): Promise<WeatherSummaryOutput> {
  return weatherSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weatherSummaryPrompt',
  tools: [getWeatherForecastTool],
  input: { schema: WeatherSummaryInputSchema },
  output: { schema: WeatherSummaryOutputSchema },
  prompt: `You are a helpful agricultural assistant. The user wants to know the weather forecast for their farm at latitude: {{{latitude}}}, longitude: {{{longitude}}}.
  
  1. Use the getWeatherForecast tool to get the 7-day forecast for the provided coordinates.
  2. Analyze the forecast data you receive from the tool.
  3. Based on the data, generate a concise, farmer-friendly summary. Highlight important events like upcoming rain, frost risks (if temperatures are low), high wind speeds, or drastic temperature shifts.
  4. Also, return the structured forecast data you received from the tool.
  
  Do not make up weather data. Only use the data returned by the tool. Address the user in a helpful and direct tone.`,
});


const weatherSummaryFlow = ai.defineFlow(
  {
    name: 'weatherSummaryFlow',
    inputSchema: WeatherSummaryInputSchema,
    outputSchema: WeatherSummaryOutputSchema,
  },
  async (input) => {
    const llmResponse = await prompt(input);
    const output = llmResponse.output;

    if (!output) {
      throw new Error("The AI model did not return a valid output. Please try again.");
    }
    
    return output;
  }
);
