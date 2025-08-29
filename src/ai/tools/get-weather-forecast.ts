'use server';

/**
 * @fileOverview A tool for fetching the weekly weather forecast.
 */

import { ai } from '@/ai/genkit';
import { getWeeklyForecast } from '@/services/weather-service';
import { z } from 'genkit';

export const getWeatherForecastTool = ai.defineTool(
  {
    name: 'getWeatherForecast',
    description: 'Returns the 7-day weather forecast for a given geographical location.',
    inputSchema: z.object({
      latitude: z.number().describe('The latitude of the location.'),
      longitude: z.number().describe('The longitude of the location.'),
    }),
    outputSchema: z.array(
      z.object({
        date: z.string().describe('The date of the forecast in ISO format.'),
        tempHigh: z.number().describe('The high temperature in Celsius.'),
        tempLow: z.number().describe('The low temperature in Celsius.'),
        precipitation: z.number().describe('The precipitation amount in millimeters.'),
        windSpeed: z.number().describe('The wind speed in kilometers per hour.'),
        condition: z.string().describe('A brief description of the weather condition (e.g., Sunny, Cloudy, Rain).'),
      })
    ),
  },
  async (input) => {
    // This tool calls our mock service. In a real app, the service would call a real weather API.
    return await getWeeklyForecast(input.latitude, input.longitude);
  }
);
